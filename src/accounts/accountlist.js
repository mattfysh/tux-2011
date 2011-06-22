namespace('tux.accounts');

// accounts collection
tux.accounts.AccountList = (function() {
	'use strict';
	
	var
	
	// init
	init = function() {
		this.fetch();
	},
	
	// calculate totals
	getTotal = function() {
		return _(this.models).reduce(function(memo, account) {
			return memo + account.get('balance');
		}, 0);
	};
	
	// define collection api
	return Backbone.Collection.extend({
		localStorage: new Store('accounts'),
		initialize: init,
		getTotal: getTotal
	});
	
}());