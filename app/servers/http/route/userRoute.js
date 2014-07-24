var UserDao = require('../../../dao').UserDao;
var User = require('../../../domain/user');
var redisClient = require('../../../models/redisClient');
var Constants = require('../../../util/constants');

module.exports = function(app, http) {
	/**
	 * 用户注册
	 */
	http.post('/user/register', function(req, res) {
		var phoneNumber = req.body.phoneNumber;
		var password = req.body.password;

		//验证电话号码，密码是否符合规则
		if (!/[0-9]{6,14}/.test(phoneNumber) || !/[a-zA-Z0-9]{6,16}/.test(password)) {
			res.send({
				error: 1
			});
			return;
		}

		//查找电话号码是否已经注册
		UserDao.getUserInfoByPhoneNumber(phoneNumber, function(err, ret) {
			if (err) {
				res.send({
					error: Constants.ERROR.SYS_ERROR
				});
				return;
			}
			if (ret.length !== 0) {
				res.send({
					error: 2
				});
				return;
			}
			//创建用户
			UserDao.createUser(phoneNumber, password, function(err, ret) {
				if (err) {
					res.send({
						error: Constants.ERROR.SYS_ERROR
					});
				} else {
					res.send({
						error: null
					});
					//保存userid到session
					req.session.userid = ret.id;

					setUserInfo(ret, function() {});
				}

			});
		});

	});

	/**
	 * 用户登录
	 */
	http.post('/user/login', function(req, res) {
		var phoneNumber = req.body.phoneNumber;
		var password = req.body.password;

		//验证电话号码，密码是否符合规则
		if (!/^[0-9]{6,20}$/.test(phoneNumber) || !/^[a-zA-Z0-9]{6,16}$/.test(password)) {
			res.send({
				error: 1
			});
			return;
		}

		//查找用户是否存在
		UserDao.getUserInfo(phoneNumber, password, function(err, ret) {
			if (err) {
				res.send({
					error: Constants.ERROR.SYS_ERROR
				});
				return;
			}
			if (ret.length === 0) {
				res.send({
					error: 2,
				});
			} else {
				res.send({
					error: null,
					user: ret[0]
				});
				//保存userid到session
				req.session.userid = ret[0].id;

				setUserInfo(ret[0], function() {});
			}
		});

	});

	http.all('/user/*', function(req, res, next) {
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
	 * 用户补充资料
	 */
	http.post('/user/addNewInfo', function(req, res) {
		var name = req.body.name;
		var headimgUrl = req.body.headimgUrl;
		var sex = req.body.sex;
		var school = req.body.school;
		var papersUrl = req.body.papersUrl;

		//验证是否符合规则
		if (!/^([\u4E00-\u9FA5]|[a-zA-Z]){2,6}$/.test(name) || !/^[a-zA-z]{1,12}:\/\/[^\s]{2,100}$/.test(headimgUrl) ||
			!/^([\u4E00-\u9FA5]|[a-zA-Z]){2,20}$/.test(school) || !/^[a-zA-z]{1,12}:\/\/[^\s]{2,100}$/.test(papersUrl) ||
			!/^(0|1|2){1}$/.test(sex)
		) {
			res.send({
				error: 1
			});
			return;
		}

		var user = new User({
			id: req.session.userid,
			headimgUrl: headimgUrl,
			sex: parseInt(sex),
			school: school,
			papersUrl: papersUrl,
			name : name
		});
		//判断用户名是否存在
		UserDao.getUserInfoByName(name, function(err, ret) {
			if (err) {
				res.send({
					error: Constants.ERROR.SYS_ERROR
				});
				return;
			}
			if (ret && ret[0].id !== req.session.userid) {
				res.send({
					error: 4,
				});
			} else {
				//更新用户资料
				UserDao.updateUserInfo(user, function(err, ret) {
					if (err) {
						res.send({
							error: Constants.ERROR.SYS_ERROR
						});
						return;
					}
					if (!ret) {
						res.send({
							error: Constants.ERROR.SYS_ERROR
						});
					} else {
						res.send({
							error: null
						});
					}
				});
			}
		});
	});

	/**
	 * 查找我的资料
	 */
	http.post('/user/getMyInfo', function(req, res) {
		//查找用户
		UserDao.getUserInfoById(req.session.userid, function(err, ret) {
			if (err) {
				res.send({
					error: Constants.ERROR.SYS_ERROR
				});
				return;
			}
			if (ret.length === 0) {
				res.send({
					error: 1,
				});
			} else {
				res.send({
					error: null,
					user: ret[0]
				});
			}
		});
	});
}


var setUserInfo = function(User) {
	redisClient.hsetnx(User.id, Constants.USER.COMMENT_AMOUNT, 0); //每天评论次数
	redisClient.hsetnx(User.id, Constants.USER.COMMENT_DAY, 0); //评论的day
	redisClient.hsetnx(User.id, Constants.USER.SHELF_AMOUNT, 0); //上架的商品个数
	redisClient.hsetnx(User.id, Constants.USER.SHELF_TIMES, 0); //每天上架的次数
	redisClient.hsetnx(User.id, Constants.USER.SHELF_DAY, 0); //每天上架的day
	redisClient.hsetnx(User.id, Constants.USER.REQUEST_AMOUNT, 0); //每秒请求的次数
	redisClient.hsetnx(User.id, Constants.USER.REQUEST_SECOND, 0); //请求的second
	redisClient.hsetnx(User.id, Constants.USER.UPDATEINFO_AMOUNT, 0); //每天更新用户资料的次数
	redisClient.hsetnx(User.id, Constants.USER.UPDATEINFO_DAY, 0); //更新用户资料的day
	redisClient.hsetnx(User.id, Constants.USER.PREVENT_USERLIST, "|"); //用户的屏蔽列表
	redisClient.hsetnx(User.id, Constants.USER.PREVENT_AMOUNT, 0); //每天屏蔽的次数
	redisClient.hsetnx(User.id, Constants.USER.PREVENT_DAY, 0); //屏蔽的day
	redisClient.hset(User.id, Constants.USER.NAME, User.name | "");
	redisClient.hset(User.id, Constants.USER.IS_VERITY, User.isVerity | 0);
}
