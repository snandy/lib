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
