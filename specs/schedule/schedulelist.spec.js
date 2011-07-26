(function() {
	'use strict';
	
	// requires
	var ScheduleList = tux.schedule.ScheduleList;
	
	describe('Schedule list', function() {
		
		var list, schSpy, origSch;
	
		beforeEach(function() {
			origSch = tux.schedule.Schedule;
			tux.schedule.Schedule = Backbone.Model;
			schSpy = sinon.spy(tux.schedule, 'Schedule');
			list = new ScheduleList();
			list.add([{
				start: new Date(2011, 0, 1),
				end: new Date(2011, 1, 1),
				id: 1
			}, {
				date: new Date(2010, 1, 1),
				end: new Date(2011, 2, 1),
				id: 2
			}]);
		});
		
		afterEach(function() {
			tux.schedule.Schedule = origSch;
			localStorage.clear();
		});
	
		it('should use schedule model', function() {
			expect(schSpy).toHaveBeenCalled();
		});
		
		it('should maintain txs between sessions', function() {
			// save each
			list.each(function(sch) {
				sch.save();
			});
			
			// overwrite list with new
			list = new ScheduleList();
			
			expect(list.length).toBeGreaterThan(0);
		});
	
	});
	
}());