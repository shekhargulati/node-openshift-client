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

exports.openshift = {
  setUp: function(done) {
    this.openshift = new OpenShift({username : process.env.OPENSHIFT_USERNAME,password : process.env.OPENSHIFT_PASSWORD});
    done();
  },
  'should fetch autorization token': function(test) {
    
    test.expect(2);
    function resultCallback(error , result){
      // console.log(JSON.parse(result));
      test.ok(!error , 'there should not be any error');
      test.ok(result,'should be not null');
      test.done();
    }
    this.openshift.authorizationToken(resultCallback);
  },
  'should fetch user details' : function(test){
    test.expect(4);
    function resultCallback(error , result){
      test.ok(!error , 'there should not be any error');
      var jsonResult = JSON.parse(result);
      test.equal(jsonResult.data.login,'shekhar.redhat@gmail.com','username should be shekhar.redhat@gmail.com');
      test.equal(jsonResult.data.plan_id,'free','account is using free plan');
      test.equal(jsonResult.data.plan_state , 'ACTIVE','account is active');
      test.done();
    }
    this.openshift.showUser(resultCallback);
  }
};
