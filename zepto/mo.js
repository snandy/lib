~function(window, document, undefined) {

	var mo = {};

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

	mo.prefix = prefix;
	mo.addStyle = addStyle;
	// console.log(prefix);
	window.mo = mo;

function insertStyle() {
	
}

}(this, document);

