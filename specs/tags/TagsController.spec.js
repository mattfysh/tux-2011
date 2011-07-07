(function() {
	'use strict';
	
	// requires
	var TagsController = tux.tags.TagsController;
	
	describe('Tags controller', function() {
		
		var view;
	
		//loadTemplate('/test/src/tags/jst/.jst');
	
		it('should add a list', function() {
			// kick off module
			var tags = new TagsController();
			view = $(tags.el);
			expect(view).toContain('ul');
		});
	
	});
	
}());