namespace('tux.ledger');

(function() {
	'use strict';
	
	tux.ledger.TxList = Backbone.Collection.extend({
	
		initialize: function() {
			this.model = tux.ledger.Tx;
			this.localStorage = new Store('ledger');
			this.fetch();
		},
		
		comparator: function(tx) {
			return tx.get('date').getTime();
		}
	
	});
	
}());