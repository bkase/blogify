"use strict";

var gitremote = require('../lib/git-remote.js');
var spawn = require('child_process').spawn;

describe("git-remote", function() {
  
  it("should fetch and rebase origin/master", function() {
    process.chdir('event-stream');
    console.log(process.cwd());
      gitremote()
          .fetch()
          .rebase()
          .done(function() {
            runs(function() { console.log("Done"); });
          });
  });

});


