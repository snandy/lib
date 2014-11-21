/**
 * 图片无缝滚动组件
 */

$.fn.carousel = function(options, callback) {
    var defaults = {
        visible: 1,
        direction: 'left',
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
        navEventType: 'click',
        navActiveCls: 'cur',
        btnPrev: '.slider-btn-prev',
        bntNext: '.slider-btn-next'
    }

    var settings = $.extend(defaults, options)

    function bootstrap($that) {
        // some alias
        var visible = settings.visible
        var autoPlay = settings.autoPlay

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
        var navEventType = settings.navEventType
        var $btnPrev = $that.find(settings.btnPrev)
        var $bntNext = $that.find(settings.bntNext)

        // some timer
        var timer = null
        var current = 0
        var total = Math.floor( $items.length/visible )
        // 单个元素的宽度(图片)
        var itemWidth = $items.outerWidth()
        // 一帧的宽度
        var frameWidth = itemWidth * visible
        
        function addNavItem() {
            $navWrap = hasNav ? $navWrap : $('<ul class="' + navCls + '"></ul>')
            for (var i = 0; i < total; i++) {
                var $el = $.isFunction(navTpl) ? navTpl(i) : $(navTpl).addClass(navCls).text(i+1).attr('data-i', i)
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

        function goNext(idx) {
            var currFrameIdx = visible*current
            var nextFrameIdx = visible*idx            
            var $curr = $items.slice(currFrameIdx, visible*(current+1))
            var $next = $items.slice(nextFrameIdx, visible*(idx+1))

            $next.show().addClass('cur')
            $next.each(function(i, el) {
                var left = itemWidth * (visible + i)
                $(el).css({
                    position: 'absolute',
                    top: '0px',
                    left: left + 'px'
                })
            })

            
            $wraper.animate({
                left: -frameWidth + 'px'
            }, {
                duration: settings.speed,
                complete: function() {
                    $wraper.css({
                        left: '0px'
                    })
                    $curr.hide().removeClass('cur')
                    $next.each(function(i, el) {
                        var left = itemWidth * i
                        $(el).css({
                            left: left + 'px'
                        })
                    })

                    // 设置导航数字
                    if (hasNav) setCurNav(idx)
                    // 重置current
                    if (idx == total) {
                        current = 1
                    } else {
                        current = idx
                    }
                }
            })            
        }

        function goPrev(idx) {
            var currFrameIdx = visible*current
            var nextFrameIdx = visible*idx            
            var $curr = $items.slice(currFrameIdx, visible*(current+1))
            var $next = $items.slice(nextFrameIdx, visible*(idx+1))

            $wraper.css({
                left: -frameWidth+'px'
            })
            $curr.css({
                left: frameWidth+'px'
            })
            $next.show().addClass('cur')
            $next.each(function(i, el) {
                var left = itemWidth * i
                $(el).css({
                    position: 'absolute',
                    top: '0px',
                    left: left + 'px'
                })
            })

            $wraper.animate({
                left: '0px'
            }, {
                duration: settings.speed,
                complete: function() {
                    $wraper.css({
                        left: '0px'
                    })
                    $curr.hide().removeClass('cur')
                    $next.each(function(i, el) {
                        var left = itemWidth * i
                        $(el).css({
                            left: left + 'px'
                        })
                    })

                    // 设置导航数字
                    if (hasNav) setCurNav(idx)
                    // 重置current
                    if (idx == total) {
                        current = 1
                    } else {
                        current = idx
                    }
                }
            })

        }

        function play() {
            timer = setInterval(function() {
                nextHander()
            }, settings.stay)
        }

        function stop() {
            clearInterval(timer)
        }

        // 防止左右箭头点击太快
        function debounce(func, wait) {
            var canSwitch = true
            return function() {
                if (!canSwitch) return
                func.apply(this, arguments)
                canSwitch = false
                setTimeout(function() {
                    canSwitch = true
                }, wait)
            }
        }

        var prevHander = debounce(function() {
            if (current == 0) {
                goPrev(total-1)
            } else {
                goPrev(current-1)    
            }
        }, 400)

        var nextHander = debounce(function() {
            if (current == total-1) {
                goNext(0)
            } else {
                goNext(current+1)    
            }
        }, 400)

        var mouseenterHander = debounce(function() {
            var i = $(this).attr('data-i') - 0
            if (i == current) return
            var isPrev = i < current ? true : false
            isPrev ? goPrev(i) : goNext(i)
        }, 400)

        function addEvent() {
            $that
            .mouseenter(function() {
                if (autoPlay) stop()    
            })
            .mouseleave(function() {
                if (autoPlay) play()
            })
            .delegate(settings.btnPrev, 'click', prevHander)
            .delegate(settings.bntNext, 'click', nextHander)
            .delegate(nav, navEventType, mouseenterHander)
        }

        function init() {
            $that.width(itemWidth*visible)
            $wraper.width(itemWidth*visible*2)
            $items.slice(0, visible).each(function(i, el) {
                $(el).css({
                    position: 'absolute',
                    top: '0px',
                    left: i * itemWidth + 'px'
                }).addClass('cur')
            })
            //绑定事件
            addEvent()
            
            if (hasNav) addNavItem()
            if (autoPlay) play()
        }
        init()
    }


    return this.each(function() {
        var $that = $(this)
        bootstrap($that)
        if ($.isFunction(callback)) callback($that)
    })
};