namespace('tux.ledger');

(function() {
	'use strict';
	
	tux.ledger.LedgerController = Backbone.View.extend({
	
		initialize: function() {
			var form;
			
			// create form and append
			form = new tux.ledger.TxForm();
			$(this.el).append(form.el);
			
			// create tx list and add DOM ul
			this.list = new tux.ledger.TxList();
			$(this.el).append('<ul class="tx-list">');
			
			// event binding
			_(this).bindAll('addTxToList', 'displayTx');
			form.bind('newtx', this.addTxToList);
			this.list.bind('add', this.displayTx);
			
			// process tx list
			this.list.each(this.displayTx);
		},
		
		addTxToList: function(tx) {
			this.list.create(tx);
		},
		
		displayTx: function(tx) {
			var view = new tux.ledger.TxView({
				model: tx
			});
			this.$('ul.tx-list').append(view.el);
		}
	
	});
	
}());