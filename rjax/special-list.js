/**
 * Rjax.js 移动端 Ajax 后退处理组件
 * 
 * ***起因***
 * 移动端由于屏幕小，首屏展示的列表有限，往往只展示第一屏数据，当向下滑动到达指定位置时加载第二屏数据，依次类推。这种交互体验也称 “瀑布流”。
 * 当然，该组件适用于任何想点击后退返回的操作，只需要配置几个参数。
 *
 * ***问题***
 * 上述“瀑布流”特性，一般会使用 Ajax 请求后台数据，然后更新页面。在这种情况下浏览器是不会产生历史的，当点击 “后退” 按钮后就不能正确的返回
 * 前一次浏览的位置。
 *
 * ***解决***
 * 1. 首先需要记录历史，移动端可以使用最新 H5 技术：history.replaceState，这样点击 “后退” 按钮就会回到上一次的 URL。
 * 2. 存储 Ajax 请求的数据，当回退后需将数据重新回填到页面。移动端可以使用最新的H5技术：localStorage。
 *
 * ***使用***
 *
 * Rjax.init(option)
 *   delayTime  {number}   延迟滚动到指定位置的时间，默认 500 毫秒。这个参数是确保 DOM 都插入后才滚动
 *   renders    {array}    存放对象，每一个对象上数据和渲染该数据的函数
 *   resetParam {function} 可选，Rjax 会把最后一次 Ajax 请求参数保存下来，如果定义了该函数，保存的参数会传给它
 *
 * Rjax.storage(data, fnName, query)
 *   data   {string} 保存 ajax 的结果数据，可以是html片段，或是 JSON 串
 *   fnName {string} 函数名，Rjax会使用该函数回填 html
 *   query  {string} 保留最后一次查询的字符串，如果有必要
 *
 */
