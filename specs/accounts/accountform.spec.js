(function() {
	'use strict';
	
	// requires
	var AccountForm = tux.accounts.AccountForm;
	
	describe('Accounts form', function() {
		
		function fillForm(view) {
			$(view.el).find('input[name=name]').val('test').end()
				.find('input[name=balance]').val(12).end()
				.find('input[type=submit]').click();
		}
		
		beforeEach(function() {
			jasmine.getFixtures().fixturesPath = '/test/src/accounts/jst';
			loadFixtures('account-form.jst');
			this.view = new AccountForm();
			setFixtures($(this.view.el));
		});
		
		it('should allow name and balance input', function() {
			var el = $(this.view.el);
			expect(el).toContain('input[name=name]');
			expect(el).toContain('input[name=balance]');
			expect(el).toContain('input[type=submit]');
		});
		
		it('should pass form data to custom event when submitted', function() {
			var eventSpy = sinon.spy();
			
			this.view.bind('newaccount', eventSpy);
			fillForm(this.view);
			
			expect(eventSpy).toHaveBeenCalledOnce();
			expect(eventSpy).toHaveBeenCalledWithExactly({
				name: 'test',
				balance: 12
			});
		});
		
		it('should reset form when submitted', function() {
			fillForm(this.view);
			
			expect(this.view.$('input[name=name]').val()).toBe('');
			expect(this.view.$('input[name=balance]').val()).toBe('');
		});
		
	});
	
}());
