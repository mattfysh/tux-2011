(function() {
	'use strict';
	
	// requires
	var Schedule = tux.schedule.Schedule;
	
	describe('Schedule module', function() {
		
		var schedule;
		
		beforeEach(function() {
			schedule = new Schedule({
				start: new Date(2011, 6, 13),
				frequency: 'w'
			});
		});
	
		it('should calculate next instance', function() {
			var next = schedule.getNext();
			expect(next).toEqual([new Date(2011, 6, 13)]);
		});
		
		it('should calculate next instances up to a date', function() {
			var next = schedule.getNext(new Date(2011, 6, 27));
			expect(next).toEqual([new Date(2011, 6, 13),
			                      new Date(2011, 6, 20),
			                      new Date(2011, 6, 27)]);
		});
	
	});
	
}());