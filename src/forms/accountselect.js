namespace('tux.forms');

(function() {
	'use strict';
	
	tux.forms.AccountSelect = Backbone.View.extend({
	
		initialize: function() {
			var wrapper = $('<div class="account-select">'),
				input = this.el;
			
			// event binding
			_(this).bindAll('addAccount', 'removeAccount', 'renameAccount');
			tux.refs.accounts.list
				.bind('add', this.addAccount)
				.bind('remove', this.removeAccount)
				.bind('change:name', this.renameAccount);
			
			// wrap input with account select template
			this.el = $(input).wrap(wrapper)
				.parents('div.account-select')
				.append('<ul>')[0];
			
			// add accounts
			tux.refs.accounts.list.each(this.addAccount);
			
			// event binding
			this.events = this.wrapperEvents;
			this.delegateEvents();
		},
		
		wrapperEvents: {
			'click li': 'select'
		},
		
		select: function(e) {
			e.preventDefault();
			this.$('input').val($(e.target).data('id'));
		},
		
		addAccount: function(account) {
			// generate item markup and append to list
			var option = $(tux.forms.accountSelectOption(account.toJSON()));
			this.$('ul').append(option);
		},
		
		removeAccount: function(account) {
			this.$('ul li[data-id=' + account.id + ']').remove();
		},
		
		renameAccount: function(account) {
			this.$('ul li[data-id=' + account.id + ']').text(account.get('name'));
		}
	
	});
	
}());