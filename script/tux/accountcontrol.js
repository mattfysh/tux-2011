namespace('tux');

$(function() {
	
	window.accounts = new tux.AccountList;
	
	tux.AccountControl = Backbone.View.extend({
		
		el: $('#accounts'),
		totalTemplate: $('#accounts-total-tmpl').template(),
		
		events: {
			'submit form': 'create'
		},
		
		initialize: function() {
			_.bindAll(this, 'addOne', 'render', 'addAll');
			accounts.bind('add', this.addOne);
			accounts.bind('all', this.render);
			accounts.bind('refresh', this.addAll);
			accounts.fetch();
		},
		
		create: function(e) {
			e.preventDefault();
			accounts.create(this.getNewAccount());
		},
		
		getNewAccount: function() {
			var account = {};
			this.el.find(':text').each(function() {
				account[this.getAttribute('name')] = $(this).val();
			});
			this.el.find('form')[0].reset();
			return account;
		},
		
		addOne: function(account) {
			var view = new tux.AccountView({model: account});
			this.el.find('table').append(view.render().el);
		},
		
		addAll: function() {
			accounts.each(this.addOne);
		},
		
		render: function() {
			var totalData = {
				total: accounts.total()
			}
			this.el.find('tr.total').remove();
			this.el.find('table').append($.tmpl(this.totalTemplate, totalData));
			$('select.accounts').empty().append(accounts.options());
		}
		
	});
	
});