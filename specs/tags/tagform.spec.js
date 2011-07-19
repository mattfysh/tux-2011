(function() {
	'use strict';
	
	// requires
	var TagForm = tux.tags.TagForm;
	
	describe('Tag form', function() {
	
		loadTemplate('/test/src/tags/jst/tag-form.jst');
		
		var newTag = {
				name: 'dinner',
				code: 'e'
			},
			form, view,
			name, code,
			omniStub;
		
		beforeEach(function() {
			// stub omniselect
			omniStub = sinon.stub(tux.forms, 'OmniSelect');
			
			form = new TagForm();
			view = $(form.el);
			
			name = view.find('input[name=name]');
			code = view.find('input[name=code]');
			
			setFixtures(view);
		});
		
		afterEach(function() {
			omniStub.restore();
		});
	
		it('should allow name and code input', function() {
			expect(view).toContain(name);
			expect(view).toContain(code);
		});
		
		it('should use omni select for type code', function() {
			expect(omniStub).toHaveBeenCalledWith({
				input: code[0],
				options: [{
					name: 'Expense',
					value: 'e'
				}, {
					name: 'Income',
					value: 'i'
				}]
			});
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
		});
	
	});
	
}());