# Review Twombly

[Watch the product walkthrough](https://player.mux.com/kE02AfSy9OHOtyANM1FDFoK285RFCE301GP8cTGSRbxrA). It shows comparing screens, leaving feedback and reviewing design changes.

Connect Twombly using the [setup instructions](../SETUP.md), then download [Field guide](field-guide.zip), unzip it, and open the Field guide folder in your coding agent. It contains two sample screens. If your hosted app cannot read a local folder, attach both HTML files to the conversation instead.

Complete your host's Twombly connection prompt. Private canvas creation can work before sign-in; Google sign-in is needed to enable sharing. The local runtime requires Node.js 22 or later and a compatible browser. Leave link sharing off throughout the walkthrough.

1. Ask the agent to open a new private Twombly canvas for this project and place Explore and Saved side by side. Both screens should appear in one row.
2. Click “Save this walk” in Explore. The button should change to “Saved”.
3. Select Explore, pin a comment to it, and ask the agent to read the feedback. It should find the comment on Explore.
4. Ask the agent to change the Explore heading to “Coastal walks” and update that frame. The frame should keep its position and comment.
5. Ask the agent to list the frames. Explore and Saved should both appear.

For a failure case, ask the agent to add a folder named MissingScreen without creating or inventing its contents. It should identify the missing source and preserve the two existing frames.

Publisher: Materic, Inc.

Support: jaytel@materic.inc · [Privacy](https://twombly.app/privacy) · [Terms](https://twombly.app/terms)
