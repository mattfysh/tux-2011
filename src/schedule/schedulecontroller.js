namespace('tux.schedule');

(function() {
	'use strict';
	
	tux.schedule.ScheduleController = Backbone.View.extend({
	
		initialize: function() {
			// form
			var form = new tux.schedule.ScheduleForm();
			$(this.el).append(form.el);
			
			// list
			this.list = new tux.schedule.ScheduleList();
			$(this.el).append('<ul class="table-list">');
			
			// event binding
			_.bindAll(this, 'addScheduleToList', 'displaySchedule');
			form.bind('newschedule', this.addScheduleToList);
			this.list.bind('add', this.displaySchedule);
			
			// add model views
			this.list.each(this.displaySchedule);
			
		},
		
		addScheduleToList: function(sch) {
			this.list.create(sch);
		},
		
		displaySchedule: function(sch) {
			var view = new tux.schedule.ScheduleView({
				model: sch
			});
			$(this.el).find('ul.table-list').append(view.el);
		}
	
	});
	
}());