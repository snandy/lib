/*!
 * ui.js v0.1.0
 * JDC-FE POP team 2014-11-13 11:40:02
 */
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
/**
 * 模态弹框
 *
 */
$.dialog = function(option, callback) {
    var settings = $.extend({
        type: 'html',
        source: null,
        width: null,
        height: null,
        title: null,
        loadingCls: 'thickloading',
        fastClose: false,
        countdown: false
    }, option)

    // some alias
    var width  = settings.width
    var height = settings.height
    var loadingCls = settings.loadingCls

    var timer
    var $win  = $(window)
    var $body = $('body')

    var $maskDiv    = $('<div class="thickdiv"></div>')
    var $maskIframe = $('<iframe class="thickframe" marginwidth="0" marginheight="0" frameborder="0" scrolling="no"></iframe>')
    var $thickBox   = $('<div class="thickbox"><div class="thickwrap"><div class="thicktitle"><span></span></div><div class="thickcon"></div><a href="#none" class="thickclose">x</a></div></div>')
    var $thickWrap  = $thickBox.find('.thickwrap')
    var $thickCon   = $thickWrap.find('.thickcon')
    var $thickTit   = $thickWrap.find('.thicktitle')

    function init() {
        // 弹框标题
        $thickTit.find('span').text(settings.title)
        // 弹框内容
        $thickCon.css({
            width: width,
            height: height
        })
        $thickCon.addClass(loadingCls)

        // 遮罩、弹框添加到body
        $body.append($maskIframe)
        $body.append($maskDiv)
        $body.append($thickBox)

        // 位置居中
        setPos()
        // 渲染弹框内容
        renderContent()

        // 关闭按钮
        $thickBox.find('.thickclose').one('click', function() {
            close()
            $thickBox.trigger('close')
            return false
        })
        // 窗口resize和scroll时调整位置
        $win.bind('resize.dialog', setPos)
            // .bind('scroll.dialog', setPos)

        // 弹出后倒计时几秒自动关闭
        if (settings.countdown) initCountdown()
        // 点击任何非弹框区域快速关闭
        if (settings.fastClose) {
            $body.bind('click.dialog', function(e) {
                var tag = e.target
                if (tag.className == 'thickdiv') {
                    $body.unbind('click.dialog')
                    close()
                }
            })
        }
    }
    function initCountdown() {
        var count = settings.countdown
        $('<div class="thickcountdown"><span class="countdown">' + count + '</span>秒后自动关闭</div>').appendTo($thickWrap)
        timer = setInterval(function() {
            count--
            $thickBox.find('.countdown').html(count)
            if (count == 0) {
                count = settings.countdown
                close()
            }
        }, 3000)
    }
    function setPos() {
        $thickBox.center()
    }    
    function close() {
        clearInterval(timer)
        $maskIframe.add($maskDiv).remove()
        $thickBox.remove()
        $win.unbind('resize.dialog').unbind('scroll.dialog')
    }
    function renderContent() {
        switch (settings.type) {
        default:
        case 'text':
            $thickCon.text(settings.source)
            $thickCon.removeClass(loadingCls)
            if (callback) {
                callback()
            }
            break
        case 'html':
            $thickCon.html(settings.source)
            $thickCon.removeClass(loadingCls)
            if (callback) {
                callback()
            }
            break
        case 'ajax':
        case 'json':
            if (callback) {
                callback(settings.source, $thickCon, function() {
                    $thickCon.removeClass(loadingCls)
                })
            }
            break
        case 'iframe':
            $('<iframe src="' + settings.source + '" marginwidth="0" marginheight="0" frameborder="0" scrolling="no" style="width:' + width + 'px;height:' + height + 'px;border:0;"></iframe>').appendTo('.thickcon')
            $thickCon.removeClass(loadingCls)
            if (callback) {
                callback()
            }
            break
        }
    }

    init()
    $thickBox.data('close', close)
    return $thickBox
};


/**
 * 焦点图
 * $(x).focusPic({
 *   direction:     // @string  滚动方向 x左右，y上下
 *   speed:         // @number  滚动时动画速度
 *   auto:          // @boolean 是否自动滚动
 *   stay:          // @string  自动播放的时间间隔
 *   hideControl:   // @boolean 无法(不足以)滚动时是否显示控制按钮
 *   content:       // @string  内容区域单个元素的选择器
 *   contentWrap:   // @string  包裹内容区域的容器选择器
 *   nav:           // @string  导航区域每个元素的选择器
 *   navWrap:       // @string  导航的包裹元素选择器
 *   navActiveCls:  // @string  当前导航的样式
 *   navEvent:      // @string  当行的事件类型，mouseenter/click
 *   btnPrev:       // @string  按钮-上一帧 选择器
 *   btnNext:       // @string  按钮-下一帧 选择器
 * })
 *
 */

~function() {

$.fn.focusPic = function(option, callback) {
    option.isFade = true
    option.nav = '[data-ui=focus-nav]'
    option.content = '[data-ui=focus-content]'
    return this.each(function() {
        var $elem = $(this)
        var $bgImg = $elem.find('[data-ui=focus-bg]')
        $elem.tab(option,callback)
        if ($bgImg.length) {
            $elem.bind('change', function(e, i) {
                $bgImg.hide()
                $bgImg.eq(i).show()
            })            
        }
    })
}

/*
 * 自动初始化，配置参数按照使用频率先后排序，即最经常使用的在前，不经常使用的往后，使用默认参数替代
 * 
 * 格式：data-ui="u-focusPic|evtType|currCls|auto|stay|nav|content|defIndex"
 * 示例：data-ui="u-focusPic|click|curr|true|2000|.nav|.content|"
 *
 * 如果字段设为默认使用 &
 * 如：data-ui="u-focusPic|click|&|&|.nav|.content|"
 */
$(function() {
    $('[data-ui^="u-focusPic"]').each(function() {
        var $elem   = $(this)
        var arr = $.uiParse($elem.attr('data-ui'))
        // 切换事件默认是mouseenter
        var evtType = arr[0]
        // 当前样式class
        var currCls = arr[1]
        // 是否自动切换，默认是false
        var auto = arr[2]
        // 自动切换的时间间隔
        var stay = arr[3] && arr[3]-0
        // 页签头部选择器
        var nav  = arr[4]
        // 页签内容部分选择器
        var con  = arr[5]
        // 默认显示第几个页签
        var cur  = arr[6]
        // create
        $elem.focusPic({
            evtType: evtType,
            currCls: currCls,
            auto: auto,
            stay: stay,
            nav: nav,
            content: con,
            defIndex: cur
        })
    })
})


}();

