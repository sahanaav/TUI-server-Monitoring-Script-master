
var http = require("http");
var https = require("https");
var emailSender = require('./emailSender');
exports.getSessionId = function(options , onResult){
	
	
		console.log("rest::getSessionId");
		var port = options.port == 443 ? https : http;
		try{
		
		var req = port.request(options, function(res) {
			var output = "";
			console.log(options.hostname + " : " + res.statusCode);
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				output += chunk;
			});
			res.on('end', function() {

				try {
					var obj = JSON.parse(output);
				} catch(err) {
					console.log("options.path :" + options.path)
					console.error(err.stack);
				}

				onResult(res.statusCode, obj);
			});

		});
		req.end(); 

		}catch(err){
			console.error(err);
			emailSender.sendEmail();
		}
	

};

exports.callAPI = function(options , onResult){
	
	console.log("rest::callAPI"+options.apiName);
	var port = options.port == 443 ? https : http;
	var req = port.request(options, function(res) {
		
		console.log(options.hostname+ " : " + res.statusCode);
		res.setEncoding('utf8');
		onResult(res.statusCode,req.path);
		
	});
	req.end(); 

}
