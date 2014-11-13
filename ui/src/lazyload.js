/*
 *  lazyload
 */
~function() {

$.fn.lazyload = function(option, callback) {

    var settings = $.extend({
        type: 'image',
        offsetParent: null,
        source: 'data-lazyload',
        defImage: 'http://misc.360buyimg.com/lib/img/e/blank.gif',
        defClass: 'loading-style2',
        threshold: 200 //阈值，控制显示位置，默认为200
    }, option)

    function bootstrap($that) {
        // some alias
        var source    = settings.source
        var defImage  = settings.defImage
        var defClass  = settings.defClass
        var threshold = settings.threshold
        var oParent   = settings.offsetParent

        // status
        var timer
        var win = window
        var doc = document

        function calcRect(el) {
            // var rect = el.getBoundingClientRect()
            // for IE9+/firefox/chrome/safari/opera
            // if (rect.widths) {
            //     return rect
            // }
            // In IE8 and below, the TextRectangle object 
            // returned by getBoundingClientRect() lacks height and width properties.            
            var left   = el.scrollLeft
            var top    = el.scrollTop
            var width  = el.offsetWidth
            var height = el.offsetHeight
            while (el.offsetParent) {
                left += el.offsetLeft
                top  += el.offsetTop
                el = el.offsetParent
            }
            return {
                left: left,
                top: top,
                width: width,
                height: height
            }
        }
        function calcClientRect() {
            var de   = doc.documentElement
            var dc   = doc.body
            var left = win.pageXOffset ? win.pageXOffset:(de.scrollLeft || dc.scrollLeft)
            var top  = win.pageYOffset ? win.pageYOffset:(de.scrollTop || dc.scrollTop)
            var width  = de.clientWidth
            var height = de.clientHeight
            return {
                left: left,
                top: top,
                width: width,
                height: height
            }
        }
        function intersect(rect1, rect2) {
            var lc1, lc2, tc1, tc2, w1, h1
            var t = threshold ? parseInt(threshold) : 0
            lc1 = rect1.left + rect1.width / 2
            lc2 = rect2.left + rect2.width / 2
            tc1 = rect1.top  + rect1.height / 2
            tc2 = rect2.top  + rect2.height / 2
            w1  = (rect1.width + rect2.width) / 2 
            h1  = (rect1.height + rect2.height) / 2
            return Math.abs(lc1 - lc2) < (w1+t) && Math.abs(tc1 - tc2) < (h1+t)
        }
        function imagesInit(flag, src, $el) {
            if (defImage && defClass) {
                $el.attr('src', defImage).addClass(defClass)
            }
            if (flag) {
                $el.attr('src', src).removeAttr(source)
                if (callback) callback(src, $el)
            }
        }
        function textareaInit(flag, src, $el) {
            if (flag) {
                var element=$('#'+src)
                element.html($el.val()).removeAttr(source)
                $el.remove()
                if (callback) callback(src, $el)
            }
        }
        function moduleInit(flag, src, $el) {
            if (flag) {
                $el.removeAttr(source)
                if (callback) callback(src, $el)
            }
        }
        function init() {
            var cRect = calcClientRect()
            var src   = $that.attr(source)
            if (!src) return
            var rect1 = !oParent ? cRect : calcRect($(oParent)[0])
            var rect2 = calcRect($that[0])
            var flag  = intersect(rect1, rect2)
            switch (settings.type) {
                case 'image':
                    imagesInit(flag, src, $that)
                    break
                case 'textarea':
                    textareaInit(flag, src, $that)
                    break
                case 'module':
                    moduleInit(flag, src, $that)
                    break
                default:
                    break
            }
        }
        function rander() {
            clearTimeout(timer)
            timer = setTimeout(function() {
                init()
            }, 20)
        }

        if (!oParent) {
            $(win).bind('scroll', function() {
                rander()
            }).bind('reset', function() {
                rander()
            })
        } else {
            $(oParent).bind('scroll', function() {
                rander()
            })
        }

        init()
    }

    return this.each(function() {
        var $that = $(this)
        bootstrap($that)
        if (callback) callback()
    })
}


$(function() {
    $('img[data-lazyload]').lazyload({
        defClass: 'err-product'
    })    
})

}();