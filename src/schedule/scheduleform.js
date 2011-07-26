namespace('tux.schedule');

(function() {
	'use strict';
	
	tux.schedule.ScheduleForm = Backbone.View.extend({
	
		initialize: function() {
			// render
			this.render();
		},
		
		render: function() {
			var result = tux.schedule.scheduleForm();
			$(this.el).empty().append(result);
			
			// add custom form inputs
			new tux.forms.OmniSelect({
				input: this.$('input[name=account]')[0],
				options: ['accounts']
			});
			new tux.forms.OmniSelect({
				input: this.$('input[name=tag]')[0],
				options: ['tags']
			});
			new tux.forms.OmniSelect({
				input: this.$('input[name=freq-code]')[0],
				options: [{
					name: 'Once only',
					value: 'o'
				}, {
					name: 'Daily',
					value: 'd'
				}, {
					name: 'Weekly',
					value: 'w'
				}, {
					name: 'Fortnightly',
					value: 'f'
				}, {
					name: 'Monthly',
					value: 'm'
				}, {
					name: 'Yearly',
					value: 'y'
				}]
			});
		}
	
	});
	
}());