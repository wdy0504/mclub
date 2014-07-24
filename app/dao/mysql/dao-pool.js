var _poolModule = require('generic-pool');
var mysql = require('mysql');

var createMysqlPool = function(app) {
	var mysqlConfig = {
		host : "127.0.0.1",
		port : "3306",
		database : "pro",
		user : "root",
		password : "123456"
	};

	return _poolModule.Pool({
		name: 'mysql',
		create: function(callback){
			var client = mysql.createConnection({
				host: mysqlConfig.host,
				user: mysqlConfig.user,
				password: mysqlConfig.password,
				database: mysqlConfig.database
			});
			callback(null, client);
		},
		destroy: function(client) {
			client.end();
		},
		max: 100,
		min: 5,
		idleTimeoutMillis : 30000,
		log : false
	});
};

exports.createMysqlPool = createMysqlPool;