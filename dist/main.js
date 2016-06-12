// 写法1 简易写法
$.fn.plugin = function() {
    // ...
};

// 写法2 批量添加插件
$.fn.extend({
    plugin1: function() {
        // ...
    },
    plugin2: function() {
        // ...
    }
});

// 写法3 复杂的，代码量大的 jQuery 插件写法，使用一个匿名函数封装
(function($) {
    // some helper function
    ...

    // plugin goes here
    $.fn.plugin = function() {
        // ...
    }

})(jQuery);




/*
 * tooltip
 *
 * **参数**
 *  location  位置，取值 top、right、bottom、left、auto
 *  bgColor   背景色
 *
 */
(function($) {
    
    // some method
    var methods = {
        init: function() {
            // ...
        },
        show: function() {
            // ...
        },
        hide: function() {
            // ...
        }
    };

    // define plugin
    $.fn.tooltip = function(option) {

        // 创建一些默认值，拓展任何被提供的选项
        var setting = $.extend({
            'location' : 'top',
            'bgColor' : 'blue'
        }, option);

        return this.each(function() {
            if (methods[option]) {
                return methods[option].apply(this, Array.prototype.slice.call(arguments, 1));
            } else {
                return methods.init.apply(this, arguments);
            }
        });
    };

})(jQuery);


// 初始化插件，默认调用 init 方法
$('div').tooltip({
    foo: 'bar'
});

// 调用插件 tooltip的 hide 方法，参数务必是字符串
$('div').tooltip('hide');