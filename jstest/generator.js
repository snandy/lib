'use strict';

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

run(delayMsg);