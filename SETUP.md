# Set up Twombly and make the first canvas

Work in the person's current project. Use the runtime you are actually running in (Claude Code, Cursor, or Codex). If multiple CLIs are installed, their presence alone does not identify your host.

1. If Twombly’s open_canvas and add_frames tools are already available, use them. Read the Twombly guide first, open one canvas, add the project's main screens, and inspect the result.
2. Otherwise install the Twombly skill plugin for your host using one of the routes below. This marketplace version provides the skill and uses the published local canvas tool. The same conversation can make a canvas immediately, even when the plugin will only load for future chats.
3. Run `npx -y twombly@latest guide`, follow its instructions, build the actual screens as static frames and add them. Return the canvas address after verifying the frames. A successful plugin install alone does not finish the task.

## Claude Code

Run `claude plugin marketplace add https://github.com/materic-inc/plugins.git` and then `claude plugin install twombly@materic`. If the marketplace is already present, continue to install. If the person needs to run an interactive command, give them the corresponding `/plugin marketplace add materic-inc/plugins` or `/plugin install twombly@materic` command. Continue with step 3 in this conversation.

## Codex and ChatGPT desktop with a local project

Run `codex plugin marketplace add https://github.com/materic-inc/plugins.git` and then `codex plugin add twombly@materic`. If permissions require the person to act, provide the command and its purpose. A new local chat may be needed to see the newly installed plugin. Continue with step 3 now.

## Cursor

Use the public Twombly skill with `npx -y skills add materic-inc/plugins --skill twombly --agent cursor -y` in this project. Continue with step 3. The official Cursor Marketplace listing is pending publication. Avoid changing a team's marketplace for a personal installation.

## Other hosts or missing capabilities

If you can work in a local project and run Node.js 22 or later, use step 3 directly. If you have no local project or shell, ask the person to open their project in a local coding agent and paste the same prompt. If a download or permission is blocked, describe the exact action needed and carry on with any available local route. Do not publish the canvas or enable comment hooks unless the person asks.
