var Loader = require("./Loader");
var when = require('when');
var creatorTest = require('./creatorTest');
var acsTest = require('./acsTest');
//var test = require("./mytest");


var laoder = new Loader(); 
setUp();
/* function will read api list then 
 * credentials list then will fire 
 * creator test function */
function setUp() {

	laoder.loadCSV('creator/api_list.csv').then(function(apis) {
		console.log("apis length:" + apis.length);
		creatorAPIs = apis;
		laoder.loadCSV('creator/credentials.csv').then(function(credentials) {
			console.log("credentials length:" + credentials.length);
			listOfcredentail = credentials;
			laoder.loadCSV("acs/api_list.csv").then(function(acsAPIs){
				acsApis = acsAPIs;
				firesTest(regullarJob);
			});
			
			//regullarJob();
		});
	}); 

}


function firesTest(callback){
	creatorTest.test(listOfcredentail, creatorAPIs);
	acsTest.test(listOfcredentail, acsApis);
	callback();
}
/* an array to hold creator api urls*/
var creatorAPIs;
/* an array to hold acs api urls*/
var acsApis;
/*read your api list*/
//readApis();
/*an array to hold all credentials from credential.csv*/
var listOfcredentail;
/*read your credential list*/
//readCredentials()

/* the variable stores your "X" minutes,that you want this script runs every X minutes.*/
var interval_minutes;
/*passing 'X' minutes as command line argument*/
process.argv.forEach(function(val, index, array) {
	console.log(index + ': ' + val);
	interval_minutes = array[2];
});
/*converting 'X' minutes to milliseconds*/
the_interval = interval_minutes * 60 * 1000;
function regullarJob() {
	setInterval(function() {
		console.log("I am doing my " + interval_minutes + "minues check");
		creatorTest.test(listOfcredentail, creatorAPIs);
		acsTest.test(listOfcredentail, acsApis);
	}, the_interval);
}

console.log("started");

function readApis() {

	new Loader().loadCSV('creator/api_list.csv').then(function(apis) {
		console.log("apis length:" + apis.length);
		listOfAPIs = apis;
	});
}

function readCredentials() {

	new Loader().loadCSV('creator/credentials.csv').then(function(credentials) {
		console.log("credentials length:" + credentials.length);
		listOfcredentail = credentials;
	});

}

increaseValue(3, printValue);
function increaseValue(value, callBack) {
	value++;
	callBack(value);
}

function printValue(value) {
	console.log("value :" + value);
}
