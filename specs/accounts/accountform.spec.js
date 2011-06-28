(function() {
	'use strict';
	
	// requires
	var AccountForm = tux.accounts.AccountForm;
	
	describe('Accounts form', function() {
		
		loadTemplate('/test/src/accounts/jst/account-form.jst');
		
		function fillForm(view, balance) {
			$(view.el).find('input[name=name]').val('test').end()
				.find('input[name=balance]').val(balance || '$300.00').end()
				.find(':submit').click();
		}
		
		beforeEach(function() {
			this.view = new AccountForm();
			setFixtures($(this.view.el));
		});
		
		it('should allow name and balance input', function() {
			var el = $(this.view.el);
			expect(el).toContain('input[name=name]');
			expect(el).toContain('input[name=balance]');
			expect(el).toContain(':submit');
		});
		
		it('should pass form data to custom event when submitted', function() {
			var eventSpy = sinon.spy();
			
			this.view.bind('newaccount', eventSpy);
			fillForm(this.view);
			
			expect(eventSpy).toHaveBeenCalledOnce();
			expect(eventSpy).toHaveBeenCalledWithExactly({
				name: 'test',
				balance: 30000
			});
		});
		
		it('should reset form when submitted', function() {
			fillForm(this.view);
			
			expect(this.view.$('input[name=name]').val()).toBe('');
			expect(this.view.$('input[name=balance]').val()).toBe('');
		});
		
		describe('validation', function() {
			
			it('should require a name', function() {
				var eventSpy = sinon.spy();
				this.view.bind('newaccount', eventSpy);
				this.view.$(':submit').click();
				expect(eventSpy).not.toHaveBeenCalled();
				expect(this.view.$('p.error')).toHaveText('name required');
			});
			
			it('should not show more than one error at a time', function() {
				this.view.$(':submit').click();
				this.view.$(':submit').click();
				expect(this.view.$('p.error').length).toBe(1);
			});
			
			it('should require balance to contain only digits, neg prefix, $ and decimal point', function() {
				var eventSpy = sinon.spy();
				this.view.bind('newaccount', eventSpy);
				
				fillForm(this.view, '-abc123');
				expect(eventSpy).not.toHaveBeenCalled();
				expect(this.view.$('p.error')).toHaveText('invalid balance format');
				
				fillForm(this.view, '-$12000.00');
				expect(eventSpy).toHaveBeenCalled();
				expect(this.view.$('p.error')).not.toExist();
			});
			
			it('should require balance in correct format', function() {
				var eventSpy = sinon.spy();
				this.view.bind('newaccount', eventSpy);
				
				_(['-', '$', '$', '$.', '.', ',', '-$.', '.-3$00', '2.0-$']).each(_(function(balance) {
					fillForm(this.view, balance);
					expect(eventSpy).not.toHaveBeenCalled();
					expect(this.view.$('p.error')).toHaveText('invalid balance format');
				}).bind(this));
			});
			
		});
		
	});
	
}());
