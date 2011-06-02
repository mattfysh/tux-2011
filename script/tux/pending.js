namespace('tux');

$(function() {
	
	var util = tux.util,
		ledger = tux.ledger,
		accounts = tux.accounts;
	
	tux.Pending = Backbone.Model.extend({
		
		initialize: function() {
			this.set({
				date: new Date(this.get('date'))
			});
			
			// getting account model
			this.account = accounts.get(this.get('accountid'));
			this.transfer = accounts.get(this.get('transfer'));
			
			_.bindAll(this, 'destroy');
			this.account.bind('remove', this.destroy);
		}
		
	});
	
	tux.PendingHold = Backbone.Collection.extend({
		
		model: tux.Pending,
		localStorage: new Store('pending')
		
	});
	
	var pending = tux.pending = new tux.PendingHold;
	
	tux.PendingView = Backbone.View.extend({
		
		tagName: 'tr',
		template: $('#pending-tmpl').template(),
		editTemplate: $('#pending-edit-tmpl').template(),
		
		events: {
			'click a.review': 'review',
			'click a.approve': 'approve',
			'click a.delete': 'destroy'
		},
		
		initialize: function() {
			_(this).bindAll('remove');
			this.model.bind('remove', this.remove);
		},
		
		render: function() {
			var tmplData = this.model.toJSON();
			tmplData.amount = util.formatCurrency(tmplData.amount);
			tmplData.date = util.formatDate(tmplData.date);
			tmplData.account = this.model.account.toJSON();
			if (this.model.transfer) tmplData.transfer = this.model.transfer.toJSON();
			$(this.el).empty().append($.tmpl(this.template, tmplData));
			return this;
		},
		
		review: function(e) {
			e.preventDefault();
			tmplData = this.model.toJSON();
			tmplData.date = util.formatDate(tmplData.date);
			tmplData.account = this.model.account.toJSON();
			if (this.model.transfer) tmplData.transfer = this.model.transfer.toJSON();
			$(this.el).empty().append($.tmpl(this.editTemplate, tmplData));
		},
		
		approve: function(e) {
			e.preventdefault();
		},
		
		destroy: function(e) {
			e.preventDefault();
			this.model.destroy();
		}
		
	});
	
	tux.PendingApp = Backbone.View.extend({
		
		el: $('#pending'),
		
		initialize: function() {
			_(this).bindAll('addOne', 'addAll');
			pending.bind('add', this.addOne);
			pending.bind('refresh', this.addAll);
			pending.fetch();
		},
		
		addOne: function(tx) {
			var view = new tux.PendingView({model: tx});
			this.el.find('table').append(view.render().el);
		},
		
		addAll: function() {
			pending.each(this.addOne);
		}
		
	});
	
});