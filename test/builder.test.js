(function() {
  // use zap to run tests, it also detects CoffeeScript files
  var assert, diff, diffeq, equ, fs, path, xml2js;

  xml2js = require('../src/xml2js');

  assert = require('assert');

  fs = require('fs');

  path = require('path');

  diff = require('diff');

  // fileName = path.join __dirname, '/fixtures/sample.xml'

  // shortcut, because it is quite verbose
  equ = assert.equal;

  // equality test with diff output
  diffeq = function(expected, actual) {
    var diffless, patch;
    diffless = "Index: test\n===================================================================\n--- test\texpected\n+++ test\tactual\n";
    patch = diff.createPatch('test', expected.trim(), actual.trim(), 'expected', 'actual');
    if (patch !== diffless) {
      throw patch;
    }
  };

  module.exports = {
    'test building basic XML structure': function(test) {
      var actual, builder, expected, obj;
      expected = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><xml><Label/><MsgId>5850440872586764820</MsgId></xml>';
      obj = {
        "xml": {
          "Label": [""],
          "MsgId": ["5850440872586764820"]
        }
      };
      builder = new xml2js.Builder({
        renderOpts: {
          pretty: false
        }
      });
      actual = builder.buildObject(obj);
      diffeq(expected, actual);
      return test.finish();
    },
    'test setting XML declaration': function(test) {
      var actual, builder, expected, opts;
      expected = '<?xml version="1.2" encoding="WTF-8" standalone="no"?><root/>';
      opts = {
        renderOpts: {
          pretty: false
        },
        xmldec: {
          'version': '1.2',
          'encoding': 'WTF-8',
          'standalone': false
        }
      };
      builder = new xml2js.Builder(opts);
      actual = builder.buildObject({});
      diffeq(expected, actual);
      return test.finish();
    },
    'test pretty by default': function(test) {
      var actual, builder, expected, obj;
      expected = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<xml>
  <MsgId>5850440872586764820</MsgId>
</xml>
`;
      builder = new xml2js.Builder();
      obj = {
        "xml": {
          "MsgId": ["5850440872586764820"]
        }
      };
      actual = builder.buildObject(obj);
      diffeq(expected, actual);
      return test.finish();
    },
    'test setting indentation': function(test) {
      var actual, builder, expected, obj, opts;
      expected = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<xml>
    <MsgId>5850440872586764820</MsgId>
</xml>
`;
      opts = {
        renderOpts: {
          pretty: true,
          indent: '    '
        }
      };
      builder = new xml2js.Builder(opts);
      obj = {
        "xml": {
          "MsgId": ["5850440872586764820"]
        }
      };
      actual = builder.buildObject(obj);
      diffeq(expected, actual);
      return test.finish();
    },
    'test headless option': function(test) {
      var actual, builder, expected, obj, opts;
      expected = `<xml>
    <MsgId>5850440872586764820</MsgId>
</xml>
`;
      opts = {
        renderOpts: {
          pretty: true,
          indent: '    '
        },
        headless: true
      };
      builder = new xml2js.Builder(opts);
      obj = {
        "xml": {
          "MsgId": ["5850440872586764820"]
        }
      };
      actual = builder.buildObject(obj);
      diffeq(expected, actual);
      return test.finish();
    },
    'test allowSurrogateChars option': function(test) {
      var actual, builder, expected, obj, opts;
      expected = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<xml>
    <MsgId>\uD83D\uDC33</MsgId>
</xml>
`;
      opts = {
        renderOpts: {
          pretty: true,
          indent: '    '
        },
        allowSurrogateChars: true
      };
      builder = new xml2js.Builder(opts);
      obj = {
        "xml": {
          "MsgId": ["\uD83D\uDC33"]
        }
      };
      actual = builder.buildObject(obj);
      diffeq(expected, actual);
      return test.finish();
    },
    'test explicit rootName is always used: 1. when there is only one element': function(test) {
      var actual, builder, expected, obj, opts;
      expected = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><FOO><MsgId>5850440872586764820</MsgId></FOO>';
      opts = {
        renderOpts: {
          pretty: false
        },
        rootName: 'FOO'
      };
      builder = new xml2js.Builder(opts);
      obj = {
        "MsgId": ["5850440872586764820"]
      };
      actual = builder.buildObject(obj);
      diffeq(expected, actual);
      return test.finish();
    },
    'test explicit rootName is always used: 2. when there are multiple elements': function(test) {
      var actual, builder, expected, obj, opts;
      expected = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><FOO><MsgId>5850440872586764820</MsgId></FOO>';
      opts = {
        renderOpts: {
          pretty: false
        },
        rootName: 'FOO'
      };
      builder = new xml2js.Builder(opts);
      obj = {
        "MsgId": ["5850440872586764820"]
      };
      actual = builder.buildObject(obj);
      diffeq(expected, actual);
      return test.finish();
    },
    'test default rootName is used when there is more than one element in the hash': function(test) {
      var actual, builder, expected, obj, opts;
      expected = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><root><MsgId>5850440872586764820</MsgId><foo>bar</foo></root>';
      opts = {
        renderOpts: {
          pretty: false
        }
      };
      builder = new xml2js.Builder(opts);
      obj = {
        "MsgId": ["5850440872586764820"],
        "foo": "bar"
      };
      actual = builder.buildObject(obj);
      diffeq(expected, actual);
      return test.finish();
    },
    'test when there is only one first-level element in the hash, that is used as root': function(test) {
      var actual, builder, expected, obj, opts;
      expected = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><first><MsgId>5850440872586764820</MsgId><foo>bar</foo></first>';
      opts = {
        renderOpts: {
          pretty: false
        }
      };
      builder = new xml2js.Builder(opts);
      obj = {
        "first": {
          "MsgId": ["5850440872586764820"],
          "foo": "bar"
        }
      };
      actual = builder.buildObject(obj);
      diffeq(expected, actual);
      return test.finish();
    },
    'test parser -> builder roundtrip': function(test) {
      var fileName;
      fileName = path.join(__dirname, '/fixtures/build_sample.xml');
      return fs.readFile(fileName, function(err, xmlData) {
        var xmlExpected;
        xmlExpected = xmlData.toString();
        return xml2js.parseString(xmlData, {
          'trim': true
        }, function(err, obj) {
          var builder, xmlActual;
          equ(err, null);
          builder = new xml2js.Builder({});
          xmlActual = builder.buildObject(obj);
          diffeq(xmlExpected, xmlActual);
          return test.finish();
        });
      });
    },
    'test building obj with undefined value': function(test) {
      var actual, builder, expected, obj;
      obj = {
        node: 'string',
        anothernode: void 0
      };
      builder = new xml2js.Builder({
        renderOpts: {
          pretty: false
        }
      });
      actual = builder.buildObject(obj);
      expected = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><root><node>string</node><anothernode/></root>';
      equ(actual, expected);
      return test.finish();
    },
    'test building obj with null value': function(test) {
      var actual, builder, expected, obj;
      obj = {
        node: 'string',
        anothernode: null
      };
      builder = new xml2js.Builder({
        renderOpts: {
          pretty: false
        }
      });
      actual = builder.buildObject(obj);
      expected = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><root><node>string</node><anothernode/></root>';
      equ(actual, expected);
      return test.finish();
    },
    'test escapes escaped characters': function(test) {
      var actual, builder, expected, obj;
      expected = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<xml>
  <MsgId>&amp;amp;&amp;lt;&amp;gt;</MsgId>
</xml>
`;
      builder = new xml2js.Builder();
      obj = {
        "xml": {
          "MsgId": ["&amp;&lt;&gt;"]
        }
      };
      actual = builder.buildObject(obj);
      diffeq(expected, actual);
      return test.finish();
    },
    'test cdata text nodes': function(test) {
      var actual, builder, expected, obj, opts;
      expected = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<xml>
  <MsgId><![CDATA[& <<]]></MsgId>
</xml>
`;
      opts = {
        cdata: true
      };
      builder = new xml2js.Builder(opts);
      obj = {
        "xml": {
          "MsgId": ["& <<"]
        }
      };
      actual = builder.buildObject(obj);
      diffeq(expected, actual);
      return test.finish();
    },
    'test cdata text nodes with escaped end sequence': function(test) {
      var actual, builder, expected, obj, opts;
      expected = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<xml>
  <MsgId><![CDATA[& <<]]]]><![CDATA[>]]></MsgId>
</xml>
`;
      opts = {
        cdata: true
      };
      builder = new xml2js.Builder(opts);
      obj = {
        "xml": {
          "MsgId": ["& <<]]>"]
        }
      };
      actual = builder.buildObject(obj);
      diffeq(expected, actual);
      return test.finish();
    },
    'test uses cdata only for chars &, <, >': function(test) {
      var actual, builder, expected, obj, opts;
      expected = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<xml>
  <MsgId><![CDATA[& <<]]></MsgId>
  <Message>Hello</Message>
</xml>
`;
      opts = {
        cdata: true
      };
      builder = new xml2js.Builder(opts);
      obj = {
        "xml": {
          "MsgId": ["& <<"],
          "Message": ["Hello"]
        }
      };
      actual = builder.buildObject(obj);
      diffeq(expected, actual);
      return test.finish();
    },
    'test uses cdata for string values of objects': function(test) {
      var actual, builder, expected, obj, opts;
      expected = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<xml>
  <MsgId><![CDATA[& <<]]></MsgId>
</xml>
`;
      opts = {
        cdata: true
      };
      builder = new xml2js.Builder(opts);
      obj = {
        "xml": {
          "MsgId": "& <<"
        }
      };
      actual = builder.buildObject(obj);
      diffeq(expected, actual);
      return test.finish();
    },
    'test does not error on non string values when checking for cdata': function(test) {
      var actual, builder, expected, obj, opts;
      expected = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<xml>
  <MsgId>10</MsgId>
</xml>
`;
      opts = {
        cdata: true
      };
      builder = new xml2js.Builder(opts);
      obj = {
        "xml": {
          "MsgId": 10
        }
      };
      actual = builder.buildObject(obj);
      diffeq(expected, actual);
      return test.finish();
    },
    'test does not error on array values when checking for cdata': function(test) {
      var actual, builder, expected, obj, opts;
      expected = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<xml>
  <MsgId>10</MsgId>
  <MsgId>12</MsgId>
</xml>
`;
      opts = {
        cdata: true
      };
      builder = new xml2js.Builder(opts);
      obj = {
        "xml": {
          "MsgId": [10, 12]
        }
      };
      actual = builder.buildObject(obj);
      diffeq(expected, actual);
      return test.finish();
    },
    'test building obj with array': function(test) {
      var actual, builder, expected, obj, opts;
      expected = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<root>
  <MsgId>10</MsgId>
  <MsgId2>12</MsgId2>
</root>
`;
      opts = {
        cdata: true
      };
      builder = new xml2js.Builder(opts);
      obj = [
        {
          "MsgId": 10
        },
        {
          "MsgId2": 12
        }
      ];
      actual = builder.buildObject(obj);
      diffeq(expected, actual);
      return test.finish();
    }
  };

}).call(this);
