'use strict';

var OpenShift = require('../lib/openshift.js');




/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['authorization tests'] = {
  setUp: function(done) {
    this.openshift = new OpenShift({username : process.env.OPENSHIFT_USERNAME,password : process.env.OPENSHIFT_PASSWORD});
    done();
  },
  'should fetch autorization token': function(test) {
    test.expect(2);
    function resultCallback(error , result){
      test.ok(!error , 'there should not be any error');
      test.ok(result,'should be not null');
      test.done();
    }
    this.openshift.authorizationToken(resultCallback);
  },
  'should get error when credentials are wrong' : function(test){
    this.openshift = new OpenShift({username : 'test',password : 'test'});
    test.expect(3);
    function resultCallback(error , result){
      test.ok(error , 'should fail as credentials are wrong');
      test.equals(error , 'Error: HTTP 401', 'should fail as credentials are wrong');
      test.equal(result,'HTTP Basic: Access denied.\n','should get access denied');
      test.done();
    }
    this.openshift.authorizationToken(resultCallback);
  }
};