namespace('tux.schedule');

(function() {
	'use strict';
	
	tux.schedule.ScheduleController = Backbone.View.extend({
	
		initialize: function() {
			var form = new tux.schedule.ScheduleForm();
			$(this.el).append(form.el);
		}
	
	});
	
}());