/**
 *  放在项目共用js里，处理所有hover效果，鼠标置上时添加一个class，离开后移除class。
 *  设计为自执行是考虑项目中很多页面都有类似的功能，此时还有部分页面仅有这个hover效果功能，没有其它任何的js交互。
 *  此时如果为该页面写一个单独的js就不值当了，为此把配置从js文件放权到HTML文件里，通过data-ui属性去管理。
 *
 *  示例
 *  1. hover直接应用在li上，hover的class默认为"hover"
 *      <li data-ui="u-hover">
 *
 *  2. 应用在li上，hover的class改为curr
 *      <li data-ui="u-hover.curr"> 
 *
 *  3. 通过ul代理应用在li上，class为默认"hover"
 *      <ul data-ui="hover|li">
 *
 *  4. 通过ul代理应用在li上，class改为"curr"
 *      <ul data-ui="u-hover.curr|li">
 */
$(function() {
    $('[data-ui^="u-hover"]').each(function() {
        var $elem = $(this)
        var arr = $.uiParse($elem.attr('data-ui'))

        // 是否更换默认hover的class
        var isDelegate = !!arr[0]
        // 代理元素的选择器
        var delegateSelector = arr[0]
        // hover时的class
        var curCls = arr[1] || 'hover'

        // 给子元素添加hover事件 
        if (isDelegate) {
            $elem.delegate(delegateSelector, 'hover', function() {
                $(this).toggleClass(curCls)
            })            
        } else { // 自身添加hover事件 
            $elem.hover(function() {
                $elem.toggleClass(curCls)
            })
        }
    })
});

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
/*
    $.login
*/

~function() {

var domain = location.hostname
if (window.pageConfig && pageConfig.FN_getDomain) {
    domain = pageConfig.FN_getDomain()    
}


/*
    jdModelCallCenter#20110126
*/
window.jdModelCallCenter = {
    settings: {
        clstag1: 0,
        clstag2: 0
    },
    tbClose: function() {
        var $dialog = $('.thickbox')
        if ($dialog.length != 0) {
            var fn = $dialog.data('close')
            fn()
        }
    },
    login: function() {
        this.tbClose()
        var settings = this.settings
        var userAgent = navigator.userAgent.toLowerCase()
        var flag = (userAgent.match(/ucweb/i) == 'ucweb' || userAgent.match(/rv:1.2.3.4/i) == 'rv:1.2.3.4')
        if (flag) {
            location.href = 'https://passport.'+ domain +'/new/login.aspx?ReturnUrl=' + escape(location.href)
            return
        }
        setTimeout(function() {
            $.dialog({
                type: 'iframe',
                title: '您尚未登录',
                source: 'http://passport.jd.com/uc/popupLogin2013?clstag1=' + settings.clstag1 + '&clstag2=' + settings.clstag2 + '&r=' + Math.random(),
                width: 390,
                height: 450
            })
        }, 20)
    },
    regist: function() {
        this.tbClose()
        var settings = this.settings
        setTimeout(function() {
            $.dialog({
                type: 'iframe',
                title: '您尚未登录',
                source: 'http://reg.jd.com/reg/popupPerson?clstag1=' + settings.clstag1 + '&clstag2=' + settings.clstag2 + '&r=' + Math.random(),
                width: 390,
                height: 450
            })
        }, 20)
    },
    init: function() {
        var self = this
        var url = location.protocol + '//passport.'+ domain +'/new/helloService.ashx?m=ls&sso=0'
        $.ajax({
            url: url,
            dataType:'jsonp',
            success: function(json) {
                self.tbClose()
                if (json && json.info) {
                    $('#loginbar').html(json.info)
                }
                self.settings.fn()
            }
        })
    }
}

/*
 * 判断是否登录函数，异步方式
 */
$.isLogin = function(is, not) {
   $.getJSON('http://passport.jd.com/loginservice.aspx?method=Login&callback=?', function(r) {
        var identity = r.Identity
        var isAuthenticated = identity.IsAuthenticated
        if ( isAuthenticated ) {
            is(r)
        } else {
            not(r)
        }
    })
}

/*
 * 会员登录函数
 * @param {Object} 
 */
$.login = function(option) {
    option = $.extend({}, option)
    var callback = option.callback
    var fn = callback || function() {
        location.reload(true)
    }
    jdModelCallCenter.settings = {
        clstag1 : 'login|keycount|5|5',
        clstag2 : 'login|keycount|5|6',        
        fn: fn
    }
    $.isLogin(function() {
        try {
            console.log('已经登录')
        } catch(e) {
        }
    }, function() {
        jdModelCallCenter.login()
    })
}

/*
 * $.login
 */
// $.login = function(options) {
//     options = $.extend({
//         loginService: 'http://passport.'+ domain +'/loginservice.aspx?callback=?',
//         loginMethod: 'Login',
//         loginUrl: 'https://passport.'+ domain +'/new/login.aspx',
//         returnUrl: location.href,
//         automatic: true,
//         complete: null,
//         modal: false
//     }, options)
//     $.getJSON(options.loginService, {
//         method: options.loginMethod
//     }, function(r) {
//         if (r != null) {
//             if (options.complete != null) {
//                 options.complete(r.Identity)
//             }
//             if (!r.Identity.IsAuthenticated && options.automatic && options.loginUrl != '') {
//                 if (options.modal) {
//                     jdModelCallCenter.login()
//                 } else {
//                     location.href = options.loginUrl + '?ReturnUrl=' + escape(options.returnUrl)
//                 }
//             }
//         }
//     })
// }

/*
    autoLocation#20110411
*/
// $.extend(jdModelCallCenter, {
//     autoLocation: function(url) {
//         $.login({
//             modal: true,
//             complete: function(r) {
//                 if (r != null && r.IsAuthenticated != null && r.IsAuthenticated) {
//                     window.location = url
//                 }
//             }
//         })
//     }
// })


}();
/*
 *  marquee
 */
