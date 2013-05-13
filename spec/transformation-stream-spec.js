var ts = require('../lib/transformation-stream');
var fs = require('fs');
var es = require('event-stream');

function fileCompare(a, b, cmp) {
  var aContents = fs.readFileSync(a).toString();
  var bContents = fs.readFileSync(b).toString();
  if (cmp) {
    expect(cmp(aContents, bContents)).toBe(true);
  } else {
    expect(aContents.trim() === bContents.trim()).toBe(true);
  }
}

describe('Transformation stream tests', function() {
  
  it('should be the same as input for identity transforms', function() {
    var isDone = false;

    fs.createReadStream('test.txt')
        .pipe(ts(function(a) { return a; }))
        .pipe(fs.createWriteStream('test.txt.out'))
        .on('close', function() {
          fileCompare('test.txt', 'test.txt.out');
          isDone = true;
        });

    waitsFor(function() { return isDone; });
  });

  it('should be the same as input for identity transforms + splitted', function() {
    var isDone = false;

    fs.createReadStream('test.txt')
        .pipe(es.split('\n'))
        .pipe(ts(function(a) { return a + '\n'; }))
        .pipe(fs.createWriteStream('test.txt.out'))
        .on('close', function() {
          fileCompare('test.txt', 'test.txt.out');
          isDone = true;
        });

    waitsFor(function() { return isDone; });
  });

  it('should transform the stream to uppercase strings', function() {
    var isDone = false;

    fs.createReadStream('test.txt')
        .pipe(es.split('\n'))
        .pipe(ts(function(a) { return a.toUpperCase() + '\n'; }))
        .pipe(fs.createWriteStream('test.txt.out'))
        .on('close', function() {
          fileCompare('test.txt', 'test.txt.out', function(a, b) {
            return a.toUpperCase().trim() === b.trim(); 
          });
          isDone = true;
        });
    
    waitsFor(function() { return isDone; });
  });
});

