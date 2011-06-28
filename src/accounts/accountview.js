namespace('tux.accounts');

(function() {
	'use strict';
	
	tux.accounts.AccountView = Backbone.View.extend({
		
		tagName: 'li',
		
		initialize: function() {
			// event binding
			_(this).bindAll('remove');
			this.model.bind('remove', this.remove);
			// render view
			this.render();
		},
		
		events: {
			'click a.destroy': 'destroy'
		},
		
		render: function() {
			var data = this.model.toJSON(),
				result = tux.accounts.accountView(data);
			$(this.el).empty().append(result);
			return this;
		},
		
		destroy: function(e) {
			e.preventDefault();
			this.model.destroy();
		}
	
	});
	
}());
