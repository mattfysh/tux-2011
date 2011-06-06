namespace('tux');

$(function() {
	
	var util = tux.util,
		accounts = tux.accounts;
	
	tux.Tx = Backbone.Model.extend({
		
		initialize: function() {
			this.set({
				date: new Date(this.get('date'))
			});
			
			// getting account model
			this.account = accounts.get(this.get('accountid'));
			
			_.bindAll(this, 'destroy');
			this.account.bind('remove', this.destroy);
		}
		
	});
	
	tux.Ledger = Backbone.Collection.extend({
		
		model: tux.Tx,
		localStorage: new Store('ledger'),
		
		comparator: function(tx) {
			return tx.get('date');
		}
		
	});
	
	var ledger = tux.ledger = new tux.Ledger;
	
	tux.TxView = Backbone.View.extend({
		
		tagName: 'tr',
		template: $('#ledger-tmpl').template(),
		
		render: function() {
			var tmplData = this.model.toJSON();
			tmplData.amount = util.formatCurrency(tmplData.amount);
			tmplData.date = util.formatDate(tmplData.date);
			tmplData.account = this.model.account.toJSON();
			$(this.el).empty().append($.tmpl(this.template, tmplData));
			return this;
		}
		
	});
	
	tux.LedgerApp = Backbone.View.extend({
		
		el: $('#ledger'),
		
		initialize: function() {
			_(this).bindAll('addOne', 'addAll');
			ledger.bind('add', this.addOne);
			ledger.bind('refresh', this.addAll);
			ledger.fetch();
			ledger.bind('add', this.applyToAccount);
		},
		
		addOne: function(tx) {
			var view = new tux.TxView({model: tx});
			this.el.find('table').append(view.render().el);
		},
		
		addAll: function() {
			ledger.each(this.addOne);
		},
		
		applyToAccount: function(tx) {
			// apply added amount to account
			tx.account.applyAmount(tx.get('amount'));
			
			// handle transfer
			if (tx.transfer) {
				
				// create a new tx, invert for transfer
				var trTx = tx.clone();
				trTx.set({
					accountid: trTx.get('transfer'),
					amount: trTx.get('amount') * -1
				});
				trTx.account = trTx.transfer;
				
				// delete transfer data from both tx's now that it has been processed
				tx.unset('transfer');
				delete tx.transfer;
				trTx.unset('transfer');
				delete trTx.transfer;
				
				// add transfer, calls this fn recursively to apply amount to transfer account
				ledger.create(trTx);
			}
		}
		
	});
	
});