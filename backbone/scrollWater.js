/**
 * 瀑布流辅助函数
 * @param {Object} refEl 参照元素
 * @param {Object} callback 滚动到临界点时触发的回调函数
 * @param {Object} time 允许触发的次数
 */
$.scrollWaterFall = function(refElement, callback, time) {
	var $refEl,
		iTime = 0,
		$win  = $(window),
		$doc  = $(document)

	if (typeof refElement === 'string') {
		$refEl = $(refElement)
	} else {
		$refEl = refElement
	}
	
	time = time || 0;

	var handler = _.throttle(function() {
		var refTop    = $refEl.offset().top,
			docTop    = $doc.scrollTop(),
			winHeight = $win.height()
		if (refTop - docTop < winHeight) {
			callback()
			iTime++;
			if (time && iTime >= time) {
				$win.off('scroll', handler)
			}
		}
	}, 100)

	$win.scroll(handler)
}