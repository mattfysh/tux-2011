(function() {
	'use strict';
	
	// requires
	var TagsController = tux.tags.TagsController;
	
	describe('Tags app', function() {
		
		var view;
	
		//loadTemplate('/test/src/tags/jst/.jst');
	
		it('should add a list', function() {
			var app = new TagsController();
			view = $(app.el);
			expect(view).toContain('ul');
		});
	
	});
	
}());