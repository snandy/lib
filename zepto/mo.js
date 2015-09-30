~function(window, document, undefined) {

	var mo = {};


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
	// console.log(prefix);
	window.mo = mo;
}(this, document);

