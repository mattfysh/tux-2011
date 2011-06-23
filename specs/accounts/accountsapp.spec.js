(function() {
	'use strict';
	
	// requires
	var AccountsApp = tux.accounts.AccountsApp;
	
	describe('Accounts app', function() {
		
		beforeEach(function() {
			var acc1, acc2, list, view, totalsView;
			
			// load html fixture
			jasmine.getFixtures().fixturesPath = '/test/specs/accounts/html';
			loadFixtures('accounts-app.html');
			
			// fake models
			this.acc1 = acc1 = new Backbone.Model();
			this.acc2 = acc2 = new Backbone.Model();
			
			// stub collection
			list = new Backbone.Collection();
			list.add([acc1, acc2]);
			this.listStub = sinon.stub(tux.accounts, 'AccountList').returns(list);
			
			// create app
			this.accounts = new AccountsApp({
				el: document.getElementById('accounts')
			});
		});
		
		afterEach(function() {
			this.listStub.restore();
		});
		
		it('should load the accounts list', function() {
			expect(this.listStub).toHaveBeenCalled();
		});
		
		it('should create a new view for each account', function() {
			
		});
		
		it('should add each account view in order', function() {
			
		});
		
		it('should add the totals last', function() {
			
		});
	
	});
	
}());