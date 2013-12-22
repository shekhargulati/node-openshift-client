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

exports['user tests'] = {
  setUp: function(done){
    this.openshift = new OpenShift({username : process.env.OPENSHIFT_USERNAME,password : process.env.OPENSHIFT_PASSWORD});
    done();
  },
  'should view user details' : function(test){
    test.expect(4);
    function resultCallback(error , result){
      test.ok(!error , 'should be no error in fetching user details');
      var jsonResult = JSON.parse(result);
      test.equal(jsonResult.data.login,'shekhar.redhat@gmail.com','username should be shekhar.redhat@gmail.com');
      test.equal(jsonResult.data.plan_id,'free','account is using free plan');
      test.equal(jsonResult.data.plan_state , 'ACTIVE','account is active');
      test.done();
    }
    this.openshift.showUser(resultCallback);
  }
};

exports['domain listing tests'] = {
  setUp: function(done){
    this.openshift = new OpenShift({username : process.env.OPENSHIFT_USERNAME,password : process.env.OPENSHIFT_PASSWORD});
    done();
  },
  'should list all domains for a user' : function(test){
    test.expect(4);
    function resultCallback(error , result){
      test.ok(!error , 'there should not be any error');
      var jsonResult = JSON.parse(result);
      test.ok(jsonResult , 'result not null');
      test.equal(jsonResult.data[0].name , 'onopenshiftcloud','domain name should be onopenshiftcloud');
      test.equal(jsonResult.data[0].suffix , 'rhcloud.com','domain name suffix should be rhcloud.com');
      test.done();
    }
    this.openshift.listDomains(resultCallback);
  }
};