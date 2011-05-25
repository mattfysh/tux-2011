namespace('tux');

$(function() {
	
	tux.Config = Backbone.Model.extend({
		
		localStorage: new Store('config')
		
	});
	
	tux.ConfigView = Backbone.View.extend({
		
		el: $('#config'),
		model: new tux.Config({id: 1}),
		
		events: {
			'click .theme a': 'changeTheme'
		},
		
		initialize: function() {
			_.bindAll(this, 'setTheme');
			this.model.bind('change:theme', this.setTheme);
			this.model.fetch();
		},
		
		changeTheme: function(e) {
			e.preventDefault();
			this.model.set({
				theme: $(e.target).attr('class')
			});
			this.model.save();
		},
		
		setTheme: function(config) {
			$('body').attr('class', config.get('theme'));
		},
		
		restoreSettings: function(config) {
			this.setTheme(config);
		}
		
	});
	
});