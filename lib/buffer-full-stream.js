var Transform = require('stream').Transform;
var util = require('util');

function BufferFullStream(opts) {
  Transform.call(this, opts);
  this._chunks = [];
}

util.inherits(BufferFullStream, Transform);

BufferFullStream.prototype._transform = function(chunk, encoding, done) {
  this._chunks.push(chunk);
  done();
};

BufferFullStream.prototype._flush = function(done) {
  this.push(Buffer.concat(this._chunks));
  done();
};
 
exports = module.exports = function() {
  return new BufferFullStream();
};

