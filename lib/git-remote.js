"use strict";

var spawn = require('child_process').spawn;
var chainsaw = require('chainsaw');

exports = module.exports = function() {
  return chainsaw(function(saw) {
    this.fetch = function(remote) {
      remote = remote || 'origin';
      spawn('git', ['fetch', remote]).on('close', function(code) {
        saw.next();
      });
    };

    this.rebase = function(remote, branch) {
      console.log("Rebasing...");
      remote = remote || 'origin';
      branch = branch || 'master';
      spawn('git', ['rebase', remote + "/" + branch]).on('close', function() {
        saw.next();
      });
    };

    this.done = function(cb) {
      cb();
    };
  });
};
