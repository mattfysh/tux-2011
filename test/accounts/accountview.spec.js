jasmine.getFixtures().fixturesPath = '/test/src/accounts/jst';

(function() {
	'use strict';
	
	// requires
	var AccountView = tux.accounts.AccountView;
	
	describe('Account view', function() {
	
		it('should display name and balance data', function() {
			var view,
				account = new Backbone.Model({
					name: 'test',
					balance: 12
				});
					
			loadFixtures('account-view.jst');
			view = new AccountView({
				model: account
			});
			view.render();
			
			expect($(view.el).find('td:eq(0)')).toHaveText('test');
			expect($(view.el).find('td:eq(1)')).toHaveText('12');
		});
	
	});
	
}());