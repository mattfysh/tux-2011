(function() {
	'use strict';
	
	// requires
	var AccountView = tux.accounts.AccountView;
	
	describe('Account view', function() {
		
		beforeEach(function() {
			// create account model
			var account = new Backbone.Model({
					name: 'test',
					balance: 12
				});
			
			// load account view template
			jasmine.getFixtures().fixturesPath = '/test/src/accounts/jst';
			loadFixtures('account-view.jst');
			
			// create view
			this.view = new AccountView({
				model: account
			});
		});
		
		it('should use a row as the view', function() {
			expect($(this.view.el)).toBe('tr');
		});
	
		it('should display name and balance data', function() {
			expect($(this.view.el).find('td:eq(0)')).toHaveText('test');
			expect($(this.view.el).find('td:eq(1)')).toHaveText('12');
		});
	
	});
	
}());
