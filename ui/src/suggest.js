/**

*/
~function() {
    $.fn.suggest = function(option, callback) {    
        var settings = $.extend({
            source: [],
            delay: 0,
            url:'',
            errorbd:'error-bd',
            dataName:'retMessage',
            keyName:'keyWord',
            resultsClass: 'suggest_results',
            selectClass: 'suggest_over',
            onSelect: false,
            keyUpCallback:null
    }, option)

    function bootstrap($that) {
        // some alias
        var input = $that;
        var source = settings.source;
        var resultsClass = settings.resultsClass;
        var selectClass = settings.selectClass;
        var delay = settings.delay;
        var url = settings.url;
        var keyName = settings.keyName;
        var dataName = settings.dataName;
        var onSelect = settings.onSelect;
        var errorbd = settings.errorbd;
        var keyUpCallback = settings.keyUpCallback;

        var timeout = null;
        var prevLength = 0;
        var cache = {};
        var cacheSize = 0;
        var $results = $('.'+resultsClass);
        var $input = $(input).attr('autocomplete', 'off');
        var $currentResult = null;
        function delHtmlTag(str) {
            return str.replace(/<[^>]+>/g, '');
        }
        // 设置位置
        function setPosition() {
            var offset = $input.offset();
            $results.css({
                top: (offset.top + $input.outerHeight()) + 'px',
                left: offset.left + 'px'
            })
        }
        $(window).load(setPosition).resize(setPosition);
        $input.blur(function() {
            setTimeout(function() { $results.hide() }, 200)
        })
        try {
            $results.bgiframe();
        } catch(e) { }
        function showSuggest(){
            $results.show();
            setPosition();
            var q = $.trim($input.val());
            var param = {}
            param[keyName] = q
            if (url) {
                if (cache[q]) {
                    displayItems(q)
                } else {
                    $.getJSON(url, param, function(data) {
                        source = data[dataName]
                        if (source) {
                            displayItems(q)
                        }
                        cache[q] = source
                    })
                }

            } else {
                displayItems(q)    
            }
        }
        function getCityInfo(key, source) {
            var value
            $.each(source, function(i, val) {
                if (val[0] == key || val[1] == key || val[2] == key || val[3] == key) {
                    value = val;
                    return false;
                }
            })
            return value;
        }
        $input.bind('keyup',processKey)
        var reg1 = /27$|38$|40$/;
        var reg2 = /^13$|^9$/;
        function processKey(e) {
            $input.removeClass(errorbd);
            var val = $input.val();
            var keyCode = e.keyCode;
            if ((reg1.test(keyCode) && $results.is(':visible')) || (reg2.test(keyCode) && getCurrentResult())) {
                e.preventDefault()
                e.stopPropagation()
                switch(e.keyCode) {
                    case 38: // up
                        prevResult();
                        break;
                    case 40: // down
                        nextResult();
                        break;
                    case 13: // return
                        selectCurrentResult();
                        break;
                    case 27: // escape
                        $results.hide();
                        break;
                }
            } else {
                if (timeout) {
                    clearTimeout(timeout)
                }
                timeout = setTimeout(showSuggest, delay)
                prevLength = val.length;
            }
            if (keyUpCallback) {
                keyUpCallback(val)
            }
        }

        function displayItems(item) {
            var items = delHtmlTag(item)
            var html = '';
            if (url && cache[item]) {
                source = cache[item];
            }
            if (items == '') {
                $results.hide()
            } else {
                var j = 0;
                var tempCitys = [];
                if (source.constructor == Array) {
                    for (var i = 0; i < source.length; i++) {
                        var reg = new RegExp('^' + items + '.*$', 'im')
                        if (reg.test(source[i][0]) || reg.test(source[i][1]) || reg.test(source[i][2]) || reg.test(source[i][3])) {
                            if (j >= 10) break;
                            tempCitys[j] = source[i][1];
                            j++;
                        }
                    }
                    tempCitys.sort();
                }
                for (var k = 0; k < tempCitys.length; k++) {
                    var cityInfo = getCityInfo(tempCitys[k], source)
                    html += '<li rel="' + cityInfo[0] + '"><a href="#' + i + '"><span>' + cityInfo[2].toLowerCase() + '</span>' + cityInfo[1] + '</a></li>';
                }
                if (html == '') {
                    if(items.length>20){
                        suggest_tip = '<div class="suggest_result_null">请重新输入</div>';
                        $input.val('');
                        $input.removeClass(errorbd);
                    }else {
                        suggest_tip = '<div class="suggest_result_null">对不起，找不到：' + items + '</div>';
                        $input.addClass(errorbd);
                    }
                } else {
                    suggest_tip = '<div class="suggest_result_tip">' + items + '，按拼音排序</div>';
                    $input.removeClass('error-bd');
                }
                html = suggest_tip + '<ul>' + html + '</ul>';
            }
            $results.html(html).show().css({
                width: $input.outerWidth()*2-50+'px'
            })
            $results.children('ul').children('li:first-child').addClass(selectClass)
            $results.children('ul').children('li').mouseover(function() {
                $results.children('ul').children('li').removeClass(selectClass)
                $(this).addClass(selectClass)
            }).click(function(e) {
                e.preventDefault()
                e.stopPropagation()
                selectCurrentResult()
            })
            if (items == '') {
               $results.hide()
            }
        }
        function getCurrentResult() {
            if (!$results.is(':visible')) return false;
            $currentResult = $results.find('li.' + selectClass);
            if (!$currentResult.length) {
                $currentResult = false
            }
            return $currentResult
        }
        function selectCurrentResult() {
            $currentResult = getCurrentResult()
            if ($currentResult) {
                $input.val($currentResult.find('a').html().replace(/<span>.+?<\/span>/i, ''))
                $results.hide()
                if (onSelect) {
                    onSelect.call($input, $input.val(), $currentResult)
                }
            }
        }
        function nextResult() {
            $currentResult = getCurrentResult();
            if ($currentResult) {
                $currentResult.removeClass(selectClass).next().addClass(selectClass);
            } else {
                $results.find('li:first-child').addClass(selectClass)
            }
        }
        function prevResult() {
            $currentResult = getCurrentResult()
            if ($currentResult) {
                $currentResult.removeClass(selectClass).prev().addClass(selectClass);
            } else {
                $results.find('li:last-child').addClass(selectClass);
            }
        }
    }
    // 实例化每个对象
    return this.each(function() {
        var $elem = $(this)
        bootstrap($elem)
        if ($.isFunction(callback)) callback($elem)
    })
}
/*
 * 
 * 格式：data-ui="u-suggest|dujiaAllCity|API"
 * 示例：data-ui="u-suggest|dujiaAllCity|a.json"
 *  
 */
$(function() {
    if($('[data-ui^="u-suggest"]')){
        $('<div class="suggest_results"></div>').appendTo('body');
    }
    $('[data-ui^="u-suggest"]').each(function() {
        var $elem = $(this);
        var arr = $.uiParse($elem.attr('data-ui'))
        var cityInfo = arr[0];
        var api = arr[1];
        if(api){
            $elem.suggest({
                url:api
            })
        }else {
            if (window.dataObj && window.dataObj[cityInfo]) {
                $elem.suggest({
                    source: window.dataObj[cityInfo],
                    keyUpCallback:function(val){
                    },
                    onSelect:function(val){
                    }
                })
            }
        }
    })
})

}();