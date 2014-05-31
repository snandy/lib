requirejs.config({
    map: {
        'dom': {
            'jquery': 'jquery-1.6.4'
        },
        'event': {
            'jquery': 'jquery-1.7.2'
        }
    }
});

require(['dom', 'event'], function(dom, event){
	
	$(function() {
		alert(3)
	})
})
