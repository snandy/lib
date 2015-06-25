'use strict';

// 经典示例，依此开始
// http://www.html-js.com/article/A-day-to-learn-JavaScript-to-replace-the-callback-function-with-ES6-Generator
// http://modernweb.com/2014/02/10/replacing-callbacks-with-es6-generators/
~function() {

	function delay(callback, time) {
	   setTimeout(function() {
	       callback("Sleep for " + time);
	   }, time);
	}

	function *delayMsg(resume) {
		var r1 = yield delay(resume, 1000);
		console.log(r1);
		var r2 = yield delay(resume, 5000);
	   	console.log(r2);
	}

	function run(generatorFunction) {
		var itor = generatorFunction(resume);
		function resume(callbackValue) {
			itor.next(callbackValue);
		}
		itor.next()
	}

	// run(delayMsg);	
}();


// 测试无限循环， 指定数后重新开始
~function() {

function *ticketGenerator() {
    for (var i = 0; true; i++) {
        var reset = yield i
        if (reset) {
        	i = -1
        }
    }
}

var iter = ticketGenerator();
// setInterval(function() {
// 	var obj = iter.next()
// 	if (obj.value == 5) {
// 		iter.next(1)
// 	}
// 	console.log(obj.value)
// }, 1000)

}();

// 两个异步Ajax，后者依赖前者的返回结果
~function() {
	function ajax1(callback) {
		$.getJSON('a.txt', function(obj) {
			callback(obj)
			// console.log(obj)
		})
	}
	function ajax2(callback) {
		$.getJSON('b.txt', function(obj) {
			callback(obj);
			// console.log(obj)
		})
	}
	function *delayAjax(resume) {
		var r1 = yield ajax1(resume)
		var r2 = yield ajax2(resume)
		return r1.v + r2.v
	}

	function run() {
		var iter = delayAjax(resume)
		function resume(callbackValue) {
			var rs = iter.next(callbackValue)
			if (rs.done) {
				console.log(rs.value)
			}
		}
		iter.next()
	}

	run()	
}();


