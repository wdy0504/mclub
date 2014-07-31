var UserDao = require('../../../dao').UserDao;
var User = require('../../../domain/user');
var redisClient = require('../../../models/redisClient');
var Constants = require('../../../util/constants');
var JPush = require('jpush-sdk');
var jpushClient = JPush.buildClient('you appKey', 'your masterSecret');

module.exports = function(app, http) {

	http.all('/chat/*', function(req, res, next) {
		//用户是否登录
		if (req.session.userid) {
			next();
		} else {
			res.send({
				error: Constants.ERROR.USER_NOT_LOGIN
			});
			return;
		}

	});

	/**
	 * 推送消息
	 */
	http.post('/chat/sendmsg', function(req, res) {

		var tagUserId = req.body.tagUserId;
		var content = req.body.contentxia

		//验证是否符合规则
		if (!/^([0-9]{1,12}$/.test(tagUserId)) {
			res.send({
				error: 1
			});
			return;
		}
		//验证是否在目标用户的屏蔽列表
		redisClient.hget(tagUserId, Constants.USER.PREVENT_USERLIST, function(err, redisData) {
			var tag = '|' + tagUserId + '|';
			if (redisData[Constants.USER.PREVENT_USERLIST].indexOf(tag)) {
				//该用户已经被屏蔽
				res.send({
					error: 2
				});
				return;
			}
			//推送消息
			jpushClient.push().setPlatform(JPush.All)
				.setAudience(JPush.tag(tagUserId))
				.setNotification(content)
				.send(function(err, res) {
					if (err) {
						if (err instanceof JPush.APIConnectionError) {
							console.log(err.message);
						} else if (err instanceof JPush.APIRequestError) {
							console.log(err.message);
						}
					} else {
						res.send({
							error: null
						});
						return;
					}
				});
		});
	});

}