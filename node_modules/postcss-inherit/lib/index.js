'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _inherit = require('./inherit');

var _inherit2 = _interopRequireDefault(_inherit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Public: PostCSS plugin allows you to inherit all the rules associated with a given selector.
 *
 * Returns a [PostCSS Plugin](http://api.postcss.org/postcss.html#.plugin) {Function}
 */
exports.default = _postcss2.default.plugin('postcss-inherit', function () {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (css) {
    return new _inherit2.default(css, opts);
  };
});
module.exports = exports['default'];