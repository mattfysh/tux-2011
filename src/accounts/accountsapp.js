namespace('tux.accounts');

(function() {
	'use strict';
	
	tux.accounts.AccountsApp = Backbone.View.extend({
	
		initialize: function() {
			var totals, form;
			
			// event binding
			_(this).bindAll('addAccountToList', 'displayAccount');
			
			// load accounts
			this.list = new tux.accounts.AccountList();
			
			// render the totals view
			totals = new tux.accounts.AccountListView({
				collection: this.list
			});
			this.$('table').append(totals.el);
			
			// render each account
			this.list.each(this.displayAccount);
			this.list.bind('add', this.displayAccount);
			
			// setup form
			form = new tux.accounts.AccountForm();
			form.bind('newaccount', this.addAccountToList);
			$(this.el).append(form.el);
		},
		
		addAccountToList: function(account) {
			this.list.create(account);
		},
		
		displayAccount: function(account) {
			var view = new tux.accounts.AccountView({
				model: account
			});
			this.$('table tr.total').before(view.el);
		}
	
	});
	
}());