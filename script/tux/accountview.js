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
			_.bindAll(this, 'remove', 'render');
			this.model.bind('remove', this.remove)
				.bind('change', this.render);
		},
		
		render: function() {
			var tmplData = this.model.toJSON();
			tmplData.bal = util.formatCurrency(tmplData.bal);
			if (tmplData.limit) tmplData.limit = util.formatCurrency(tmplData.limit);
			tmplData.type = this.typeMap[tmplData.type];
			$(this.el).empty().append($.tmpl(this.template, tmplData));
			return this;
		},
		
		typeMap: {
			s: 'Savings',
			c: 'Credit'
		},
		
		destroy: function(e) {
			e.preventDefault();
			this.model.destroy();
		},
		
		edit: function(e) {
			e.preventDefault();
			$(this.el).empty().append($.tmpl(this.editTemplate, this.model.toJSON()));
			this.$('select[name=type]').val(this.model.get('type'));
		},
		
		save: function(e) {
			e.preventDefault();
			this.model.set({
				name: this.$('input[name=name]').val(),
				bal: this.$('input[name=bal]').val(),
				type: this.$('select[name=type]').val(),
				limit: this.$('input[name=limit]').val()
			}).save();
			this.render();
		}
		
	});
	
});