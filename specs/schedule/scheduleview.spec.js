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
				end: new Date(2011, 5, 1),
				next: new Date(2011, 0, 1)
			});
			model.getAccountName = sinon.stub().returns('Bank abc');
			model.getTagName = sinon.stub().returns('Tag abc');
			model.getNext = sinon.stub().returns([new Date(2011, 0, 1)]);
			
			// kickoff
			view = new ScheduleView({
				model: model
			});
			el = $(view.el);
		});
		
		it('should use an li element as the view', function() {
			expect(el).toBe('li');
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
			expect(view.$('span.start')).toHaveText('1/01/11');
			expect(view.$('span.end')).toHaveText('1/06/11');
		});
		
		it('should show next date', function() {
			expect(view.$('span.next')).toHaveText('1/01/11');
		});
		
		it('should not attempt to display a missing end date', function() {
			model.unset('end');
			view = new ScheduleView({
				model: model
			});
			expect(view.$('span.end')).toHaveText('');
		});
		
		it('should show a schedule has expired', function() {
			model.set({
				expired: true
			});
			model.unset('next');
			// refresh
			view = new ScheduleView({
				model: model
			});
			el = $(view.el);
			expect(el).toHaveClass('expired');
		});
	
	});
	
}());