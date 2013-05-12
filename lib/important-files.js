var _ = require('lodash');

module.exports = function(postReceiveData) {
  if (!postReceiveData || 
      !postReceiveData.commits || 
      postReceiveData.commits.length == 0) {
    return [];
  } else {
    var commits = _(postReceiveData.commits);
    var m = commits.map(function(data) { return data.modified; });
    var a = commits.map(function(data) { return data.added; });
    return a.zip([m.value()]).flatten().uniq().compact().value();
  }
}
