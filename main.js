var express = require('express');
var gitFile = require('git-file');
var marked = require('marked');
var fs = require('fs');

var gremote = require('./lib/git-remote');
var extractFiles = require('./lib/important-files');
var bfs = require('./lib/buffer-full-stream');
var ts = require('./lib/transformation-stream');
var forkJoin = require('./lib/fork-join');

var app = express();

var secret = <secret>
var repoLocation = 'repo';


function eachChangedFile(file, cb) {
  gitFile
    .read("HEAD", file)
    .pipe(bfs())
    .pipe(ts(marked))
    .pipe(fs.createWriteStream(file + '_out'))
    .on('close', function() {
      console.log("Finished: " + file);
      cb();
    });
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

