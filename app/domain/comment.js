
/**
 * 初始化新的 'Comment' 通过 'opts' 对象.
 * Player inherits Character
 *
 * @param {Object} opts
 * @api public
 */

var Comment = function(opts) {
  this.id = Number(opts.id);
  this.userId = opts.userId;
  this.commodityId = opts.commodityId;
  this.commentTime = opts.commentTime;
  this.content = opts.content;
  this.isForbid = opts.isForbid;
};

/**
 * Expose 'Comment' constructor.
 */
module.exports = Comment;