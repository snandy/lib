/*
 * 项目中使用select 各浏览器，各系统都不统一，为了保证统一展示，现把此效果写在pop共用js
 * 组件中，主要分三部分，一个父级，一个select 和一个显示标签，使用中如果要修改select显示值
 * 只需修改 显示标签值就可以。
 * 示例：
 * 1、在select 父级增加属性: data-ui="u-select|select"
 * <div data-ui="u-select|select">
 * 2、给显示的标签增加属性：data-ui="select-h"
 * <em data-ui="select-h">test</em>
 */
$(function() {
    $('[data-ui^="u-select"]').each(function() {
        var $elem = $(this);
        var arr = $.uiParse($elem.attr('data-ui'));
        // 选中select
        var delegateSelector = arr[0];
        // 获取select 
        var option = $elem.find(delegateSelector);
        var h = $elem.find('[data-ui="select-h"]');
        // 给sleect 增加change 事件
        $elem.delegate(delegateSelector,'change',function(){
            h.html(option.children('option:selected').text())
        })
        // 通过鼠标放上去改变select 值  程序只需修改 显示em 值
        $elem.delegate(delegateSelector,'mouseenter',function(){
            $elem.find(option).val(h.html())
        })
    })
})