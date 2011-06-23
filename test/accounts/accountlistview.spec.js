jasmine.getFixtures().fixturesPath = '/test/src/accounts/jst';

(function() {
	'use strict';
	
	// requires
	var AccountListView = tux.accounts.AccountListView;
	
	describe('Account list view', function() {
		
		beforeEach(function() {
			this.list = new Backbone.Collection();
			this.list.add([{
				name: 'ANZ',
				balance: 20
			}, {
				name: 'CommBank',
				balance: 300
			}]);
			this.list.getTotal = sinon.stub().returns(320);
			console.log(this.list.length);
			loadFixtures('account-list-view.jst');
			
			this.view = new AccountListView({
				collection: this.list
			});
		});
		
		it('should get and display the total', function() {
			var el = $(this.view.el);
			
			this.view.render();
			
			expect(this.list.getTotal).toHaveBeenCalled();
			expect(el.find('tr.total td:eq(1)')).toHaveText('320');
		});
	
		it('should add account views in correct order', function() {
			var el = $(this.view.el);
			
			this.list.at(0).el = $('<tr><td>ANZ</td><td>20</td></tr>')[0];
			this.list.at(1).el = $('<tr><td>CommBank</td><td>300</td></tr>')[0];
			this.view.render();
			
			expect(el.find('tr:eq(0) td:eq(0)')).toHaveText('ANZ');
			expect(el.find('tr:eq(1) td:eq(0)')).toHaveText('CommBank');
		});
	
	});
	
}());
