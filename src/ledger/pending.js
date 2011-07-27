namespace('tux.ledger');

(function() {
	'use strict';
	
	tux.ledger.Pending = Backbone.Collection.extend({
	
		initialize: function() {
			this.model = tux.ledger.Tx;
			this.localStorage = new Store('pending');
			this.fetch();
		},
		
		comparator: function(tx) {
			return tx.get('date').getTime();
		}
	
	});
	
}());