var Rjax = function() {

    // URL 对象
    var urlObj = parseURL(location.href);

    // 存储的 key 前缀，需要保证唯一，以该页面 url 的 host+path
    // 如 http://mpaimai.jd.com/album/2647?ipage=1&sTop=0，prefix 为 mpaimai.jd.com/album/2647
    var prefix = urlObj.protocol + '://' + urlObj.host + urlObj.path;

    // 从 1 开始，默认页面直接打出第 1 页的数据
    var ipage = 1;
    
    // 保存的 Ajax 最大条数，默认 50
    var maximum = 50;

    // 缓存 keys
    var preKey = prefix + '&ipage';

    // URL 匹配相关
    var rePage = /ipage=\d{1,3}/g;
    var reItop = /itop=\d+/g;
    var spliter = '~!~';

    /* 
     * 解析URL，返回其各个部分
     */
    function parseURL(url) {
        var a =  document.createElement('a');
        a.href = url;
        return {
            source: url,
            protocol: a.protocol.replace(':', ''),
            host: a.hostname,
            port: a.port,
            query: a.search,
            params: (function() {
                var s, ret = {};
                var seg = a.search.replace(/^\?/, '').split('&');
                var len = seg.length;
                for (var i = 0; i < len; i++) {
                    if (!seg[i]) continue;
                    s = seg[i].split('=');
                    ret[s[0]] = s[1];
                }
                return ret;
            })(),
            file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
            hash: a.hash.replace('#', ''),
            path: a.pathname.replace(/^([^\/])/, '/$1'),
            relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
            segments: a.pathname.replace(/^\//, '').split('/')
        }
    }

    /* 
     * 把一个哈希对象转成查询参数字符串，如 {a:1, b:2} -> "a=1&b=2"
     */    
    function toQueryString(hash) {
        var arr = [];
        for (var k in hash) {
            arr.push( k + '=' + encodeURIComponent(hash[k]) );
        }
        return arr.join('&');
    }

    /* 
     * 把一个哈希对象转成查询参数字符串，如 {a:1, b:2} -> "a=1&b=2"
     */
    function toParam(str) {
        var obj = {};
        var arr = str.split('&');
        arr.forEach(function(s) {
            var ar = s.split('=');
            obj[ar[0]] = ar[1];
        })
        return obj;
    }

    /* 
     * Empty function
     */  
    function noop() {}

    /*
     * 清除上一次的存储，这里暂定最大条数是 50，后续可以考虑将数量改为可配置
     * 不能使用 localStorage.clear ，这样会把非该页面使用的存储也删除，造成误伤
     */
    function removeStorage() {
        var item = null;
        // 清除 Ajax 列表
        for (var i = 1; i <= maximum; i++) {
            var key = preKey + i;
            item = localStorage.getItem(key);
            if (item) {
                localStorage.removeItem(key);
            }
        }
        // 清除参数
        localStorage.removeItem(prefix);
    }

    /*
     * 重置 url，会把参数 ipage，itop 添加到 url中，如果 url 里不含这两个参数的情况下
     * 默认第一页，会重置为 ipage=1&itop=0
     * 注意：移动端很少用到锚点，暂时不考虑 URL 里 "#" 的情况
     */
    function initStatus() {
        var href = prefix;
        var params = urlObj.params;
        var query = toQueryString(params);
        var defPair = 'ipage=1&itop=0';

        removeStorage();

        if (query) {
            href = prefix + '?' + query + '&' + defPair;
        } else {
            href = href + '?' + defPair;
        }
        history.replaceState('', document.title, href);
    }

    var destObj = {
        operater: {},
        isRendering: false,
        init: function(opt) {
            opt = (opt || {});
            
            var delayTime = opt.delayTime || 500;
            var renders = opt.renders || [];
            var resetParam = opt.resetParam;
            var urlObj = parseURL(location.href);
            var urlParams = urlObj.params || {};

            // 配置存储的 Ajax 最大条数，默认为 50
            if (opt.maximum) {
                maximum = opt.maximum
            }

            // 初始化状态
            if (!urlParams.ipage) {
                initStatus();
            }

            // 注册渲染函数
            renders.forEach(function(obj) {
                destObj.register(obj.name, obj.func)
            });

            // 重置参数
            var queryStr = localStorage[prefix];
            if (typeof resetParam === 'function' && queryStr) {
                var obj = toParam(queryStr)
                resetParam(obj)
            }

            // 如果 ipage > 1 , 表示需要从缓存里取
            if (urlParams && urlParams.ipage > 1) {
                var curPage = urlParams.ipage;
                var arrHtml = [];
                for (var p = 2; p <= curPage; p++) {
                    var key = preKey + p;
                    var str = localStorage[key];
                    var arr = str.split(spliter);
                    var name = arr[0];
                    var data = arr[1];
                    var func = destObj.operater[name];
                    if (typeof func === 'function') {
                        func(data);
                    }
                }

                // 初始值修改为 url 里取的，转整数
                ipage = curPage - 0;

                // 延迟一下滚动到指定位置
                setTimeout(function() {
                    var top = urlParams.itop;
                    window.scrollTo(0, top);
                    destObj.isRendering = false;
                }, delayTime);

                destObj.isRendering = true;
            }

            // 更新 itop
            window.addEventListener('scroll', function() {
                var top = window.scrollTop || window.pageYOffset;
                var url = location.href.replace(reItop, 'itop='+top);
                history.replaceState('', document.title, url);
            }, false);
        },
        storage: function(data, fnName, query) {
            ipage++;
            // 改变 URL
            var href = location.href.replace(rePage, 'ipage=' + ipage);
            history.replaceState('', document.title, href);
            localStorage[preKey + ipage] = fnName + spliter + data;
            // 存储查询参数，某些场景可能会用到
            if (query) {
                localStorage[prefix] = query;
            }
        },
        isFetched: function(num) {
            var obj = localStorage[preKey + num];
            return !!obj;
        },
        isFetchFromLocal: function() {
            var urlObj = parseURL(location.href);
            if (urlObj.params && urlObj.params.ipage > 1) {
                return true;
            }
            return false;
        },
        register: function(fnName, fn) {
            destObj.operater[fnName] = fn;
        },
        toQueryString: toQueryString
    };

    return destObj;
}();


(function(){
    
    var URL = 'http://paimai.jd.com/';
    var albumIdStr = $('#special-wrapper').attr("albumId");
    var albumId = $('#special-wrapper').attr("albumId");
    var endTime = $('#special-wrapper').attr("endTime");
    var jieshuDate = "</b>"
    	+ endTime.substring(5, 7)+ "</b>月<b>"
    	+ endTime.substring(8, 10)+ "</b>日 <b>"
    	+ endTime.substring(11, 13)+ ":"
    	+ endTime.substring(14, 16)+ "</b> 结束";
    var mode = 0;
    var page = 1;
    var imgTop = 0; //倒计时位置
    var isFetching = false;

    // 通用DOM
    var $win = $(window);
    var $wrapper = $('.wrapper');

    init();
    Rjax.init({
        renders: [{name: 'render', func: render}],
        resetParam: resetParam
    });

    function render(html) {
        var $ul = $('#thelist');
        $ul.append(html);
    }

    function loadImage(url,callback) {    
        var img = new Image();  
        img.onload = function() {  
            img.onload = null;  
            callback(img);  
        }
        if (url) {
            img.src = url;
        }
    }

    /*iscrll.js分页调用*/
    var myScroll;
    var pullUpEl;
    var pullUpOffset;
    var generatedCount = 0;

    function resetParam(obj) {
        page = obj.pageStr - 0;
    }

    window.addEventListener('scroll', function() {
        loadImage($('.special-product .p-img img').attr('src'), function() {
            var $img = $('.special-product .p-img img'),
                imgTop = $img.height();
                if($win.scrollTop() >= imgTop){
                    $('.special-product .p-extra .p-time').addClass('p-time-fixed');
                } else {
                    $('.special-product .p-extra .p-time').removeClass('p-time-fixed');
                }
        });

        if ($win.scrollTop() + $win.height() >= ($wrapper.offset().height - 300)) {
            if (!isFetching) {
                fetchPageList(++page);
            }
        }
    }, false);

    // 刷新专场状态及出价次数
    // http://mpaimai.jd.com/json/current/queryCurAlbumInfo?albumIdStr= 
    function refreshShowState() {
        var url = 'http://mpaimai.jd.com/json/current/queryCurAlbumInfo';
        var album = {
            albumIdStr: albumIdStr,
            from: 'mobileAlbumFont'
        };

        $.ajax({
            url: url,
            data: album,
            dataType: 'jsonp',
            success: function(rs){
                rs = rs[0];
                mode = rs.auctionStatus;
                switch (rs.auctionStatus) {
                    case 0:
                        var $pTag=$('.special-product .p-state');
                        // 拍卖状态
                        $pTag[0].className = 'p-state p-state2';
                        $pTag.html('即将开始');
                        // 围观人数
                        var $num=$('.special-product .p-detail .p-number');
                        $num.html('<span class="f-red">' + $num.find(".f-red").eq(0).html() + '</span>件拍品<b></b><span class="f-red">' + rs.access + '</span>人围观');
                        break;
                    case 1:
                        var $pTag=$('.special-product .p-state');

                        $pTag[0].className = 'p-state p-state1';
                        $pTag.html('正在进行');
                        // 出价人数
                        var $num=$('.special-product .p-detail .p-number');
                        $num.html('<span class="f-red">' + $num.find(".f-red").eq(0).html() + '</span>件拍品<b></b><span class="f-red">' + rs.bidCount + '</span>人出价');
                        break;
                    case 2:
                        var $pTag=$('.special-product .p-state');
                        $pTag[0].className = 'p-state p-state3';
                        $pTag.html('本场已结束');
                        // 出价人数
                        var $num=$('.special-product .p-detail .p-number');
                        $num.html('<span class="f-red">' + $num.find(".f-red").eq(0).html() + '</span>件拍品<b></b><span class="f-red">' + rs.bidCount + '</span>人出价');
                        break;
                }
             // 更新获取专场剩余时间
                switch (rs.auctionStatus) {
                case 0:
                    var $pTime=$('.special-product .p-time');
                    // 拍卖状态
//                    $pTime.html('距离开始仅剩：<span></span>');
                    $pTime.html('距离开始仅剩：<span>'+ $pTime.find('span').html() +'</span>');
                    $pTime.find('span').countdown({
                        diff : rs.remainTime,
                        end :function(){
                            fetchShowState();
                        }
                    });
                    break;
                case 1:
                    var $pTime=$('.special-product .p-time');
                    $pTime.html('距离结束：<span>'+ $pTime.find('span').html() +'</span>');
                    $pTime.find('span').countdown({
                        diff : rs.remainTime,
                        end :function(){
                            fetchShowState();
                        }
                    });
                    break;
                case 2:
                    var $pTime=$('.special-product .p-time');
                    $pTime.html('<span>'+jieshuDate+'</span>');
                    break;

            }
                refreshPageList();
            }
        });
     
    }


    function creatListTpl(id,src,title,state,count,price) {
        var url = 'http://mpaimai.jd.com/';
        var imgUrl = 'http://img12.360buyimg.com/n1/';
        var tpl = '<li k="'+ id +'">'
                +   '<div class="p-img"><img src="' + (imgUrl+src) + '" alt="'+ title +'"></div>'
                +   '<div class="p-detail">'
                +        '<div class="p-name">' + title + '</div>'
                +        '<div class="p-price">￥'+ price +'</div>'
                +        '<div class="p-extra"><div class="fl"><span class="f-red">'+ count +'</span>'+ state +'</div></div>'
                +    '</div>'
                +    '<a href="'+ (url+id) +'" class="p-link" title="'+ title +'"></a>'
                +'</li>';
        return tpl;
    }

    function appendLI(rs) {
        var $ul = $('#thelist');
        var tpl = '';
        for (var i = 0, len = rs.length; i < len; i++) {
            var item = rs[i];
            var state = '';
            var count = 0;
            if (mode == 0) {
                tpl += creatListTpl(item.id,item.productImage,item.title,'人围观','0',item.currentPrice);
            } else {
                tpl += creatListTpl(item.id,item.productImage,item.title,'人出价',item.bidCount,item.currentPrice);
            }
        }
        $ul.append(tpl);
        return tpl;
    }

    function showFooter() {
        $('#pullUp .pullUpIcon').hide();
        $('footer').show();
    } 

    // 获取专场列表某一页(增加一页)
    // http://mpaimai.jd.com/json/productList?albumIdStr=150&pageStr=1&callback=test
    function fetchPageList(n) {
        var url = 'http://mpaimai.jd.com/json/productList';
        var album = {
            albumIdStr: albumIdStr,
            pageStr: n
        };
        isFetching = true;
        $.ajax({
            url: url,
            data: album,
            dataType: 'jsonp',
            jsonpCallback: 'test',
            success: function(rs) {
                isFetching = false;
                if (rs == null) {
                    return showFooter();
                }
                var tpl = appendLI(rs);
                Rjax.storage(tpl, 'render', Rjax.toQueryString(album));
            }
        });
        // 刷新一下实时数据
        refreshPageList();
    }
    // 刷新专场列表数据
    // http://paimai.jd.com/services/currentPriceList.action?albumId=733&paimaiIds=100191066-100191052-100190960-100191023-100190987&callback=test
    function refreshPageList() {
        var idArr=[];
        $('#thelist li').each(function(){
            idArr.push($(this).attr('k'));
        });
        idArr = idArr.join('-');
        // console.log(mode)
        switch (mode){
            case 0:
                var url = 'http://mpaimai.jd.com/json/current/queryProAccess';
                var param = {
                    paimaiIds: idArr
                };
                $.ajax({
                    url: url,
                    data: param,
                    dataType: 'json',
                    success: function(rs){
                        if(rs==null){
                            return;
                        }
                        for(var i = 0,len = rs.length;i <len;i++){
                            var item = rs[i];
                            $li = $('#thelist [k="'+item.paimaiId+'"]');
                            $li.find('.p-extra .fl').html('<span class="f-red">'+ item.access +'</span>次围观');
                        }
                    }
                });
                break;
            case 1:
                var url = URL + 'services/currentPriceList.action';
                var param = {
                    albumId: albumId,
                    paimaiIds: idArr
                };
                $.ajax({
                    url: url,
                    data: param,
                    dataType: 'jsonp',
                    success: function(rs){
                        if(rs==null){
                            return;
                        }
                        for(var i = 0,len = rs.length;i <len;i++){
                            var item = rs[i];
                            $li = $('#thelist [k="'+item.paimaiId+'"]');
                            $li.find('.p-price').html('￥'+item.currentPriceStr);
                            $li.find('.p-extra .fl').html('<span class="f-red">'+ item.bidCount +'</span>次出价');
                        }
                    }
                });
                break;
            case 2:
                var url = URL + 'services/currentPriceList.action';
                var param = {
                    albumId: albumId,
                    paimaiIds: idArr
                };
                $.ajax({
                    url: url,
                    data: param,
                    dataType: 'jsonp',
                    success: function(rs) {
                        if (rs==null) {
                            return;
                        }
                        for (var i = 0,len = rs.length;i <len;i++) {
                            var item = rs[i];
                            $li = $('#thelist [k="'+item.paimaiId+'"]');
                            $li.addClass('done');
                            if($li.find('.p-extra .fr').length == 0){
                                $li.find('.p-extra').append('<div class="fr">已结束</div>');
                            }
                        }
                    }
                });
                break;
        }
    }

    //30秒刷新一次
    function freshData(){
        var timer = setInterval(function() {
            refreshShowState();
        }, 30000);
    }

    function init(){
        refreshShowState();
        freshData();
    }

})();
