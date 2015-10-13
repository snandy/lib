~function(window, document, undefined) {

var mo = {};

// 移动终端浏览器版本信息
var env = function() {
	var u = navigator.userAgent, app = navigator.appVersion;
	return {
		trident: u.indexOf('Trident') > -1, // IE内核
		presto: u.indexOf('Presto') > -1, // opera内核
		webkit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
		gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
		mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), // 是否为移动终端
		ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
		android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或者 UC 浏览器
		iphone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, // 是否为 iPhone 或者 QQHD 浏览器
		ipad: u.indexOf('iPad') > -1, // iPad
		webapp: u.indexOf('Safari') === -1, // WEB 应该程序，没有头部与底部
		weixin: u.indexOf('MicroMessenger') > -1, // 微信环境
		qq: (/qq\/([\d\.]+)*/i).test(u) > -1 // 手Q环境
	};
 }();

// 获取浏览器的样式前缀
var prefix = function() {
	var styles = window.getComputedStyle(document.documentElement, '');
	var core = (
		Array.prototype.slice
	    .call(styles)
	    .join('') 
	    .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
	)[1];
	return '-' + core + '-';
}();

// 动态添加 css 样式
var addStyle = function() {
	var styleSheet = function() {
		var head = document.head;
		var style = document.createElement('style');
		style.type = 'text/css';
		head.appendChild(style);
		return style.sheet;
	}();
	return function(cssText) {
		var cssRules = cssText.split('\r\n');
		var len = !!styleSheet.cssRules ? styleSheet.cssRules.length : 0;
		for (var i = 0; i < cssRules.length; ++i) {
			styleSheet.insertRule(cssRules[i], len++);
		}
		return len;
	};
}();

mo.env = env;
mo.prefix = prefix;
mo.addStyle = addStyle;
window.mo = mo;

}(this, document);

