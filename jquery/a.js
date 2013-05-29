	var len = 10000

	function fn(a, b) {
		console.log(a+b)
	}
	for (var i=0; i<len; i++) {
		for (var j=0; j<len; j++) {
			fn(i, j)
		}
	}