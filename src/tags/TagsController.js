namespace('tux.tags');

(function() {
	'use strict';
	
	tux.tags.TagsController = Backbone.View.extend({
	
		initialize: function() {
			// add ul
			$(this.el).append('<ul>');
		}
	
	});
	
}());