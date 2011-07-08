namespace('tux.tags');

(function() {
	'use strict';
	
	tux.tags.TagForm = Backbone.View.extend({
	
		initialize: function() {
			this.render();
		},
		
		render: function() {
			var result = tux.tags.tagForm();
			$(this.el).empty().append(result);
		},
		
		events: {
			'submit form': 'process'
		},
		
		process: function (e) {
			var tag = {};
			this.$(':input:not(:submit)').each(function() {
				tag[this.getAttribute('name')] = $(this).val();
			});
			
			this.trigger('newtag', tag);
			this.$('form')[0].reset();
			
			e.preventDefault();
		}
	
	});
	
}());