~function() {

$.fn.marquee = function(option, callback) {
    var defaults = {
        direction: 'up',
        speed: 10,
        auto: false,
        width: null,
        height: null,
        step: 1,
        control: false,
        btnPrev: '[data-ui="btn-prev"]',
        btnNext: '[data-ui="btn-next"]',
        btnStop: '[data-ui="btn-stop"]',
        btnContinue: '[data-ui="btn-continue"]',
        wrapstyle: '',
        stay: 5000,
        delay: 20,
        dom: ['ul', 'li'],
        tag: false,
        convert: false,
        btn: null,
        disabledCls: 'disabled',
        pos: {
            object: null,
            clone: null
        }
    }

    // override
    var settings = $.extend(defaults, option)

    function bootstrap($that) {
        // some alias
        var dir     = settings.direction
        var sWid    = settings.width
        var sHei    = settings.height
        var sDom    = settings.dom
        var auto    = settings.auto
        var step    = settings.step
        var posObj  = settings.pos
        var btnPrev = settings.btnPrev
        var btnNext = settings.btnNext
        var btnStop = settings.btnStop
        var btnContinue = settings.btnContinue
        var disabledCls = settings.disabledCls

        // DOM
        var $cloneWrap   = null
        var $contentWrap = $that.find(sDom[0])
        var $content     = $that.find(sDom[1])
        var $btnPrev     = $that.find(btnPrev)
        var $btnNext     = $that.find(btnNext)
        var $btnStop     = $that.find(btnStop)
        var $continue    = $that.find(btnContinue)

        // some timer
        var mainTimer, subTimer

        var height = $contentWrap.outerHeight()
        var contentWidth  = $content.outerWidth()
        var contentHeight = $content.outerHeight()

        if (dir == 'up' || dir == 'down') {
            $contentWrap.css({
                width: sWid + 'px',
                overflow: 'hidden'
            })
            var frameSize = step * contentHeight
        }
        if (dir == 'left' || dir == 'right') {
            var width = $content.length * contentWidth
            $contentWrap.css({
                width: width + 'px',
                overflow: 'hidden'
            })
            var frameSize = step * contentWidth
        }
        function init() {
            var sty = 'position:relative;overflow:hidden;z-index:1;width:' + sWid + 'px;height:' + sHei + 'px;' + settings.wrapstyle
            var wrap = '<div style="' + sty + '"></div>'
            $contentWrap.css({
                position: 'absolute',
                left: 0,
                top: 0
            }).wrap(wrap)
            posObj.object = 0
            $cloneWrap = $contentWrap.clone()
            $contentWrap.after($cloneWrap)
            switch (dir) {
                case 'up':
                    $contentWrap.css({
                        marginLeft: 0,
                        marginTop: 0
                    })
                    $cloneWrap.css({
                        marginLeft: 0,
                        marginTop: height + 'px'
                    })
                    posObj.clone = height
                    break
                case 'down':
                    $contentWrap.css({
                        marginLeft: 0,
                        marginTop: 0
                    })
                    $cloneWrap.css({
                        marginLeft: 0,
                        marginTop: -height + 'px'
                    })
                    posObj.clone = -height
                    break
                case 'left':
                    $contentWrap.css({
                        marginTop: 0,
                        marginLeft: 0
                    })
                    $cloneWrap.css({
                        marginTop: 0,
                        marginLeft: width + 'px'
                    })
                    posObj.clone = width;
                    break;
                case 'right':
                    $contentWrap.css({
                        marginTop: 0,
                        marginLeft: 0
                    })
                    $cloneWrap.css({
                        marginTop: 0,
                        marginLeft: -width + 'px'
                    })
                    posObj.clone = -width
                    break
            }
            if (auto) {
                initMainTimer()
                $contentWrap.hover(function() {
                    clear(mainTimer)
                }, function() {
                    initMainTimer()
                })
                $cloneWrap.hover(function() {
                    clear(mainTimer)
                }, function() {
                    initMainTimer()
                })
            }
            if (settings.control) initControl()
        }
        function initMainTimer(delay) {
            clear(mainTimer)
            settings.stay = delay ? delay : settings.stay
            mainTimer = setInterval(function() {
                initSubTimer()
            }, settings.stay)
        }
        function initSubTimer() {
            clear(subTimer)
            subTimer = setInterval(function() {
                rollAlong()
            }, settings.delay)
        }
        function clear(timer) {
            if (timer) {
                clearInterval(timer)
            }
        }
        function _parseInt(str) {
            return parseInt(str, 10)
        }
        function disControl(boo) {
            if (boo) {
                $btnPrev.unbind('click')
                $btnNext.unbind('click')
                $btnStop.unbind('click')
                $continue.unbind('click')
            } else {
                initControl()
            }
        }
        function initControl() {
            $btnPrev.click(function() {
                $btnPrev.addClass(disabledCls)
                disControl(true)
                clear(mainTimer)
                settings.convert = true
                settings.btn = 'front'
                initSubTimer()
                if (!auto) {
                    settings.tag = true
                }
                convert()
            })
            $btnNext.click(function() {
                $btnNext.addClass(disabledCls)
                disControl(true)
                clear(mainTimer)
                settings.convert = true
                settings.btn = 'back'
                initSubTimer()
                if (!auto) {
                    settings.tag = true
                }
                convert()
            })
            $btnStop.click(function() {
                clear(mainTimer)
            })
            $continue.click(function() {
                initMainTimer()
            })
        }
        function convert() {
            if (settings.tag && settings.convert) {
                settings.convert = false
                if (settings.btn == 'front') {
                    if (dir == 'down') {
                        dir = 'up'
                    }
                    if (dir == 'right') {
                        dir = 'left'
                    }
                }
                if (settings.btn == 'back') {
                    if (dir == 'up') {
                        dir = 'down'
                    }
                    if (dir == 'left') {
                        dir = 'right'
                    }
                }
                if (auto) {
                    initMainTimer()
                } else {
                    initMainTimer(4 * settings.delay)
                }
            }
        }
        function setPos(y1, y2, x) {
            if (x) {
                clear(subTimer)
                posObj.object  = y1
                posObj.clone   = y2
                settings.tag = true
            } else {
                settings.tag = false
            }
            if (settings.tag) {
                if (settings.convert) {
                    convert()
                } else {
                    if (!auto) {
                        clear(mainTimer)
                    }
                }
            }
            if (dir == 'up' || dir == 'down') {
                $contentWrap.css({
                    marginTop: y1 + 'px'
                });
                $cloneWrap.css({
                    marginTop: y2 + 'px'
                })
            }
            if (dir == 'left' || dir == 'right') {
                $contentWrap.css({
                    marginLeft: y1 + 'px'
                });
                $cloneWrap.css({
                    marginLeft: y2 + 'px'
                })
            }
        }
        function rollAlong() {
            var ul       = $contentWrap[0]
            var cl       = $cloneWrap[0]
            var ulSty    = ul.style
            var clSty    = cl.style
            var ulMargin = (dir == 'up' || dir == 'down') ? _parseInt(ulSty.marginTop) : _parseInt(ulSty.marginLeft)
            var clMargin = (dir == 'up' || dir == 'down') ? _parseInt(clSty.marginTop) : _parseInt(clSty.marginLeft)
            var yAdd     = Math.max(Math.abs(ulMargin - posObj.object), Math.abs(clMargin - posObj.clone))
            var yCeil    = Math.ceil((frameSize - yAdd) / settings.speed)
            switch (dir) {
                case 'up':
                    if (yAdd == frameSize) {
                        setPos(ulMargin, clMargin, true)
                        $btnPrev.removeClass(disabledCls)
                        disControl(false)
                    } else {
                        if (ulMargin <= -height) {
                            ulMargin = clMargin + height
                            posObj.object = ulMargin
                        }
                        if (clMargin <= -height) {
                            clMargin = ulMargin + height
                            posObj.clone = clMargin
                        }
                        setPos((ulMargin - yCeil), (clMargin - yCeil))
                    }
                    break
                case 'down':
                    if (yAdd == frameSize) {
                        setPos(ulMargin, clMargin, true)
                        $btnNext.removeClass(disabledCls)
                        disControl(false)
                    } else {
                        if (ulMargin >= height) {
                            ulMargin = clMargin - height
                            posObj.object = ulMargin
                        }
                        if (clMargin >= height) {
                            clMargin = ulMargin - height
                            posObj.clone = clMargin
                        }
                        setPos((ulMargin + yCeil), (clMargin + yCeil))
                    }
                    break
                case 'left':
                    if (yAdd == frameSize) {
                        setPos(ulMargin, clMargin, true)
                        $btnPrev.removeClass(disabledCls)
                        disControl(false)
                    } else {
                        if (ulMargin <= -width) {
                            ulMargin = clMargin + width
                            posObj.object = ulMargin
                        }
                        if (clMargin <= -width) {
                            clMargin = ulMargin + width
                            posObj.clone = clMargin
                        }
                        setPos((ulMargin - yCeil), (clMargin - yCeil))
                    }
                    break
                case 'right':
                    if (yAdd == frameSize) {
                        setPos(ulMargin, clMargin, true)
                        $btnNext.removeClass(disabledCls)
                        disControl(false)
                    } else {
                        if (ulMargin >= width) {
                            ulMargin = clMargin - width
                            posObj.object = ulMargin
                        }
                        if (clMargin >= width) {
                            clMargin = ulMargin - width
                            posObj.clone = clMargin
                        }
                        setPos((ulMargin + yCeil), (clMargin + yCeil))
                    }
                    break
            }
        }
        if (dir == 'up' || dir == 'down') {
            if (height >= sHei && height >= step) {
                init()
            }
        }
        if (dir == 'left' || dir == 'right') {
            if (width >= sWid && width >= step) {
                init()
            }
        }
    }

    return this.each(function() {
        var $that = $(this)
        bootstrap($that)
        if (callback) callback($that)
    })
}

}();
/*
 * 导航/菜单高亮组件
 * option
 *   nav        // @string 导航/菜单选择器
 *   content    // @string 内容模块选择器
 *   diffTop    // @number 距离顶部的误差值
 *   diffBottom // @number 距离底部的误差值
 *   currCls    // @string 高亮的class
 *   evtType    // @string 导航的事件类型
 */
