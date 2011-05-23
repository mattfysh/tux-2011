namespace('tux');

$(function() {
	
	var accounts = tux.accounts,
		util = tux.util;
	
	tux.Tx = Backbone.Model.extend({
		
		initialize: function() {
			this.set({
				date: new Date(this.get('date'))
			});
			// getting account model
			this.account = accounts.get(this.get('accountid'));
			_.bindAll(this, 'destroy', 'changeAccName');
			this.account.bind('remove', this.destroy)
				.bind('change:name', this.changeAccName);
		},
		
		changeAccName: function() {
			this.trigger('change:name');
		}
		
	})
	
	tux.Ledger = Backbone.Collection.extend({
		
		model: tux.Tx,
		localStorage: new Store('ledger'),
		
		comparator: function(tx) {
			return tx.date;
		}
		
	});
	
	var ledger = tux.ledger = new tux.Ledger;
	
	tux.LedgerView = Backbone.View.extend({
		
		tagName: 'tr',
		template: $('#ledger-tx-tmpl').template(),
		
		events: {
			'click a.remove': 'destroy'
		},
		
		initialize: function(model) {
			_.bindAll(this, 'render', 'remove');
			this.model.bind('change:name', this.render)
				.bind('remove', this.remove)
		},
		
		render: function() {
			var tmplData = this.model.toJSON();
			tmplData.date = util.formatDate(tmplData.date);
			tmplData.amount = util.formatCurrency(tmplData.amount);
			tmplData.account = this.model.account.toJSON();
			$(this.el).empty().append($.tmpl(this.template, tmplData));
			return this;
		},
		
		destroy: function(e) {
			e.preventDefault();
			this.model.destroy();
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
			tx.date = util.makeDate(tx.date);
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
