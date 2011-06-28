namespace('tux.accounts');

(function() {
	'use strict';
	
	tux.accounts.AccountView = Backbone.View.extend({
		
		tagName: 'li',
		
		initialize: function() {
			// event binding
			_(this).bindAll('remove');
			this.model.bind('remove', this.remove);
			// render view
			this.render();
		},
		
		events: {
			'click a.destroy': 'destroy',
			'click a.edit': 'edit',
			'submit form': 'saveEdit',
			'keyup form': 'formKey'
		},
		
		render: function() {
			var data = this.model.toJSON(),
				result = tux.accounts.accountView(data);
			$(this.el).empty().append(result);
			return this;
		},
		
		destroy: function(e) {
			e.preventDefault();
			this.model.destroy();
		},
		
		edit: function(e) {
			e.preventDefault();
			var data = this.model.toJSON(),
				result = tux.accounts.accountEditView(data);
			$(this.el).empty().append(result);
			this.$('input[name=name]').focus();
		},
		
		saveEdit: function(e) {
			e.preventDefault();
			// save new values
			this.model.set({
				name: this.$('input[name=name]').val(),
				balance: parse(this.$('input[name=balance]').val())
			}).save();
			// revert to regular view
			this.render();
		},
		
		formKey: function(e) {
			if (e.which === 27) {
				this.render();
			}
		}
	
	});
	
}());
