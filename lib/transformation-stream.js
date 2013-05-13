var Transform = require('stream').Transform;
var util = require('util');

function TransformationStream(transformation, opts) {
  Transform.call(this, opts);
  this._transformation = transformation;
  this.decodeStrings = true;
}

util.inherits(TransformationStream, Transform);

TransformationStream.prototype._transform = function(chunk, encoding, done) {
  try {
    var result = this._transformation(chunk.toString());
    if (result !== undefined) {
      this.push(result)
    }
  } catch (e) {
    console.log("Error!!" + e);
    this.emit('error', new Error('Transformation threw error'));
    this.push(chunk);
  }
  done();
};


exports = module.exports = function(transformation) {
  return new TransformationStream(transformation);
}

