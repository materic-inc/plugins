# Twombly

[Twombly](https://twombly.app) puts working screens from your codebase side by side on a live canvas. Ask your agent to lay out an onboarding flow, compare versions of a page, or pull out components. Each version is a real, working frame you can click through.

With this plugin:

- **The canvas opens beside your conversation** in the ChatGPT and Codex desktop apps and any app that shows MCP Apps, and in Cursor's browser tab. Elsewhere it opens in your browser.
- **What you select is what "this" means.** Select frames on the canvas and your agent knows which ones you mean.
- **Comments reach your agent.** Tick "For agent" on a comment and your agent starts on it, in Claude Code, Codex, ChatGPT and Cursor.
- **Share with one click** for live cursors, comments and voice huddles.

## Install

Claude Code:

```
/plugin marketplace add materic-inc/plugins
/plugin install twombly@materic
```

Codex and the ChatGPT desktop app:

```
codex plugin marketplace add materic-inc/plugins
codex plugin add twombly@materic
```

Then restart the ChatGPT app and open Plugins → Twombly.

In Cursor, follow the [current setup guide](https://raw.githubusercontent.com/materic-inc/plugins/main/SETUP.md). It covers installing the full plugin locally while the official listing is unavailable.

Try: “Put our signup flow on Twombly so I can review every step side by side.”

Canvases live at twombly.app, private to you until you share them. Requires Node.js 22 or later.
