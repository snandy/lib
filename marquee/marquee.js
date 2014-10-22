/*
 *  marquee
 */
$.fn.marquee = function(options, callback) {
    if (typeof options == 'function') {
        callback = options
        options = {}
    }

    var defaults = {
        direction: 'up',
        speed: 10,
        auto: false,
        width: null,
        height: null,
        step: 1,
        control: false,
        _front: null,
        _back: null,
        _stop: null,
        _continue: null,
        wrapstyle: '',
        stay: 5000,
        delay: 20,
        dom: 'ul>li'.split('>'),
        tag: false,
        convert: false,
        btn: null,
        disabled: 'disabled',
        pos: {
            object: null,
            clone: null
        }
    }

    var settings = $.extend(defaults, options)

    // some alias
    var sDir  = settings.direction
    var sPos  = settings.pos
    var sWid  = settings.width
    var sHei  = settings.height
    var sAuto = settings.auto

    // DOM
    var $Clone    = null
    var $elem     = this.find(settings.dom[0])
    var $subElem  = this.find(settings.dom[1])
    var $front    = $(settings._front)
    var $back     = $(settings._back)
    var $stop     = $(settings._stop)
    var $continue = $(settings._continue)

    // some timer
    var mainTimer, subTimer

    var $elem1 = $elem.first()
    var $subElem1 = $subElem.first()
    var height = $elem1.outerHeight()
    var subElemWidth = $subElem1.outerWidth()
    var subElemHeight = $subElem1.outerHeight()

    if (sDir == 'up' || sDir == 'down') {
        var step = settings.step * subElemHeight
        $elem.css({
            width: sWid + 'px',
            overflow: 'hidden'
        })
    }
    if (sDir == 'left' || sDir == 'right') {
        var width = $subElem.length * subElemWidth
        $elem.css({
            width: width + 'px',
            overflow: 'hidden'
        })
        var step = settings.step * subElemWidth
    }
    var init = function() {
        var sty = 'position:relative;overflow:hidden;z-index:1;width:' + sWid + 'px;height:' + sHei + 'px;' + settings.wrapstyle
        var wrap = '<div style="' + sty + '"></div>'
        $elem.css({
            position: 'absolute',
            left: 0,
            top: 0
        }).wrap(wrap)
        sPos.object = 0
        $Clone = $elem.clone()
        $elem.after($Clone)
        switch (sDir) {
            case 'up':
                $elem.css({
                    marginLeft: 0,
                    marginTop: 0
                });
                $Clone.css({
                    marginLeft: 0,
                    marginTop: height + 'px'
                });
                sPos.clone = height
                break;
            case 'down':
                $elem.css({
                    marginLeft: 0,
                    marginTop: 0
                });
                $Clone.css({
                    marginLeft: 0,
                    marginTop: -height + 'px'
                });
                sPos.clone = -height
                break;
            case 'left':
                $elem.css({
                    marginTop: 0,
                    marginLeft: 0
                });
                $Clone.css({
                    marginTop: 0,
                    marginLeft: width + 'px'
                });
                sPos.clone = width;
                break;
            case 'right':
                $elem.css({
                    marginTop: 0,
                    marginLeft: 0
                });
                $Clone.css({
                    marginTop: 0,
                    marginLeft: -width + 'px'
                });
                sPos.clone = -width
                break;
        }
        if (sAuto) {
            initMainTimer()
            $elem.hover(function() {
                clear(mainTimer)
            }, function() {
                initMainTimer()
            })
            $Clone.hover(function() {
                clear(mainTimer)
            }, function() {
                initMainTimer()
            })
        };
        if (callback) {
            callback()
        };
        if (settings.control) {
            initControls()
        }
    };
    var initMainTimer = function(delay) {
        clear(mainTimer)
        settings.stay = delay ? delay : settings.stay
        mainTimer = setInterval(function() {
            initSubTimer()
        }, settings.stay)
    }
    var initSubTimer = function() {
        clear(subTimer)
        subTimer = setInterval(function() {
            roll()
        }, settings.delay)
    }
    var clear = function(timer) {
        if (timer != null) {
            clearInterval(timer)
        }
    }
    var _parseInt = function(str) {
        return parseInt(str, 10)
    }
    var disControl = function(boo) {
        if (boo) {
            $front.unbind('click')
            $back.unbind('click')
            $stop.unbind('click')
            $continue.unbind('click')
        } else {
            initControls()
        }
    }
    var initControls = function() {
        $front.click(function() {
            $front.addClass(settings.disabled);
            disControl(true);
            clear(mainTimer);
            settings.convert = true;
            settings.btn = 'front';
            initSubTimer();
            if (!sAuto) {
                settings.tag = true
            }
            convert()
        })
        $back.click(function() {
            $back.addClass(settings.disabled);
            disControl(true);
            clear(mainTimer);
            settings.convert = true;
            settings.btn = 'back';
            initSubTimer();
            if (!sAuto) {
                settings.tag = true
            }
            convert()
        })
        $stop.click(function() {
            clear(mainTimer)
        })
        $continue.click(function() {
            initMainTimer()
        })
    }
    var convert = function() {
        if (settings.tag && settings.convert) {
            settings.convert = false;
            if (settings.btn == 'front') {
                if (sDir == 'down') {
                    sDir = 'up'
                };
                if (sDir == 'right') {
                    sDir = 'left'
                }
            };
            if (settings.btn == 'back') {
                if (sDir == 'up') {
                    sDir = 'down'
                };
                if (sDir == 'left') {
                    sDir = 'right'
                }
            };
            if (sAuto) {
                initMainTimer()
            } else {
                initMainTimer(4 * settings.delay)
            }
        }
    }
    var setPos = function(y1, y2, x) {
        if (x) {
            clear(subTimer);
            sPos.object = y1;
            sPos.clone = y2;
            settings.tag = true
        } else {
            settings.tag = false
        }
        if (settings.tag) {
            if (settings.convert) {
                convert()
            } else {
                if (!sAuto) {
                    clear(mainTimer)
                }
            }
        }
        if (sDir == 'up' || sDir == 'down') {
            $elem.css({
                marginTop: y1 + 'px'
            });
            $Clone.css({
                marginTop: y2 + 'px'
            })
        }
        if (sDir == 'left' || sDir == 'right') {
            $elem.css({
                marginLeft: y1 + 'px'
            });
            $Clone.css({
                marginLeft: y2 + 'px'
            })
        }
    }
    var roll = function() {
        var ul = $elem[0]
        var cl = $Clone[0]
        var ulSty = ul.style
        var clSty = cl.style
        var y_object = (sDir == 'up' || sDir == 'down') ? _parseInt(ulSty.marginTop) : _parseInt(ulSty.marginLeft)
        var y_clone = (sDir == 'up' || sDir == 'down') ? _parseInt(clSty.marginTop) : _parseInt(clSty.marginLeft)
        var y_add = Math.max(Math.abs(y_object - sPos.object), Math.abs(y_clone - sPos.clone))
        var y_ceil = Math.ceil((step - y_add) / settings.speed)
        switch (sDir) {
            case 'up':
                if (y_add == step) {
                    setPos(y_object, y_clone, true);
                    $front.removeClass(settings.disabled);
                    disControl(false)
                } else {
                    if (y_object <= -height) {
                        y_object = y_clone + height;
                        sPos.object = y_object
                    }
                    if (y_clone <= -height) {
                        y_clone = y_object + height;
                        sPos.clone = y_clone
                    }
                    setPos((y_object - y_ceil), (y_clone - y_ceil))
                };
                break;
            case 'down':
                if (y_add == step) {
                    setPos(y_object, y_clone, true);
                    $back.removeClass(settings.disabled);
                    disControl(false)
                } else {
                    if (y_object >= height) {
                        y_object = y_clone - height;
                        sPos.object = y_object
                    }
                    if (y_clone >= height) {
                        y_clone = y_object - height;
                        sPos.clone = y_clone
                    }
                    setPos((y_object + y_ceil), (y_clone + y_ceil))
                };
                break;
            case 'left':
                if (y_add == step) {
                    setPos(y_object, y_clone, true);
                    $front.removeClass(settings.disabled);
                    disControl(false)
                } else {
                    if (y_object <= -width) {
                        y_object = y_clone + width;
                        sPos.object = y_object
                    }
                    if (y_clone <= -width) {
                        y_clone = y_object + width;
                        sPos.clone = y_clone
                    }
                    setPos((y_object - y_ceil), (y_clone - y_ceil))
                };
                break;
            case 'right':
                if (y_add == step) {
                    setPos(y_object, y_clone, true);
                    $back.removeClass(settings.disabled);
                    disControl(false)
                } else {
                    if (y_object >= width) {
                        y_object = y_clone - width;
                        sPos.object = y_object
                    }
                    if (y_clone >= width) {
                        y_clone = y_object - width;
                        sPos.clone = y_clone
                    }
                    setPos((y_object + y_ceil), (y_clone + y_ceil))
                };
                break
        }
    }
    if (sDir == 'up' || sDir == 'down') {
        if (height >= sHei && height >= settings.step) {
            init()
        }
    }
    if (sDir == 'left' || sDir == 'right') {
        if (width >= sWid && width >= settings.step) {
            init()
        }
    }
}
