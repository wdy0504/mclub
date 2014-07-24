var User = require('../domain/user');

var Commodity = require('../domain/commodity');

var commodityDao = module.exports;

//var dbclient = pomelo.app.get('dbclient');
var dbclient = require('./mysql/mysql').init(null);

/**
 * 通过商品id获取商品信息
 * callback:
 * - err, 错误
 * - commodity, 商品信息
 * @parma {int} commodityId 商品id
 * @parma {Function} callback 回调函数
 */
commodityDao.getCommodityInfoById = function(commodityId, cb) {
	var sql = 'select * from Commodity where id = ? ';
	var args = [commodityId];

	dbclient.query(sql, args, function(err, res) {
		cb(err, res);
	});
};

/**
 * 通过地点获取商品信息
 * callback:
 * - err, 错误
 * - commodity, 商品信息
 * @parma {float} x 用户坐标x
 * @parma {float} y 用户坐标y
 * @parma {int} distance 范围
 * @parma {Function} callback 回调函数
 */
commodityDao.getCommodityInfoByLocation = function(x, y, distance, cb) {
	//var sql = 'select * from Commodity where locationX > ? and  locationX < ? and locationY > ? and  locationY < ? ORDER BY issueTime DESC';
	//var args = [x - distance, x + distance, y - distance, y + distance];
	var sql = 'select * from Commodity ORDER BY issueTime DESC';
	var args = [];
	dbclient.query(sql, args, function(err, res) {
		cb(err, res);
	});
};

/**
 * 创建商品
 * callback:
 * - err, 错误
 * - commodity, 商品信息
 * @parma {Object} commodity 商品对象
 * @parma {Function} callback 回调函数
 */
commodityDao.createCommodity = function(commodity, cb) {
	var fields = 'userId, name, soundUrl, description, paymentType, paymentDes, payValue, label, classifyType, effectTimeType, status, picturesUrl, locationX, locationY';
	var sql = 'insert into Commodity (' + fields + ') values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
	var args = [commodity.userId, commodity.name, commodity.soundUrl, commodity.description, commodity.paymentType,
		commodity.paymentDes, commodity.payValue, commodity.label, commodity.classifyType, commodity.effectTimeType,
		commodity.status, commodity.picturesUrl, commodity.locationX, commodity.locationY
	];
	dbclient.query(sql, args, function(err, res) {
		cb(err);
	});
};

/**
 * 通过用户id获取商品列表信息
 * callback:
 * - err, 错误
 * - commodity, 商品信息
 * @parma {String} userId 用户id
 * @parma {Function} callback 回调函数
 */
commodityDao.getCommodityInfoByUserId = function(userId, cb) {
	var sql = 'select * from Commodity where userId = ? ORDER BY issueTime DESC';
	var args = [userId];
	dbclient.query(sql, args, function(err, res) {
		cb(err, res);
	});
}

commodityDao.updateCommodityInfo = function() {};

commodityDao.deleteCommodity = function() {};