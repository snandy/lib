/**
 * 滚动轮播插件
 * 
 */
$.fn.slide = function(option, callback) {
    var defaults = {
        // 可见图片个数
        visible: 1,
        // 方向x,y
        direction: 'x',
        // 滚动速度
        speed: 300,
        // 循环播放
        loop: true,
        // 是否自动播放
        auto: false,
        // 自动播放时间
        stay: 5000,
        // 无法(不足以)滚动时是否显示控制按钮
        hideControl: false,
        // 每个滚动元素宽度，默认取li的outerWidth
        width: null,
        // 每个滚动元素宽度，默认取li的outerHeight
        height: null,
        // 是否显示滚动当前状态(1,2,3,4,...)
        nav: false,
        // 包围元素的class，默认为'scroll-nav-wrap'
        navWrap: 'nav-wrap',
        // 当前项目高亮class
        navActivedCls: 'cur',
        // 导航项目事件名称
        navEvent: 'click',
        // 按钮-下一张，默认为选择器字符串，或者是jQuery对象
        btnNext: '',
        // 按钮-上一张，默认为选择器字符串，或者是jQuery对象
        btnPrev: '',
        // 结束一帧时的回调
        end: function() {}
    }

    // 继承 初始化参数 - 替代默认参数
    var settings = $.extend(defaults, option)

    /*
     * 函数节流，控制间隔时间
     */
    function debounce(func, wait, immediate) {
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
    }

    function init($that) {
        // some alias
        var btnPrev  = settings.btnPrev
        var btnNext  = settings.btnNext
        var nav = settings.nav
        var navWrap  = settings.navWrap
        var hideControl = settings.hideControl

        var $ul = $that.find('ul').eq(0)
        var $lis = $ul.children('li')
        var size = $lis.length

        var $btnNext = typeof btnNext == 'string' ? $(btnNext) : btnNext
        var $btnPrev = typeof btnPrev == 'string' ? $(btnPrev) : btnPrev

        var current = 0
        var visible = settings.visible
        var dir = settings.direction
        var total = Math.ceil((size - visible) / visible) + 1


        var $navWrap = $(navWrap)
        var navHasWrap = $navWrap.length > 0
        var navClass = settings.navActivedCls
        var navEvent = settings.navEvent

        var first = true
        var last = false
        var end = settings.end
                    
        var liWidth, liHeight
        var nextFrame, intervalTimer

        /*
         * 重置下样式
         */
        function resetStyles(dir) {
            var $firstLi = $lis.first()
            // 重置每个滚动列表项样式
            if ($firstLi.css('float') !== 'left') {
                $lis.css('float', 'left')
            }

            // 重新设置滚动列表项高宽
            var outerWidth = $firstLi.outerWidth(true)
            var outerHeight = $firstLi.outerHeight()
            liWidth = settings.width || outerWidth
            liHeight = settings.height || outerHeight

            // 重置最外层可视区域元素样式
            var position = $that.css('position')
            $that.css({
                'position': position == 'static' ? 'relative' : position,
                'width': dir == 'x' ? (liWidth * visible - outerWidth + $firstLi.outerWidth(false)) : liWidth,
                'height': dir == 'x' ? liHeight : liHeight * visible,
                'overflow': 'hidden'
            })

            // 重置滚动内容区元素样式
            $ul.css({
                'position': 'absolute',
                'width': dir == 'x' ? liWidth * size : liWidth,
                'height': dir == 'x' ? liHeight : liHeight * size,
                'top': 0,
                'left': 0
            })
        }

        /*
         * 重新初始化参数
         */
        function reInitSettings() {
            size = settings.data.length
            $lis = $ul.children('li')
            total = Math.ceil((size - visible) / visible) + 1
        }

        /*
         * isPrev 是否向前滚动
         */
        function switchTo(isPrev) {
            if (settings.loop) {
                if (first && isPrev) {
                    current = total-1
                }
                if (last && !isPrev) {
                    current = 0
                }
            }

            // 滚动下一帧位移量
            nextFrame = dir == 'x' ? {
                left: -current * visible * liWidth
            } : {
                top: -current * visible * liHeight
            }

            // 滚动完成一帧回调
            function onEnd() {
                if (size - current * visible <= visible) {
                    last = true
                } else {
                    last = false
                }

                if (current <= 0) {
                    first = true
                } else {
                    first = false
                }

                // 显示导航数字
                if (nav) {
                    setCurrNav(current)
                }

                // 轮播不循序且拖动到顶部会尾部时左右箭头自动隐藏
                if (!settings.loop) {
                    first ? $btnPrev.hide() : $btnPrev.show()
                    last ? $btnNext.hide() : $btnNext.show()
                }

                // 每次滚动到可视区li的集合
                var viewLi = $lis.slice(current * visible, current * visible + visible)
                // current 当前滚动到第几页
                // total 一共有多少页
                // allLi 所有的li
                // viewLi可视区域内的滚动li
                end.apply($that, [current, total, viewLi])
            }

            // 是否动画滚动
            if(!!settings.speed) {
                $ul.animate(nextFrame, settings.speed, onEnd)
            } else {
                $ul.css(nextFrame)
                onEnd()
            }
        }

        /*
         * 事件节流后的
         */
        var deSwitchTo = debounce(switchTo, 100)

        /*
         * 显示数字分页1,2,3,4,5,6...
         * 数字导航外层div的class
         * 数字导航当前页高亮class
         */
        function addNav(navWrap, active) {
            var $navPage = navHasWrap ? $navWrap : $('<div class="' + navWrap + '"></div>')
            for (var i = 0; i < total; i++) {
                var $li = $('<li>').attr('data-i', i)
                $.isFunction(nav) ? $li.append(nav(i)) : $li.text(i+1)
                if (i === 0) {
                    $li.addClass(active)
                }
                $navPage.append($li)
            }
            if(!navHasWrap) {
                $that.after($navPage)
            }
        }

        // 设置当前状态的数字导航与分页
        function setCurrNav(i) {
            if (nav) {
                $navWrap.find('li').removeClass(navClass).eq(i).addClass(navClass)
            }
        }

        function play() {
            intervalTimer = setInterval(function() {
                current++
                switchTo(false)
            }, settings.stay)
        }

        function stop() {
            clearInterval(intervalTimer)
        }

        function bindEvent() {
            // 左右按钮
            var prevHander = debounce(function() {
                current--
                switchTo(true)
            }, 200)
            var nextHander = debounce(function() {
                current++
                switchTo(false)
            }, 200)            
            if (!hideControl) {
                $btnPrev.unbind('click').bind('click', prevHander)
                $btnNext.unbind('click').bind('click', nextHander)
            }

            if (settings.loop && settings.auto) {
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
                $ul.find('li').mouseover(function() {
                    stop()
                }).mouseout(function() {
                    play()
                })
                play()
            }

            if (nav && navEvent) {                
                $navWrap.delegate('li', navEvent, function() {
                    var idx = $(this).attr('data-i')
                    var isPrev = idx < current ? true : false
                    current = idx
                    deSwitchTo(isPrev)
                })
                $navWrap.mouseover(function() {
                    stop()
                }).mouseout(function() {
                    play()
                })
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
            if (nav) {
                addNav(navWrap, navClass)
            }
            if (!settings.loop) {
                $btnPrev.hide()
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
        var $that = $(this)
        init($that)
        if ($.isFunction(callback)) callback.call($that, $that)
    })
};