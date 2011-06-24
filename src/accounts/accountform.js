namespace('tux.accounts');

(function() {
	'use strict';
	
	tux.accounts.AccountForm = Backbone.View.extend({
		
		initialize: function() {
			// compile and cache template
			$('#account-form').template('accountForm');
			// render
			this.render();
		},
		
		render: function() {
			var result = $.tmpl('accountForm');
			$(this.el).empty().append(result);
		},
		
		events: {
			'submit form': 'submit'
		},
		
		submit: function(e) {
			var account = this.getAccountFormData();
			e.preventDefault();
			// custom event
			this.trigger('newaccount', account);
			// reset form
			e.target.reset();
		},
		
		getAccountFormData: function() {
			// build account object from form data
			var account = {};
			this.$(':input:not(:submit)').each(function() {
				account[this.getAttribute('name')] = $(this).val();
			});
			account.balance = parseInt(account.balance, 10);
			return account;
		}
		
	});
	
}());
