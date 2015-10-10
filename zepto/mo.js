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
			var styleSheets = document.styleSheets;
			return styleSheets[styleSheets.length-1];
		}();
		return function(cssText) {
			var cssRules = cssText.split('\r\n');
			var len = !!styleSheet.cssRules ? styleSheet.cssRules.length : 0;
			for (var i=0; i < cssRules.length; ++i) {
				styleSheet.insertRule(cssRules[i],len++);
			};
			return len;
		};
	}();

	var getTransformVal = function(transform, key, index) {
		var index_list = [0];
		if (arguments.length > 2) {
			for (var i = 2; i < arguments.length; ++i) {
				index_list[i-2] = arguments[i];
			}
		}
		//没有值，直接中断
		if (!transform || transform == 'none') return;

		var reg = RegExp(key+'\\(([^\\)]+)\\)','ig');
		var key_value = transform.match(reg);
		var value_list = [];
		var ret = [];
		if (key_value && key_value.length) {
			key_value = key_value[0];
			value_list = key_value.replace(reg,'$1').split(',');
			for (var i = 0; i < index_list.length; ++i) {
				ret.push(value_list[index_list[i]]);
			}
		}
		if (ret.length == 1) {
			ret = ret[0];
		} else if (index) {
			ret = ret[index];
		}
		return ret;
	}

	// var s = getTransformVal('translate3d(0px, -569px, 0px)', 'translate3d', 1)
	// console.log(s)

	mo.prefix = prefix;
	mo.addStyle = addStyle;
	// console.log(prefix);
	window.mo = mo;

}(this, document);

