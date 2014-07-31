var CommentDao = require('../../../dao').CommentDao;
var Comment = require('../../../domain/comment');
var redisClient = require('../../../models/redisClient');
var Constants = require('../../../util/constants');

module.exports = function(app, http) {

	http.all('/comment/*', function(req, res, next) {
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
	 * 发表评论
	 */
	http.post('/comment/addComment', function(req, res) {

		var userId = req.session.userid;
		var commodityId = req.body.commodityId;
		var content = req.body.content;
		//验证是否符合规则
		if (!/^([\u4E00-\u9FA5]|[0-9a-zA-Z]){1,200}$/.test(content) || !/^[0-9]{1,20}$/.test(commodityId)) {
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

			var date = new Date();
			var day = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));


			//判断每天评论的次数是否已经超过限制
			if (parseInt(retRedis.commentAmount) >= 300 && parseInt(retRedis.commentDay) === day) {
				res.send({
					error: 2
				});
				return;
			}
			//判断商品是否存在 或者 商品是否下架 或者 商品是否过期
			//CommentDao.getCommentsByCommodityId(commodityId, function(err, result) {});

			var comment = new Comment({
				userId: userId,
				commodityId: parseInt(commodityId),
				content: content
			});

			//添加评论
			CommentDao.addComment(comment, function(err) {
				if (err) {
					res.send({
						error: Constants.ERROR.SYS_ERROR
					});
				} else {
					res.send({
						error: null
					});
					//更新评论的次数
					if (parseInt(retRedis.commentDay) === day) {
						redisClient.hset(req.session.userid, "commentAmount", parseInt(retRedis.commentAmount) + 1);
					} else {
						redisClient.hset(req.session.userid, "commentAmount", 1);
						redisClient.hset(req.session.userid, "commentDay", day);
					}
				}
			});
		});
	});

	/**
	 * 获取商品的评论
	 */
	http.post('/comment/getComments', function(req, res) {

		var commodityId = req.body.commodityId;

		//验证是否符合规则
		if (!/^[0-9]{1,20}$/.test(commodityId)) {
			res.send({
				error: 1
			});
			return;
		}
		CommentDao.getCommentsByCommodityId(commodityId, function(err, result) {
			if (err) {
				res.send({
					error: Constants.ERROR.SYS_ERROR
				});
			} else {

				res.send({
					error: null,
					comments: result
				});
			}
		});
	});

	/**
	 * 获取自己的评论
	 */
	http.post('/comment/getMyComments', function(req, res) {
		CommentDao.getCommentsByUserId(req.session.userid, function(err, result) {
			if (err) {
				res.send({
					error: Constants.ERROR.SYS_ERROR
				});
			} else {
				res.send({
					error: null,
					comments: result
				});
			}
		});
	});

}