~function() {

$.fn.navLight = function(option, callback) {
    var settings = $.extend({
        nav: '[data-ui="light-nav"]',
        content: '[data-ui="light-content"]',
        diffTop: 200,
        diffBottom: 500,
        currCls: 'curr',
        evtType: ''
    }, option)

    function bootstrap($that) {
        // alias
        var nav        = settings.nav
        var content    = settings.content
        var diffTop    = settings.diffTop
        var diffBottom = settings.diffBottom
        var currCls    = settings.currCls
        var evtType    = settings.evtType

        // dom
        var $win = $(window)
        var $doc = $(document)        
        var $nav = $that.find(nav)
        var $content = $that.find(content)

        // nav与content长度不一致时直接返回
        if ($nav.length != $content.length) {
            throw new Error('nav\'s length and content length must be equal.')
        }

        // 记录每个分类的位置
        var contentPos = $content.map(function(i, el) {
            var $cont  = $(el)
            var top    = $cont.offset().top
            var height = $cont.height()
            return {
                top: top-diffTop,
                bottom: top+diffBottom,
                jq: $cont
            }
        })

        // scroll handler
        var handler  = $.throttle(function(e) {
            var dTop = $doc.scrollTop()
            highLight(dTop)
        }, 50)
        
        function highLight(docTop) {
            contentPos.each(function(i, pos) {
                var $curNav = $nav.eq(i)
                if (pos.top < docTop && pos.bottom > docTop) {
                    $nav.removeClass(currCls)
                    $curNav.addClass(currCls)
                    // $nav.trigger('highLight', [$nav,])
                }
            })
        }

        // nav ment event
        if (evtType) {
            $that.delegate(nav, evtType, function() {
                var $el = $(this)
                var idx = $nav.index($el)
                var $cont = $content.eq(idx)
                var top = $cont.offset().top
                $('html,body').animate({
                    scrollTop: top-30 + 'px'
                })
            })
        }

        $win.scroll(handler)
    }

    // 实例化每个对象
    return this.each(function() {
        var $elem = $(this)
        bootstrap($elem)
        if ($.isFunction(callback)) callback($elem)
    })
}

/*
 * 初始化，配置参数按照使用频率先后排序，即最经常使用的在前，不经常使用的往后，使用默认参数替代
 * 
 * 格式：data-ui="u-navlight|currCls|diffTop|diffBottom|evtType
 * 示例：
 *   data-ui="u-navlight"
 *   data-ui="u-navlight|curr"   
 *
 */
$(function() {
    $('[data-ui^="u-navlight"]').each(function() {
        var $elem = $(this)
        var arr = $.uiParse($elem.attr('data-ui'))
        var currCls = arr[0]
        var diffTop = arr[1]
        var diffBottom = arr[2]
        var evtType = arr[3]

        $elem.navLight({
            currCls: currCls,
            diffTop: diffTop,
            diffBottom: diffBottom,
            evtType: evtType
        })
    })
});



}();
/*
 * 项目中使用select 各浏览器，各系统都不统一，为了保证统一展示，现把此效果写在pop共用js
 * 组件中，主要分三部分，一个父级，一个select 和一个显示标签，使用中如果要修改select显示值
 * 只需修改 显示标签值就可以。
 * 示例：
 * 1、在select 父级增加属性: data-ui="u-select|select"
 * <div data-ui="u-select|select">
 * 2、给显示的标签增加属性：data-ui="select-h"
 * <em data-ui="select-h">test</em>
 */
