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
			/*new tux.forms.OmniSelect({
				el: this.$('input[name=account]')[0],
				items: ['accounts']
			});
			new tux.forms.OmniSelect({
				el: this.$('input[name=tag]')[0],
				items: ['tags']
			});*/
		},
		
		process: function(e) {
			var tx = this.getTxFormData();
			
			e.preventDefault();
			
			// trigger and reset
			this.trigger('newtx', tx);
			e.target.reset();
		},
		
		getTxFormData: function() {
			// build tx object
			var tag,
				tx = {};
			this.$(':input:not(:submit)').each(function() {
				tx[this.getAttribute('name')] = $(this).val();
			});
			
			// parse amount
			tx.amount = parse(tx.amount);
			
			// process tag type
			tag = tx.tag.split(',');
			tx.tag = tag[0];
			if (tag[1] === 'ex') {
				tx.amount = tx.amount * -1;
			}
			
			// return new tx
			return tx;
		}
	
	});
	
}());