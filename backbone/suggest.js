
function Suggest(opt) {
	var input = opt.input || null
	var containerCls = opt.containerCls || 'suggest-container'
	var itemCls = opt.itemCls || 'suggest-item'
	var activeCls = opt.activeCls || 'suggest-active'
	var width = opt.width
	var opacity = opt.opacity
	var data = opt.data || []
	
	var Model = Backbone.Model.extend({
		initialize: function() {
			this.set({html: ''})
		}
	})
	var model = new Model
	
	var View = Backbone.View.extend({
		className: containerCls,
		initialize: function() {
			this.setPos()
			model.on('change', this.render, this)
			this.$el.hide().appendTo('body')
		},
		render: function() {
			if (input.value === '') {
				this.hide()
			} else {
				this.show()
			}
		},
		hide: function() {
			this.$el.hide()
		},
		show: function() {
			
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
		}
	})
	var view = new View
	
	var App = Backbone.View.extend({
		el: input,
		events: {
			'keyup': 'onkeyup'
		},
		onkeyup: function() {
			model.set({html: input.value})
		}
	})
	var app = new App
}
Suggest.prototype = {
	
}
