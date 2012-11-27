
/**
 *
 * DOM util
 * Version:  0.1
 * Author: snandy
 * Blog: http://snandy.cnblogs.com
 *
 * 1, 普通属性直接name
 * 2, IE6/7中特殊属性如class, for等转义
 * 3, IE6/7中style属性使用cssText
 * 4, support对象
 * 5, class 操作 addClass/removeClass/hasClass/toggleClass/replaceClass
 * 6, 
 * 
 */

define('dom',[],function() {

	var rupper = /([A-Z]|^ms)/g,
		rnumpx = /^-?\d+(?:px)?$/i,
		rnum = /^-?\d/,
		camelRe = /(-[a-z])/gi;
		
	var cssWidth = ['Left', 'Right'],
		cssHeight = ['Top', 'Botton'];
	
	var fixAttr = {
		tabindex: 'tabIndex',
		readonly: 'readOnly',
		'for': 'htmlFor',
		'class': 'className',
		maxlength: 'maxLength',
		cellspacing: 'cellSpacing',
		cellpadding: 'cellPadding',
		rowspan: 'rowSpan',
		colspan: 'colSpan',
		usemap: 'useMap',
		valign: 'vAlign',
		frameborder: 'frameBorder',
		contenteditable: 'contentEditable'
	},
	
	getComputedStyle, currentStyle, getRealStyle, strFloat, getCSS;
	
	// 特性检测
	var support = function() {
		
		var div, p, a;
		
		div = document.createElement( 'div' );
		div.className = 'a';
		div.innerHTML = '<p style="color:red;"><a href="#" style="opacity:.45;float:left;">a</a></p>';
		div.setAttribute('class', 't');
		
		p = div.getElementsByTagName('p')[0];
		a = p.getElementsByTagName('a')[0];
	
		var 
		// http://www.cnblogs.com/snandy/archive/2011/08/27/2155300.html
		setAttr = div.className === 't',
		// http://www.cnblogs.com/snandy/archive/2011/03/11/1980545.html
		cssText = /;/.test(p.style.cssText),
		
		opacity = /^0.45$/.test(a.style.opacity),
		getComputedStyle = !!(document.defaultView && document.defaultView.getComputedStyle);
		
		return {
			setAttr : setAttr,
			cssText : cssText,
			opacity : opacity,
			classList : !!div.classList,
			cssFloat : !!a.style.cssFloat,
			getComputedStyle : getComputedStyle
			
		};
		
	}();
	
	strFloat = support.cssFloat ? 'cssFloat' : 'styleFloat';
	
	var special = {
		style : {
			get: function( el ) {
				var txt = el.style.cssText;
				if(txt) {
					txt =  support.cssText ? txt : txt + ';';
					return txt.toLowerCase();
				}
			},
			set: function( el, value ) {
				return (el.style.cssText = '' + value);
			}
		}
	};
	
	function camelFn(m, a) {
		return a.charAt(1).toUpperCase();
	}
	
	if(document.defaultView && document.defaultView.getComputedStyle) {
		
		getRealStyle = function(el) {
			if( !(defaultView = el.ownerDocument.defaultView) ) {
				return null;
			}
			return defaultView.getComputedStyle( el, null );
		};
		
		getComputedStyle = function(el, name) {
			var ret, defaultView, computedStyle;
	
			if( !(defaultView = el.ownerDocument.defaultView) ) {
				return null;
			}
			
			if( (computedStyle = defaultView.getComputedStyle( el, null )) ) {
				ret = computedStyle.getPropertyValue( name );
				if(ret === '') {
					ret = el.style[name];
				}
			}
	
			return ret;
		};
	}
	
	if(document.documentElement.currentStyle) {
		
		getRealStyle = function(el) {
			return el.currentStyle;
		};
		
		currentStyle = function( el, name ) {
			var ret = el.currentStyle && el.currentStyle[ name ];
			return ret === "" ? "auto" : ret;
		};
	}
	
	getCSS = getComputedStyle || currentStyle;
	
	function setCSS(el, name, val) {
		name = name.replace(camelRe, camelFn);
		var cssNumber = {
			fontWeight : 1,
			zIndex : 1,
			zoom : 1
		};
		if(typeof val === 'number' && !cssNumber[name]) {
			val += 'px';
		}
		el.style[name] = val;
	}
	
	// class 模块
	var supportClassList = support.classList;
	var hasClass, addClass, removeClass, toggleClass, replaceClass;
	
	function check(el, cls) {
		if (el.nodeType !== 1 || typeof cls !== 'string') {
			return false;
		}
		return true;
	}
	if(supportClassList) {
		hasClass = function(el, cls) {
			if( check(el, cls) )
				return el.classList.contains(cls);
			else
				return false;
		};
		addClass = function(el, cls) {
			var i = 0, c;
			if( check(el, cls) ) {
				cls = cls.split(' ');
				while( c = cls[i++] ) {
					el.classList.add(c);
				}
			}
		};
		removeClass = function(el, cls) {
			var i = 0, c;
			if( check(el, cls) ) {
				cls = cls.split(' ');
				while( c = cls[i++] ) {
					el.classList.remove(c);
				}
			}
		};
		toggleClass = function(el, cls) {
			if( check(el, cls) ) {
				el.classList.toggle(cls);
			}
		};
		
	}
	else {
		hasClass = function(el, cls) {
			if( check(el, cls) )
				return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') != -1;
			else
				return false
		};
		addClass = function(el, cls) {
			if( check(el, cls) && !hasClass(el, cls) ) {
				el.className += (el.className ? " " : "") + cls;;
			}
		};
		removeClass = function(el, cls) {
			if( check(el, cls) ) {
				el.className = el.className.replace(RegExp("\\b" + cls + "\\b", "g"), "");
			}
		};
		toggleClass = function(el, cls) {
			hasClass(el, cls) ? removeClass(el, cls) : addClass(el, cls);
		};
	}
	replaceClass = function(el, oldCls, newCls) {
		removeClass(el, oldCls);
		addClass(el, newCls);
	}
	
	// 获取元素宽高
	function getWidthOrHeight(el, name, extra) {
		// Start with offset property
		var val = name === "width" ? el.offsetWidth : el.offsetHeight,
			which = name === "width" ? cssWidth : cssHeight;
		
		// display is none
		if(val === 0) {
			return 0;
		}
		
		// css3 box-sizing
		if(extra === 'border-box') {
			return val + 'px';
		}
		
		for(var i = 0, a; a = which[i++];) {
			val -= parseFloat( getCSS(el, "border" + a + "Width") ) || 0;
			val -= parseFloat( getCSS(el, "padding" + a) ) || 0;
		}
	
		if(extra === undefined) {
			return val + 'px';
		}
	
		if(extra === 'padding' || extra === "margin" || extra === "border") {
			for(var i = 0, a; a = which[i++];) {
				val += parseFloat( getCSS( el, extra + a + (extra==='border' ? 'Width' : '')) ) || 0;
			}
			return val + 'px';
		}
		
	}
	
	function getWorH(el, wh, extra) {
		switch(extra) {
			case 'border-box' :
			case 'margin' :
			case 'padding':
			case 'border' :
				return getWidthOrHeight(el, wh, extra);
			default :
				return getWidthOrHeight(el, wh);
		}	
	}
	
	// 获取文档宽高
	function getDocWH(name) {
		var doc = document;
		var val = Math.max(
			doc.documentElement["client" + name],
			doc.body["scroll" + name], doc.documentElement["scroll" + name],
			doc.body["offset" + name], doc.documentElement["offset" + name]
		);
		return val;
	}
	
	div = p = a = null;
	
	return {
		
		support : support,
		
		setAttr : function(el, name, val) {
			if(support.setAttr) {
				el.setAttribute(name, val);
				return val;
				
			}else {
				if(special[name]) {
					return special[name].set(el, val);
					
				}else {
					el.setAttribute(fixAttr[name] || name, val);
					return val;
				}
			}
			
		},
		
		getAttr : function(el, name) {
			if(support.setAttr) {
				return el.getAttribute(name);
				
			}else {
				if(special[name]) {
					return special[name].get(el);
					
				}else {
					return el.getAttribute(fixAttr[name] || name);
				}
			}
			
		},
		
		// 布尔类型的使用property，不要使用attribute，如checkbox/radio 的checked属性
		// 类似：autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected
		setProp : function(el, name, val) {
			name = fixAttr[name] || name;
			el[name] = val;
		},
		
		getProp : function(el, name) {
			name = fixAttr[name] || name;
			return  el[name];
		},
		
		setVal : function(el, val) {
			el.value = val;
		},
		
		getVal : function(el) {
			return el.value;
		},
		
		html : function(el, val) {
			this.setProp(el, 'innerHTML', val);
		},
		
		text : function(el, val) {
			this.setProp(el, el.innerText === undefined ? 'innerText' : 'textContent', val);
		},
		
		setCssText : function(el, css) {
			var sty = el.style, str = sty.cssText || '';
			if (!support.cssText) {
				str += ';';
			}
			sty.cssText = str + css;
		},
		
		setCSS : setCSS,
		
		getCSS : getCSS,
		
		setOpacity : function(el, val) {
			if(support.opacity) {
				el.style.opacity = (val === 1 ? '' : '' + val);
			} else {
				el.style.filter = 'alpha(opacity=' + val * 100 + ');';
				el.style.zoom = 1;
			}
		},
		
		getOpacity : function(el, val) {
			if(support.getComputedStyle) {
				style = window.getComputedStyle(el, null);
				opa = style.opacity;
				// http://www.cnblogs.com/snandy/archive/2011/07/27/2118441.html
				if(opa.length>1) {
					opa = opa.substr(0,3);
				}
				return parseFloat(opa);
			}else{
				style = el.currentStyle;
				filter = style.filter;
				return filter.indexOf('opacity=') >= 0 ? parseFloat(filter.match(/opacity=([^)]*)/)[1]) / 100 : 1;
			}
		},
		
		setFloat : function(el, val) {
			setCSS(el, strFloat, val);
		},
		
		getFloat : function(el) {
			return getCSS(el, strFloat);
		},
		
		hasClass : hasClass,
		
		addClass : addClass,
		
		removeClass : removeClass,
		
		toggleClass : toggleClass,
		
		replaceClass : replaceClass,
		
		setWidth : function(el, size) {
			if(!isNaN(size)) {
				el.style.width = val + 'px';
			}
		},
		
		getWidth : function(el, extra) {
			return getWorH(el, 'width', extra);
		},
		
		getInnerWidth : function(el) {
			return getWorH(el, 'width', 'border-box');
		},
		
		getOuterWidth : function(el) {
			return getWorH(el, 'width', 'margin');
		},
		
		setHeight : function(el, size) {
			if(!isNaN(size)) {
				el.style.height = val + 'px';
			}
		},
		
		getHeight : function(el, extra) {
			return getWorH(el, 'height', extra);
		},
		
		getInnerHeight : function(el) {
			return getWorH(el, 'height', 'border-box');
		},
		
		getOuterHeight : function(el) {
			return getWorH(el, 'height', 'margin');
		},
		
		setWH : function(el, w, h) {
			var style = el.style;
			if(!isNaN(w) && !isNaN(h)) {
				style.width = w + 'px';
				style.height = h + 'px';
			}
		},
		
		getWH : function(el, extra) {
			return {
				width : this.getWidth(el, extra),
				height : this.getHeight(el, extra)
			};
		},
		
		getStyle : function(el) {
			return el.style;
		},
		
		getRealStyle : getRealStyle,
		
		getDocWidth : function() {
			return getDocWH('Width');
		},
		
		getDocHeight : function() {
			return getDocWH('Height');
		},
		
		getWinWidth : function() {
			return window['innerWidth'] || document.documentElement.clientWidth;
		},
		
		getWinHeight : function() {
			return window['innerHeight'] || document.documentElement.clientHeight;
		},
		
		getViewSize : function() {
			return {
				width : this.getWinWidth(),
				height : this.getWinHeight()
			}
		},
		
		getFullSize : function() {
			return {
				width : this.getDocWidth(),
				height : this.getDocHeight()
			}
		},
		
		getOffset : function(el) {
			var box;
			try {
				box = el.getBoundingClientRect();
			} catch(e) {}
			
			var doc = el.ownerDocument,
				docElem = doc.documentElement;
			var body = doc.body,
				win = doc.defaultView || doc.parentWindow,
				clientTop  = docElem.clientTop  || body.clientTop  || 0,
				clientLeft = docElem.clientLeft || body.clientLeft || 0,
				scrollTop  = win.pageYOffset || docElem.scrollTop  || body.scrollTop,
				scrollLeft = win.pageXOffset || docElem.scrollLeft || body.scrollLeft,
				top  = box.top  + scrollTop  - clientTop,
				left = box.left + scrollLeft - clientLeft;
		
			return { top: top, left: left };
		},
		
		getRefOffset : function(el, refEl) {
			var doc = el.ownerDocument,
				docElem = doc.documentElement,
				body = doc.body,
				refEl = refEl || body,
				x = 0,
				y = 0;
			while(el && el !== refEl && el !== body && el !== docElem) {
				x += el.offsetLeft;
				y += el.offsetTop;
				el = el.offsetParent;
			}
			return {top: x, left: y};
			
		}
		
	};

});


