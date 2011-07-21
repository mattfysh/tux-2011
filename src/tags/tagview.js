namespace('tux.tags');

(function() {
	'use strict';
	
	tux.tags.TagView = Backbone.View.extend({
	
		tagName: 'li',
		
		initialize: function() {
			// proxy methods
			_(this).bindAll('remove');
			// render
			this.render();
			// bind to model
			this.model.bind('remove', this.remove);
		},
		
		render: function() {
			var data = this.model.toJSON(),
				result;
			
			data.code = this.codes[data.code];
			result = tux.tags.tagView(data);
			
			$(this.el).empty().append(result);
		},
		
		events: {
			'click a.destroy': 'destroy'
		},
		
		codes: {
			'e': 'expense',
			'i': 'income'
		},
		
		destroy: function(e) {
			e.preventDefault();
			this.model.destroy();
		}
	
	});
	
}());