~function(){
	
	var Model = Backbone.Model.extend({
		caption: '对话框'
	})
	
	var View = Backbone.View.extend({
		model: new Model,
		el: 'body',
		template: _.template($('#dialog-template').html()),
		render: function() {
			$(this.el).html(this.template(this.model.toJSON()))
		}
	})
	
	
	$(function() {
		new View
	})
	
}()
