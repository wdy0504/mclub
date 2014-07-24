var redis = require('redis');

var redisIp = '127.0.0.1';
var redisPort = '6379';

var redisClient = redis.createClient(redisPort, redisIp);

redisClient.on("error", function(err){
	console.log("redisClient Error" + err);
	return false;
});

module.exports = redisClient;

