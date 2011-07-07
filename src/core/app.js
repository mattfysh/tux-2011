namespace('tux.core');

(function() {
	'use strict';
	
	tux.core.App = Backbone.View.extend({
	
		initialize: function(options) {
			// render
			this.render();
			
			// create namespace to store references to modules
			namespace('tux.refs');
			
			// add each module
			_(options.modules).each(_(function(spec) {
				var module, wrapper, link;
				
				// create app and export a reference
				module = tux.refs[spec.name] = new spec.obj();
				
				// create a wrapper around module view
				wrapper = $(tux.core.moduleWrap(spec));
				wrapper.append(module.el);
				
				// append the wrapper to the module container
				this.$('#module-container').append(wrapper);
				
				// create and add link
				link = tux.core.moduleLink(spec);
				this.$('#nav').append(link);
				
			}).bind(this));
			
			// hide all apps and switch to first
			this.$('#module-container > div:eq(0)').addClass('current');
			this.$('#nav li:eq(0)').addClass('current');
		},
		
		events: {
			'click #nav li': 'select'
		},
		
		render: function() {
			var result = tux.core.tuxView();
			$(this.el).empty().append(result);
		},
		
		select: function(e) {
			var module = $(e.target).attr('class'),
				item = $(e.target).parent('li');
			e.preventDefault();
			
			if (item.hasClass('current')) {
				// already current
				return;
			}
			
			this.$('#nav li.current').add(item).toggleClass('current');
			this.$('#module-container > div.current').add('#' + module).toggleClass('current');
		}
	
	});
	
}());