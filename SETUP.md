# Set up Twombly and make the first canvas

Work in the person's current project. Use the host you're running in. The presence of several coding-agent CLIs on the machine does not identify the current host.

1. Look for Twombly’s native tools. Claude Code may need a tool search for “twombly”. If you have open_canvas and add_frames, read the guide, open a single canvas and use the tools to add the main screens. You can skip installation.
2. Otherwise install the full plugin for this host using its section below. It includes the Twombly skill, local tools, comment hooks and artwork. Use Node.js 22 or later. Explain any permission prompt or restart the person needs to complete. If a step fails, say which one and why.
3. Use the native tools to open the canvas and add the screens. If the host only loads plugins at session start, stop after verifying installation. Leave canvas creation for the reloaded session. Tell the person the reload action and give them this continuation: “Open Twombly and put this project's main screens side by side.” Check the frames and return the canvas address.

Keep the published runtime pin and files intact if a download fails. Only describe a canvas as online when the tool returns its hosted link.

Current Twombly canvases are uploaded privately as they're created, including before sign-in. Add only static frame output safe to leave the machine. Leave link sharing off unless requested.

## Claude Code

Run `claude plugin marketplace add https://github.com/materic-inc/plugins.git` followed by `claude plugin install twombly@materic`. If the Materic source is already registered, check that it points at this public repository, then refresh that marketplace before installing. Preserve a developer's differently configured source and explain the name conflict. For an earlier release, use `claude plugin update twombly@materic`. Verify its installed entry using `claude plugin list`. If a reload is needed, tell the person to run `/reload-plugins` or open a fresh project conversation and ask Twombly to open the canvas.

## Codex and ChatGPT desktop with a local project

Run `codex plugin marketplace add https://github.com/materic-inc/plugins.git`, then `codex plugin add twombly@materic`. For an existing source, verify the repository, refresh it with `codex plugin marketplace upgrade materic`, then install. Preserve a developer’s differently configured source if its name collides. Verify installation in `codex plugin list`. If the tools haven't loaded, have the person restart the desktop app and open Plugins → Twombly in a local project chat.

## Cursor

Use the whole Cursor plugin from this public repository. Clone `https://github.com/materic-inc/plugins.git` into a new temporary directory. Put a real copy of its `twombly-hosted` folder under the user's `~/.cursor/plugins/local/twombly` directory. Include its hidden `.cursor-plugin` folder. Keep an existing installation intact: if the target already exists, inspect its version and source before attempting an update. If this machine already has a working imported Claude plugin, use its native tools directly.

Tell the person to run **Developer: Reload Window**, then open **Customize → Plugins → Twombly**. Check that the tools are enabled. The workspace may require an administrator to allow local imports. If local imports are unavailable, use the direct MCP setup below if workspace policy permits it. Avoid changing a team marketplace for a personal installation.

## Hosts with local MCP support

Register a local stdio MCP server named `twombly` using the host's supported configuration or install UI. Set the command to `npx` and the arguments to `["-y", "twombly@latest", "mcp"]`. Reload the host if needed. Verify that `open_canvas` is available, then use `add_frames` and `list_frames`. Pass the project's absolute path as `folder` when the host starts the server elsewhere. This provides the local canvas tools; the native plugin also supplies the skill and host-specific comment hooks.

## Shell-only agents

When the host cannot connect to a local MCP server but can run commands in the project, run `npx -y twombly@latest guide` and follow the command-line instructions. If the host has neither local project access nor a shell, ask the person to open the project in a supported local coding agent.
