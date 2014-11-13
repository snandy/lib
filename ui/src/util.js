~function(win, $) {

var px = 'px'
var doc = win.document
var body = doc.body
var docElem = doc.documentElement

if ($.browser) {
    var ver = /\d/.exec($.browser.version)[0]
    if ($.browser.msie && ver) {
        $['ie'+ ver] = true
    }
} else {
    throw new Error('Your jQuery does\"t has $.browser.')
}

/*
 * 函数节流，控制间隔时间
 */
$.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result
    var later = function() {
        var last = $.now() - timestamp
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last)
        } else {
            timeout = null
            if (!immediate) {
                result = func.apply(context, args)
                context = args = null
            }
        }
    }
    return function() {
        context = this
        args = arguments
        timestamp = $.now()
        var callNow = immediate && !timeout
        if (!timeout) timeout = setTimeout(later, wait)
        if (callNow) {
            result = func.apply(context, args)
            context = args = null
        }

        return result
    }
};
/*
 * 函数节流，控制执行频率
 */
$.throttle = function(func, wait, options) {
    var context, args, result
    var timeout = null
    var previous = 0
    if (!options) options = {}
    var later = function() {
        previous = options.leading === false ? 0 : $.now()
        timeout = null
        result = func.apply(context, args)
        context = args = null
    }
    return function() {
        var now = $.now()
        if (!previous && options.leading === false) {
            previous = now
        }
        var remaining = wait - (now - previous)
        context = this
        args = arguments
        if (remaining <= 0 || remaining > wait) {
            clearTimeout(timeout)
            timeout = null
            previous = now
            result = func.apply(context, args)
            context = args = null
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining)
        }
        return result
    }
};

$.viewSize = function() { 
    return {
        width: win['innerWidth'] || docElem.clientWidth,
        height: win['innerHeight'] || docElem.clientHeight
    }
};

$.fn.center = function(option, callback) {
    var settings = $.extend({}, option)
    var position = settings.position || 'fixed'
    var $win = $(win)

    function fixIE6($el) {
        $el[0].style.position = 'absolute'
        $win.scroll(function() {
            move($el)
        })
    }
    function move($that) {
        var that = $that[0]
        var size = $.viewSize()
        var x = (size.width)/2 - (that.clientWidth)/2
        var y = (size.height)/2 - (that.clientHeight)/2
        if ($.ie6) {
            var scrollTop = docElem.scrollTop || document.body.scrollTop
            y += scrollTop
        }
        $that.css({
            top: y + px,
            left: x + px
        })
    }
    function init($that, option) {
        $that.css({
            position: position
        }).show()
        // ie6 don't support position 'fixed'
        if (position === 'fixed' && $.ie6) {
            fixIE6($that)
        }
        move($that)
    }

    return this.each(function() {
        var $that = $(this)
        init($that, option)
        if (callback) callback($that)
    })
};

$.uiParse = function(action) {
    var arr = action.split('|').slice(1)
    var len = arr.length
    var res = [], exs
    var boo = /^(true|false)$/
    for (var i = 0; i < len; i++) {
        var item = arr[i]
        if (item == '&') {
            item = undefined
        } else if (exs = item.match(boo)) {
            item = exs[0] == 'true' ? true : false
        }
        res[i] = item
    }
    return res
};

}(window, window.jQuery);