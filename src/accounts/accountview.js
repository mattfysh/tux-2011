namespace('tux.accounts');

(function() {
	'use strict';
	
	tux.accounts.AccountView = Backbone.View.extend({
	
		initialize: function() {
			// compile and cache template
			$('#account-view').template('accountView');
		},
		
		render: function() {
			var data = this.model.toJSON(),
				result = $.tmpl('accountView', data);
			$(this.el).empty().append(result);
		}
	
	});
	
}());