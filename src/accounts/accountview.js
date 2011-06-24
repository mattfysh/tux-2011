namespace('tux.accounts');

(function() {
	'use strict';
	
	tux.accounts.AccountView = Backbone.View.extend({
		
		tagName: 'tr',
		
		initialize: function() {
			// compile and cache template
			$('#account-view').template('accountView');
			// render view
			this.render();
		},
		
		render: function() {
			var data = this.model.toJSON(),
				result = $.tmpl('accountView', data);
			$(this.el).empty().append(result);
			return this;
		}
	
	});
	
}());
