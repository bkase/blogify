# Architecture

* main - Top level server, listening for GitHub's webhooks
* modified-files - Takes Post-Receive payload, returns array of all modified  files in all commits
* render - (re)-Renders a markdown+ file (with Latex?)
  * render(file)
  
# Dependencies

substack/node-chainsaw - to write modules with chainable-interfaces
chjj/marked - to render the blog files
substack/git-file - stream information about git
express - server

# Todo

* Make sure we don't look for a file that we modified or added then later removed
* Refactor libraries here into npm modules

