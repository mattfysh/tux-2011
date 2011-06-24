namespace('tux.accounts');

(function() {
	'use strict';
	
	tux.accounts.AccountListView = Backbone.View.extend({
		
		tagName: 'tr',
	
		initialize: function() {
			// compile and cache template
			$('#account-list-view').template('accountListView');
			
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
			var result = $.tmpl('accountListView', {
					total: this.collection.getTotal()
				});
			$(this.el).empty().append(result);
		}
	
	});
	
}());
