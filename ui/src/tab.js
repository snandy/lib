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