---
name: twombly
description: Put screens, flows and design versions side by side on a shared canvas, with live controls to tune them. Use when asked to "put this on Twombly", "put these on a canvas", "lay out these versions", "show me all the variations side by side", or to see the screens or steps of a flow side by side; to keep or change values someone tuned on a canvas (sliders, colours, spacing); or to share explorations with real-time cursors and comments. Works with any framework in any repo.
---

When the Twombly tools take a canvas ID and frame files, use these hosted tools. If the person gives you a Twombly link, open the canvas with the ID from the link. For a new canvas, call `open_canvas` once and keep its ID for the conversation. Leave link sharing private until the person asks to share.

For each frame, pass its static files to `add_frames`. Include an entry HTML file and every asset it references. Use distinct titles and the actual design dimensions. Put related frames in the same call. Use files the person supplied or asked you to create. Ask for missing source material when you cannot access it.

Use `list_frames` to find an existing frame's ID. Use `update_frame` to replace its files in place so comments and position survive. Use `get_comments` to read feedback. When the person sends a comment or selects a frame in chat, use that context to identify what they mean.
