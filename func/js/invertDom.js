$.invertDom = ~function(window) {

    var $win = $(window)
    var $doc = $(document)

    function throttle(func, wait, immediate) {
        var timeout
        return function() {
            var context = this, args = arguments
            later = function() {
                timeout = null
                if (!immediate) func.apply(context, args)
            }
            var callNow = immediate && !timeout
            clearTimeout(timeout)
            timeout = setTimeout(later, wait)
            if (callNow) func.apply(context, args)
        }
    }

    return function(mod1Selector, mod2Selector, callback) {
        // 记录模块1的位置
        var positions = $(mod1Selector).map(function(idx, elem) {
            var top = $(elem).offset().top
            return {
                area: [top-200, top+560],
                elem: elem
            }
        })

        var handler = throttle(function(e) {
            var dTop = $doc.scrollTop()
            callback(dTop)
        }, 100)

        $win.scroll(handler)

    }

}(this);