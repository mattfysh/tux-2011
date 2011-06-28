(function() {
	'use strict';
	
	// requires
	var AccountView = tux.accounts.AccountView;
	
	describe('Account view', function() {
		
		loadTemplate('/test/src/accounts/jst/account-view.jst');
		
		beforeEach(function() {
			// create account model
			this.account = new Backbone.Model({
				name: 'test',
				balance: 12
			});
			
			// create view
			this.view = new AccountView({
				model: this.account
			});
			setFixtures(this.view.el);
		});
		
		it('should use li as the view', function() {
			expect($(this.view.el)).toBe('li');
		});
	
		it('should display name and balance data', function() {
			expect($(this.view.el).find('span.name')).toHaveText('test');
			expect($(this.view.el).find('span.balance')).toHaveText('$0.12');
		});
		
		it('should have a remove link', function() {
			expect($(this.view.el)).toContain('a.destroy');
		});
		
		it('should destroy the model on remove link click', function() {
			var destroyStub = sinon.stub(this.account, 'destroy');
			this.view.$('a.destroy').click();
			expect(destroyStub).toHaveBeenCalled();
			destroyStub.restore();
		});
		
		it('should remove itself from the DOM when model destroyed', function() {
			this.account.trigger('remove');
			expect($.contains(document.body, this.view.el)).toBeFalsy();
		});
	
	});
	
}());
