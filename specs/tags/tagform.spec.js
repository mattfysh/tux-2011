(function() {
	'use strict';
	
	// requires
	var TagForm = tux.tags.TagForm;
	
	describe('Tag form', function() {
	
		loadTemplate('/test/src/tags/jst/tag-form.jst');
		
		var newTag = {
				name: 'dinner',
				type: 'ex'
			},
			form, view,
			name, type;
		
		beforeEach(function() {
			form = new TagForm();
			view = $(form.el);
			
			name = view.find('input[name=name]');
			type = view.find('select[name=type]');
			
			setFixtures(view);
		});
	
		it('should allow name input', function() {
			expect(view).toContain(name);
			expect(view).toContain(':submit');
		});
		
		it('should allow type input', function() {
			expect(view).toContain(type);
			expect(type).toContain('option[value=in]');
			expect(type).toContain('option[value=ex]');
		});
		
		it('should default to expense type', function() {
			expect(type).toHaveValue('ex');
		});
		
		it('should throw custom event with new tag on submit', function() {
			var eventSpy = sinon.spy();
			
			form.bind('newtag', eventSpy);
			fillForm(view.find('form'), newTag).submit();
			
			expect(eventSpy).toHaveBeenCalledWith(newTag);
		});
		
		it('should reset form on submit', function() {
			fillForm(view.find('form'), newTag).submit();
			expect(name).toHaveValue('');
			expect(type).toHaveValue('ex');
		});
	
	});
	
}());