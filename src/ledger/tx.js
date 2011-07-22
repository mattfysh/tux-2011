namespace('tux.ledger');

(function() {
	'use strict';
	
	tux.ledger.Tx = Backbone.Model.extend({
	
		initialize: function() {
			// restore date
			this.set({
				date: new Date(this.get('date'))
			});
		},
		
		getAccountName: function() {
			var account;
			
			// caching
			if (this.accountName) {
				return this.accountName;
			}
			
			// get name
			account = this.get('account');
			this.accountName = tux.refs.accounts.list.get(account).get('name');
			return this.accountName;
		},
		
		getTagName: function() {
			var tag;
			
			// caching
			if (this.tagName) {
				return this.tagName;
			}
			
			// get name
			tag = this.get('tag');
			this.tagName = tux.refs.tags.list.get(tag).get('name');
			return this.tagName;
		}
	
	});
	
}());