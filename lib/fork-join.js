var chainsaw = require('chainsaw');

var nop = function() { };

exports = module.exports = function(opts) {
  
  var shouldIgnoreErrors = (opts) ? opts.ignoreErrors : false;

  var elemsDone = [];
  var total = 0;
  var doneCount = 0;
  var joinCb = nop;
  return chainsaw(function(saw) {
    this.fork = function(elements, asyncFn) { /* [element], function(element, function(output)) */
      var offset = total;
      var i;

      total += elements.length;

      for (i = 0; i < elements.length; i++) {
        (function() {
          var _i = i; // capture the current i
          asyncFn(elements[i], function(err, output) {
            doneCount++;
            if (err && !shouldIgnoreErrors) {
              elemsDone[_i + offset] = undefined;
            } else {
              elemsDone[_i + offset] = output;
            }
            // if this is the last one, call the join
            if (total === doneCount) {
              joinCb(elemsDone);
            }
          });
        })();
      }

      saw.next();
    };

    this.join = function(cb) { /* cb = function([result]) { stuff after a result } */
      joinCb = cb;
      if (total === 0) {
        cb([]);
      }
    };
  });
};


