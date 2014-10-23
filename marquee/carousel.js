/**
 * 图片无缝滚动组件
 */

$.fn.carousel = function(options, callback) {
    var defaults = {
        visiable: 1,
        direction: 'left',
        step: 1,
        loop: true,
        autoPlay: true,
        stay: 5000
    }

    var settings = $.extend(defaults, options)

    // some alias
    var step = settings.step

    // some dom
    $self = this
    var $scroll = $self.find('.slider-scroll')
    var $main = $self.find('.slider-main')
    var $item = $self.find('.slider-main-img')


    // some timer
    var timer = null

    var current = 1
    var all = $item.length/settings.step

    function init() {
        var width = $item.outerWidth()
        $main.width(width*settings.visiable)
        $item.slice(0, settings.step).each(function(i, el) {
            $(el).css({
                position: 'absolute',
                top: '0px',
                left: i * width + 'px'
            }).addClass('current')
        })

        play()
    }

    function play() {
        timer = setInterval(function() {
            var $will = $item.slice(step * current, step * (current+1))
            if (current == all) {
                $will = $item.slice(0, step)
                $item.slice(step * (all-1), step*all).each(function(i, el) {
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
                duration: 1000,
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
                    if (current == all+1) {
                        current = 1
                    }
                }
            })



        }, settings.stay)
    }
    function stop() {
        clearInterval(timer)
    }

    init()

};