$(function() {
    $('[data-ui^="u-select"]').each(function() {
        var $elem = $(this);
        var arr = $.uiParse($elem.attr('data-ui'));
        // 选中select
        var delegateSelector = arr[0];
        // 获取select 
        var option = $elem.find(delegateSelector);
        var h = $elem.find('[data-ui="select-h"]');
        // 给sleect 增加change 事件
        $elem.delegate(delegateSelector,'change',function(){
            h.html(option.children('option:selected').text())
        })
        // 通过鼠标放上去改变select 值  程序只需修改 显示em 值
        $elem.delegate(delegateSelector,'mouseenter',function(){
            $elem.find(option).val(h.html())
        })
    })
})
/**
 * 滚动轮播插件
 * $(x).slide({
 *   visible:       // @number  可显示的图片数量
 *   direction:     // @string  滚动方向 x左右，y上下
 *   speed:         // @number  滚动时动画速度
 *   auto:          // @boolean 是否自动滚动
 *   stay:          // @string  自动播放的时间间隔
 *   hideControl:   // @boolean 无法(不足以)滚动时是否显示控制按钮
 *   content:       // @string  内容区域单个元素的选择器
 *   contentWrap:   // @string  包裹内容区域的容器选择器
 *   nav:           // @string  导航区域每个元素的选择器
 *   navWrap:       // @string  导航的包裹元素选择器
 *   navActiveCls:  // @string  当前导航的样式
 *   navEvent:      // @string  当行的事件类型，mouseenter/click
 *   btnPrev:       // @string  按钮-上一帧 选择器
 *   btnNext:       // @string  按钮-下一帧 选择器
 * })
 *
 */
