# Set up Twombly and make the first canvas

Work in the person's current project. Use the host you're running in. The presence of several coding-agent CLIs on the machine does not identify the current host.

1. Look for Twombly’s native tools. Claude Code may need a tool search for “twombly”. If you have open_canvas and add_frames, read the guide, open a single canvas and use the tools to add the main screens. You can skip installation.
2. Otherwise install the full plugin for this host using its section below. It includes the Twombly skill, local tools, comment hooks and artwork. Use Node.js 22 or later. Explain any permission prompt or restart the person needs to complete. If a step fails, say which one and why.
3. Continue in this conversation. If the new tools are available, use them. While a reload or user action is pending, run `npx -y twombly@latest guide` and follow it to put the actual screens on a canvas. Verify the frames, return their canvas address and distinguish a working canvas from a verified native installation.

Install the published files unchanged. If the pinned runtime download fails, keep the original manifest, hooks and version pin. Retry the published version or give the person the exact retry step. A CLI fallback can create a canvas while native setup is pending. Only describe a canvas as online when the tool returns its hosted link.

Current Twombly canvases are uploaded privately as they're created, including before sign-in. Add only static frame output safe to leave the machine. Leave link sharing off unless requested.

## Claude Code

Run `claude plugin marketplace add https://github.com/materic-inc/plugins.git` followed by `claude plugin install twombly@materic`. If the Materic source is already registered, check that it points at this public repository, then refresh that marketplace before installing. Preserve a developer's differently configured source and explain the name conflict. For an earlier release, use `claude plugin update twombly@materic`. Verify its installed entry using `claude plugin list`. If a reload is needed, tell the person to run `/reload-plugins` or open a fresh project conversation and ask Twombly to open the canvas.

## Codex and ChatGPT desktop with a local project

Run `codex plugin marketplace add https://github.com/materic-inc/plugins.git`, then `codex plugin add twombly@materic`. For an existing source, verify the repository, refresh it with `codex plugin marketplace upgrade materic`, then install. Preserve a developer’s differently configured source if its name collides. Verify installation in `codex plugin list`. If the tools haven't loaded, have the person restart the desktop app and open Plugins → Twombly in a local project chat.

## Cursor

Use the whole Cursor plugin from this public repository. Clone `https://github.com/materic-inc/plugins.git` into a new temporary directory. Put a real copy of its `twombly` folder under the user's `~/.cursor/plugins/local/twombly` directory. Include its hidden `.cursor-plugin` folder. Keep an existing installation intact: if the target already exists, inspect its version and source before attempting an update. If this machine already has a working imported Claude plugin, use its native tools directly.

Tell the person to run **Developer: Reload Window**, then open **Customize → Plugins → Twombly**. Check that the tools are enabled. The workspace may require an administrator to allow local imports. If local imports are unavailable, install the project skill using `npx -y skills add materic-inc/plugins --skill twombly --agent cursor -y`, continue with the CLI, and tell the person that only the skill was installed. Avoid changing a team marketplace for a personal installation.

## Other agents

Use the CLI in a local project with a shell. If no local project or shell is available, ask the person to open their project in a local coding agent and paste the same prompt. If installation succeeds but native tools cannot be verified until the next chat, say so.
