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
				next: new Date(2011, 0, 10),
				id: 1
			}, {
				expired: true,
				id: 2
			}, {
				next: new Date(2011, 0, 9),
				id: 3
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
		
		it('should sort by next date', function() {
			expect(list.at(0).id).toBe(3);
			expect(list.at(1).id).toBe(1);
		});
		
		it('should place expired at end', function() {
			expect(list.at(2).id).toBe(2);
		})
	
	});
	
}());