/**
 * @module cache
 * @author zhoutao (2011-06-02)
 *
 * Cache Manager, 数据管理, 通过HTMLElement关联
 */
define('cache',[],function() {

	var idSeed = 0,
		cache = {},
		id = '_ guid _';

	// @private
	function guid(el) {
		return el[id] || (el[id] = ++idSeed);
	}

	return {
		set: function(el, key, val) {

			if (!el) {
				throw new Error('setting failed, invalid element');
			}

			var id = guid(el),
				c = cache[id] || (cache[id] = {});
			if (key) c[key] = val;

			return c;
		},

		get: function(el, key, create) {
			if (!el) {
				throw new Error('getting failed, invalid element');
			}

			var id = guid(el),
				elCache = cache[id] || (create && (cache[id] = {}));

			if (!elCache) return null;

			return key !== undefined ? elCache[key] || null : elCache;
		},

		has: function(el, key) {
			return this.get(el, key) !== null;
		},

		remove: function(el, key) {
			var id = typeof el === 'object' ? guid(el) : el,
				elCache = cache[id];

			if (!elCache) return false;

			if (key !== undefined) {
				delete elCache[key];
			} else {
				delete cache[id];
			}

			return true;
		}
	};
});


/**
 * Event manager
 * 2011-08-10 snandy
 * 
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code originated from jQuery library (1.6.2).
 * 
 * 
 * add event : 
 * 
 * E.bind(el, 'click', fn);
 * E.bind(el, 'click.name', fn);
 * E.bind(el, 'click', fn, data);
 * 
 * remove event : 
 * 
 * E.unbind(el, 'click', fn);
 * E.unbind(el, 'click.name');
 * E.unbind(el, 'click');
 * E.unbind(el);
 * 
 * trigger event
 * 
 * E.trigger(el, 'click');
 * E.trigger(el, 'click.name');
 * E.trigger(el, 'click!');
 * 
 */

