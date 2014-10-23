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
        navItems: false,
        navItemsWrap: '.nav-wrap'
    }

    var settings = $.extend(defaults, options)

    function init($that) {
        // some alias
        var visible = settings.visible
        var step = settings.step

        // some dom
        var $main = $that.find('.slider-scroll')
        var $item = $that.find('.slider-main-img')
        var $navWrap = $that.find(settings.navItemsWrap)
        var hasNavWrap = $navWrap.length > 0
        var navItems = settings.navItems
        var navItemActived = settings.navItemActived
        var navItemEvent = settings.navItemEvent      

        // some timer
        var timer = null
        var current = 1
        var total = Math.ceil(($item.length - visible) / step) + 1 
        var width = $item.outerWidth()

        $main.width(width*settings.visible)
        $item.slice(0, settings.step).each(function(i, el) {
            $(el).css({
                position: 'absolute',
                top: '0px',
                left: i * width + 'px'
            }).addClass('current')
        })

        if (settings.navItems) {
            addNavItem()
        }
        
        function addNavItem() {
            $navWrap = hasNavWrap ? $navWrap : $('<div class="' + settings.navItmesWrap + '"></div>')
            for (var i = 0; i < total; i++) {
                var $nav = $.isFunction(navItems) ? navItems(i) : $('<li></li>').text(i+1)
                if (i === 0) {
                    $nav.addClass(navItemActived)
                }
                $navWrap.append($nav)
            }
            if(!hasNavWrap) {
                $that.after($navWrap)
            }            
        }

        function play() {
            timer = setInterval(function() {
                var $will = $item.slice(step * current, step * (current+1))
                if (current == total) {
                    $will = $item.slice(0, step)
                    $item.slice(step * (total-1), step*total).each(function(i, el) {
                        var width = $item.outerWidth()
                        $(el).css({
                            left: i * width + 'px'
                        })                    
                    })
                }
                $will.addClass('current')
                $will.each(function(i, el) {
                    var left = $item.width() * (step + i)
                    $(el).css({
                        position: 'absolute',
                        top: '0px',
                        left: left + 'px'
                    })
                })
                $main.css({
                    width: ($item.width() * step * 2) + 'px'
                }).animate({
                    left: (-$item.width() * step) + 'px'
                }, {
                    duration: settings.speed,
                    complete: function() {
                        $main.css({
                            width: $item.width() * step +'px',
                            left: '0px'
                        })
                        var $prev = $item.slice(step * (current-1), step*current)
                        $prev.removeClass('current')
                        $will.each(function(i, el) {
                            var left = $item.width() * i
                            $(el).css({
                                left: left + 'px'
                            })
                        })
                        current++
                        if (current == total+1) {
                            current = 1
                        }
                    }
                })
            }, settings.stay)
        }

        function stop() {
            clearInterval(timer)
        }

        if (settings.autoPlay) {
            play()
        }
        
    }

    return this.each(function() {
        var $that = $(this)
        init($that)
        if ($.isFunction(callback)) callback($that)
    })
};