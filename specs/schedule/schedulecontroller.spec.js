(function() {
	'use strict';
	
	// requires
	var ScheduleController = tux.schedule.ScheduleController;
	
	describe('Schedule controller', function() {
		
		var el, form, formStub;
	
		beforeEach(function() {
			// form
			form = new Backbone.View();
			formStub = sinon.stub(tux.schedule, 'ScheduleForm');
			formStub.returns(form);
			
			// kickoff
			var ctrl = new ScheduleController();
			el = $(ctrl.el);
		});
		
		afterEach(function() {
			formStub.restore();
		})
	
		it('should add a form', function() {
			expect(el).toContain(form.el);
		});
	
	});
	
}());