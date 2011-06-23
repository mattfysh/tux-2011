namespace('tux.accounts');

(function() {
	'use strict';
	
	tux.accounts.AccountsApp = Backbone.View.extend({
	
		initialize: function() {
			// load accounts and render each
			var list = new tux.accounts.AccountList(),
				totals;
			
			// render each account
			list.each(_(function(account) {
				var view = new tux.accounts.AccountView({
					model: account
				});
				this.$('table').append(view.el);
			}).bind(this));
			
			// render the totals view
			totals = new tux.accounts.AccountListView({
				collection: list
			});
			this.$('table').append(totals.el);
		}
	
	});
	
}());