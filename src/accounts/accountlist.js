namespace('tux.accounts');

(function() {
	'use strict';
	
	tux.accounts.AccountList = Backbone.Collection.extend({
		
		initialize: function() {
			this.model = tux.accounts.Account;
			this.localStorage = new Store('accounts');
			this.fetch();
		},
		
		getTotal: function() {
			// calculate totals from all accounts
			return _(this.models).reduce(function(memo, account) {
				return memo + account.get('balance');
			}, 0);
		}
		
	});
	
}());
