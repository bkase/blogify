var inject = require('../lib/inject-post')('../');

describe('Injecting posts', function() {
  
  it('should result in a post injected', function() {
    var someHtml = '<h1> yo, html </h1>';
    expect(inject(someHtml).indexOf('div') !== -1).toBe(true);
  });
});
