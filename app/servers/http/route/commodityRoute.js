var CommodityDao = require('../../../dao').CommodityDao;
var Commodity = require('../../../domain/commodity');
var redisClient = require('../../../models/redisClient');
var Constants = require('../../../util/constants');

module.exports = function(app, http) {

	http.all('/commodity/*', function(req, res, next) {
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
	 * 发布商品
	 */
	http.post('/commodity/addCommodity', function(req, res) {

		var userId = req.session.userid;
		var name = req.body.name;
		var status = req.body.status; //商品发布类型:出售、求购
		var classifyType = req.body.classifyType; //商品类型
		var label = req.body.label; //商品标签
		var commodityDescription = req.body.commodityDescription;
		var effectTimeType = req.body.effectTimeType; //有效时间类型
		var paymentType = req.body.paymentType; //支付类型
		var paymentDes = req.body.paymentDes; //支付描述
		var picturesUrl = req.body.picturesUrl; //图片url
		var soundUrl = req.body.soundUrl; //声音url
		var payValue = req.body.payValue; //支付金额
		var locationX = req.body.locationX; //用户的地点x
		var locationY = req.body.locationY; //用户的地点y


		//验证是否符合规则
		if (!/^([\u4E00-\u9FA5]|[0-9a-zA-Z]){1,10}$/.test(name) || !/^[0-9]{1,3}$/.test(classifyType) || !/^[a-zA-z]{1,12}:\/\/[^\s]{2,100}$/.test(picturesUrl) ||
			!/^([\u4E00-\u9FA5]|[0-9a-zA-Z]){1,10}$/.test(label) || !/^([\u4E00-\u9FA5]|[0-9a-zA-Z]){1,100}$/.test(commodityDescription) || !/^(1|2){1}$/.test(status) ||
			!/^(1|2|3){1}$/.test(effectTimeType) || !/^[0-9]{1,2}$/.test(paymentType) || !/^([\u4E00-\u9FA5]|[a-zA-Z]){1,100}$/.test(paymentDes) ||
			!/^[0-9]{1,6}$/.test(payValue) || !/^[1-9]\d{0,9}\.\d{1,9}|0\.\d{0,9}[1-9]$/.test(locationX) || !/^[1-9]\d{0,9}\.\d{1,9}|0\.\d{0,9}[1-9]$/.test(locationY) ||
			!/^[a-zA-z]{1,12}:\/\/[^\s]{2,100}$/.test(soundUrl)
		) {
			res.send({
				error: 1
			});
			return;
		}

		redisClient.hgetall(req.session.userid, function(err, retRedis) {
			if (err) {
				res.send({
					error: Constants.ERROR.SYS_ERROR
				});
				return;
			}
			//判断用户是否已经授权
			/*if (retRedis.isVerity === "0") {
				res.send({
					error: 2
				});
				return;
			}*/

			var date = new Date();
			var day = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
			//判断上架的商品是否超过限制
			if (parseInt(retRedis.shelfAmount) >= Constants.LIMIT.SHEKF_AMOUNT) {
				res.send({
					error: 3
				});
				return;
			}
			//判断上架操作次数是否已经超过限制
			if (parseInt(retRedis.shelfTimes) >= Constants.LIMIT.SHELF_TIMES && parseInt(retRedis.shelfDay) === day) {
				res.send({
					error: 4
				});
				return;
			}
			var commodity = new Commodity({
				userId: userId,
				name: name,
				status: parseInt(status),
				soundUrl: soundUrl,
				classifyType: parseInt(classifyType),
				label: label,
				description: commodityDescription,
				effectTimeType: parseInt(effectTimeType),
				paymentType: parseInt(paymentType),
				paymentDes: paymentDes,
				payValue: parseInt(payValue),
				picturesUrl: picturesUrl,
				locationX: parseFloat(locationX),
				locationY: parseFloat(locationY)
			});

			//创建新商品
			CommodityDao.createCommodity(commodity, function(err) {
				if (err) {
					res.send({
						error: Constants.ERROR.SYS_ERROR
					});
				} else {
					res.send({
						error: null
					});
					redisClient.hset(req.session.userid, "shelfAmount", parseInt(retRedis.shelfAmount) + 1);
					if (parseInt(retRedis.shelfDay) === day) {
						redisClient.hset(req.session.userid, "shelfTimes", parseInt(retRedis.shelfTimes) + 1);
					} else {
						redisClient.hset(req.session.userid, "shelfTimes", 1);
						redisClient.hset(req.session.userid, "shelfDay", day);
					}
				}
			});
		});
	});

	/**
	 * 获取商品
	 */
	http.post('/commodity/getCommodities', function(req, res) {

		var status = req.body.status; //商品发布类型:出售、求购
		var classifyType = req.body.classifyType; //商品类型
		var locationX = req.body.locationX; //用户的地点x
		var locationY = req.body.locationY; //用户的地点y

		//验证是否符合规则
		if (!/^[0-9]{1,3}$/.test(classifyType) || !/^(1|2){1}$/.test(status) ||
			!/^[1-9]\d{0,9}\.\d{1,9}|0\.\d{0,9}[1-9]$/.test(locationX) || !/^[1-9]\d{0,9}\.\d{1,9}|0\.\d{0,9}[1-9]$/.test(locationY)
		) {
			res.send({
				error: 1
			});
			return;
		}
		CommodityDao.getCommodityInfoByLocation(null, null, null, function(err, result) {
			if (err) {
				res.send({
					error: Constants.ERROR.SYS_ERROR
				});
			} else {
				res.send({
					error: null,
					commodities: result
				});
			}
		});
	});

	/**
	 * 获取自己的商品
	 */
	http.post('/commodity/getMyCommodities', function(req, res) {
		CommodityDao.getCommodityInfoByUserId(req.session.userid, function(err, result) {
			if (err) {
				res.send({
					error: Constants.ERROR.SYS_ERROR
				});
			} else {
				res.send({
					error: null,
					commodities: result
				});
			}
		});
	});

}