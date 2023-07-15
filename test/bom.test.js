(function() {
  var assert, equ, xml2js;

  xml2js = require('../src/xml2js');

  assert = require('assert');

  equ = assert.equal;

  module.exports = {
    'test decoded BOM': function(test) {
      var demo;
      demo = '\uFEFF<xml><foo>bar</foo></xml>';
      return xml2js.parseString(demo, function(err, res) {
        equ(err, void 0);
        equ(res.xml.foo[0], 'bar');
        return test.done();
      });
    }
  };

}).call(this);
