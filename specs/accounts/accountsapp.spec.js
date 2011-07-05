(function() {
	'use strict';
	
	// requires
	var AccountsApp = tux.accounts.AccountsApp;
	
	describe('Accounts app', function() {
		
		beforeEach(function() {
			var list, view1, view2, view3, totalsView;
			
			// fake models and stub collection
			this.acc1 = new Backbone.Model({
				id: 1
			});
			this.acc2 = new Backbone.Model();
			this.acc3 = new Backbone.Model();
			this.list = list = new Backbone.Collection();
			list.add([this.acc1, this.acc2]);
			this.listStub = sinon.stub(tux.accounts, 'AccountList')
				.returns(list);
			
			// stub view
			view1 = new Backbone.View({
				el: $('<li>ANZ</li>')[0]
			});
			view2 = new Backbone.View({
				el: $('<li>CommBank</li>')[0]
			});
			view3 = new Backbone.View({
				el: $('<li>ME Bank</li>')[0]
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
				el: $('<li class="total">Total</li>')[0]
			});
			this.totalsStub = sinon.stub(tux.accounts, 'TotalView');
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
			this.accounts = new AccountsApp();
		});
		
		afterEach(function() {
			this.listStub.restore();
			this.viewStub.restore();
			this.totalsStub.restore();
			this.formStub.restore();
		});
		
		it('should add a list', function() {
			expect(this.accounts.$('ul')).toExist();
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
			expect(this.accounts.$('li:eq(0)')).toHaveText('ANZ');
			expect(this.accounts.$('li:eq(1)')).toHaveText('CommBank');
		});
		
		it('should create a totals view for the list', function() {
			expect(this.totalsStub).toHaveBeenCalledWithExactly({
				collection: this.list
			});
		});
		
		it('should add the totals view last', function() {
			expect(this.accounts.$('li:last')).toHaveText('Total');
		});
		
		it('should create a new accounts form', function() {
			expect(this.formStub).toHaveBeenCalled();
		});
		
		it('should add the accounts form to the page', function() {
			expect(this.accounts.$('form')).toExist();
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
			expect(this.accounts.$('li:eq(2)')).toHaveText('ME Bank');
		});
		
		it('should expose collection get method', function() {
			expect(this.accounts.get(1)).toBe(this.acc1);
		});
	
	});
	
}());