~function() {

$.fn.slide = function(option, callback) {
    var defaults = {
        // 可见图片个数
        visible: 1,
        // 方向x,y
        direction: 'x',
        // 滚动速度
        speed: 300,
        // 是否自动播放
        auto: false,
        // 自动播放时间
        stay: 5000,
        // 无法(不足以)滚动时是否显示控制按钮
        hideControl: false,
        // 滚动元素的选择器
        content: '[data-ui="slide-item"]',
        // 包裹内容的元素容器
        contentWrap: '[data-ui="slide-wrap"]',
        // 是否显示滚动当前状态(如1,2,3,4,...)
        nav: '[data-ui="slide-nav"]',
        // 包围元素的class，默认为'scroll-nav-wrap'
        navWrap: '[data-ui="slide-nav-wrap"]',
        // 当前项目高亮class
        navActivedCls: 'cur',
        // 导航项目事件名称
        navEvent: 'click',
        // 按钮-上一张，默认为选择器字符串，或者是jQuery对象
        btnPrev: '[data-ui="btn-prev"]',        
        // 按钮-下一张，默认为选择器字符串，或者是jQuery对象
        btnNext: '[data-ui="btn-next"]',
        // 滚动到临边时是否自动禁用或隐藏按钮
        btnDisabledCls: ''
    }

    // 继承 初始化参数 - 替代默认参数
    var settings = $.extend(defaults, option)

    function bootstrap($that) {
        // some alias
        var visible     = settings.visible    
        var dir         = settings.direction
        var auto        = settings.auto 
        var speed       = settings.speed
        var btnPrev     = settings.btnPrev
        var btnNext     = settings.btnNext
        var nav         = settings.nav
        var navWrap     = settings.navWrap
        var hideControl = settings.hideControl
        var btnDisabledCls = settings.btnDisabledCls

        var $contentWrap = $that.find(settings.contentWrap)
        var $content     = $contentWrap.find(settings.content)
        var size         = $content.length

        var $btnNext = $that.find(btnNext)
        var $btnPrev = $that.find(btnPrev)

        var current = 0
        var total   = Math.ceil((size - visible) / visible) + 1

        var $navWrap = $that.find(navWrap)
        var hasNav   = $navWrap.length > 0
        var $nav     = $that.find(nav)
        var navClass = settings.navActivedCls
        var navEvent = settings.navEvent

        var liWidth, liHeight
        var timer

        /*
         * 重置下样式
         */
        function resetStyles(dir) {
            var $firstLi = $content.first()
            // 重置每个滚动列表项样式
            if ($firstLi.css('float') !== 'left') {
                $content.css('float', 'left')
            }

            // 重新设置滚动列表项高宽
            var outerWidth = $firstLi.outerWidth(true)
            var outerHeight = $firstLi.outerHeight()
            liWidth = settings.width || outerWidth
            liHeight = settings.height || outerHeight

            // 重置最外层可视区域元素样式
            var position = $contentWrap.css('position')
            // 包裹的宽高各自留余了300px
            $contentWrap.css({
                'position': position == 'static' ? 'relative' : position,
                'width': dir == 'x' ? (outerWidth * size + 300) : liWidth,
                'height': dir == 'x' ? liHeight : (outerHeight * size + 300),
                'top': 0,
                'left': 0,
                'overflow': 'hidden'
            })
        }

        /*
         * 重新初始化参数
         */
        function reInitSettings() {
            size = settings.data.length
            $content = $contentWrap.find(settings.content)
            total = Math.ceil((size - visible) / visible) + 1
        }

        // 滚动完成一帧回调
        function onEnd() {
            // 显示导航数字
            if (hasNav) {
                setCurrNav(current)
            }

            // 轮播不循环且拖动到顶部会尾部时左右箭头自动隐藏
            if (btnDisabledCls) {
                // 第一帧
                if (current == 0) {
                    $btnPrev.addClass(btnDisabledCls)
                    $btnNext.removeClass(btnDisabledCls)
                }
                // 最后一帧
                if (current == total-1) {
                    $btnPrev.removeClass(btnDisabledCls)
                    $btnNext.addClass(btnDisabledCls)
                }
                // 非第一帧和最后一帧
                if (current!=0 && current!=total-1) {
                    $btnNext.add($btnPrev).removeClass(btnDisabledCls)
                }
            }

            // event
            $that.trigger('change', current)
        }

        function goRB() {
            current++
            if (auto) {
                if (current == total) {
                    current = 0
                }
            } else {
                if (current == total) {
                    current--
                    return
                }
            }
            going(current)
        }

        function goLT() {
            current--
            if (auto) {
                if (current == -1) {
                    current = total-1
                }
            } else {
                if (current == -1) {
                    current++
                    return
                }
            }   
            going(current)
        }

        function going(idx) {
            // 滚动下一帧位移量
            var nextFrame = dir == 'x' ? {
                left: -idx * visible * liWidth
            } : {
                top:  -idx * visible * liHeight
            }
            // 动画滚动
            $contentWrap.animate(nextFrame, speed, onEnd)            
        }

        /*
         * 显示数字分页1,2,3,4,5,6...
         * 数字导航外层div的class
         * 数字导航当前页高亮class
         */
        function addNav(navWrap, active) {
            // 页面结构里已存在就不在创建了
            if ($nav.length) {
                $nav.each(function(i, el) {
                    $(el).attr('data-i', i)
                })
            } else {
                for (var i = 0; i < total; i++) {
                    var $li = $('<li>').attr('data-i', i)
                    $.isFunction(nav) ? $li.append(nav(i)) : $li.text(i+1)
                    if (i === 0) {
                        $li.addClass(active)
                    }
                    $navWrap.append($li)
                }                
            }
        }

        // 设置当前状态的数字导航与分页
        function setCurrNav(i) {
            if (hasNav) {
                $navWrap.find(nav).removeClass(navClass).eq(i).addClass(navClass)
            }
        }

        function play() {
            timer = setInterval(function() {
                goRB()
            }, settings.stay)
        }

        function stop() {
            clearInterval(timer)
        }

        function bindEvent() {
            // 左右按钮
            var prevHander = $.debounce(function() {
                goLT()
            }, 200, true)
            var nextHander = $.debounce(function() {
                goRB()
            }, 200, true)


            if (!hideControl) {
                $btnPrev.unbind('click').bind('click', prevHander)
                $btnNext.unbind('click').bind('click', nextHander)
            }

            if (auto) {
                $btnPrev.mouseover(function() {
                    stop()
                }).mouseout(function() {
                    play()
                })
                $btnNext.mouseover(function() {
                    stop() 
                }).mouseout(function() {
                    play()
                });
                $content.mouseover(function() {
                    stop()
                }).mouseout(function() {
                    play()
                })
                play()
            }

            var navHander = $.debounce(going, 200, true)
            if (hasNav && navEvent) {         
                $navWrap.delegate(nav, navEvent, function() {
                    var idx = $(this).attr('data-i')
                    current = idx
                    navHander(idx)
                })
                if (auto) {
                    $navWrap.mouseover(function() {
                        stop()
                    }).mouseout(function() {
                        play()
                    })                    
                }
            }
        }

        function hideButton() {
            $btnNext.add($btnPrev).hide()
        }

        // 初始化滚动
        if (total > 1) {
            // 可以滚动
            resetStyles(dir)
            bindEvent()
            if (hasNav) {
                addNav(navWrap, navClass)
            }
            if (btnDisabledCls) {
                $btnPrev.addClass(btnDisabledCls)
            }
        } else {
            // 无法滚动
            hideButton()
        }

        if (hideControl) {
            hideButton()
        }
    }

    // 实例化每个滚动对象
    return this.each(function() {
        var $elem = $(this)
        bootstrap($elem)
        if ($.isFunction(callback)) callback($elem)
    })
}

/*
 * 自动初始化，配置参数按照使用频率先后排序，即最经常使用的在前，不经常使用的往后，使用默认参数替代
 * 
 * 格式：data-ui="u-slide|visible|auto|direction|navEvent|btnDisabledCls|btnPrev|btnNext|"
 * 示例：data-ui="u-slide|2|false|x|"
 *
 * 如果字段设为默认使用 &
 * 如：data-ui="u-slide|2|&|&|.nav|.content|"
 */
$(function() {
    $('[data-ui^="u-slide"]').each(function() {
        var $self = $(this)
        var arr = $.uiParse($self.attr('data-ui'))
        var option = {}
        option.visible = arr[0]
        option.auto    = arr[1]
        if (arr[2] !== undefined) {
            option.direction = arr[2]    
        }
        if (arr[3] !== undefined) {
            option.navEvent = arr[3]
        }         
        if (arr[4] !== undefined) {
            option.btnDisabledCls = arr[4]
        }

        // if (arr[4] !== undefined) {
        //     option.btnPrev = arr[4]    
        // }
        // if (arr[5] !== undefined) {
        //     option.btnNext = arr[5]    
        // }
        $self.slide(option)
    })
})

}();
/*
 * 吸顶灯
 * option {
 *    fixCls: className，默认 “fixed”
 * }
 */
