var bfs = require('../lib/buffer-full-stream');
var es = require('event-stream');
var fs = require('fs');

function fileCompare(a, b, cmp) {
  var aContents = fs.readFileSync(a).toString();
  var bContents = fs.readFileSync(b).toString();
  expect(cmp(aContents, bContents)).toBe(true);
}

describe('Buffer the entire stream', function() {
  
  it('should buffer everything before emitting anything', function() {
    var isDone = false;
    fs.createReadStream('test.txt')
        .pipe(es.split('\n'))
        .pipe(bfs())
        .pipe(fs.createWriteStream('test.txt.out'))
        .on('close', function() {
          fileCompare('test.txt', 'test.txt.out', function(a, b) {
            return a.split('\n').join('') === b;
          });
          isDone = true;
        });

    waitsFor(function() { return isDone; });
  });
});

