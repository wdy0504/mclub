
/**
 * 初始化新的 'Commodity' 通过 'opts' 对象.
 * Player inherits Character
 *
 * @param {Object} opts
 * @api public
 */

var Commodity = function(opts) {
  this.id = Number(opts.id);
  this.userId = opts.userId;
  this.name = opts.name;
  this.soundUrl = opts.soundUrl;
  this.description = opts.description;
  this.paymentType = opts.paymentType;
  this.paymentDes = opts.paymentDes;
  this.payValue = opts.payValue;
  this.label = opts.label;
  this.classifyType = opts.classifyType;
  this.issueTime = opts.issueTime;
  this.effectTimeType = opts.effectTimeType;
  this.status = opts.status;
  this.picturesUrl = opts.picturesUrl;
  this.underTime = opts.underTime;
  this.locationX = opts.locationX;
  this.locationY = opts.locationY;
};

/**
 * Expose 'Commodity' constructor.
 */
module.exports = Commodity;