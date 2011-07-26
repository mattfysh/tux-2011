namespace('tux.schedule');

(function() {
	'use strict';
	
	tux.schedule.ScheduleForm = Backbone.View.extend({
	
		initialize: function() {
			// render
			this.render();
		},
		
		events: {
			'submit form': 'process'
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
		},
		
		process: function(e) {
			var sch = this.getScheduleFormData();
			
			this.trigger('newschedule', sch);
			
			e.preventDefault();
			e.target.reset();
		},
		
		getScheduleFormData: function() {
			// build schedule object
			var sch = {};
			this.$(':input:not(:submit)').each(function() {
				sch[this.getAttribute('name').replace(/\-\w/g, function(match) {
					return match[1].toUpperCase();
				})] = $(this).val();
			});
			
			// parse dates
			sch.start = tux.util.parseDate(sch.start);
			if (sch.end) {
				sch.end = tux.util.parseDate(sch.end);
			} else {
				delete sch.end;
			}
			
			// parse amount
			sch.amount = tux.util.parseCurrency(sch.amount);
			
			// process tag code
			if (this.$('input[name=tag]').data('code') === 'e') {
				sch.amount = sch.amount * -1;
			}
			
			return sch;
		}
	
	});
	
}());