namespace('tux');

$(function() {
	
	tux.AccountView = Backbone.View.extend({
		
		tagName: 'tr',
		template: $('#account-tmpl').template(),
		
		events: {
			'click a.remove': 'remove'
		},
		
		render: function() {
			$.tmpl(this.template, this.model.toJSON()).appendTo(this.el);
			return this;
		},
		
		remove: function() {
			console.log('Removing an account. this = ', this);
		}
		
	});
	
});