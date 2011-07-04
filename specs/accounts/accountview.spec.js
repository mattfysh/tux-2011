(function() {
	'use strict';
	
	// requires
	var AccountView = tux.accounts.AccountView;
	
	describe('Account view', function() {
		
		loadTemplate('/test/src/accounts/jst/account-view.jst');
		loadTemplate('/test/src/accounts/jst/account-edit-view.jst');
		
		beforeEach(function() {
			// create account model
			this.account = new Backbone.Model({
				name: 'test',
				balance: 12
			});
			this.account.save = sinon.stub();
			
			// create view
			this.view = new AccountView({
				model: this.account
			});
			setFixtures(this.view.el);
		});
		
		describe('initially', function() {
			
			it('should use li as the view', function() {
				expect($(this.view.el)).toBe('li');
			});
			
			it('should display name and balance data', function() {
				expect($(this.view.el)).toContain('span.name');
				expect(this.view.$('span.name')).toHaveText('test');
				expect($(this.view.el)).toContain('span.balance');
				expect(this.view.$('span.balance')).toHaveText('$0.12');
			});
			
			it('should have a remove link', function() {
				expect($(this.view.el)).toContain('a.destroy');
				expect(this.view.$('a.destroy')).toHaveAttr('title', 'Delete this account');
			});
			
			it('should have an edit link', function() {
				expect($(this.view.el)).toContain('a.edit');
				expect(this.view.$('a.edit')).toHaveAttr('title', 'Edit account details');
			});
			
		});
		
		describe('removal', function() {
			
			it('should destroy the model on remove link click', function() {
				var destroyStub = sinon.stub(this.account, 'destroy');
				this.view.$('a.destroy').click();
				expect(destroyStub).toHaveBeenCalled();
				destroyStub.restore();
			});
			
			it('should remove itself from the document when model destroyed', function() {
				this.account.trigger('remove');
				expect($.contains($(document.body), this.view.el)).toBeFalsy();
			});
			
		});
	
		describe('editing', function() {
			
			beforeEach(function() {
				this.view.$('a.edit').click();
			});
			
			function fillForm(view) {
				view.$('input[name=name]').val('new name');
				return view.$('input[name=balance]').val('12.34');
			}
			
			it('should switch to edit template on click', function() {
				var el = $(this.view.el);
				expect(el).toContain('form');
				expect(el).toContain('span.name input[name=name]');
				expect(this.view.$('span.name input[name=name]')).toHaveValue('test');
				expect(el).toContain('span.balance input[name=balance]');
				expect(this.view.$('span.balance input[name=balance]')).toHaveValue('$0.12');
				expect(el).toContain(':submit');
				expect($(document.activeElement)).toBe('input[name=name]');
			});
			
			it('should set new values on submit', function() {
				fillForm(this.view).submit();
				expect(this.account.get('name')).toBe('new name');
				expect(this.account.get('balance')).toBe(1234);
			});
			
			it('should save the account on submit', function() {
				fillForm(this.view).submit();
				expect(this.account.save).toHaveBeenCalled();
			});
			
			it('should revert to regular view after saving edit', function() {
				fillForm(this.view).submit();
				
				expect(this.view.$('span.name')).toHaveText('new name');
				expect(this.view.$('span.balance')).toHaveText('$12.34');
			});
			
			it('should revert to regular view without saving when escape pressed', function() {
				var escKey = $.Event('keyup');
				escKey.which = 27;
				
				fillForm(this.view).trigger(escKey);
				
				expect(this.view.$('span.name')).toHaveText('test');
				expect(this.view.$('span.balance')).toHaveText('$0.12');
			});
			
		});
	
	});
	
}());
