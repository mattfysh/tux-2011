namespace('tux');

$(function() {
	
	var util = tux.util;
	
	tux.AccountView = Backbone.View.extend({
		
		tagName: 'tr',
		template: $('#account-tmpl').template(),
		editTemplate: $('#account-edit-tmpl').template(),
		
		events: {
			'click a.remove': 'destroy',
			'click a.edit': 'edit',
			'click a.save': 'save'
		},
		
		initialize: function() {
			_.bindAll(this, 'remove');
			this.model.bind('remove', this.remove);
		},
		
		render: function() {
			var tmplData = this.model.toJSON();
			tmplData.bal = util.formatCurrency(tmplData.bal);
			$(this.el).empty().append($.tmpl(this.template, tmplData));
			return this;
		},
		
		destroy: function(e) {
			e.preventDefault();
			this.model.destroy();
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