~function() {

$.fn.topSuction = function(option, callback) {
    option = option || {}
    var fixCls = option.fixCls || 'fixed'

    // some alias
    var $win = $(window)
    var $doc = $(document)

    function init($that) {
        var offset = $that.offset()
        var fTop   = offset.top
        var fLeft  = offset.left

        // 暂存
        $that.data('def', offset)
        $win.resize(function() {
            $that.data('def', $that.offset())
        })

        var handler = $.throttle(function() {
            var dTop = $doc.scrollTop()
            if (fTop < dTop) {
                $that.addClass(fixCls)
                $that.trigger('fixed', [fTop])
            } else {
                $that.removeClass(fixCls)
                $that.trigger('unfixed', [fTop])
            }
        }, 50)
        $win.scroll(handler)
    }

    return this.each(function() {
        var $elem = $(this)
        init($elem)
        if ($.isFunction(callback)) callback($elem)        
    })
};

/*
 * 初始化，配置参数按照使用频率先后排序，即最经常使用的在前，不经常使用的往后，使用默认参数替代
 * 
 * 格式：data-ui="u-suction|fixCls
 * 示例：
 *   data-ui="u-suction"
 *   data-ui="u-suction|cateFixed"   
 *
 */
$(function() {
    $('[data-ui^="u-suction"]').each(function() {
        var $elem = $(this)
        var arr = $.uiParse($elem.attr('data-ui'))
        var fixCls = arr[0]
        $elem.topSuction({
            fixCls: fixCls
        })
    })
});


}();
/**

*/
~function() {
    $.fn.suggest = function(option, callback) {    
        var settings = $.extend({
            source: [],
            delay: 0,
            url:'',
            errorbd:'error-bd',
            dataName:'retMessage',
            keyName:'keyWord',
            resultsClass: 'suggest_results',
            selectClass: 'suggest_over',
            onSelect: false,
            keyUpCallback:null
    }, option)

    function bootstrap($that) {
        // some alias
        var input = $that;
        var source = settings.source;
        var resultsClass = settings.resultsClass;
        var selectClass = settings.selectClass;
        var delay = settings.delay;
        var url = settings.url;
        var keyName = settings.keyName;
        var dataName = settings.dataName;
        var onSelect = settings.onSelect;
        var errorbd = settings.errorbd;
        var keyUpCallback = settings.keyUpCallback;

        var timeout = null;
        var prevLength = 0;
        var cache = {};
        var cacheSize = 0;
        var $results = $('.'+resultsClass);
        var $input = $(input).attr('autocomplete', 'off');
        var $currentResult = null;
        function delHtmlTag(str) {
            return str.replace(/<[^>]+>/g, '');
        }
        // 设置位置
        function setPosition() {
            var offset = $input.offset();
            $results.css({
                top: (offset.top + $input.outerHeight()) + 'px',
                left: offset.left + 'px'
            })
        }
        $(window).load(setPosition).resize(setPosition);
        $input.blur(function() {
            setTimeout(function() { $results.hide() }, 200)
        })
        try {
            $results.bgiframe();
        } catch(e) { }
        function showSuggest(){
            $results.show();
            setPosition();
            var q = $.trim($input.val());
            var param = {}
            param[keyName] = q
            if (url) {
                if (cache[q]) {
                    displayItems(q)
                } else {
                    $.getJSON(url, param, function(data) {
                        source = data[dataName]
                        if (source) {
                            displayItems(q)
                        }
                        cache[q] = source
                    })
                }

            } else {
                displayItems(q)    
            }
        }
        function getCityInfo(key, source) {
            var value
            $.each(source, function(i, val) {
                if (val[0] == key || val[1] == key || val[2] == key || val[3] == key) {
                    value = val;
                    return false;
                }
            })
            return value;
        }
        $input.bind('keyup',processKey)
        var reg1 = /27$|38$|40$/;
        var reg2 = /^13$|^9$/;
        function processKey(e) {
            $input.removeClass(errorbd);
            var val = $input.val();
            var keyCode = e.keyCode;
            if ((reg1.test(keyCode) && $results.is(':visible')) || (reg2.test(keyCode) && getCurrentResult())) {
                e.preventDefault()
                e.stopPropagation()
                switch(e.keyCode) {
                    case 38: // up
                        prevResult();
                        break;
                    case 40: // down
                        nextResult();
                        break;
                    case 13: // return
                        selectCurrentResult();
                        break;
                    case 27: // escape
                        $results.hide();
                        break;
                }
            } else {
                if (timeout) {
                    clearTimeout(timeout)
                }
                timeout = setTimeout(showSuggest, delay)
                prevLength = val.length;
            }
            if (keyUpCallback) {
                keyUpCallback(val)
            }
        }

        function displayItems(item) {
            var items = delHtmlTag(item)
            var html = '';
            if (url && cache[item]) {
                source = cache[item];
            }
            if (items == '') {
                $results.hide()
            } else {
                var j = 0;
                var tempCitys = [];
                if (source.constructor == Array) {
                    for (var i = 0; i < source.length; i++) {
                        var reg = new RegExp('^' + items + '.*$', 'im')
                        if (reg.test(source[i][0]) || reg.test(source[i][1]) || reg.test(source[i][2]) || reg.test(source[i][3])) {
                            if (j >= 10) break;
                            tempCitys[j] = source[i][1];
                            j++;
                        }
                    }
                    tempCitys.sort();
                }
                for (var k = 0; k < tempCitys.length; k++) {
                    var cityInfo = getCityInfo(tempCitys[k], source)
                    html += '<li rel="' + cityInfo[0] + '"><a href="#' + i + '"><span>' + cityInfo[2].toLowerCase() + '</span>' + cityInfo[1] + '</a></li>';
                }
                if (html == '') {
                    if(items.length>20){
                        suggest_tip = '<div class="suggest_result_null">请重新输入</div>';
                        $input.val('');
                        $input.removeClass(errorbd);
                    }else {
                        suggest_tip = '<div class="suggest_result_null">对不起，找不到：' + items + '</div>';
                        $input.addClass(errorbd);
                    }
                } else {
                    suggest_tip = '<div class="suggest_result_tip">' + items + '，按拼音排序</div>';
                    $input.removeClass('error-bd');
                }
                html = suggest_tip + '<ul>' + html + '</ul>';
            }
            $results.html(html).show().css({
                width: $input.outerWidth()*2-50+'px'
            })
            $results.children('ul').children('li:first-child').addClass(selectClass)
            $results.children('ul').children('li').mouseover(function() {
                $results.children('ul').children('li').removeClass(selectClass)
                $(this).addClass(selectClass)
            }).click(function(e) {
                e.preventDefault()
                e.stopPropagation()
                selectCurrentResult()
            })
            if (items == '') {
               $results.hide()
            }
        }
        function getCurrentResult() {
            if (!$results.is(':visible')) return false;
            $currentResult = $results.find('li.' + selectClass);
            if (!$currentResult.length) {
                $currentResult = false
            }
            return $currentResult
        }
        function selectCurrentResult() {
            $currentResult = getCurrentResult()
            if ($currentResult) {
                $input.val($currentResult.find('a').html().replace(/<span>.+?<\/span>/i, ''))
                $results.hide()
                if (onSelect) {
                    onSelect.call($input, $input.val(), $currentResult)
                }
            }
        }
        function nextResult() {
            $currentResult = getCurrentResult();
            if ($currentResult) {
                $currentResult.removeClass(selectClass).next().addClass(selectClass);
            } else {
                $results.find('li:first-child').addClass(selectClass)
            }
        }
        function prevResult() {
            $currentResult = getCurrentResult()
            if ($currentResult) {
                $currentResult.removeClass(selectClass).prev().addClass(selectClass);
            } else {
                $results.find('li:last-child').addClass(selectClass);
            }
        }
    }
    // 实例化每个对象
    return this.each(function() {
        var $elem = $(this)
        bootstrap($elem)
        if ($.isFunction(callback)) callback($elem)
    })
}
/*
 * 
 * 格式：data-ui="u-suggest|dujiaAllCity|API"
 * 示例：data-ui="u-suggest|dujiaAllCity|a.json"
 *  
 */
$(function() {
    if($('[data-ui^="u-suggest"]')){
        $('<div class="suggest_results"></div>').appendTo('body');
    }
    $('[data-ui^="u-suggest"]').each(function() {
        var $elem = $(this);
        var arr = $.uiParse($elem.attr('data-ui'))
        var cityInfo = arr[0];
        var api = arr[1];
        if(api){
            $elem.suggest({
                url:api
            })
        }else {
            if (window.dataObj && window.dataObj[cityInfo]) {
                $elem.suggest({
                    source: window.dataObj[cityInfo],
                    keyUpCallback:function(val){
                    },
                    onSelect:function(val){
                    }
                })
            }
        }
    })
})

}();
/**
 * 页签组件 
 * $(x).tab({
 *   auto:       // @boolean 是否自动切换，默认false
 *   evtType:    // @string  默认mouseover，鼠标移动到上面时切换，可选click
 *   currCls:    // @string  默认curr
 *   nav:        // @string  tab的css属性选择器的key，默认为 tab-nav
 *   content:    // @string  tab content的css属性选择器的key，默认为 tab-content
 *   arrow:      // @string  tab-arrow 切换时动态移动效果
 *   stay:       // @number  自动切换的时间间隔
 *   defIndex:   // @number  默认显示的tab,
 *   isFade:     // @boolean 默认false
 * })
 *
 */
