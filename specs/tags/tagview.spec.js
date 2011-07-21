(function() {
	'use strict';
	
	// requires
	var TagView = tux.tags.TagView;
	
	describe('Tag view', function() {
	
		loadTemplate('/test/src/tags/jst/tag-view.jst');
		
		var view, el, model, name, code, destroy;
		
		function makeView(tag) {
			model = new Backbone.Model(tag);
			view = new TagView({
				model: model
			});
			el = $(view.el);
			name = el.find('span.name');
			code = el.find('span.code');
			destroy = el.find('a.destroy');
			
			setFixtures(el);
		}
		
		describe('init', function() {
			
			it('should use li elem', function() {
				makeView();
				expect(el).toBe('li');
			});
			
			it('should show tag name and expense code', function() {
				makeView({
					name: 'dinner',
					code: 'e'
				});
				
				expect(el).toContain(name);
				expect(el).toContain(code);
				
				expect(name).toHaveText('dinner');
				expect(code).toHaveText('expense');
			});
			
			it('should show income code', function() {
				makeView({
					name: 'pay',
					code: 'i'
				});
				expect(code).toHaveText('income');
			});
			
		});
	
		describe('removal', function() {
			
			beforeEach(function() {
				makeView({
					name: 'pay',
					code: 'i'
				});
			});
			
			it('should have a destroy command', function() {
				expect(el).toContain(destroy);
			});
			
			it('should destroy model on command', function() {
				var destroyStub = sinon.stub(model, 'destroy');
				destroy.click();
				expect(destroyStub).toHaveBeenCalled();
				destroyStub.restore();
			});
			
			it('should remove itself from the DOM when model destroyed', function() {
				model.trigger('remove');
				expect($.contains(document.body, el[0])).toBeFalsy();
			});
			
		});
		
	
	});
	
}());