define('event',['cache'], function(cache) {
	
	var triggered,
		doc = window.document,
		w3c = !!doc.addEventListener,
		expando = 'snandy' + (''+Math.random()).replace(/\D/g, ''),
		addListener = w3c ?
			function(el, type, fn) { el.addEventListener(type, fn, false); } :
			function(el, type, fn) { el.attachEvent('on' + type, fn); },
		removeListener = w3c ?
			function(el, type, fn) { el.removeEventListener(type, fn, false); } :
			function(el, type, fn) { el.detachEvent('on' + type, fn); };
	
	function returnFalse() {
		return false;
	}
	
	function returnTrue() {
		return true;
	}
	
	function now() {
		return (new Date).getTime();
	}
	
	function isEmptyObject(obj){
		for (var i in obj){
			return false;
		}
		return true;
	}
	
	function addEvent (elem, types, handler, data) {
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}
		
		if (handler === false) {
			handler = returnFalse;
		} else if (!handler) {
			return;
		}
		
		var elemData = cache.get(elem, undefined, true),
			events   = elemData.events,
			eventHandle = elemData.handle,
			types = types.split(' ');
	
		if (!events) {
			elemData.events = events = {};
		}
		
		if (!eventHandle) {
			elemData.handle = eventHandle = function (e) {
				return triggered !== e.type ? 
					evtHandle.apply( eventHandle.elem, arguments ) : 
					undefined;
			};
		}
		
		eventHandle.elem = elem;
		
		var type, i = 0, namespaces;
		
		while ( type = types[i++] ) {
			var handleObj = {handler : handler, data : data},
				handlers  = events[type];
		
			// Namespaced event handlers
			if ( type.indexOf('.') > -1 ) {
				namespaces = type.split('.');
				type = namespaces.shift();
				handleObj.namespace = namespaces.slice(0).join('.');
	
			} else {
				handleObj.namespace = '';
			}
			
			if (!handlers) {
				handlers = events[type] = [];
				addListener( elem, type, eventHandle );
			}
			
			handlers.push(handleObj);
		}
		
		elem = null;
	}
	
	function trigger(elem, event, data, onlyHandlers) {
		
		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			exclusive;
	
		if (type.indexOf('!') >= 0) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}
	
		if (type.indexOf('.') >= 0) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split('.');
			type = namespaces.shift();
			namespaces.sort();
		}
		
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}
		
		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === 'object' ?
			// jQuery.Event object
			event[expando] ? event :
			// Object literal
			new Event(type, event) :
			// Just the event type (string)
			new Event(type);
	
		event.type = type;
		event.exclusive = exclusive;
		event.namespace = namespaces.join('.');
		event.namespace_re = new RegExp('(^|\\.)' + namespaces.join('\\.(?:.*\\.)?') + '(\\.|$)');
		
		// triggerHandler() and global events don't bubble or run the default action
		if ( onlyHandlers || !elem ) {
			event.preventDefault();
			event.stopPropagation();
		}
	
		// Clean up the event in case it is being reused
		event.result = undefined;
		event.target = elem;
		
		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? [data] : [];
		data.unshift(event);
		
		var cur = elem,
			// IE doesn't like method names with a colon (#3533, #8272)
			ontype = type.indexOf(':') < 0 ? 'on' + type : '';
			
		// Fire event on the current element, then bubble up the DOM tree
		do {
			var handle = cache.get(cur, 'handle');
	
			event.currentTarget = cur;
			if (handle) {
				handle.apply(cur, data);
			}
	
			// Trigger an inline bound script
			if ( ontype && cur[ontype] && cur[ontype].apply(cur, data) === false ) {
				event.result = false;
				event.preventDefault();
			}
	
			// Bubble up to document, then to window
			cur = cur.parentNode || cur.ownerDocument || cur === event.target.ownerDocument && window;
		} while ( cur && !event.isPropagationStopped() );
		
		// If nobody prevented the default action, do it now
		if ( !event.isDefaultPrevented() ) {
			var old;
	
			if ( !(type === 'click' && elem.nodeName === 'A') ) {
	
				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction)() check here because IE6/7 fails that test.
				// IE<9 dies on focus to hidden element (#1486), may want to revisit a try/catch.
				try {
					if ( ontype && elem[type] ) {
						// Don't re-trigger an onFOO event when we call its FOO() method
						old = elem[ontype];
	
						if (old) {
							elem[ontype] = null;
						}
						triggered = type;
						elem[type]();
					}
				} catch (ieError) {}
	
				if (old) {
					elem[ontype] = old;
				}
				
				triggered = undefined;
			}
		}
		
		return event.result;
	}
	
	function evtHandle (event) {
		event = fixEvent( event || window.event );
		
		var handlers = ( (cache.get(this, 'events') || {} )[event.type] || []).slice(0),
			run_all = !event.exclusive && !event.namespace,
			args = Array.prototype.slice.call( arguments, 0 );
				
		event.currentTarget = this;
		
		for (var j = 0, l = handlers.length; j < l; j++) {
			var handleObj = handlers[j];
	
			// Triggered event must 1) be non-exclusive and have no namespace, or
			// 2) have namespace(s) a subset or equal to those in the bound event.
			if ( run_all || event.namespace_re.test(handleObj.namespace) ) {
				
				event.handler = handleObj.handler;
				event.data = handleObj.data;
				event.handleObj = handleObj;
				
				var ret = handleObj.handler.apply(this, args);
				
				if (ret !== undefined) {
					if (ret === false) {
						event.preventDefault();
						event.stopPropagation();
					}
				}
				
				if ( event.isImmediatePropagationStopped() ) {
					break;
				}
				
			}	
	
		}
		
		return event.result;
	}
	
	function removeEvent( elem, types, handler ) {
		// don't do events on text and comment nodes
		if (elem.nodeType === 3 || elem.nodeType === 8) {
			return;
		}
	
		if (handler === false) {
			handler = returnFalse;
		}
		
		var type, origType, i = 0, j,
			elemData = cache.get(elem),
			events = elemData && elemData.events;
	
		if (!elemData || !events) {
			return;
		}
		
		// Unbind all events for the element
		if (!types) {
			types = types || '';
			for (type in events) {
				removeEvent( elem, type );
			}
			return;
		}
		
		// Handle multiple events separated by a space
		// jQuery(...).unbind('mouseover mouseout', fn);
		types = types.split(' ');
		
		while ( (type = types[i++]) ) {
			origType = type;
			handleObj = null;
	
			eventType = events[type] || [];
	
			if (!eventType) {
				continue;
			}
			
			if (!handler) {
				for (j = 0; j < eventType.length; j++) {
					handleObj = eventType[j];
					removeEvent(elem, origType, handleObj.handler);
					eventType.splice(j--, 1);
				}
				continue;
			}
			
			for (j = 0; j < eventType.length; j++) {
				handleObj = eventType[j];
	
				if (handler === handleObj.handler) {
					// remove the given handler for the given type
					eventType.splice(j--, 1);
				}
			}
	
		}
		
		// remove generic event handler if no more handlers exist
		if (eventType.length === 0) {
			removeListener(elem, origType, elemData.handle);
			delete events[origType];
		}
		
		// Remove the expando if it's no longer used
		if ( isEmptyObject(events) ) {
			var handle = elemData.handle;
			if (handle) {
				handle.elem = null;
			}
	
			delete elemData.events;
			delete elemData.handle;
	
			if ( isEmptyObject(elemData) ) {
				cache.remove(elem, 'events');
			}
		}
		
		
	}
	Event = function(src, props) {
		// Allow instantiation without the 'new' keyword
		if (!this.preventDefault) {
			return new Event( src, props );
		}
	
		// Event object
		if (src && src.type) {
			this.originalEvent = src;
			this.type = src.type;
	
			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false ||
				src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse;
	
		// Event type
		} else {
			this.type = src;
		}
	
		// Put explicitly provided properties onto the event object
		if ( props ) {
			for (var i in props) {
				this[i] = props[i];
			}
		}
	
		// timeStamp is buggy for some events on Firefox(#3843)
		// So we won't rely on the native value
		this.timeStamp = now();
		
		// Mark it as fixed
		this[expando] = true;	
	
	};
	Event.prototype = {
		preventDefault: function() {
			this.isDefaultPrevented = returnTrue;
			var e = this.originalEvent;
			if (e.preventDefault) {
				e.preventDefault();
			}
			e.returnValue = false;
		},
		stopPropagation: function() {
			this.isPropagationStopped = returnTrue;
			var e = this.originalEvent;
			if (e.stopPropagation) {
				e.stopPropagation();
			}		
			e.cancelBubble = true;
		},
		stopImmediatePropagation: function() {
			this.isImmediatePropagationStopped = returnTrue;
			this.stopPropagation();
		},
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse
	};	
		
	function fixEvent( evt ) {
		if ( evt[expando] ) {
			return evt;
		}
		
		var props = 'altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which'.split(' '),
			len   = props.length;
		
		var originalEvent = evt;
		evt = new Event(originalEvent);
		
		for (var i = len, prop; i;) {
			prop = props[ --i ];
			evt[ prop ] = originalEvent[ prop ];
		}
		if (!evt.target) {
			evt.target = evt.srcElement || document;
		}
		if ( evt.target.nodeType === 3 ) {
			evt.target = evt.target.parentNode;
		}
		if ( !evt.relatedTarget && evt.fromElement ) {
			evt.relatedTarget = evt.fromElement === evt.target ? evt.toElement : evt.fromElement;
		}
		if ( evt.pageX == null && evt.clientX != null ) {
			var doc = document.documentElement, body = document.body;
			evt.pageX = evt.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
			evt.pageY = evt.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
		}
		if ( !evt.which && ((evt.charCode || evt.charCode === 0) ? evt.charCode : evt.keyCode) ) {
			evt.which = evt.charCode || evt.keyCode;
		}
		if ( !evt.metaKey && evt.ctrlKey ) {
			evt.metaKey = evt.ctrlKey;
		}
		if ( !evt.which && evt.button !== undefined ) {
			evt.which = (evt.button & 1 ? 1 : ( evt.button & 2 ? 3 : ( evt.button & 4 ? 2 : 0 ) ));
		}
		
		return evt;
	}
	
	
	function bind(el, type, handler, data) {
		if (!el) {
			return;
		}
		
		if (typeof type === 'object') {
			for (var key in type) {
				bind(el, key, type[key], data);
			}
			return;
		}
		
		addEvent(el, type, handler, data);
	}
	
	function unbind( el, type, handler ) {
		if (typeof type === 'object') {
			for (var key in type) {
				unbind(el, key, type[key]);
			}
	
		} else {
			removeEvent( el, type, handler );
		}
	}
	
	return {
		bind : bind,
		unbind : unbind,
		trigger : trigger
	};
	
});

define('main',['jquery', 'dom', 'event'], function($, dom, event){
	
	$(function() {
		alert(3)
	})
})
;