'use strict';

var p1 = new Promise(function(resolve, reject) {
	setTimeout(function() {
		resolve(1)
	}, 3000)
});

var p2 = new Promise(function(resolve, reject) {
	setTimeout(function() {
		resolve(2)
	}, 5000)
});

// p1.then(function(result) {
// 	console.log(result)
// }, function(err) {
// 	console.log(err)
// })

// 返回一个promise，当参数中所有的 promise 都被解决后，该promise也会被解决。
// Promise.all([p1, p2]).then(function(result) {
// 	console.log('Result: ' + (result[0] + result[1]))
// })

// 只要有一个 接受 或 拒绝 后，该 promise 也会用子promise的成功或失败值接受或失败
// Promise.race([p1, p2]).then(function(result) {
// 	console.log(result)
// })


// var p1 = new Promise(function(resolve, reject) {
// 	$.ajax('http://aa.xx.com', {
// 		success: function(result) {
// 			resolve(result)
// 		},
// 		error: function(err) {
// 			reject(err)
// 		}
// 	})
// })

// p1.then(function(r1) {
// 	console.log(r1)
// })

// setTimeout(function() {
// 	p1.then(function(r2) {
// 		console.log(r2)
// 	})
// }, 4000)


function getUserName() {
	return new Promise(function(resolve) {
		setTimeout(function() {
			resolve('lily126')
		}, 3000)
	});
}

function getPassword(uname) {
	return new Promise(function(resolve) {
		setTimeout(function() {
			resolve(uname + ':' + '123456')
		}, 3000)
	});	
}

getUserName()
	.then(function(uname) {
		return getPassword(uname)
	})
	.then(function(pwd) {
		console.log(pwd)
	})