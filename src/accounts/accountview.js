namespace('tux.accounts');

(function() {
	'use strict';
	
	tux.accounts.AccountView = Backbone.View.extend({
		
		tagName: 'tr',
		
		initialize: function() {
			// compile and cache template
			$('#account-view').template('accountView');
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
				result = $.tmpl('accountView', data);
			$(this.el).empty().append(result);
			return this;
		},
		
		destroy: function(e) {
			e.preventDefault();
			this.model.destroy();
		}
	
	});
	
}());
