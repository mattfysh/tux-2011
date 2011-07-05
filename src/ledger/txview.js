namespace('tux.ledger');

(function() {
	'use strict';
	
	tux.ledger.TxView = Backbone.View.extend({
		
		tagName: 'li',
	
		initialize: function() {
			// render
			this.render();
		},
		
		render: function() {
			var data = this.model.toJSON(),
				result;
			
			// replace account id with name
			data.account = this.model.getAccountName();
			
			result = tux.ledger.txView(data);
			$(this.el).empty().append(result);
		}
	
	});
	
}());