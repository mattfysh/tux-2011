namespace('tux');

$(function() {
	
	tux.AccountView = Backbone.View.extend({
		
		tagName: 'tr',
		template: $('#account-tmpl').template(),
		editTemplate: $('#account-edit-tmpl').template(),
		
		events: {
			'click a.remove': 'remove',
			'click a.edit': 'edit',
			'click a.save': 'save'
		},
		
		render: function() {
			$(this.el).empty().append($.tmpl(this.template, this.model.toJSON()));
			return this;
		},
		
		remove: function(e) {
			e.preventDefault();
			this.model.destroy();
			$(this.el).remove();
		},
		
		edit: function(e) {
			e.preventDefault();
			$(this.el).empty().append($.tmpl(this.editTemplate, this.model.toJSON()));
		},
		
		save: function(e) {
			e.preventDefault();
			this.model.set({
				name: this.$('input[name=name]').val(),
				bal: this.$('input[name=bal]').val()
			}).save();
			this.render();
		}
		
	});
	
});