namespace('tux.accounts');

tux.accounts.AccountForm = (function() {
	'use strict';
	
	var
	
	// init
	init = function() {
		// compile and cache template
		$('#account-form').template('accountForm');
	},
	
	// render
	render = function() {
		var result = $.tmpl('accountForm');
		$(this.el).empty().append(result);
	},
	
	// events
	events = {
			'submit form': 'submit'
	},
	
	// get form data
	getAccountFormData = function() {
		var account = {};
		this.$(':input:not(:submit)').each(function() {
			account[this.getAttribute('name')] = $(this).val();
		});
		account.balance = parseInt(account.balance, 10);
		return account;
	},
	
	// submit
	submit = function(e) {
		var account;
		e.preventDefault();
		account = getAccountFormData.call(this);
		this.trigger('newaccount', account);
		e.target.reset();
	};
	
	// define form view api
	return Backbone.View.extend({
		initialize: init,
		render: render,
		events: events,
		submit: submit
	});
	
}());