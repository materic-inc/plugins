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

In Cursor, follow the [current setup guide](https://twombly.app/install). It covers installing the full plugin locally while the official listing is unavailable.

Try: “Put our signup flow on Twombly so I can review every step side by side.”

Canvases live at twombly.app, private to you until you share them. Requires Node.js 22 or later.

## Data and permissions

Twombly reads the project folders you select and uploads static frame files and previews to your private canvas on twombly.app. Sharing is an explicit action. The comment hooks ask the Twombly server on your machine for feedback addressed to your agent. The service uses Google for sign-in, Cloudflare for hosting and huddles, PostHog for usage and error reports, and Resend for invitations. See the [privacy policy](https://twombly.app/privacy) for retention, deletion and how to turn off local usage reporting.
