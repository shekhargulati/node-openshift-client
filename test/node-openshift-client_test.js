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

var openshift = new OpenShift({username : process.env.OPENSHIFT_USERNAME,password : process.env.OPENSHIFT_PASSWORD});
openshift.deleteDomain('onopenshiftcloud');

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

exports['domain application tests'] = {
  setUp: function(done){
    this.openshift = new OpenShift({username : process.env.OPENSHIFT_USERNAME,password : process.env.OPENSHIFT_PASSWORD});
    done();
  },
  
  'should create domain' : function(test){
    console.log('\n Running test \'should create domain\'');
    test.expect(2);
    function resultCallback(error , result){
      test.ok(!error , 'there should not be any error');
      var jsonResult = JSON.parse(result);
      test.ok(jsonResult,'result should be truthy');
      test.done();
    }
    this.openshift.createDomain('onopenshiftcloud',resultCallback);
  },

  'should list all domains' : function(test){
    console.log('\n Running test \'should list all domains\'');
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
  },
  'should view domain details' : function(test){
    console.log('\n Running test \'should view domain details\'');
    test.expect(3);
    function resultCallback(error , result){
      test.ok(!error , 'there should not be any error');
      var jsonResult = JSON.parse(result);
      test.ok(jsonResult , 'result not null');
      test.equal(jsonResult.data.name,'onopenshiftcloud','domain name should be onopenshiftcloud');
      test.done();
    }
    this.openshift.viewDomainDetails('onopenshiftcloud',resultCallback);
  },

  'should create application' : function(test){
    console.log('\n Running test \'should create application\'');
    test.expect(7);
    function resultCallback(error , result){
      var jsonResult = JSON.parse(result);
      test.ok(!error ,'should not have error message '+error);
      test.ok(jsonResult , 'result not null');
      test.equal(jsonResult.data.app_url ,'http://myfirstapp-onopenshiftcloud.rhcloud.com/','app url should be http://myfirstapp-onopenshiftcloud.rhcloud.com/');
      test.equal(jsonResult.data.name ,'myfirstapp','app name should be myfirstapp');
      test.equal(jsonResult.data.scalable,true , 'app should be scaleable');
      test.equal(jsonResult.data.framework,'php-5.3','web cartridge should be php-5.3');
      test.ok(jsonResult.data.git_url,'git url should be truthy');
      test.done();
    }
    var app_options = {
      name : 'myfirstapp',
      cartridge : 'php-5.3',
      scale : true
    };
    this.openshift.createApplication('onopenshiftcloud',app_options, resultCallback);
  },

  'should list all the supported cartridges' : function(test){
    console.log('\n Running test \'should list all the supported cartridges\'');
    test.expect(3);
    function resultCallback(error , result){
      test.ok(!error, 'there should not be any error');
      var jsonResult = JSON.parse(result);
      test.ok(jsonResult,'listCartridges() result should be truthy');
      test.equal(jsonResult.data.length ,29, 'number of cartridges should be 29');
      test.done();
    }
    this.openshift.listCartridges(resultCallback);
  },

  'should add mongodb cartridge to application' : function(test){
    console.log('\n Running test \'should add mongodb cartridge to application\'');
    test.expect(3);
    function resultCallback(error , result){
      test.ok(!error, 'there should not be any error');
      var jsonResult = JSON.parse(result);
      test.ok(jsonResult,'addCartridge() result should be truthy');
      test.ok(jsonResult.status, 'created','status should be created');
      test.done();
    }
    this.openshift.addCartridge('onopenshiftcloud','myfirstapp','mongodb-2.2',resultCallback);
  },

  'should delete application' : function(test){
    console.log('\n Running test \'should delete application\'');
    test.expect(3);
    function resultCallback(error , result){
      test.ok(!error , 'there should not be any error');
      var jsonResult = JSON.parse(result);
      test.ok(jsonResult , 'result not null');
      test.equal(jsonResult.messages[0].text,'Application myfirstapp is deleted.','success message should be not null');
      test.done();
    }
    this.openshift.deleteApplication('onopenshiftcloud','myfirstapp', resultCallback);
  },
  'should delete domain' : function(test){
    console.log('\n Running test \'should delete domain\'');
    test.expect(3);
    function resultCallback(error , result){
      test.ok(!error , 'there should not be any error');
      var jsonResult = JSON.parse(result);
      test.ok(jsonResult , 'result not null');
      test.ok(jsonResult.messages[0].text, 'message should be not null');
      test.done();
    }
    this.openshift.deleteDomain('onopenshiftcloud',resultCallback);
  }

};