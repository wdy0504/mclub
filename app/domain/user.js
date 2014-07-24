/**
 * 初始化新的 'User' 通过 'opts' 对象.
 * Player inherits Character
 *
 * @param {Object} opts
 * @api public
 */


var User = function(opts) {
	this.id = opts.id;
	this.name = opts.name;
	this.phoneNumber = opts.phoneNumber;
	this.password = opts.password;
	this.headimgUrl = opts.headimgUrl;
	this.adress = opts.adress;
	this.sex = opts.sex;
	this.school = opts.school;
	this.papersUrl = opts.papersUrl;
	this.regiterTime = opts.regiterTime;
	this.isVerify = opts.isVerify;
	this.verifyTime = opts.verifyTime;
	this.ifForbid = opts.ifForbid;
	this.forbidTime = opts.forbidTime;
}

module.exports = User;

