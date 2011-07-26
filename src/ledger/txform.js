namespace('tux.ledger');

(function() {
	'use strict';
	
	tux.ledger.TxForm = Backbone.View.extend({
	
		initialize: function() {
			// render
			this.render();
		},
		
		events: {
			'submit form': 'process'
		},
		
		render: function() {
			// add template
			var result = tux.ledger.txForm();
			$(this.el).empty().append(result);
			
			// add custom form inputs
			new tux.forms.OmniSelect({
				input: this.$('input[name=account]')[0],
				options: ['accounts']
			});
			new tux.forms.OmniSelect({
				input: this.$('input[name=tag]')[0],
				options: ['tags']
			});
		},
		
		process: function(e) {
			e.preventDefault();
			
			var tx = this.getTxFormData();
			
			// trigger and reset
			this.trigger('newtx', tx);
			e.target.reset();
		},
		
		getTxFormData: function() {
			// build tx object
			var tx = {};
			this.$(':input:not(:submit)').each(function() {
				tx[this.getAttribute('name')] = $(this).val();
			});
			
			// parse date
			tx.date = tux.util.parseDate(tx.date);
			
			// parse amount
			tx.amount = tux.util.parseCurrency(tx.amount);
			
			// process tag code
			if (this.$('input[name=tag]').data('code') === 'e') {
				tx.amount = tx.amount * -1;
			}
			
			// return new tx
			return tx;
		}
	
	});
	
}());