var rest = require('./rest');
var emailSender = require('./emailSender');
var when = require('when');
/* This function will login using first credential from array credentials
 and will check if response is '200'.If not it will re login with next credential.
 in sequence if three times response is not ok, will exit the procees.
 If response is '200' will fetch session Id.Will use session ids to call APIs.
 *
 * */
exports.test = function test(credentials, listOfApis) {
	var index = 0;
	var credential = credentials[index];

	var opts = {
		rootPath : '/login/',
		basePath : '/v3test/ds',
		//hostname : 'thunder.creatormail.co.uk',
		hostname : 'mysitesdev.cm-apps.co.uk',
		credential : {
			Surname : "Martin",
			DepartureDate : "2013-03-19",
			ShopNumber : "9999",
			BookingRef : "12347027"
		}
	}
	var options = {
		hostname : 'mysitesdev.cm-apps.co.uk',
		port : '443',
		path : "",
		method : 'GET',
		apiName:"",
		headers : {
			'Content-Type' : 'application/json'
		}
	}; 

	startTest();
	function startTest() {
		getPath(credential).then(function(path) {
			return getSessionId(path);
		}).then(function(sessionId) {
			callAPIsWithSessionId(sessionId);
		});
	}

	function getPath(credential) {
		var path = 'https://' 
							+ opts.hostname 
							+ opts.basePath 
							+ opts.rootPath 
							+ credential.Surname 
							+ '/' + credential.DepartureDate 
							+ '/' + credential.ShopNumber 
							+ '/' + credential.BookingRef+'/'+'2312312';;

		console.log("Path :" + path);
		var deferred = when.defer();
		deferred.resolve(path);
		return deferred.promise;
		

	}

	function getSessionId(loginApi) {
		var deferred = when.defer();
		options.path = loginApi;
		try {

			rest.getSessionId(options, function(statusCode, result) {
				console.log("onLogin :" + statusCode + " : " + JSON.stringify(result));

				switch(statusCode) {
					case 500:
						emailSender.sendEmail("InternalServerErrot(500) ", "Internal Error in service or webserver while trying to login");
						break;
					default:
						if (statusCode == 200 && typeof result != undefined) {
							var sessionId = result.SessionID;
							console.log("sessionId :" + sessionId);
							deferred.resolve(sessionId);
							index = 0;
						} else if (index < 3) {
							console.error("The login api is not ok for " + " , " + credential.DepartureDate + " , " + credential.ShopNumber + "," + credential.BookingRef);
							index++;
							credential = credentials[index];
							startTest();
						} else {
							//deferred.reject(err);
							emailSender.sendEmail("Temporary Unavailable ","TUI-ACS Server is Temprarily unavailable.");
						}

				}

			})
		} catch(err) {
			deferred.reject(err);
			console.error(err);
		}
		return deferred.promise;
	}

	function callAPIsWithSessionId(sessionId) {
		options.hostname = "f493b441381e61346638017481d58ca9ba9ba520.cloudapp.appcelerator.com";
		for (var i = 0; i < listOfApis.length; i++) {
			options.path = listOfApis[i].path + sessionId;
			console.log("API:" + options.path);
			
			rest.callAPI(options, function(statusCode, name) {
				console.log("onApi call :" + statusCode);

				switch(statusCode) {
					case 500:
						emailSender.sendEmail("InternalServerErrot(500) with ACS" + name + "API", "Internal Error in service or webserver");
						break;
						break;
					default:
						if (statusCode !== 200) {
							console.error("The api " + name + " is not working.");
							emailSender.sendEmail("Statuscode : "+statusCode, "The api " + name + " is not working.");
						}
				}

			})
		}
	}

}