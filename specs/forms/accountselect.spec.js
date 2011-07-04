(function() {
	'use strict';
	
	// requires
	var AccountSelect = tux.forms.AccountSelect;
	
	describe('Account select input', function() {
		
		loadTemplate('/test/src/forms/jst/account-select-option.jst');
		
		var input, accSel;
		
		beforeEach(function() {
			var accounts;
			
			namespace('tux.refs');
			accounts = tux.refs.accounts = new Backbone.View();
			accounts.list = new Backbone.Collection([{
				name: 'Bank abc',
				id: 1
			}, {
				name: 'XYZ Bank',
				id: 2
			}]);
			
			input = $('<input type="text" name="account">');
			setFixtures(input);
			
			accSel = new AccountSelect({
				el: input[0]
			});
		});
		
		describe('init', function() {
			
			it('should use a wrapping div with class account-select', function() {
				expect($(accSel.el)).toBe('div.account-select');
			});
			
			it('should add the wrapper to the DOM', function() {
				expect($.contains($(document.body)[0], accSel.el)).toBeTruthy();
			});
			
			it('should wrap the original input element', function() {
				expect(accSel.$('input')).toBe(input);
			});
			
			it('should have an options list', function() {
				expect($(accSel.el)).toContain('ul');
			});
			
			it('should add an account to the options list', function() {
				expect(accSel.$('ul')).toContain('li');
				expect(accSel.$('ul li:eq(0)')).toHaveData('id', 1);
				expect(accSel.$('ul li:eq(0)')).toHaveText('Bank abc');
			});
			
			it('should add multiple accounts in order', function() {
				expect(accSel.$('ul li').length).toBe(2);
				expect(accSel.$('ul li:eq(1)')).toHaveData('id', 2);
				expect(accSel.$('ul li:eq(1)')).toHaveText('XYZ Bank');
			});
			
		});
		
		describe('selection', function() {
			
			beforeEach(function() {
				accSel.$('li:eq(1)').click();
			});
			
			it('should copy the account id to the input', function() {
				expect(accSel.$('input')).toHaveValue(2);
			});
			
		});
	
	});
	
}());