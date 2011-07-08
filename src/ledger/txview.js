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
			
			// get account and tag names
			data.account = this.model.getAccountName();
			data.tag = this.model.getTagName();
			
			result = tux.ledger.txView(data);
			$(this.el).empty().append(result);
		}
	
	});
	
}());