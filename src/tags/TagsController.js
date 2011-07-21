namespace('tux.tags');

(function() {
	'use strict';
	
	tux.tags.TagsController = Backbone.View.extend({
	
		initialize: function() {
			var form;
			
			// proxy methods
			_(this).bindAll('sendTagToList', 'displayTag');
			
			// create list
			this.list = new tux.tags.TagList();
			
			// add ul
			$(this.el).append('<ul class="tag-list">');
			
			// create views
			this.list.each(this.displayTag);
			
			// create form and append
			form = new tux.tags.TagForm();
			$(this.el).append(form.el);
			
			// event binding
			form.bind('newtag', this.sendTagToList);
			this.list.bind('add', this.displayTag);
		},
		
		sendTagToList: function(tag) {
			this.list.create(tag);
		},
		
		displayTag: function(tag) {
			var view = new tux.tags.TagView({
				model: tag
			});
			this.$('ul.tag-list').append(view.el);
		},
		
		get: function(id) {
			return this.list.get(id);
		}
	
	});
	
}());