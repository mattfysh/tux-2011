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
			
			setFixtures(el);
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
		
		describe('submit', function() {
			
			var eventSpy;
			
			beforeEach(function() {
				fillForm(form.el, {
					account: '1',
					tag: '1',
					amount: '$1.11',
					desc: 'test',
					'freq-code': 'd',
					start: '1/01/2011',
					end: '12/12/2011'
				});
				form.$('input[name=tag]').data('code', 'i');
				
				eventSpy = sinon.spy();
				form.bind('newschedule', eventSpy)
			})
			
			it('should trigger custom event', function() {
				form.$(':submit').click();
				expect(eventSpy).toHaveBeenCalledWithExactly({
					account: '1',
					tag: '1',
					amount: 111,
					desc: 'test',
					freqCode: 'd',
					start: new Date(2011, 0, 1),
					end: new Date(2011, 11, 12)
				});
			});
			
			it('should reset', function() {
				form.$(':submit').click();
				expect(form.$('input[name=amount]')).toHaveValue('');
				expect(form.$('input[name=desc]')).toHaveValue('');
				expect(form.$('input[name=start]')).toHaveValue('');
				expect(form.$('input[name=end]')).toHaveValue('');
			});
			
			it('should negate amounts with expense tags', function() {
				form.$('input[name=tag]').data('code', 'e');
				form.$(':submit').click();
				
				expect(eventSpy.args[0][0].amount).toBe(-111);
			});
			
		});
	
	});
	
}());