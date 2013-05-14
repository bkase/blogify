var express = require('express');
var gitFile = require('git-file');
var marked = require('marked');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var gremote = require('./lib/git-remote');
var extractFiles = require('./lib/important-files');
var bfs = require('./lib/buffer-full-stream');
var ts = require('./lib/transformation-stream');
var forkJoin = require('./lib/fork-join');
var texify = require('./lib/texify');
var inject = require('./lib/inject-post')('./');

var app = express();

var secret = <secret>
var repoLocation = 'repo';
var blogPostLocation = 'posts';

function eachChangedFile(file, cb) {
  if (path.extname(file) === '.md' && 
      path.dirname(file).indexOf(blogPostLocation) !== -1) {
    var outFilename = '../' + file.replace('.md', '.html');
    gitFile
      .read("HEAD", file)
      .pipe(bfs())
      .pipe(ts(_.compose(inject, texify, marked)))
      .pipe(fs.createWriteStream(outFilename))
      .on('close', function() {
        console.log("Finished: " + file);
        cb();
      });
  }
}

app.use(express.bodyParser());


process.chdir(repoLocation);

app.post('/hook', function(req, res) {
  if (req.query.secret !== secret) {
    res.end(403, { error: 'secret is wrong' });
  } else {
    console.log(req.body);
    var changedFiles = extractFiles(JSON.parse(req.body.payload));
    console.log(changedFiles);
    gremote()
        .fetch()
        .rebase()
        .done(function() {
          forkJoin({ ignoreErrors: true })
            .fork(changedFiles, eachChangedFile)
            .join(function() {
              console.log("Finished processing all files");
            });
        });
    res.end("Correct secret, processing...");
  }
});

app.listen(3004);

