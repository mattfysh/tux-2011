(function() {
	'use strict';
	
	// requires
	var TagList = tux.tags.TagList;
	
	describe('Tag list', function() {
		
		var tag, tagSpy, list;
		
		beforeEach(function() {
			tag = tux.tags.Tag;
			tux.tags.Tag = Backbone.Model;
			tagSpy = sinon.spy(tux.tags, 'Tag');
			
			list = new TagList();
			list.add([{
				name: 'pay',
				type: 'in'
			}, {
				name: 'dinner',
				type: 'expense'
			}]);
		});
		
		afterEach(function() {
			tux.tags.Tag = tag;
			localStorage.clear();
		});
		
		it('should use the tag model', function() {
			expect(tagSpy).toHaveBeenCalledTwice();
		});
		
		it('should maintain tags between sessions', function() {
			list.each(function(tag) {
				tag.save();
			});
			list = new TagList();
			expect(list.length).toBe(2);
		});
	
		it('should sort in alphabetical order', function() {
			expect(list.at(0).get('name')).toBe('dinner');
			expect(list.at(1).get('name')).toBe('pay');
		});
	
	});
	
}());