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
				el: this.$('input[name=account]')[0],
				items: ['accounts']
			});
		},
		
		process: function(e) {
			var tx;
			e.preventDefault();
			
			tx = this.getTxFormData();
			// parse amount
			tx.amount = parse(tx.amount);
			this.trigger('newtx', tx);
			// reset form
			e.target.reset();
		},
		
		getTxFormData: function() {
			var tx = {};
			this.$(':input:not(:submit)').each(function() {
				tx[this.getAttribute('name')] = $(this).val();
			});
			return tx;
		}
	
	});
	
}());