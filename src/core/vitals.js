namespace('tux.core');

(function() {
	'use strict';
	
	tux.core.Vitals = Backbone.View.extend({
		
		id: 'vitals',
	
		initialize: function() {
			this.render();
			
			// event binding
			_.bindAll(this, 'renderNetWorth', 'renderPendingCount');
			
			accounts.list
				.bind('add', this.renderNetWorth)
				.bind('remove', this.renderNetWorth)
				.bind('change', this.renderNetWorth);
			
			ledger.pending
				.bind('add', this.renderPendingCount)
				.bind('remove', this.renderPendingCount);
		},
		
		render: function() {
			if ($(this.el).is(':empty')) {
				// render skeleton
				$(this.el).html(tux.core.vitals());
			}
			this.renderNetWorth();
			this.renderPendingCount();
		},
		
		renderNetWorth: function() {
			var netWorth = accounts.list.getTotal();
			this.$('.net-worth strong').text(tux.util.formatCurrency(netWorth));
		},
		
		renderPendingCount: function() {
			var pendingCount = ledger.pending.length;
			this.$('.pending strong').text(pendingCount);
		}
	
	});
	
}());