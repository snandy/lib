/*
 * 滑屏翻页组件
 * @param direction {string} 方向，支持上下和左右滑动，默认垂直翻页
 * @param minOffset {string} 误差值，至少滑动到指定数值后才翻页
 * @param content   {string} 翻页内层元素的选择器，默认是 section 标签
 */
$.fn.pagedrag = function(option, callback) {
    var setting = $.extend({
        direction: 'Y',
        minOffset: 50,
        content: 'section'
    }, option);

    var prefix = mo.prefix;
    var transform = prefix + 'transform';
    var docElem = document.documentElement;

    mo.addStyle('.PAGE_DRAG_V{' + prefix + 'transition:' + transform + ' .3s linear;}'); //竖屏
    mo.addStyle('.PAGE_DRAG_H{' + prefix + 'transition:' + transform + ' .2s linear;}'); //横屏

    function getTranslate3D(elem) {
        var result = {x: 0, y: 0, z: 0};
        var trans  = elem.style[transform];

        //没有值，直接中断
        if (!trans || trans == 'none') return result;

        var reg = RegExp('translate3d\\(([^\\)]+)\\)','ig');
        var res = trans.match(reg);
        if (res && res.length) {
            var arr = res[0].replace(reg, '$1').split(',');
            result.x = parseInt(arr[0], 10);
            result.y = parseInt(arr[1], 10);
            result.z = parseInt(arr[2], 10);
        }

        return result;
    }
    function bootstrap($elem) {
        var direction = setting.direction.toUpperCase();
        var elem = $elem[0];
        var sw = elem.scrollWidth;
        var sh = elem.scrollHeight;
        var cw = docElem.clientWidth;
        var ch = docElem.clientHeight;
        window.addEventListener('resize', function() {
            ch = docElem.clientHeight;
            cw = docElem.clientWidth;
        }, false);

        var total = Math.ceil(sh/ch);
        var cur = 0;
        var previous = -1;
        var next = 1; 
        var startX = 0
        var startY = 0;
        var x = 0;
        var y = 0;
        var offset = 0;
        var motion = 'none'
        var lock = false;
        var keep = 'X' == direction ? 'PAGE_DRAG_H' : 'PAGE_DRAG_V';

        // 水平方向需要把内层元素横着摆放，容器的宽度也要放大到足以容纳子元素以实现动画效果
        if (direction === 'X') {
            $elem.width('2000%');
            $elem.find(setting.content).css({
                width: cw + 'px',
                'float': 'left'
            });
        }

        function fixPage(num) {
            if (!total) return num;
            //使页码正确
            if(num >= 0) {
                return num % total;
            } else {
                return (total + num % total);
            }
        }

        $elem.on('touchstart', function(ev) {
            var toucher = ev.targetTouches || ev.changedTouches;
            var touchObj = toucher[0];
            var trans3d = getTranslate3D(elem);
            startX = touchObj.pageX;
            startY = touchObj.pageY;
            x = trans3d.x;
            y = trans3d.y;
            
            // 需要重新取值
            if (!sw && !sh) {
                sh = elem.scrollHeight;
                sw = elem.scrollWidth;
                total = Math.ceil(sh/ch);
                next = fixPage(cur + 1);
                previous = fixPage(cur - 1);
            }
            // console.log(ev);
        });
        $elem.on('touchmove', function(ev) {
            // 需要阻止默认行为和停止冒泡，否则手机端会卡顿，pc模拟没问题
            ev.preventDefault();
            ev.stopPropagation();

            var toucher = ev.targetTouches || ev.changedTouches;
            var touchObj = toucher[0];
            var pageX = touchObj.pageX;
            var pageY = touchObj.pageY;
            
            if (direction === 'Y') {
                offset = pageY - startY;
                $elem.css(transform, 'translate3d(0,' + (y+offset) + 'px, 0)');
            } else {
                offset = pageX - startX;
                $elem.css(transform, 'translate3d(' + (x+offset) + 'px,0,0)');
            }
        });
        $elem.on('touchend', function(ev) {
            lock = true; //上锁
            var toucher = ev.targetTouches || ev.changedTouches;
            if ( Math.abs(offset) < setting.minOffset || (offset < 0 && cur == total-1) || (offset > 0 && cur == 0) ) {
                turnback();
            } else {
                if (offset < 0) {
                    move(next);
                } else {
                    move(previous);
                }
            }
        });

        // 回退到原来位置
        function turnback() {
            if (direction === 'Y') {
                elem.style[transform] = 'translate3d(0,-' + cur*ch + 'px,0)';    
            } else {
                elem.style[transform] = 'translate3d(-' + cur*cw + 'px,0,0)';
            }
            // 解锁
            setTimeout(function() {
                lock = false;
            }, 100);
        }

        function move(index) {
            elem.classList.add(keep);
            if (direction === 'Y') {
                elem.style[transform] = 'translate3d(0,-' + (index*ch) + 'px,0)';    
            } else {
                elem.style[transform] = 'translate3d(-' + index*cw + 'px,0,0)';
            }
            setTimeout(function() {
                elem.classList.remove(keep);
                cur = index;
                next = cur + 1;
                previous = cur - 1;
                cur = fixPage(cur);
                next = fixPage(next);
                previous = fixPage(previous);
                lock = false; //解锁
            }, 300);
        }

    }

    // 实例化每个对象
    return this.each(function() {
        var $elem = $(this)
        bootstrap($elem)
        if ($.isFunction(callback)) callback($elem)
    })
};