import { createHash } from 'node:crypto';
import { closeSync, constants, existsSync, fstatSync, openSync, readSync, realpathSync } from 'node:fs';
import { tmpdir, userInfo } from 'node:os';
import { dirname, join, resolve } from 'node:path';
// Asks Twombly on this machine for comments the person sent to their agent, from `twombly hooks` or the Twombly plugin.
let mode = process.argv[2] || 'check';
// A headless Stop checks for newly sent comments once. Selection belongs to prompt submission.
if (mode === 'wait' && ['0', 'false'].includes(process.env.CLAUDE_CODE_SESSION_ATTENDED || '')) mode = 'continue';
let input = {};
if (!process.stdin.isTTY) {
  try { let text = ''; for await (const chunk of process.stdin) text += chunk; input = JSON.parse(text); } catch {}
}
const cwd = input.cwd || (input.workspace_roots || [])[0] || process.cwd();

// Which servers to ask. The Twombly on this machine keeps its canvases in a home, and when the default home can't be
// written it uses another, with a port of its own. This works out the same homes the tool would, and asks the server at
// the usual port and each one that says it keeps one of those homes. It runs each time, since nothing here knows which
// home an agent's tool chose: a sandboxed agent's canvas can be on a server of its own while the person's usual one runs.
const BASE = Number(process.env.TWOMBLY_PORT) || 4747;
const ask = async port => {
  try {
    const response = await fetch('http://localhost:' + port + '/health', { signal: AbortSignal.timeout(800) });
    const found = response.ok ? await response.json() : null;
    return found && typeof found.build === 'string' ? found : null;
  } catch { return null; }
};
const same = (a, b) => typeof a === 'string' && resolve(a) === resolve(b);
const above = has => { for (let dir = resolve(cwd);; dir = dirname(dir)) { if (has(dir)) return dir; if (dirname(dir) === dir) return null; } };
const real = path => { try { return realpathSync(path); } catch { return path; } };
const uid = typeof process.getuid === 'function' ? process.getuid() : null;
const ours = info => uid === null || info.uid === uid;
const NOFOLLOW = constants.O_NOFOLLOW || 0;
// A real folder (not a link) that is ours, and that the people in 'loose' can't use.
const folderOk = (path, loose) => {
  try {
    const fd = openSync(path, constants.O_RDONLY | NOFOLLOW | (constants.O_DIRECTORY || 0));
    try { const info = fstatSync(fd); return info.isDirectory() && ours(info) && (uid === null || !(info.mode & loose)); } finally { closeSync(fd); }
  } catch { return false; }
};
// A file's text, only when it's a real file (not a link) that is ours and that no one else can read or write.
const privateText = path => {
  let fd;
  try { fd = openSync(path, constants.O_RDONLY | NOFOLLOW); } catch { return null; }
  try {
    const info = fstatSync(fd);
    if (!info.isFile() || !ours(info) || (uid !== null && info.mode & 0o077) || info.size > 1 << 20) return null;
    const buffer = Buffer.alloc(info.size);
    let read = 0;
    while (read < info.size) { const n = readSync(fd, buffer, read, info.size - read, read); if (!n) break; read += n; }
    return buffer.subarray(0, read).toString('utf8');
  } catch { return null; } finally { closeSync(fd); }
};
async function servers() {
  // The folder the tool bases its home on: the package or repository around the work, or the canvas it already has,
  // whichever is higher up.
  const marked = above(dir => existsSync(join(dir, 'package.json')) || existsSync(join(dir, '.git')));
  const canvased = above(dir => existsSync(join(dir, '.twombly', 'canvas.json')));
  const top = marked && canvased ? (marked.length <= canvased.length ? marked : canvased) : marked || canvased || resolve(cwd);
  const root = real(top);
  const user = typeof process.getuid === 'function' ? String(process.getuid()) : userInfo().username.replace(/[^a-z0-9_-]/gi, '-') || 'user';
  const temporary = join(tmpdir(), 'twombly-' + user);
  // Nothing under a shared temp folder is believed unless it's ours alone, as the tool itself requires: a folder or file
  // another account could have made would otherwise send what a hook asks, and what comes back to the agent, anywhere.
  const homes = [];
  if (folderOk(temporary, 0o077)) {
    try {
      const saved = JSON.parse(privateText(join(temporary, 'home-' + createHash('sha256').update(root).digest('hex').slice(0, 16))) || 'null');
      if (saved && saved.project === root && typeof saved.home === 'string' && folderOk(saved.home, 0o022)) homes.push(saved.home);
    } catch {}
  }
  if (folderOk(join(root, '.twombly'), 0o022)) homes.push(join(root, '.twombly'));
  if (folderOk(temporary, 0o077)) homes.push(temporary);
  const portOf = home => {
    const step = 1 + createHash('sha256').update(resolve(home)).digest().readUInt32BE(0) % 1000;
    let port = BASE + step <= 65535 ? BASE + step : BASE - step;
    while ([1,7,9,11,13,15,17,19,20,21,22,23,25,37,42,43,53,69,77,79,87,95,101,102,103,104,109,110,111,113,115,117,119,123,135,137,139,143,161,179,389,427,465,512,513,514,515,526,530,531,532,540,548,554,556,563,587,601,636,989,990,993,995,1719,1720,1723,2049,3659,4045,4190,5060,5061,6000,6566,6665,6666,6667,6668,6669,6679,6697,10080].includes(port)) port++;
    return port;
  };
  // The usual port is asked as it always was, whatever home its server keeps. A fallback port only when its server says
  // it keeps the home that port was worked out from.
  const [first, ...found] = await Promise.all([ask(BASE), ...homes.map(home => ask(portOf(home)))]);
  const ports = first ? [BASE] : [];
  homes.forEach((home, i) => { if (found[i] && same(found[i].home, home)) ports.push(portOf(home)); });
  return [...new Set(ports)];
}

const hear = async port => {
  try {
    const response = await fetch('http://localhost:' + port + '/hook', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ cwd, session: input.session_id || input.conversation_id || '', wait: mode === 'wait', looking: mode === 'check' || mode === 'context', agent: process.argv[3] || '' }),
      signal: AbortSignal.timeout(mode === 'wait' ? 55 * 60_000 : 2000),
    });
    if (response.ok) return (await response.json()).text || '';
    process.stderr.write('twombly: the server on port ' + port + ' answered ' + response.status + ' to the hook.\n');
  } catch (error) {
    // Twombly not running is normal and says nothing. A server that was there and didn't answer is worth a line.
    if (error && error.name !== 'TimeoutError' && error.name !== 'AbortError') process.stderr.write('twombly: the hook could not reach the server on port ' + port + ': ' + (error.message || error) + '\n');
  }
  return '';
};
const ports = await servers().catch(() => []);
// A server without this folder's canvas answers at once with nothing, even when asked to wait. Waiting, the first with
// something to say answers; otherwise every answer is kept, each once.
const text = mode === 'wait'
  ? await new Promise(done => { let left = ports.length; if (!left) done(''); for (const port of ports) hear(port).then(found => { if (found) done(found); else if (!--left) done(''); }); })
  : [...new Set(await Promise.all(ports.map(hear)))].filter(Boolean).join('\n\n');
if (!text) process.exit(0);
if (process.argv[2] === 'wait') { process.stderr.write(text); process.exit(2); }
process.stdout.write(mode === 'continue' ? JSON.stringify({ decision: 'block', reason: text }) : mode === 'followup' ? JSON.stringify({ followup_message: text }) : mode === 'context' ? JSON.stringify({ additional_context: text }) : text);
