namespace('tux.accounts');

(function() {
	'use strict';
	
	tux.accounts.TotalView = Backbone.View.extend({
		
		tagName: 'tr',
		className: 'total',
	
		initialize: function() {
			// event binding
			_(this).bindAll('render');
			this.collection
				.bind('add', this.render)
				.bind('remove', this.render)
				.bind('change:balance', this.render);
			
			// render
			this.render();
		},
		
		render: function() {
			var result = tux.accounts.totalView({
					total: this.collection.getTotal()
				});
			$(this.el).empty().append(result);
		}
	
	});
	
}());
