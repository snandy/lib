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