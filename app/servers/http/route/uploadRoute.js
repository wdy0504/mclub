var redisClient = require('../../../models/redisClient');
var Constants = require('../../../util/constants');
var qiniu = require('qiniu');
var path = require('path');

qiniu.conf.ACCESS_KEY = '7nrkRuM3IMm7ghHfXisXHt4U-j1TcYB1cd6jTcvo';
qiniu.conf.SECRET_KEY = 'XFcHHyf44NdvPIL96lgTeybNa5QFNq3D-zdaN6jx';

module.exports = function(app, http) {

	http.all('/upload/*', function(req, res, next) {
		//用户是否登录
		console.log(req.session.userid);
		if (req.session.userid) {
			next();
		} else {
			res.send({
				error: Constants.ERROR.USER_NOT_LOGIN
			});
			return;
		}

	});

	http.post('/upload/getToken', function(req, res) {
		var BUCKET = 'mclubpicture1';
		var putPolicy = new qiniu.rs.PutPolicy(BUCKET);
		var uptoken = putPolicy.token();
		console.log(uptoken);
		res.send({
			error: null,
			uptoken: uptoken

		});
	/*	var extra = new qiniu.io.PutExtra();
		var localFile = path.join(__dirname, 'logo.png');
		var key = 'logo';
		var localFile = path.join(__dirname, 'indexRoute.js');
		qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
		    if (!err) {
		      // 上传成功， 处理返回值
		      console.log(ret.key, ret.hash);
		      // ret.key & ret.hash
		    } else {
		      // 上传失败， 处理返回代码
		      console.log(err)
		      // http://developer.qiniu.com/docs/v6/api/reference/codes.html
		    }
		 });*/
	});

};


