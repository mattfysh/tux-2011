namespace('tux');

$(function() {
	
	tux.Tx = Backbone.Model.extend({
		
		initialize: function() {
			// getting account model
			this.account = accounts.get(this.get('accountid'));
		}
		
	})
	
	tux.Ledger = Backbone.Collection.extend({
		
		model: tux.Tx,
		localStorage: new Store('ledger')
		
	});
	
	window.ledger = new tux.Ledger;
	
	tux.LedgerView = Backbone.View.extend({
		
		tagName: 'tr',
		template: $('#ledger-tx-tmpl').template(),
		
		render: function() {
			var tmplData = this.model.toJSON();
			tmplData.account = this.model.account.toJSON();
			$(this.el).empty().append($.tmpl(this.template, tmplData));
			return this;
		}
		
	});
	
	tux.LedgerApp = Backbone.View.extend({
		
		el: $('#ledger'),
		events: {
			'submit form': 'create'
		},
		
		initialize: function() {
			_.bindAll(this, 'addOne', 'addAll');
			ledger.bind('add', this.addOne);
			ledger.bind('refresh', this.addAll);
			ledger.fetch();
		},
		
		create: function(e) {
			e.preventDefault();
			ledger.create(this.getNewTx());
		},
		
		getNewTx: function() {
			var tx = {};
			this.el.find(':input:not(:submit)').each(function() {
				tx[this.getAttribute('name')] = $(this).val();
			});
			this.el.find('form')[0].reset();
			return tx;
		},
		
		addOne: function(tx) {
			var view = new tux.LedgerView({model: tx});
			this.el.find('table').append(view.render().el);
		},
		
		addAll: function() {
			ledger.each(this.addOne);
		}
		
	});
	
})
