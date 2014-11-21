(function (a, c) {
    var b = a.NTES || {};
    if (!b.ui) {
        b.ui = {}
    }
    var d = {forward: function (f) {
        var e = this, g = Math.abs(e._bPos) - f;
        e._setPos(g);
        g == 0 && e.stop()
    }, backward: function (f) {
        var e = this, g = e._bPos + f;
        g = g < e._bRange ? g : e._bRange;
        e._setPos(g);
        g == e._bRange && e.stop()
    }};
    b.ui.ScrollCarousel = function (e, i, j, g) {
        if (!arguments.length) {
            return
        }
        var h = this;
        h.constructor = arguments.callee;
        h._axis = i == "y" ? "y" : "x";
        h._fix = h._axis == "x" ? {pos: "left", offsetSize: "offsetWidth", pageAxis: "pageX", offsetPos: "left", scrollPos: "scrollLeft"} : {pos: "top", offsetSize: "offsetHeight", pageAxis: "pageY", offsetPos: "offsetTop", scrollPos: "scrollTop"};
        h.fps = g && Math.ceil(g.fps / 50) || 13;
        h.fps = h.fps < 13 ? 13 : h.fps;
        h.lpf = 10;
        h.speed = 40;
        if (b.browser.msie) {
            h.speed = 20
        }
        h._body = e;
        h._bCnt = e.parentNode;
        h._bRange = Math.max(0, h._body[h._fix.offsetSize] - h._bCnt[h._fix.offsetSize]);
        h._bPos = h._body.offsetLeft;
        b(h._bCnt).addCss("overflow:hidden");
        if (j !== c) {
            h._handle = j;
            h._hCnt = j.parentNode;
            h._hPos = 0;
            h._hRange = Math.max(0, h._hCnt[h._fix.offsetSize] - h._handle[h._fix.offsetSize]);
            h.bhRate = h._hRange ? h._bRange / h._hRange : 0;
            var f = new b.ui.Mouse(h._handle);
            f.mouseStart = h._mouseStart.bind(h);
            f.mouseDrag = h._mouseDrag.bind(h);
            f.mouseStop = h._mouseStop.bind(h);
            b(h._hCnt).addEvent("click", h._mouseClick.bind(h))
        }
    };
    b.ui.ScrollCarousel.prototype = {start: function (e, g) {
        var f = this;
        if (f._timer == c) {
            e = e == "forward" ? "forward" : "backward";
            f._move = d[e];
            var h = {length: isNaN(g) ? -1 : parseInt(g)};
            f._timer = setInterval(f._scroll.bind(f, h), f.fps);
            f.onStart && f.onStart()
        }
    }, stop: function () {
        var e = this;
        if (e._timer !== c) {
            clearTimeout(e._timer);
            e._timer = c;
            e.onStop && e.onStop()
        }
        return this
    }, scrollTo: function (f) {
        var e = this, g = f;
        g < 0 ? e.stop().start("forward", -1 * g) : e.stop().start("backward", g)
    }, _scroll: function (g) {
        var e = this, f = e.lpf;
        if (g.length !== 0) {
            if (g.length > 0) {
                f = Math.min(e.lpf * Math.ceil(g.length / e.speed), g.length);
                g.length -= f
            }
            e._move(f)
        } else {
            e.stop()
        }
    }, _setPos: function (f) {
        var e = this;
        e._bPos = f;
        e._body.style.left = -e._bPos + "px";
        if (e._handle) {
            e._hPos = e.bhRate ? f / e.bhRate : 0;
            e._handle.addCss(e._fix.pos + ":" + e._hPos + "px")
        }
    }, _mouseStart: function (f) {
        var e = this;
        e._diffPos = f[e._fix.pageAxis] - e._handle[e._fix.offsetPos];
        return true
    }, _mouseDrag: function (f) {
        var e = this, g = Math.max(0, Math.min(f[e._fix.pageAxis] - e._diffPos, e._hRange));
        e._setPos(g * e.bhRate);
        return false
    }, _mouseStop: function (e) {
        return false
    }, _mouseClick: function (h) {
        var f = this, e = f._hCnt, g = e[f._fix.offsetPos];
        while (e.offsetParent) {
            e = e.offsetParent;
            g += e[f._fix.offsetPos]
        }
        f.scrollTo((h[f._fix.pageAxis] - f._handle[f._fix.offsetSize] / 2 - g) * f.bhRate)
    }};
    b.ui.Carousel = function (f, j, i, g) {
        var h = this;
        h.ctrls = f, h.cons = j, h.css = i, h.defaults = {auto: false, interval: 2000, duration: 5000, pause: "mouseover", goOn: "mouseout", event: "mouseover", onSwitch: function () {
        }, width: 310}, h.options = b.util.extend(h.defaults, g), h.event = h.options.event || h.defaults.event, h.btn = {}, h.scrol = [], h.step, h.btn.prev = h.options.prev, h.btn.next = h.options.next, h.current = null;
        if (arguments.length < 3) {
            return
        }
        h.wrap = h.options.wrap || h.cons[0].parentNode, h.activeMap = {prev: function (l) {
            var e = l.previousSibling;
            for (; e; e = e.previousSibling) {
                if (e.nodeType === 1 && e !== l) {
                    return e
                }
            }
        }, next: function (l) {
            var e = l.nextSibling;
            for (; e; e = e.nextSibling) {
                if (e.nodeType === 1 && e !== l) {
                    return e
                }
            }
        }};
        h.consMap = {first: function (e) {
            return e[0]
        }, last: function (e) {
            return e[e.length - 1]
        }};
        h.stepMap = {x: function (e) {
            return e.offsetWidth
        }, y: function (e) {
            return e.offsetHeight
        }};
        h.step = h.stepMap.x(h.cons[0]);
        h.step = h.step || h.options.width;
        if (!h.current) {
            h.cons.each(function (e) {
                if (this.className.indexOf(h.css) > -1) {
                    h.current = e
                }
            });
            if (h.current === null) {
                h.current = 0;
                b(h.cons.get(0)).addCss(h.css)
            }
            h.options.onSwitch && h.options.onSwitch(h.current + 1, h.cons.length)
        }
        if (h.options.auto) {
            try {
                b(h.wrap).addEvent(h.options.goOn, h.cycle.bind(h));
                b(h.wrap).addEvent(h.options.pause, h.pause.bind(h))
            } catch (k) {
            }
        }
        if (h.ctrls && h.ctrls[h.current]) {
            b(h.ctrls[h.current]).addCss(h.css);
            h.ctrls.each(function (e) {
                b(h.ctrls[e]).addEvent(h.event, function () {
                    h.to(e)
                })
            })
        }
        if (h.btn.prev) {
            if (h.event != "click") {
                h.btn.prev.addEvent("click", function (e) {
                    h.prev();
                    return false
                })
            }
            h.btn.prev.addEvent(h.event, h.prev.bind(h))
        }
        if (h.btn.next) {
            if (h.event != "click") {
                h.btn.next.addEvent("click", function (e) {
                    h.next();
                    return false
                })
            }
            h.btn.next.addEvent(h.event, h.next.bind(h))
        }
        h.total = h.cons.length;
        h.cycle()
    };
    b.ui.Carousel.prototype = {getStyle: function (e, f) {
        var g = "";
        if (document.defaultView && document.defaultView.getComputedStyle) {
            g = document.defaultView.getComputedStyle(e, "").getPropertyValue(f)
        } else {
            if (e.currentStyle) {
                f = f.replace(/\-(\w)/g, function (h, i) {
                    return i.toUpperCase()
                });
                g = e.currentStyle[f]
            }
        }
        return g
    }, cycle: function (g) {
        var f = this;
        f.paused = false;
        if (f.options.auto) {
            f.interval = setInterval(function () {
                f.next()
            }, f.options.interval)
        }
        return this
    }, to: function (g) {
        var f = this, e = f.cons[f.current] || f.cons[0];
        if (g > f.cons.length - 1 || g < 0) {
            return
        }
        if (f.current == g) {
            return f.pause().cycle()
        }
        return f.slide(g > f.current ? "next" : "prev", f.cons[g])
    }, pause: function (g) {
        var f = this;
        f.paused = true;
        clearInterval(f.interval);
        f.interval = null;
        return f
    }, next: function (f) {
        var e = this;
        f && f.preventDefault();
        if (e.sliding) {
            return
        }
        return e.slide("next")
    }, prev: function (f) {
        var e = this;
        f && f.preventDefault();
        if (e.sliding) {
            return false
        }
        return e.slide("prev")
    }, slide: function (k, f) {
        var n = this, m, h, e, i = n.interval, l = k == "next" ? "left" : "right", g = k == "next" ? "first" : "last", j = n.options.onSwitch;
        m = n.cons[n.current] || n.cons[0];
        e = f || n.activeMap[k](m);
        e = e || n.consMap[g](n.cons);
        this.sliding = true;
        i && n.pause();
        if (e.className.indexOf(n.css) > -1) {
            return
        }
        if (n.step == 0 || n.step == null) {
            n.step = n.stepMap.x(m);
            if (n.step == 0 || n.step == null) {
                throw"carsousel slide get a wrong step"
            }
        }
        if (l == "left") {
            b(m.parentNode).addCss("position:relative;width:" + n.step * 2 + "px;overflow:hidden;zoom:1;position:relative;left:0px;height:" + n.stepMap.y(m) + "px;");
            b(m.parentNode.parentNode).addCss("position:relative;overflow:hidden;zoom:1;width:" + n.step + "px;");
            b(e).addCss("position:absolute;top:0px;left:" + n.step + "px;zoom:1;display:block");
            b(m).addCss("position:absolute;top:0px;left:0;display:block;zoom:1;")
        } else {
            b(m.parentNode).addCss("position:relative;width:" + n.step * 2 + "px;overflow:hidden;zoom:1;position:relative;left:-" + n.step + "px;height:" + n.stepMap.y(m) + "px;");
            b(m.parentNode.parentNode).addCss("position:relative;overflow:hidden;zoom:1;width:" + n.step + "px;");
            b(e).addCss("position:absolute;top:0px;left:0px;zoom:1;display:block");
            b(m).addCss("position:absolute;top:0px;left:" + n.step + "px;display:block;zoom:1;")
        }
        n.s = new NTES.ui.ScrollCarousel(m.parentNode, "x", c, {fps: n.options.duration});
        n.cons.each(function (o) {
            if (n.cons[o] == e) {
                n.nextIndex = o
            }
        });
        if (n.ctrls && n.ctrls[n.current]) {
            b(n.ctrls[n.current]).removeCss(n.css);
            n.ctrls[n.nextIndex] && b(n.ctrls[n.nextIndex]).addCss(n.css)
        }
        n.s.onStart = function () {
            n.sliding = true
        };
        n.s.onStop = function () {
            if (l == "left") {
                m.removeCss(n.css);
                m.removeCss("position:absolute;top:0px;left:0;display:block;");
                b(e).removeCss("left:" + n.step + "px;");
                b(m.parentNode).removeCss("width:" + n.step * 2 + "px;left:-" + n.step + "px;");
                e.addCss(n.css);
                n.sliding = false
            } else {
                m.removeCss(n.css);
                e.addCss(n.css);
                b(e.parentNode).removeCss("position:relative;width:" + n.step * 2 + "px;overflow:hidden;left:0px;");
                b(e).removeCss("position:absolute;top:0px;left:0px;zoom:1;display:block");
                b(m).removeCss("position:absolute;top:0px;left:" + n.step + "px;display:block;zoom:1;");
                n.sliding = false
            }
        };
        n.current = n.nextIndex;
        i && n.cycle();
        if (j) {
            j(n.current + 1, n.cons.length)
        }
        switch (l) {
            case"left":
                n.s.scrollTo(n.step);
                break;
            case"right":
                n.s.scrollTo(-n.step);
                break
        }
        return n
    }}
})(window);