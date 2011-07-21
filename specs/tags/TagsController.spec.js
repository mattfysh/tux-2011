(function() {
	'use strict';
	
	// requires
	var TagsController = tux.tags.TagsController;
	
	describe('Tags controller', function() {
		
		var tag1, tag2,
			list, listStub,
			tagView1, tagView2, viewStub,
			form, formStub,
			view, ul,
			tags;
		
		beforeEach(function() {
			// model
			tag1 = new Backbone.Model();
			tag2 = new Backbone.Model();
			
			// list
			list = new Backbone.Collection([tag1, tag2]);
			listStub = sinon.stub(tux.tags, 'TagList').returns(list);
			
			// tag view
			tagView1 = $('<li>')[0];
			tagView2 = $('<li>')[0];
			viewStub = sinon.stub(tux.tags, 'TagView');
			
			viewStub.withArgs({
				model: tag1
			}).returns(new Backbone.View({
				el: tagView1
			}));
			
			viewStub.withArgs({
				model: tag2
			}).returns(new Backbone.View({
				el: tagView2
			}));
			
			// form
			form = new Backbone.View();
			formStub = sinon.stub(tux.tags, 'TagForm').returns(form);
			
			// kick off module
			tags = new TagsController();
			view = $(tags.el);
			ul = view.find('ul');
			setFixtures(view);
		});
			
		afterEach(function() {
			listStub.restore();
			viewStub.restore();
			formStub.restore();
		});
		
		describe('init', function() {
			
			it('should create a tag list', function() {
				expect(listStub).toHaveBeenCalled();
			});
			
			it('should add a ul elem', function() {
				expect(view).toContain('ul.tag-list');
			});
			
			it('should create a new view for each tag', function() {
				expect(viewStub).toHaveBeenCalledTwice();
			});
			
			it('should pass each tag to the view in order', function() {
				expect(viewStub.getCall(0)).toHaveBeenCalledWith({
					model: tag1
				});
				expect(viewStub.getCall(1)).toHaveBeenCalledWith({
					model: tag2
				});
			});
			
			it('should add each view to the ul elem in the correct order', function() {
				expect(ul).toContain(tagView1);
				expect(ul).toContain(tagView2);
				expect($(tagView1).next()).toBe(tagView2);
			});
			
			it('should create a new tag form', function() {
				expect(formStub).toHaveBeenCalled();
			});
			
			it('should append the form after the list', function() {
				expect(ul.next()).toBe(form.el);
			});
			
		});
		
		describe('event routing', function() {
			
			it('should send tags from form to list', function() {
				var createStub = sinon.stub(list, 'create'),
					newTag = {foo: 'bar'};
				
				form.trigger('newtag', newTag);
				
				expect(createStub).toHaveBeenCalledWith(newTag);
				createStub.restore();
			});
			
			it('should add new tags to list', function() {
				var newTag = new Backbone.Model(),
					newView = $('<li>')[0];
				
				viewStub.withArgs({
					model: newTag
				}).returns(new Backbone.View({
					el: newView
				}));
				
				list.trigger('add', newTag);
				
				expect(ul.find('li:last')).toBe(newView);
			});
			
			it('should expose the list get method', function() {
				expect(tags.get(0)).toBe(list.get(0));
			});
			
		});
		
	});
	
}());