(function() {
	'use strict';
	
	// requires
	var Vitals = tux.core.Vitals;
	
	describe('Vitals', function() {
	
		loadTemplate('/test/src/core/jst/vitals.jst');
	
		it('should be defined', function() {
			var vitals = new Vitals();
			expect($(vitals.el)).toHaveText('Vitals');
		});
	
	});
	
}());