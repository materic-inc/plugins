# Set up Twombly and make the first canvas

Work in the person's current project. Use the host you're running in. The presence of several coding-agent CLIs on the machine does not identify the current host.

1. Look for Twombly’s native tools. Claude Code may need a tool search for “twombly”. If you have open_canvas and add_frames, read the guide, open a single canvas and use the tools to add the main screens. You can skip installation.
2. Otherwise, if you're in Claude's chat or Cowork (claude.ai or the Claude desktop app, not Claude Code), follow **Claude chat and Cowork** below and install nothing. Elsewhere, install the full plugin for this host using its section below. It includes the Twombly skill, local tools, comment hooks and artwork. Use Node.js 22 or later. Explain any permission prompt the person needs to answer. If installing fails or keeps hitting permission or sandbox errors, don't troubleshoot it: say in a line what failed and go straight to the command line in step 3. The plugin can be added later.
3. Outside Claude chat and Cowork, make the canvas in this conversation; never stop to ask for a restart or reload. If the tools appeared, use them. Most hosts only load a new plugin in the next conversation, so if they haven't, or installing failed, run `npx -y twombly@latest guide` and follow it: the command line reaches the same canvas the plugin will. If you have your own browser pane, show the canvas there (`init --no-open`, then open its address). Check the frames and return the canvas address. The plugin loads by itself next time; nothing else is needed.

Keep the published runtime pin and files intact if a download fails. Only describe a canvas as online when the tool returns its hosted link.

Current Twombly canvases are uploaded privately as they're created, including before sign-in. Add only static frame output safe to leave the machine. Leave link sharing off unless requested.

## Claude Code

This includes the Code tab in the Claude desktop app, where `claude` is often not on PATH: use `"$CLAUDE_CODE_EXECPATH"` in its place, and still install the plugin. Run `claude plugin marketplace add https://github.com/materic-inc/plugins.git` followed by `claude plugin install twombly@materic`. If the Materic source is already registered, check that it points at this public repository, then refresh that marketplace before installing. Preserve a developer's differently configured source and explain the name conflict. For an earlier release, use `claude plugin update twombly@materic`. Verify its installed entry using `claude plugin list`, then carry on with step 3.

## Claude chat and Cowork

Twombly reaches you here as a connector at `https://twombly.app/mcp`; nothing is installed. Don't run `npx twombly` or any install command, even if you have a shell. Your commands run in a virtual machine, even in Cowork on the person's own computer: it usually can't reach twombly.app, and the person's browser can't open what it serves, so the canvas would be stranded there. Attaching another folder doesn't change that.

If the tools aren't available, ask the person to add the connector, then continue in a new conversation:

- **Pro or Max:** Customize → Connectors → **+ Add** → **Add custom connector**. Name it Twombly, enter `https://twombly.app/mcp`, choose **Sign in now**, then click **Add** and sign in to Twombly.
- **Team or Enterprise:** an Owner adds it in Organization settings → Connectors. The person then clicks **Connect** on it in Customize → Connectors.

If it's added but the tools are missing, turn it on for this conversation: **+** at the bottom left of the chat → Connectors → Twombly. Give them this to paste into the new conversation: “Open Twombly and put these screens side by side.”

## Codex and ChatGPT desktop with a local project

Run `codex plugin marketplace add https://github.com/materic-inc/plugins.git`, then `codex plugin add twombly@materic`. For an existing source, verify the repository, refresh it with `codex plugin marketplace upgrade materic`, then install. Preserve a developer’s differently configured source if its name collides. Verify installation in `codex plugin list`, then carry on with step 3.

## Cursor

Use the whole Cursor plugin from this public repository. Clone `https://github.com/materic-inc/plugins.git` into a new temporary directory. Put a real copy of its `twombly-hosted` folder under the user's `~/.cursor/plugins/local/twombly` directory. Include its hidden `.cursor-plugin` folder. Keep an existing installation intact: if the target already exists, inspect its version and source before attempting an update. If this machine already has a working imported Claude plugin, use its native tools directly.

Carry on with step 3. Cursor loads the plugin after **Developer: Reload Window**; it may need enabling in **Customize → Plugins → Twombly**. The workspace may require an administrator to allow local imports. If local imports are unavailable, use the direct MCP setup below if workspace policy permits it. Avoid changing a team marketplace for a personal installation.

## Hosts with local MCP support

Register a local stdio MCP server named `twombly` using the host's supported configuration or install UI. Set the command to `npx` and the arguments to `["-y", "twombly@latest", "mcp"]`. Reload the host if needed. Verify that `open_canvas` is available, then use `add_frames` and `list_frames`. Pass the project's absolute path as `folder` when the host starts the server elsewhere. This provides the local canvas tools; the native plugin also supplies the skill and host-specific comment hooks.

## Shell-only agents

When the host cannot connect to a local MCP server but can run commands in the project directly on the person's computer (not in a virtual machine, as Cowork does), run `npx -y twombly@latest guide` and follow the command-line instructions. If the host has neither local project access nor a shell, ask the person to open the project in a supported local coding agent.
