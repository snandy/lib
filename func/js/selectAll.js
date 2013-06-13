/**
 * 全选函数 （两个全选复选框）
 * @param {css selector or jQuery Object} opCheckbox
 * @param {css selector or jQuery Object} listCheckbox
 * @param {css selector or jQuery Object} item
 * @param {css selector} target
 */
$.selectAll = function(opCheckbox, listCheckbox, item, target) {
	var $op, $list, $item
	
	if (typeof opCheckbox === 'string') {
		$op = $(opCheckbox)
	} else {
		$op = opCheckbox
	}
	
	if (typeof listCheckbox === 'string') {
		$list = $(listCheckbox)
	} else {
		$list = listCheckbox
	}
	
	if (typeof item === 'string') {
		$item = $(item)
	} else {$('');
		$item = item
	}

	target = target || 'div'
	
	$op.click(function() {
		var $self = $(this), $another
		$another = $self[0] === $op[0] ? $op.eq(1) : $op.eq(0)
		
		if ($self[0].checked) {
			$item.addClass('selected')
			$list.prop('checked', true)
			$another.prop('checked', true)
		} else {
			$item.removeClass('selected')
			$list.prop('checked', false)
			$another.prop('checked', false)
		}
	})
	$list.click(function() {
		var $checkbox = $(this)
		if ($checkbox[0].checked) {
			$(this).closest(target).addClass('selected')
		} else {
			$(this).closest(target).removeClass('selected')
		}
		if (isAllSelected()) {
			$op.prop('checked', true)
		} else {
			$op.prop('checked', false)
		}
	})
	
	function isAllSelected() {
		var boo = true
		$list.each(function() {
			if (this.checked === false) {
				boo = false
			}
		})
		return boo
	}
}
