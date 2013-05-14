var cheerio = require('cheerio');
var fs = require('fs');


exports = module.exports = function(root) {
  var $ = cheerio.load(fs.readFileSync(root + 'stubs/blogPost.html'));
  return function(blogPost) {
    $('#post').html(blogPost);
    return $.html();
  };
}

