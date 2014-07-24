var User = require('../domain/user');

var CommentDao = module.exports;

var dbclient = require('./mysql/mysql').init(null);

/**
 * 通过评论id获取评论信息
 * callback:
 * - err, 错误
 * - comment, 评论信息
 * @parma {int} commentId 评论id
 * @parma {Function} callback 回调函数
 */
CommentDao.getCommentById = function(commentId, cb) {
	var sql = 'select * from Comment where id = ? ';
	var args = [commentId];
	dbclient.query(sql, args, function(err, res) {
		cb(err, res);
	});
};

/**
 * 通过商品id获取评论信息
 * callback:
 * - err, 错误
 * - comment, 评论信息
 * @parma {int} commodityId 商品id
 * @parma {Function} callback 回调函数
 */
CommentDao.getCommentsByCommodityId = function(commodityId, cb) {
	var sql = 'select * from Comment  where commodityId = ? ORDER BY commentTime DESC';
	var args = [commodityId];
	dbclient.query(sql, args, function(err, res) {
		cb(err, res);
	});
};

/**
 * 添加评论信息
 * callback:
 * - err, 错误
 * @parma {Object} comment 评论对象
 * @parma {Function} callback 回调函数
 */
CommentDao.addComment = function(comment, cb) {
	var fields = 'commodityId, userId, content';
	var sql = 'insert into Comment (' + fields + ') values (?,?,?)';
	var args = [comment.commodityId, comment.userId, comment.content];
	dbclient.query(sql, args, function(err, res) {
		cb(err);
	});
};

/**
 * 通过用户id获取评论信息
 * callback:
 * - err, 错误
 * - comment, 评论信息
 * @parma {int} userId 用户id
 * @parma {Function} callback 回调函数
 */
CommentDao.getCommentsByUserId = function(userId, cb) {
	var sql = 'select * from Comment where userId = ? ORDER BY commentTime DESC';
	var args = [userId];
	dbclient.query(sql, args, function(err, res) {
		cb(err, res);
	});
}

CommentDao.deleteCommentById = function(commentId, cb) {};