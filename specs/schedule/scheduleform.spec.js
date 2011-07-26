(function() {
	'use strict';
	
	// requires
	var ScheduleForm = tux.schedule.ScheduleForm;
	loadTemplate('/test/src/schedule/jst/schedule-form.jst');
	
	describe('Schedule form', function() {
		
		var form, el, omniSelStub;
	
		beforeEach(function() {
			omniSelStub = sinon.stub(tux.forms, 'OmniSelect');
			form = new ScheduleForm();
			el = $(form.el);
		});
		
		afterEach(function() {
			omniSelStub.restore();
		});
		
		describe('init', function() {
			
			it('should contain tx fields', function() {
				expect(el).toContain('input[name=account]');
				expect(el).toContain('input[name=tag]');
				expect(el).toContain('input[name=amount]');
				expect(el).toContain('input[name=desc]');
				expect(el).toContain(':submit');
			});
			
			it('should contain repeater fields', function() {
				expect(el).toContain('input[name=start]');
				expect(el).toContain('input[name=end]');
				expect(el).toContain('input[name=freq-code]');
			});
			
			it('should replace account input with omni select', function() {
				expect(omniSelStub).toHaveBeenCalledWith({
					input: form.$('input[name=account]')[0],
					options: ['accounts']
				});
			});
			
			it('should replace tag input with omni select', function() {
				expect(omniSelStub).toHaveBeenCalledWith({
					input: form.$('input[name=tag]')[0],
					options: ['tags']
				});
			});
			
			it('should use omniselect for frequency code', function() {
				expect(omniSelStub).toHaveBeenCalledWith({
					input: form.$('input[name=freq-code]')[0],
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
			})
			
		});
	
	});
	
}());