/**
 * @author James Chow
 */

var csv = require('csv');
var fs = require('fs');
var when = require('when');
var _ = require('underscore');

var Loader = function (){
	
}

Loader.prototype.loadCSV = function(filename) {
	var deferred = when.defer();
	console.log('loadCSV '+__dirname +'/'+ filename);
	csv().from(__dirname +'/'+ filename).to.array(
		function(data){
			var json = csvToJson(data);
			//console.log("Laoder-json"+json);
			deferred.resolve(json);
		}
	)
	
	return deferred.promise;
}

Loader.prototype.loadJSON = function(filename){
	var deferred = when.defer();
	console.log('loadJSON '+__dirname +'/'+ filename);
	fs.readFile(__dirname +'/'+ filename,null, function(err,data){
		if (err){
			deferred.reject(err);
		}
		else 
		{
			//console.log("laodre_data"+JSON.parse(data));
			deferred.resolve(JSON.parse(data));
		}
	});
	
	return deferred.promise;
}

function csvToJson(data) {
	//take the header
	//console.log("csv data"+data);
	var header = data.shift();
	return _.map(data,function(row){
		return _.object(header,row)
	});
}

module.exports = Loader;