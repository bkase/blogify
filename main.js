var express = require('express');
var gitFile = require('git-file');

var gremote = require('./lib/git-remote');
var extractFiles = require('./lib/important-files');

var app = express();

var secret = <secret>
var repoLocation = 'repo';

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
          changedFiles.map(function(file) {
            // TODO: swap out process.stdout with res
            gitFile.read("HEAD", file).pipe(process.stdout);
          });
        });
    res.end("Correct secret, processing...");
  }
});

app.listen(3004);

