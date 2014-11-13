/**
 * 模态弹框
 *
 */
$.dialog = function(option, callback) {
    var settings = $.extend({
        type: 'html',
        source: null,
        width: null,
        height: null,
        title: null,
        loadingCls: 'thickloading',
        fastClose: false,
        countdown: false
    }, option)

    // some alias
    var width  = settings.width
    var height = settings.height
    var loadingCls = settings.loadingCls

    var timer
    var $win  = $(window)
    var $body = $('body')

    var $maskDiv    = $('<div class="thickdiv"></div>')
    var $maskIframe = $('<iframe class="thickframe" marginwidth="0" marginheight="0" frameborder="0" scrolling="no"></iframe>')
    var $thickBox   = $('<div class="thickbox"><div class="thickwrap"><div class="thicktitle"><span></span></div><div class="thickcon"></div><a href="#none" class="thickclose">x</a></div></div>')
    var $thickWrap  = $thickBox.find('.thickwrap')
    var $thickCon   = $thickWrap.find('.thickcon')
    var $thickTit   = $thickWrap.find('.thicktitle')

    function init() {
        // 弹框标题
        $thickTit.find('span').text(settings.title)
        // 弹框内容
        $thickCon.css({
            width: width,
            height: height
        })
        $thickCon.addClass(loadingCls)

        // 遮罩、弹框添加到body
        $body.append($maskIframe)
        $body.append($maskDiv)
        $body.append($thickBox)

        // 位置居中
        setPos()
        // 渲染弹框内容
        renderContent()

        // 关闭按钮
        $thickBox.find('.thickclose').one('click', function() {
            close()
            $thickBox.trigger('close')
            return false
        })
        // 窗口resize和scroll时调整位置
        $win.bind('resize.dialog', setPos)
            // .bind('scroll.dialog', setPos)

        // 弹出后倒计时几秒自动关闭
        if (settings.countdown) initCountdown()
        // 点击任何非弹框区域快速关闭
        if (settings.fastClose) {
            $body.bind('click.dialog', function(e) {
                var tag = e.target
                if (tag.className == 'thickdiv') {
                    $body.unbind('click.dialog')
                    close()
                }
            })
        }
    }
    function initCountdown() {
        var count = settings.countdown
        $('<div class="thickcountdown"><span class="countdown">' + count + '</span>秒后自动关闭</div>').appendTo($thickWrap)
        timer = setInterval(function() {
            count--
            $thickBox.find('.countdown').html(count)
            if (count == 0) {
                count = settings.countdown
                close()
            }
        }, 3000)
    }
    function setPos() {
        $thickBox.center()
    }    
    function close() {
        clearInterval(timer)
        $maskIframe.add($maskDiv).remove()
        $thickBox.remove()
        $win.unbind('resize.dialog').unbind('scroll.dialog')
    }
    function renderContent() {
        switch (settings.type) {
        default:
        case 'text':
            $thickCon.text(settings.source)
            $thickCon.removeClass(loadingCls)
            if (callback) {
                callback()
            }
            break
        case 'html':
            $thickCon.html(settings.source)
            $thickCon.removeClass(loadingCls)
            if (callback) {
                callback()
            }
            break
        case 'ajax':
        case 'json':
            if (callback) {
                callback(settings.source, $thickCon, function() {
                    $thickCon.removeClass(loadingCls)
                })
            }
            break
        case 'iframe':
            $('<iframe src="' + settings.source + '" marginwidth="0" marginheight="0" frameborder="0" scrolling="no" style="width:' + width + 'px;height:' + height + 'px;border:0;"></iframe>').appendTo('.thickcon')
            $thickCon.removeClass(loadingCls)
            if (callback) {
                callback()
            }
            break
        }
    }

    init()
    $thickBox.data('close', close)
    return $thickBox
};

