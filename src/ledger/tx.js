namespace('tux.ledger');

(function() {
	'use strict';
	
	tux.ledger.Tx = Backbone.Model.extend({
	
		initialize: function() {
			
		},
		
		getAccountName: function() {
			var account;
			
			// caching
			if (this.accountName) {
				return this.accountName;
			}
			
			// get name
			account = this.get('account');
			this.accountName = tux.refs.accounts.get(account).get('name');
			return this.accountName;
		}
	
	});
	
}());