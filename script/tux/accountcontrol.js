namespace('tux');

$(function() {
	
	var accounts = new tux.AccountList;
	
	tux.AccountControl = Backbone.View.extend({
		
		el: $('#accounts'),
		totalTemplate: $('#accounts-total-tmpl').template(),
		
		events: {
			'submit form': 'create'
		},
		
		initialize: function() {
			
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
		}
		
	});
	
});