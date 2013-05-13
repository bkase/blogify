var forkJoin = require('../lib/fork-join.js');

describe("Simple fork-join library", function() { 
  it("should join on nothing", function() {
    var isDone = false;
    forkJoin()
        .join(function() {
          isDone = true;
        });

    waitsFor(function() { return isDone; });
  });

  it("should fork and call join at end", function() {
    var isDone = false;
    forkJoin()
        .fork([1,5,3,2], function(elem, cb) {
          setTimeout(function() {
            cb(null, elem*2);
          }, elem * 5);
        })
        .join(function(results) {
          expect(JSON.stringify(results)).toEqual(JSON.stringify([2, 10, 6, 4]));
          isDone = true;
        });

    waitsFor(function() { return isDone; }, "waiting", 1000);
  });

  it("should fork any number of times and call join at end", function() {
    var isDone = false;
    forkJoin()
        .fork([1,5,3], function(elem, cb) {
          setTimeout(function() {
            cb(null, elem*2);
          }, elem * 5);
        })
        .fork([2], function(elem, cb) {
          setTimeout(function() {
            cb(null, elem*2);
          }, elem * 5);
        })
        .join(function(results) {
          expect(JSON.stringify(results)).toEqual(JSON.stringify([2, 10, 6, 4]));
          isDone = true;
        });

    waitsFor(function() { return isDone; }, "waiting...", 500);
  });

  it("should leave undefined elements in the result array if asyncFn has errors", function() {
    var isDone = false;
    forkJoin()
        .fork([1,5,3,2], function(elem, cb) {
          setTimeout(function() {
            if (elem === 3) {
              cb("elem is 3", 76);             
            } else {
              cb(null, elem*2);
            }
          }, elem * 5);
        })
        .join(function(results) {
          expect(JSON.stringify(results)).toEqual(JSON.stringify([2, 10, undefined, 4]));
          isDone = true;
        });

    waitsFor(function() { return isDone; }, "waiting...", 500);
  });
});

