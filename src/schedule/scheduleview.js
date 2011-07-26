namespace('tux.schedule');

(function() {
	'use strict';
	
	tux.schedule.ScheduleView = Backbone.View.extend({
		
		tagName: 'li',
	
		initialize: function() {
			this.render();
		},
		
		render: function() {
			var data = this.model.toJSON(),
				result;
			
			// get account and tag names
			data.account = this.model.getAccountName();
			data.tag = this.model.getTagName();
			data.frequency = this.freqCodes[data.freqCode]
			
			result = tux.schedule.scheduleView(data);
			$(this.el).empty().append(result);
		},
		
		freqCodes: {
			o: 'Once only',
			d: 'Daily',
			w: 'Weekly',
			f: 'Fortnightly',
			m: 'Monthly',
			y: 'Yearly'
		}
	
	});
	
}());