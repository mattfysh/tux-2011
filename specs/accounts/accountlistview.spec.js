(function() {
	'use strict';
	
	// requires
	var AccountListView = tux.accounts.AccountListView;
	
	describe('Account list view', function() {
		
		beforeEach(function() {
			jasmine.getFixtures().fixturesPath = '/test/src/accounts/jst';
			loadFixtures('account-list-view.jst');
			
			this.list = new Backbone.Collection();
			this.list.getTotal = sinon.stub().returns(320);
			
			this.view = new AccountListView({
				collection: this.list
			});
			this.view.render();
		});
		
		it('should get and display the total', function() {
			var el = $(this.view.el);
			
			expect(this.list.getTotal).toHaveBeenCalled();
			expect(el.find('td:eq(1)')).toHaveText('320');
		});
		
		it('should refresh when an account is added or removed', function() {
			var el = $(this.view.el);
			
			this.list.getTotal.returns(620);
			this.list.trigger('add');
			expect(el.find('td:eq(1)')).toHaveText('620');
			
			this.list.getTotal.returns(600);
			this.list.trigger('remove');
			expect(el.find('td:eq(1)')).toHaveText('600');
		});
		
		it('should refresh when an account balance changes', function() {
			var el = $(this.view.el);
			this.list.getTotal.returns(1000);
			this.list.trigger('change');
			this.list.trigger('change:balance');
			expect(el.find('td:eq(1)')).toHaveText('1000');
		});
		
		it('should not refresh for other account attribute updates', function() {
			var el = $(this.view.el);
			this.list.trigger('change');
			this.list.trigger('change:name');
			expect(this.list.getTotal).toHaveBeenCalledOnce();
		});
	
	});
	
}());
