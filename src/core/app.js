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
				
				// create wrapper
				appWrap = $(tux.core.appWrapView({
					app: module.app,
					title: module.title
				}));
				
				// create app and export a reference
				app = tux.refs[module.app] = new tux[module.app][module.obj]();
				
				// wrap the app and append to app container
				
				appWrap.append(app.el);
				this.$('#app-container').append(appWrap);
				
				// create and add link
				link = tux.core.appLink({
					app: module.app,
					title: module.title
				});
				this.$('#nav').append(link);
				
			}).bind(this));
		},
		
		render: function() {
			var result = tux.core.tuxView();
			$(this.el).empty().append(result);
		}
	
	});
	
}());