namespace('tux.accounts');

(function() {
	"use strict";
	// account model
	tux.accounts.Account = Backbone.Model.extend({
		
		defaults: {
			balance: 0
		},
		
		adjustBalance: function(amount) {
			this.set({
				balance: this.get('balance') + amount
			});
		},
		
		validate: function(attrs) {
			if (typeof attrs.balance !== 'number') {
				return 'balance must be a number';
			}
		}
		
	});
}());
