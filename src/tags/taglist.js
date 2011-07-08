namespace('tux.tags');

(function() {
	'use strict';
	
	tux.tags.TagList = Backbone.Collection.extend({
	
		initialize: function() {
			this.model = tux.tags.Tag;
			this.localStorage = new Store('tags');
			this.fetch();
		},
		
		comparator: function(tag) {
			return tag.get('name');
		}
	
	});
	
}());