namespace('tux.schedule');

(function() {
	'use strict';
	
	tux.schedule.Schedule = Backbone.Model.extend({
	
		initialize: function() {
			
		},
		
		getNext: function(to) {
			var instances = [],
				next = this.get('start');
			
			do {
				instances.push(next);
				next = new Date(next.getTime());
				next.setDate(next.getDate() + 7);
			} while (to && next.getTime() <= to.getTime());
			
			return instances;
		}
	
	});
	
}());