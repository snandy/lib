
function Suggest(opt) {
	var input = opt.input
		visible = false,
		activeItem = null,
		finalValue = ''
	
	var Model = Backbone.Model.extend({
		defaults: {
			panelCls: 'suggest-container',
			itemCls: 'suggest-item',
			activeCls: 'suggest-active',
			opacity: opt.opacity,
			width: opt.width,
			data: opt.data || []
		}
	})
	var model = new Model
	
	var View = Backbone.View.extend({
		className: model.get('panelCls'),
		initialize: function() {
			var me = this
			this.setPos()
			this.$el.hide().appendTo('body')			
			model.on('change', this.render, this)
			$(input).keyup(function(e) {
				if (!me.onSpecKeys(e)) {
					var options = {html: input.value}
					model.set(options)
				}
			}).blur(function() { // blur会在click前发生，这里使用mousedown
				me.hide()
			})
			$(window).resize(function() {
				me.setPos()
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
				this.show()
			}
		},
		hide: function() {
			this.$el.hide()
			visible = false
		},
		show: function() {
			var value = input.value,
				itemCls = model.get('itemCls'),
				data = model.get('data'),
				opacity = model.get('opacity'),
				width = model.get('width')
				
			if (value.indexOf('@') !== -1) return
			
			this.items = []
			this.el.innerHTML = ''
			for (var i=0, len = data.length; i<len; i++) {
				var item = $('<div>').addClass(itemCls).html(value + '@' + data[i])
				this.items[i] = item
				this.el.appendChild(item[0])
			}
			if (width) {
				this.$el.width(width)
			}
			if (opacity) {
				this.$el.css('opacity', opacity)
			}
			this.$el.show()
			visible = true
			finalValue = value
		},
		setPos: function() {
			var pos = $(input).position()
			this.$el.css({
				position: 'absolute',
				overflow: 'hidden',
				left: pos.left,
				top: pos.top + input.offsetHeight,
				width: input.offsetWidth-1
			})
		},
		onSpecKeys: function(e) {
			var container = this.el, itemCls = model.get('itemCls'), activeCls = model.get('activeCls')
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
								input.value = finalValue
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
								input.value = finalValue
							}
						}
						return true
					case 27: 
						this.hide()
						input.value = finalValue
						return true
				}
			}
		},
		onMouseOver: function(e) {
			var target = e.target,
				itemCls = model.get('itemCls'),
				activeCls = model.get('activeCls')
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
	
	this.model = model
	this.view = view
}
