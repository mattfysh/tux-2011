namespace('tux.accounts');

(function() {
	'use strict';
	
	tux.accounts.AccountsController = Backbone.View.extend({
	
		initialize: function() {
			var totals, form;
			
			// add table to view
			$('<ul class="table-list">').appendTo(this.el);
			
			// event binding
			_(this).bindAll('addAccountToList', 'displayAccount');
			
			// accounts list
			this.list = new tux.accounts.AccountList();
			
			// totals view
			totals = new tux.accounts.TotalView({
				collection: this.list
			});
			this.$('ul').append(totals.el);
			
			// form
			form = new tux.accounts.AccountForm();
			form.bind('newaccount', this.addAccountToList);
			$(this.el).append(form.el);
			
			// accounts models
			this.list.each(this.displayAccount);
			this.list.bind('add', this.displayAccount);
		},
		
		addAccountToList: function(account) {
			this.list.create(account);
		},
		
		displayAccount: function(account) {
			var view = new tux.accounts.AccountView({
				model: account
			});
			this.$('ul li.total').before(view.el);
		}
	
	});
	
}());
