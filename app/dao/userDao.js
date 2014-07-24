var User = require('../domain/user');

//var dbclient = pomelo.app.get('dbclient');
var dbclient = require('./mysql/mysql').init(null);

var userDao = module.exports;

/**
 * 根据电话号码和密码获取用户信息
 * callback:
 * - err, 错误
 * - user, 用户资料
 * @param {String} phoneNumber 电话号码
 * @parma {String} password 密码
 * @parma {Function} callback 回调函数
 */
userDao.getUserInfo = function(phoneNumber, password, cb) {
	var sql = 'select * from User where phoneNumber = ? and password = ?';
	var args = [phoneNumber, password];

	dbclient.query(sql, args, function(err, res) {
		cb(err, res);
	});
};

/**
 * 根据电话号码获取用户信息
 * callback:
 * - err, 错误
 * - user, 用户资料
 * @param {String} phoneNumber 电话号码
 * @parma {Function} callback 回调函数
 */
userDao.getUserInfoByPhoneNumber = function(phoneNumber, cb) {
	var sql = 'select * from User where phoneNumber = ?';
	var args = [phoneNumber];

	dbclient.query(sql, args, function(err, res) {
		cb(err, res);
	});
};

/**
 * 根据用户名获取用户信息
 * callback:
 * - err, 错误
 * - user, 用户资料
 * @param {String} name 用户名
 * @parma {Function} callback 回调函数
 */
userDao.getUserInfoByName = function(name, cb) {
	var sql = 'select * from User where name = ?';
	var args = [name];

	dbclient.query(sql, args, function(err, res) {
		cb(err, res);
	});
};

/**
 * 根据用户id获取用户信息
 * callback:
 * - err, 错误
 * - user, 用户资料
 * @param {int} userId 用户名
 * @parma {Function} callback 回调函数
 */
userDao.getUserInfoById = function(userId, cb) {
	var sql = 'select * from User where id = ?';
	var args = [userId];

	dbclient.query(sql, args, function(err, res) {
		cb(err, res);
	});
};

/**
 * 创建用户信息
 * callback:
 * - err, 错误
 * - user, 用户资料
 * @param {String} phoneNumber 电话号码
 * @parma {String} password 密码
 * @parma {Function} callback 回调函数
 */
userDao.createUser = function(phoneNumber, password, cb) {
	var sql = 'insert into User (phoneNumber, password) values (?,?)';
	var args = [phoneNumber, password];
	dbclient.query(sql, args, function(err, res) {
		if (err !== null) {
			cb(err, null);
		} else {
			var user = new User({
				id: res.insertId,
				phoneNumber: phoneNumber,
				password: password
			});
			cb(null, user);
		}
	});
};

/**
 * 创建用户信息
 * callback:
 * - err, 错误
 * - flag, 更新是否成功
 * @parma {Object} user 用户对象
 * @parma {Function} callback 回调函数
 */
userDao.updateUserInfo = function(user, cb) {
	var sql = 'update User set name = ? , sex = ? , headimgUrl = ? , school = ? , papersUrl = ? where id = ?';
	args = [user.name, user.sex, user.headimgUrl, user.school, user.papersUrl, user.id];
	dbclient.query(sql, args, function(err, res) {
		if (err !== null) {
			cb(err, null)
		} else {
			if (!!res && res.affectedRows > 0) {
				cb(err, true);
			} else {
				cb(err, false);
			}

		}
	});
};

userDao.deleteUser = function() {};