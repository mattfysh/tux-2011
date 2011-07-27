namespace('tux.ledger');

(function() {
	'use strict';
	
	tux.ledger.LedgerController = Backbone.View.extend({
	
		initialize: function() {
			var form;
			
			// create ledger tx list and add DOM ul
			this.list = new tux.ledger.TxList();
			$(this.el).append('<ul class="table-list">')
			
			// create form and append
			form = new tux.ledger.TxForm();
			$(this.el).append(form.el);
			
			// create pending tx list
			this.pending = new tux.ledger.Pending();
			
			// event binding
			_(this).bindAll('addTxToList', 'displayTx', 'processNewTx');
			form.bind('newtx', this.addTxToList);
			this.list.bind('add', this.processNewTx);
			
			// process tx lists
			this.list.each(this.displayTx);
		},
		
		addTxToList: function(tx) {
			this.list.create(tx);
		},
		
		processNewTx: function(tx) {
			this.sendAdjustment(tx);
			this.displayTx(tx);
		},
		
		displayTx: function(tx) {
			var view = new tux.ledger.TxView({
				model: tx
			});
			this.$('ul.table-list').append(view.el);
		},
		
		sendAdjustment: function(tx) {
			tux.refs.accounts.list
				.get(tx.get('account'))
				.adjustBalance(tx.get('amount'));
		}
	
	});
	
}());