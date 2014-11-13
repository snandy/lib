/*
    $.login
*/

~function() {

var domain = location.hostname
if (window.pageConfig && pageConfig.FN_getDomain) {
    domain = pageConfig.FN_getDomain()    
}


/*
    jdModelCallCenter#20110126
*/
window.jdModelCallCenter = {
    settings: {
        clstag1: 0,
        clstag2: 0
    },
    tbClose: function() {
        var $dialog = $('.thickbox')
        if ($dialog.length != 0) {
            var fn = $dialog.data('close')
            fn()
        }
    },
    login: function() {
        this.tbClose()
        var settings = this.settings
        var userAgent = navigator.userAgent.toLowerCase()
        var flag = (userAgent.match(/ucweb/i) == 'ucweb' || userAgent.match(/rv:1.2.3.4/i) == 'rv:1.2.3.4')
        if (flag) {
            location.href = 'https://passport.'+ domain +'/new/login.aspx?ReturnUrl=' + escape(location.href)
            return
        }
        setTimeout(function() {
            $.dialog({
                type: 'iframe',
                title: '您尚未登录',
                source: 'http://passport.jd.com/uc/popupLogin2013?clstag1=' + settings.clstag1 + '&clstag2=' + settings.clstag2 + '&r=' + Math.random(),
                width: 390,
                height: 450
            })
        }, 20)
    },
    regist: function() {
        this.tbClose()
        var settings = this.settings
        setTimeout(function() {
            $.dialog({
                type: 'iframe',
                title: '您尚未登录',
                source: 'http://reg.jd.com/reg/popupPerson?clstag1=' + settings.clstag1 + '&clstag2=' + settings.clstag2 + '&r=' + Math.random(),
                width: 390,
                height: 450
            })
        }, 20)
    },
    init: function() {
        var self = this
        var url = location.protocol + '//passport.'+ domain +'/new/helloService.ashx?m=ls&sso=0'
        $.ajax({
            url: url,
            dataType:'jsonp',
            success: function(json) {
                self.tbClose()
                if (json && json.info) {
                    $('#loginbar').html(json.info)
                }
                self.settings.fn()
            }
        })
    }
}

/*
 * 判断是否登录函数，异步方式
 */
$.isLogin = function(is, not) {
   $.getJSON('http://passport.jd.com/loginservice.aspx?method=Login&callback=?', function(r) {
        var identity = r.Identity
        var isAuthenticated = identity.IsAuthenticated
        if ( isAuthenticated ) {
            is(r)
        } else {
            not(r)
        }
    })
}

/*
 * 会员登录函数
 * @param {Object} 
 */
$.login = function(option) {
    option = $.extend({}, option)
    var callback = option.callback
    var fn = callback || function() {
        location.reload(true)
    }
    jdModelCallCenter.settings = {
        clstag1 : 'login|keycount|5|5',
        clstag2 : 'login|keycount|5|6',        
        fn: fn
    }
    $.isLogin(function() {
        try {
            console.log('已经登录')
        } catch(e) {
        }
    }, function() {
        jdModelCallCenter.login()
    })
}

/*
 * $.login
 */
// $.login = function(options) {
//     options = $.extend({
//         loginService: 'http://passport.'+ domain +'/loginservice.aspx?callback=?',
//         loginMethod: 'Login',
//         loginUrl: 'https://passport.'+ domain +'/new/login.aspx',
//         returnUrl: location.href,
//         automatic: true,
//         complete: null,
//         modal: false
//     }, options)
//     $.getJSON(options.loginService, {
//         method: options.loginMethod
//     }, function(r) {
//         if (r != null) {
//             if (options.complete != null) {
//                 options.complete(r.Identity)
//             }
//             if (!r.Identity.IsAuthenticated && options.automatic && options.loginUrl != '') {
//                 if (options.modal) {
//                     jdModelCallCenter.login()
//                 } else {
//                     location.href = options.loginUrl + '?ReturnUrl=' + escape(options.returnUrl)
//                 }
//             }
//         }
//     })
// }

/*
    autoLocation#20110411
*/
// $.extend(jdModelCallCenter, {
//     autoLocation: function(url) {
//         $.login({
//             modal: true,
//             complete: function(r) {
//                 if (r != null && r.IsAuthenticated != null && r.IsAuthenticated) {
//                     window.location = url
//                 }
//             }
//         })
//     }
// })


}();