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