/**
 * 图片无缝滚动组件
 */

$.fn.carousel = function(options, callback) {
    var defaults = {
        visible: 1,
        direction: 'left',
        step: 1,
        loop: true,
        speed: 300,
        autoPlay: true,
        stay: 5000,
        itemWrap: '.slider-wraper',
        itemSel: '.slider-item',
        navWrap: '.slider-nav-wrap',
        nav: '.slider-nav',
        navTpl: '<li></li>',
        navCls: 'slider-nav',
        navActiveCls: 'cur',
        btnPrev: '.slider-btn-prev',
        bntNext: '.slider-btn-next'
    }

    var settings = $.extend(defaults, options)

    function init($that) {
        // some alias
        var visible = settings.visible
        var step = settings.step

        // some dom
        var nav = settings.nav
        var navCls = settings.navCls
        var navTpl = settings.navTpl
        var navActiveCls = settings.navActiveCls
        var $wraper = $that.find(settings.itemWrap)
        var $items = $that.find(settings.itemSel)
        var $navWrap = $that.find(settings.navWrap)
        var $nav = $that.find(nav)
        var hasNav = $navWrap.length > 0
        var navItemEvent = settings.navItemEvent
        var $btnPrev = $that.find(settings.btnPrev)
        var $bntNext = $that.find(settings.bntNext)

        // some timer
        var timer = null
        var current = 1
        var total = Math.ceil(($items.length - visible) / step) + 1 
        var itemWidth = $items.outerWidth()

        $wraper.width(itemWidth*settings.visible)
        $items.slice(0, settings.step).each(function(i, el) {
            $(el).css({
                position: 'absolute',
                top: '0px',
                left: i * itemWidth + 'px'
            }).addClass('cur')
        })

        if (hasNav) {
            addNavItem()
        }
        
        function addNavItem() {
            $navWrap = hasNav ? $navWrap : $('<ul class="' + navCls + '"></ul>')
            for (var i = 0; i < total; i++) {
                var $el = $.isFunction(navTpl) ? navTpl(i) : $(navTpl).addClass(navCls).text(i+1)
                if (i === 0) {
                    $el.addClass(navActiveCls)
                }
                $navWrap.append($el)
            }
            if(!hasNav) {
                $that.after($navWrap)
            }
            $nav = $navWrap.find(nav)
        }

        function setCurNav(i) {
            if (i == 6) i = 0
            if (hasNav) {
                $nav.removeClass(navActiveCls)
                $nav.eq(i).addClass(navActiveCls)
            }
        }
        function switchTo() {
            var $will = $items.slice(step * current, step * (current+1))
            if (current == total) {
                $will = $items.slice(0, step)
                $items.slice(step * (total-1), step*total).each(function(i, el) {
                    $(el).css({
                        left: i * itemWidth + 'px'
                    })                    
                })
            }
            $will.addClass('cur').show()
            $will.each(function(i, el) {
                var left = itemWidth * (step + i)
                $(el).css({
                    position: 'absolute',
                    top: '0px',
                    left: left + 'px'
                })
            })
            $wraper.css({
                width: (itemWidth * step * 2) + 'px'
            }).animate({
                left: (-itemWidth * step) + 'px'
            }, {
                duration: settings.speed,
                complete: function() {
                    $wraper.css({
                        width: itemWidth * step +'px',
                        left: '0px'
                    })
                    var $prev = $items.slice(step*(current-1), step*current)
                    $prev.removeClass('cur')
                    $prev.hide()
                    $will.each(function(i, el) {
                        var left = itemWidth * i
                        $(el).css({
                            left: left + 'px'
                        })
                    })

                    // 设置导航数字
                    if (hasNav) setCurNav(current)

                    current++
                    if (current == total+1) {
                        current = 1
                    }
                }
            })
        }

        function play() {
            timer = setInterval(function() {
                switchTo()
            }, settings.stay)
        }

        function stop() {
            clearInterval(timer)
        }

        function addEvent() {
            $that
                .mouseenter(function() {
                    stop()
                })
                .mouseleave(function() {
                    if (settings.autoPlay) {
                        play()
                    }
                })
                .delegate(settings.btnPrev, 'click', function() {
                    current--
                    switchTo()
                })
                .delegate(settings.bntNext, 'click', function() {
                    current++
                    switchTo()
                })
        }

        if (settings.autoPlay) {
            play()
        }
        
        addEvent()
    }

    return this.each(function() {
        var $that = $(this)
        init($that)
        if ($.isFunction(callback)) callback($that)
    })
};