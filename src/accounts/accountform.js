namespace('tux.accounts');

(function() {
	'use strict';
	
	// balance validation
	var rBalance = /^(|(-?\$?|\$?-?)\d+\.?\d*)$/;
	
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
			'submit form': 'process'
		},
		
		process: function(e) {
			var account, error;
			e.preventDefault();
			
			// get form data
			account = this.getAccountFormData();
			// clear previous error
			this.$('p.error').remove();
			// validate form
			error = this.validate(account);
			if (error) {
				$(this.el).append($('<p>', {
					'class': 'error',
					text: error
				}));
			} else {
				// parse balance
				account.balance = parse(account.balance);
				// custom event
				this.trigger('newaccount', account);
				// reset form
				e.target.reset();
			}
		},
		
		getAccountFormData: function() {
			// build account object from form data
			var account = {};
			this.$(':input:not(:submit)').each(function() {
				account[this.getAttribute('name')] = $(this).val();
			});
			return account;
		},
		
		validate: function(account) {
			if (!account.name) {
				return 'name required';
			} else if(!rBalance.test(account.balance)) {
				return 'invalid balance format';
			}
		}
		
	});
	
}());
