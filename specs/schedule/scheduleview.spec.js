(function() {
	'use strict';
	
	// requires
	var ScheduleView = tux.schedule.ScheduleView;
	loadTemplate('/test/src/schedule/jst/schedule-view.jst');
	
	describe('Schedule view', function() {
		
		var view, model, el;
	
		beforeEach(function() {
			model = new Backbone.Model({
				account: 1,
				tag: 1,
				amount: 111,
				desc: 'test',
				freqCode: 'm',
				start: new Date(2011, 0, 1),
				end: new Date(2011, 5, 1)
			});
			model.getAccountName = sinon.stub().returns('Bank abc');
			model.getTagName = sinon.stub().returns('Tag abc');
			
			// kickoff
			view = new ScheduleView({
				model: model
			});
		});
		
		it('should use an li element as the view', function() {
			expect($(view.el)).toBe('li');
		});
	
		it('should display account', function() {
			expect(view.$('span.account')).toHaveText('Bank abc');
		});
		
		it('should display tag', function() {
			expect(view.$('span.tag')).toHaveText('Tag abc');
		});
		
		it('should show amount and desc', function() {
			expect(view.$('span.amount')).toHaveText('$1.11');
			expect(view.$('span.desc')).toHaveText('test');
		});
		
		it('should show frequency', function() {
			expect(view.$('span.frequency')).toHaveText('Monthly');
		});
		
		it('should show start and end dates', function() {
			expect(view.$('span.start')).toHaveText('1/01/2011');
			expect(view.$('span.end')).toHaveText('1/06/2011');
		});
	
	});
	
}());