~function() {

$.fn.tab = function(option, callback) {
    var settings = $.extend({
        auto:     false,
        evtType:  'mouseenter',
        currCls:  'cur',
        nav:      '[data-ui="tab-nav"]',
        content:  '[data-ui="tab-content"]',
        arrow:    '[data-ui="tab-arrow"]',
        stay:     3000,
        defIndex:  0,
        animate:  false
    }, option)

    function bootstrap($that) {
        // some alias
        var auto        = settings.auto
        var evtType     = settings.evtType
        var currCls     = settings.currCls
        var navSelector = settings.nav
        var conSelector = settings.content
        var arrow       = settings.arrow
        var isFade      = settings.isFade

        // some timer
        var timer
        var defIndex = settings.defIndex
        var current  = defIndex

        // DOM elements
        var $nav         = $that.find(navSelector)
        var $content     = $that.find(conSelector)
        var $arrow       = $that.find(arrow)
        var $prevNav     = $nav.eq(defIndex)
        var $prevContent = $content.eq(defIndex)

        // cache index
        $nav.each(function(i, el) {
            $(el).data('data-i', i)
        })

        // nav与content长度不一致时直接返回
        if ($nav.length != $content.length) {
            throw new Error('nav\'s length and content length must be equal.')
        }

        // 设置需要显示的tab
        function setTab(i) {
            if (current == i) return

            var $curNav = $nav.eq(i)
            var $curCont = $content.eq(i)

            // iframe tab
            var ifrSrc = $curNav.attr('data-iframe')
            var loaded = $curCont.attr('data-loaded')
            if (ifrSrc && !loaded) {
                $curCont.find('iframe').attr('src', ifrSrc)
                $curCont.attr('data-loaded', 'true')
            }

            // 是否淡入淡出
            if (!isFade) {
                $prevContent.hide()
                $curCont.show()
            } else {
                $prevContent.fadeOut()
                $curCont.fadeIn()
            }
            $prevNav.removeClass(currCls)
            $curNav.addClass(currCls)
            // 有箭头的tab动画效果
            if ($arrow.length) {
                $arrow.animate({
                    left: $arrow.outerWidth() * i + 'px'
                }, 300)
            }
            // change
            current = i
            $prevNav = $curNav
            $prevContent = $curCont
            // observe
            $that.trigger('change', [i, $curNav, $curCont])
        }

        // 自动切换
        function play() {
            timer = setInterval(function() {
                var i = current+1
                if (i === $nav.length) {
                    i = 0
                }
                setTab(i)
            }, settings.stay)
        }

        // 停止自动切换
        function stop() {
            clearInterval(timer)
        }

        // events
        $that.delegate(navSelector, evtType, function() {
            stop()
            var i = $(this).data('data-i')
            setTab(i)
        })
        $that.mouseenter(function() {
            if (auto) stop()
        })
        $that.mouseleave(function() {
            if (auto) play()
        })

        // initilize
        $content.eq(0).show()
        setTab(defIndex)

        // 自动播放
        if (auto) play()
    }

    // 实例化每个对象
    return this.each(function() {
        var $elem = $(this)
        bootstrap($elem)
        if ($.isFunction(callback)) callback($elem)
    })
}

/*
 * 自动初始化，配置参数按照使用频率先后排序，即最经常使用的在前，不经常使用的往后，使用默认参数替代
 * 
 * 格式：data-ui="u-tab|evtType|currCls|auto|stay|nav|content|defIndex"
 * 示例：data-ui="u-tab|click|curr|true|2000|.nav|.content|"
 *
 * 如果字段设为默认使用 &
 * 如：data-ui="u-tab|click|&|&|.nav|.content|"
 */
$(function() {
    $('[data-ui^="u-tab"]').each(function() {
        var $elem = $(this)
        var arr = $.uiParse($elem.attr('data-ui'))
        // 切换事件默认是mouseenter
        var evtType = arr[0]
        // 当前样式class
        var currCls = arr[1]
        // 是否自动切换，默认是false
        var auto = arr[2]
        // 自动切换的时间间隔
        var stay = arr[3] && arr[3]-0
        // 页签头部选择器
        var nav  = arr[4]
        // 页签内容部分选择器
        var con  = arr[5]
        // 默认显示第几个页签
        var cur  = arr[6]
        // create
        $elem.tab({
            evtType: evtType,
            currCls: currCls,
            auto: auto,
            stay: stay,
            nav: nav,
            content: con,
            defIndex: cur
        })
    })
})

}();