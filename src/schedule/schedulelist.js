namespace('tux.schedule');

(function() {
	'use strict';
	
	tux.schedule.ScheduleList = Backbone.Collection.extend({
	
		initialize: function() {
			this.model = tux.schedule.Schedule;
			this.localStorage = new Store('schedule');
			this.fetch();
		}
	
	});
	
}());