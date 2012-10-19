
function Suggest(opt) {
	var input = opt.input || null
	var containerCls = opt.containerCls || 'suggest-container'
	var itemCls = opt.itemCls || 'suggest-item'
	var activeCls = opt.activeCls || 'suggest-active'
	var width = opt.width
	var opacity = opt.opacity
	var data = opt.data || []
	var visible = false
	var activeItem = null
	
	var Model = Backbone.Model.extend({
		initialize: function() {
			this.set({html: ''})
		}
	})
	var model = new Model
	
	var View = Backbone.View.extend({
		className: containerCls,
		initialize: function() {
			var me = this
			this.setPos()
			model.on('change', this.render, this)
			this.$el.hide().appendTo('body')
			$(input).keyup(function(e) {
				if (!view.keys(e)) {
					model.set({html: input.value}, {ev: e})
				}
			}).blur(function() { // blur会在click前发生，这里使用mousedown
				me.hide()
			})
		},
		events: {
			'mouseover': 'onMouseOver',
			'mousedown': 'onMouseDown'
		},
		render: function(model, options) {
			if (input.value === '') {
				this.hide()
			} else {
				this.show(options.ev)
			}
		},
		hide: function() {
			this.$el.hide()
			visible = false
		},
		show: function(e) {
			if (input.value.indexOf('@') !== -1) return
			
			this.items = []
			if ($(input).attr('curr_val') !== input.value) {
				this.el.innerHTML = ''
				for (var i=0, len = data.length; i<len; i++) {
					var item = $('<div>').addClass(itemCls).html(input.value + '@' + data[i])
					this.items[i] = item
					this.el.appendChild(item[0])
				}
				$(input).attr('curr_val', input.value)
			}
			this.$el.show()
			visible = true
		},
		keys: function(e) {
			var container = this.el
			if (visible) {
				switch (e.keyCode) {
					case 13: // Enter
						if (activeItem) {
							input.value = activeItem.firstChild.data
							this.hide()
						}
						return true
					case 38: // 方向键上
						if(activeItem === null) {
							activeItem = container.lastChild
							activeItem.className = activeCls
							input.value = activeItem.firstChild.data
						} else {
							if (activeItem.previousSibling !== null) {
								activeItem.className = itemCls
								activeItem = activeItem.previousSibling
								activeItem.className = activeCls
								input.value = activeItem.firstChild.data
							} else {
								activeItem.className = itemCls
								activeItem = null
								input.focus()
								input.value = input.getAttribute("curr_val")
							}
						}
						return true
					case 40: // 方向键下
						if (activeItem == null) {
							activeItem = container.firstChild
							activeItem.className = activeCls
							input.value = activeItem.firstChild.data
						} else {
							if (activeItem.nextSibling !== null) {
								activeItem.className = itemCls
								activeItem = activeItem.nextSibling
								activeItem.className = activeCls
								input.value = activeItem.firstChild.data
							} else {
								activeItem.className = itemCls
								activeItem = null
								input.focus()
								input.value = input.getAttribute("curr_val")
							}
						}
						return true
					case 27: 
						this.hide()
						input.value = $(input).attr('curr_val')
						return true
				}
			}
		},
		setPos: function() {
			var pos = $(input).position()
			this.$el.css({
				position: 'absolute',
				overflow: 'hidden',
				left: pos.left,
				top: pos.top + input.offsetHeight,
				width: $.browser.mozilla ? input.clientWidth : input.offsetWidth-2
			})
		},
		onMouseOver: function(e) {
			var target = e.target
			if (target.className === itemCls) {
				if (activeItem) {
					activeItem.className = itemCls
				}
				target.className = activeCls
				activeItem = target
			}
		},
		onMouseDown: function(e) {
			input.value = e.target.innerHTML
			this.hide()
		}
	})
	var view = new View
	
}
