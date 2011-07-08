namespace('tux.core');

(function() {
	'use strict';
	
	tux.core.Vitals = Backbone.View.extend({
	
		initialize: function() {
			this.render();
		},
		
		render: function() {
			var result = tux.core.vitals();
			$(this.el).empty().append(result);
		}
	
	});
	
}());