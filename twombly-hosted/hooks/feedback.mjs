// Native delivery for a terminal without an embedded chat view. All canvas work uses the hosted MCP.
import { createHash, randomBytes } from 'node:crypto';
import { mkdir, readFile, readdir, rename, stat, unlink, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

const mode = process.argv[2];
const digest = value => createHash('sha256').update(value).digest('hex');
const dir = join(process.env.TWOMBLY_HOME || join(homedir(), '.twombly'), 'feedback');
const origin = new URL(process.env.TWOMBLY_ENDPOINT || 'https://twombly.app').origin;
const validId = value => typeof value === 'string' && /^[a-z2-9]{12}$/.test(value);
const file = name => join(dir, digest(origin) + '-' + name);

async function makeKey() {
  await mkdir(dir, { recursive: true, mode: 0o700 });
  // Expired session files have no purpose after their server receipt expires.
  const prefix = digest(origin) + '-';
  for (const name of await readdir(dir)) {
    if (!name.startsWith(prefix)) continue;
    const path = join(dir, name);
    const item = await stat(path).catch(() => null);
    if (item?.isFile() && Date.now() - item.mtimeMs > 24 * 3600_000) await unlink(path).catch(() => {});
  }
  const proof = randomBytes(32).toString('hex');
  const key = digest(proof);
  await writeFile(file(key), proof, { flag: 'wx', mode: 0o600 });
  return key;
}

async function run() {
  if (mode === 'headers') {
    if (process.env.CLAUDE_CODE_MCP_SERVER_URL !== origin + '/mcp') return;
    process.stdout.write(JSON.stringify({ 'X-Twombly-Feedback-Key': await makeKey() }));
    return;
  }
  let data = '';
  for await (const chunk of process.stdin) data += chunk;
  const input = JSON.parse(data);
  const sessionId = input.session_id || input.conversation_id;
  if (typeof sessionId !== 'string' || !sessionId) return;
  const session = file('session-' + digest(sessionId));
  if (mode === 'cursor-prepare') {
    if (!/^(?:MCP:|mcp__twombly__|mcp_twombly_)open_twombly_canvas$/i.test(input.tool_name)) return;
    const args = typeof input.tool_input === 'string' ? JSON.parse(input.tool_input) : input.tool_input;
    process.stdout.write(JSON.stringify({ permission: 'allow', updated_input: { ...args, nativeFeedbackKey: await makeKey() } }));
    return;
  }
  if (mode === 'remember' || mode === 'cursor-remember') {
    let result = input.tool_response;
    if (mode === 'cursor-remember') {
      if (input.mcp_server_name !== 'twombly' || input.tool_name !== 'open_twombly_canvas') return;
      const response = JSON.parse(input.result_json);
      if (response.isError) return;
      result = response.structuredContent || JSON.parse(response.content[0].text);
    } else if (!/^mcp__(?:plugin_twombly_)?twombly__open_canvas$/.test(input.tool_name)) return;
    if (typeof result === 'string') result = JSON.parse(result);
    if (Array.isArray(result)) result = JSON.parse(result.find(item => item.type === 'text').text);
    if (result?.content && !result.structuredContent) result = JSON.parse(result.content.find(item => item.type === 'text').text);
    const { id, feedback } = result?.structuredContent || result || {};
    if (!validId(id) || !/^[a-f0-9]{64}$/.test(feedback?.key) || typeof feedback.receipt !== 'string') return;
    await readFile(file(feedback.key));
    const tmp = session + '.' + randomBytes(8).toString('hex');
    await writeFile(tmp, JSON.stringify({ id, ...feedback }), { flag: 'wx', mode: 0o600 });
    await rename(tmp, session);
    return;
  }
  if (!['wait', 'check', 'cursor-stop', 'cursor-context'].includes(mode)) return;
  if (mode === 'cursor-stop' && input.status && input.status !== 'completed') return;
  const { id, receipt, key } = JSON.parse(await readFile(session, 'utf8'));
  if (!validId(id) || !/^[a-f0-9]{64}$/.test(key)) return;
  const proof = await readFile(file(key), 'utf8');
  const response = await fetch(origin + '/api/canvases/' + id + '/feedback-ticket', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ receipt, proof }),
    redirect: 'error', signal: AbortSignal.timeout(4000),
  });
  if (!response.ok) return;
  const { url } = await response.json();
  if (new URL(url).origin !== origin.replace(/^http/, 'ws')) return;
  // Cursor displays the finished turn while its stop hook waits, and submits its result as a follow-up.
  const wait = mode === 'cursor-stop' || mode === 'wait' && !['0', 'false'].includes(process.env.CLAUDE_CODE_SESSION_ATTENDED);
  const socket = new WebSocket(url);
  await new Promise(resolve => {
    const stop = () => {
      clearTimeout(timeout);
      clearInterval(ping);
      if (socket.readyState < WebSocket.CLOSING) socket.close();
      resolve();
    };
    const ping = setInterval(() => { if (socket.readyState === WebSocket.OPEN) socket.send('{"t":"ping"}'); }, 30_000);
    const timeout = setTimeout(stop, wait ? 55 * 60_000 : 2400);
    socket.onclose = socket.onerror = stop;
    socket.onopen = () => socket.send(JSON.stringify({ t: 'machine.agent', agent: mode.startsWith('cursor-') ? 'cursor' : 'claude' }));
    socket.onmessage = event => {
      const message = JSON.parse(event.data);
      if (message.t === 'agent') {
        if (Object.values(message.sent).includes('queued')) socket.send(JSON.stringify({ t: 'agent.take', id: 1 }));
        else if (!wait) stop();
      }
      if (message.t !== 'agent.taken' || !message.items.length) return;
      const lines = message.items.map(({ thread, text, location }) => {
        const where = location?.title ? 'On "' + location.title + '" at ' + location.x + ',' + location.y : 'On the canvas';
        return where + ' (' + thread + '): ' + text;
      });
      const feedback = 'The person sent you feedback on their Twombly canvas ' + id + '.\n' + lines.join('\n');
      if (mode === 'wait') { process.stderr.write(feedback); process.exitCode = 2; }
      else if (mode === 'cursor-stop') process.stdout.write(JSON.stringify({ followup_message: feedback }));
      else if (mode === 'cursor-context') process.stdout.write(JSON.stringify({ additional_context: feedback }));
      else process.stdout.write(feedback);
      stop();
    };
  });
}
run().catch(() => { if (mode === 'headers') process.stdout.write('{}'); });
