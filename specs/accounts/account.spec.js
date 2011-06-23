(function() {
	'use strict';
	
	// requires
	var Account = tux.accounts.Account;
	
	describe('Account model', function() {
		
		describe('creation', function() {
			
			it('should default to zero balance', function() {
				var account = new Account({
					name: 'test'
				});
				expect(account.get('balance')).toBe(0);
			});
			
		});
		
		describe('validation', function() {
			
			beforeEach(function() {
				this.account = new Account({
					name: 'test',
					balance: 100
				});
				this.errorSpy = sinon.spy();
				this.account.bind('error', this.errorSpy);
			});
			
			it('should require balance to be a number', function() {
				this.account.set({
					balance: 20
				});
				
				expect(this.errorSpy).not.toHaveBeenCalled();
			});
			
			it('should throw error if balance is not a number', function() {
				this.account.set({
					balance: '20'
				});
				this.account.set({
					balance: function() {}
				});
				
				expect(this.errorSpy).toHaveBeenCalledTwice();
				expect(this.account.get('balance')).toBe(100);
			});
			
		});
		
		describe('balance adjustments', function() {
			
			beforeEach(function() {
				this.account = new Account({
					name: 'test',
					balance: 10000
				});
			});
			
			it('should adjust the balance', function() {
				var account = this.account;
				account.adjustBalance(200);
				expect(account.get('balance')).toBe(10200);
			}); 
			
		});
		
	});
	
}());