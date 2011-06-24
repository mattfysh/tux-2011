(function() {
	'use strict';
	
	// requires
	var AccountsApp = tux.accounts.AccountsApp;
	
	describe('Accounts app', function() {
		
		beforeEach(function() {
			var list, view1, view2, view3, totalsView;
			
			// load html fixture
			jasmine.getFixtures().fixturesPath = '/test/specs/accounts/html';
			loadFixtures('accounts-app.html');
			
			// fake models and stub collection
			this.acc1 = new Backbone.Model();
			this.acc2 = new Backbone.Model();
			this.acc3 = new Backbone.Model();
			this.list = list = new Backbone.Collection();
			list.add([this.acc1, this.acc2]);
			this.listStub = sinon.stub(tux.accounts, 'AccountList')
				.returns(list);
			
			// stub view
			view1 = new Backbone.View({
				el: $('<tr><td>ANZ</td><td>20</td></tr>')[0]
			});
			view2 = new Backbone.View({
				el: $('<tr><td>CommBank</td><td>300</td></tr>')[0]
			});
			view3 = new Backbone.View({
				el: $('<tr><td>ME</td><td>12</td></tr>')[0]
			});
			this.viewStub = sinon.stub(tux.accounts, 'AccountView');
			
			this.viewStub.withArgs({
				model: this.acc1
			}).returns(view1);
			
			this.viewStub.withArgs({
				model: this.acc2
			}).returns(view2);
			
			this.viewStub.withArgs({
				model: this.acc3
			}).returns(view3);
			
			// stub totals view
			totalsView = new Backbone.View({
				el: $('<tr class="total"><td>Total</td><td>320</td></tr>')[0]
			});
			this.totalsStub = sinon.stub(tux.accounts, 'AccountListView');
			this.totalsStub.withArgs({
				collection: list
			}).returns(totalsView);
			
			// stub form
			this.form = new Backbone.View({
				el: $('<form></form>')[0]
			});
			this.formStub = sinon.stub(tux.accounts, 'AccountForm')
				.returns(this.form);
			
			// create app
			this.accounts = new AccountsApp({
				el: document.getElementById('accounts')
			});
		});
		
		afterEach(function() {
			this.listStub.restore();
			this.viewStub.restore();
			this.totalsStub.restore();
			this.formStub.restore();
		});
		
		it('should load the accounts list', function() {
			expect(this.listStub).toHaveBeenCalled();
		});
		
		it('should create a new view for each account', function() {
			expect(this.viewStub.getCall(0)).toHaveBeenCalledWithExactly({
				model: this.acc1
			});
			expect(this.viewStub.getCall(1)).toHaveBeenCalledWithExactly({
				model: this.acc2
			});
		});
		
		it('should add each account view in order', function() {
			expect($('#accounts tr:eq(0) td:eq(0)')).toHaveText('ANZ');
			expect($('#accounts tr:eq(1) td:eq(0)')).toHaveText('CommBank');
		});
		
		it('should create a totals view for the list', function() {
			expect(this.totalsStub).toHaveBeenCalledWithExactly({
				collection: this.list
			});
		});
		
		it('should add the totals view last', function() {
			expect($('#accounts tr:last td:eq(1)')).toHaveText('320');
		});
		
		it('should create a new accounts form', function() {
			expect(this.formStub).toHaveBeenCalled();
		});
		
		it('should add the accounts form to the page', function() {
			expect($('#accounts form')).toExist();
		});
		
		it('should create new accounts from the form', function() {
			var createStub = sinon.stub(this.list, 'create'),
				newAccount = {
						name: 'test'
				};
			
			this.form.trigger('newaccount', newAccount);
			
			expect(createStub).toHaveBeenCalledWithExactly(newAccount);
		});
		
		it('should show any new accounts added to the collection', function() {
			this.list.trigger('add', this.acc3);
			expect($('#accounts tr:eq(2) td:eq(0)')).toHaveText('ME');
		});
	
	});
	
}());
