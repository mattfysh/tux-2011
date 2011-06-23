namespace('tux.accounts');

(function() {
	'use strict';
	
	tux.accounts.AccountsApp = Backbone.View.extend({
	
		initialize: function() {
			// load accounts and render each
			var list = new tux.accounts.AccountList();
		}
	
	});
	
}());