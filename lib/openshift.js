/*
 * node-openshift-client
 * https://github.com/shekhargulati/node-openshift-client
 *
 * Copyright (c) 2013 Shekhar Gulati
 * Licensed under the MIT license.
 */

'use strict';

var request = require('request');

var BASE_URL = "https://openshift.redhat.com/broker/rest/";

module.exports = OpenShift;

function OpenShift(options){
	this.options = options;
	this.credentials = new Buffer(options.username +":" + options.password).toString('base64');
}

OpenShift.prototype.authorizationToken = function(){
	request.post(options(this.credentials , 'user/authorizations', {scope:'session'}) , callback);
};

OpenShift.prototype.showUser = function() {
	request.get(options(this.credentials , 'user'),callback);
};

OpenShift.prototype.listDomains = function(){
	request.get(options(this.credentials,'domains') , callback);
};

OpenShift.prototype.createDomain = function(domain_name){
	request.post(options(this.credentials , 'domains' , {id:domain_name}) , callback);
};

OpenShift.prototype.viewDomainDetails = function(domain_name){
	request.get(options(this.credentials , 'domains/'+domain_name),callback);
};

OpenShift.prototype.updateDomain = function(old_domain_name , new_domain_name){
	request.put(options(this.credentials , 'domains/'+old_domain_name , {id : new_domain_name}), callback);
};

OpenShift.prototype.deleteDomain = function(domain_name,force){
	force = force || true;
	request.del(options(this.credentials , 'domains/'+domain_name, {force : force}), callback);
};

OpenShift.prototype.listApplications = function(domain_name){
	var rest_url_fragment = 'domains/'+ domain_name+ '/applications';
	request.get(options(this.credentials ,rest_url_fragment), callback);
};

OpenShift.prototype.listApplicationsAndCartridges = function(domain_name){
	var rest_url_fragment = 'domains/'+ domain_name+ '/applications?include=cartridges';
	request.get(options(this.credentials ,rest_url_fragment), callback);	
};

OpenShift.prototype.createApplication = function(domain_name, app_options){
	var rest_url_fragment = 'domains/'+domain_name+'/applications';
	request.post(options(this.credentials , rest_url_fragment , app_options) , callback);
};

OpenShift.prototype.viewApplicationDetails = function(domain_name,app_name){
	var rest_url_fragment = 'domains/'+domain_name+'/applications/'+app_name;
	request.get(options(this.credentials , rest_url_fragment),callback);
};

OpenShift.prototype.startApplication = function(domain_name,app_name){
	var rest_url_fragment = 'domains/'+domain_name+'/applications/'+app_name+'/events';
	request.post(options(this.credentials , rest_url_fragment,{event:'start'}),callback);
};

OpenShift.prototype.stopApplication = function(domain_name,app_name){
	var rest_url_fragment = 'domains/'+domain_name+'/applications/'+app_name+'/events';
	request.post(options(this.credentials , rest_url_fragment,{event:'stop'}),callback);
};

OpenShift.prototype.forceStopApplication = function(domain_name,app_name){
	var rest_url_fragment = 'domains/'+domain_name+'/applications/'+app_name+'/events';
	request.post(options(this.credentials , rest_url_fragment,{event:'force-stop'}),callback);
};

OpenShift.prototype.restartApplication = function(domain_name,app_name){
	var rest_url_fragment = 'domains/'+domain_name+'/applications/'+app_name+'/events';
	request.post(options(this.credentials , rest_url_fragment,{event:'restart'}),callback);
};

OpenShift.prototype.deleteApplication = function(domain_name , app_name){
	var rest_url_fragment = 'domains/'+domain_name+'/applications/'+app_name;
	request.del(options(this.credentials , rest_url_fragment),callback);	
};

OpenShift.prototype.scaleUpApplication = function(domain_name , app_name){
	var rest_url_fragment = 'domains/'+domain_name+'/applications/'+app_name+'/events';
	request.post(options(this.credentials , rest_url_fragment,{event:'scale-up'}),callback);
};

OpenShift.prototype.scaleDownApplication = function(domain_name , app_name){
	var rest_url_fragment = 'domains/'+domain_name+'/applications/'+app_name+'/events';
	request.post(options(this.credentials , rest_url_fragment,{event:'scale-down'}),callback);
};


function options(credentials , rest_url_fragment , data){
	var options = {
	  url : BASE_URL + rest_url_fragment,
	  headers : {
	    'Accept' : 'application/json',
	    'Authorization' : 'Basic ' + credentials
	  },
	  form : data
  	};
  	return options;
}

function callback(error, response, body) {
	if (!error && (response.statusCode == 200 || response.statusCode == 201)) {
        var info = JSON.parse(body);
       	console.log(info);
    }else{
    	console.log("Error Response code : "+response.statusCode);
    	console.log(body);
    }
 };