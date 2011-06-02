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
		localStorage: new Store('ledger')
		
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
		},
		
		addOne: function(tx) {
			var view = new tux.TxView({model: tx});
			this.el.find('table').append(view.render().el);
		},
		
		addAll: function() {
			ledger.each(this.addOne);
		}
		
	});
	
});