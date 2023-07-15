(function() {
  var assert, equ, parseNumbersExceptAccount, processors, xml2js;

  processors = require('../src/processors');

  xml2js = require('../src/xml2js');

  assert = require('assert');

  equ = assert.equal;

  parseNumbersExceptAccount = function(value, key) {
    if (key === 'accountNumber') {
      return value;
    }
    return processors.parseNumbers(value);
  };

  module.exports = {
    'test normalize': function(test) {
      var demo, result;
      demo = 'This shOUld BE loWErcase';
      result = processors.normalize(demo);
      equ(result, 'this should be lowercase');
      return test.done();
    },
    'test firstCharLowerCase': function(test) {
      var demo, result;
      demo = 'ThiS SHould OnlY LOwercase the fIRST cHar';
      result = processors.firstCharLowerCase(demo);
      equ(result, 'thiS SHould OnlY LOwercase the fIRST cHar');
      return test.done();
    },
    'test stripPrefix': function(test) {
      var demo, result;
      demo = 'stripMe:DoNotTouch';
      result = processors.stripPrefix(demo);
      equ(result, 'DoNotTouch');
      return test.done();
    },
    'test stripPrefix, ignore xmlns': function(test) {
      var demo, result;
      demo = 'xmlns:shouldHavePrefix';
      result = processors.stripPrefix(demo);
      equ(result, 'xmlns:shouldHavePrefix');
      return test.done();
    },
    'test parseNumbers': function(test) {
      equ(processors.parseNumbers('0'), 0);
      equ(processors.parseNumbers('123'), 123);
      equ(processors.parseNumbers('15.56'), 15.56);
      equ(processors.parseNumbers('10.00'), 10);
      return test.done();
    },
    'test parseBooleans': function(test) {
      equ(processors.parseBooleans('true'), true);
      equ(processors.parseBooleans('True'), true);
      equ(processors.parseBooleans('TRUE'), true);
      equ(processors.parseBooleans('false'), false);
      equ(processors.parseBooleans('False'), false);
      equ(processors.parseBooleans('FALSE'), false);
      equ(processors.parseBooleans('truex'), 'truex');
      equ(processors.parseBooleans('xtrue'), 'xtrue');
      equ(processors.parseBooleans('x'), 'x');
      equ(processors.parseBooleans(''), '');
      return test.done();
    },
    'test a processor that filters by node name': function(test) {
      var options, xml;
      xml = '<account><accountNumber>0012345</accountNumber><balance>123.45</balance></account>';
      options = {
        valueProcessors: [parseNumbersExceptAccount]
      };
      return xml2js.parseString(xml, options, function(err, parsed) {
        equ(parsed.account.accountNumber, '0012345');
        equ(parsed.account.balance, 123.45);
        return test.finish();
      });
    },
    'test a processor that filters by attr name': function(test) {
      var options, xml;
      xml = '<account accountNumber="0012345" balance="123.45" />';
      options = {
        attrValueProcessors: [parseNumbersExceptAccount]
      };
      return xml2js.parseString(xml, options, function(err, parsed) {
        equ(parsed.account.$.accountNumber, '0012345');
        equ(parsed.account.$.balance, 123.45);
        return test.finish();
      });
    }
  };

}).call(this);
