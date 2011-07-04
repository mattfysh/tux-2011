namespace('tux.forms');

(function() {
	'use strict';
	
	tux.forms.AccountSelect = Backbone.View.extend({
	
		initialize: function() {
			var wrapper = $('<div class="account-select">'),
				input = this.el,
				option;
			
			// wrap input with account select template
			this.el = $(input).wrap(wrapper)
				.parents('div.account-select')
				.append('<ul>');
			
			// add accounts
			tux.refs.accounts.list.each(_(function(acc) {
				// generate item markup and append to list
				option = $(tux.forms.accountSelectOption(acc.toJSON()));
				this.$('ul').append(option);
			}).bind(this));
			
			// event binding
			this.events = this.eventsQueue;
			this.delegateEvents();
		},
		
		eventsQueue: {
			'click li': 'select'
		},
		
		select: function(e) {
			e.preventDefault();
			this.$('input').val($(e.target).data('id'));
		}
	
	});
	
}());