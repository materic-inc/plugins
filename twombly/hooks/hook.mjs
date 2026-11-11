// Asks Twombly on this machine for comments the person sent to their agent, from `twombly hooks` or the Twombly plugin.
let mode = process.argv[2] || 'check';
// A headless Stop checks for newly sent comments once. Selection belongs to prompt submission.
if (mode === 'wait' && ['0', 'false'].includes(process.env.CLAUDE_CODE_SESSION_ATTENDED || '')) mode = 'continue';
let input = {};
if (!process.stdin.isTTY) {
  try { let text = ''; for await (const chunk of process.stdin) text += chunk; input = JSON.parse(text); } catch {}
}
let text = '';
try {
  const response = await fetch('http://localhost:' + (process.env.TWOMBLY_PORT || 4747) + '/hook', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ cwd: input.cwd || (input.workspace_roots || [])[0] || process.cwd(), session: input.session_id || input.conversation_id || '', wait: mode === 'wait', looking: mode === 'check' || mode === 'context', agent: process.argv[3] || '' }),
    signal: AbortSignal.timeout(mode === 'wait' ? 55 * 60_000 : 2000),
  });
  if (response.ok) text = (await response.json()).text || '';
} catch {}
if (!text) process.exit(0);
if (process.argv[2] === 'wait') { process.stderr.write(text); process.exit(2); }
process.stdout.write(mode === 'continue' ? JSON.stringify({ decision: 'block', reason: text }) : mode === 'followup' ? JSON.stringify({ followup_message: text }) : mode === 'context' ? JSON.stringify({ additional_context: text }) : text);
