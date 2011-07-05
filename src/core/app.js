namespace('tux.core');

(function() {
	'use strict';
	
	tux.core.App = Backbone.View.extend({
	
		initialize: function(options) {
			// render
			this.render();
			
			// add modules
			namespace('tux.refs');
			_(options.modules).each(_(function(module) {
				var appWrap, app, link;
				
				// create app and export a reference
				app = tux.refs[module.app] = new tux[module.app][module.obj]();
				
				// create a wrapper
				appWrap = $(tux.core.appWrapView({
					module: module.app,
					title: module.title
				}));
				
				// wrap the apps view and append wrapper to app container
				appWrap.append(app.el);
				this.$('#app-container').append(appWrap);
				
				// create and add link
				link = tux.core.appLink({
					app: module.app,
					title: module.title
				});
				this.$('#nav').append(link);
				
			}).bind(this));
			
			// hide all apps and switch to first
			this.$('#app-container > div:eq(0)').addClass('current');
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
			this.$('#app-container > div.current').add('#' + module).toggleClass('current');
		}
	
	});
	
}());