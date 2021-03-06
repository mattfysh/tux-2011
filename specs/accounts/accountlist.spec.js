(function() {
	'use strict';
	
	// requires
	var AccountList = tux.accounts.AccountList;
	
	describe('Accounts collection', function() {
		
		beforeEach(function() {
			// stub account model
			this.origModel = tux.accounts.Account;
			tux.accounts.Account = Backbone.Model;
			
			// add accounts
			this.accounts = new AccountList();
			this.accounts.add([{
				name: 'a',
				balance: 20
			}, {
				name: 'b',
				balance: 20
			}, {
				name: 'c',
				balance: 0 // default
			}]);
		});
		
		afterEach(function() {
			// restore model
			tux.accounts.Account = this.origModel;
			// clear local storage
			localStorage.clear();
		});
		
		it('should maintain accounts between sessions', function() {
			var accounts = this.accounts;
			
			// save all accounts
			accounts.each(function(account) {
				account.save();
			});
			
			// create new account list
			accounts = new AccountList();
			
			expect(accounts.length).toBe(3);
			expect(accounts.at(1).get('name')).toBe('b');
		});
		
		it('should total all accounts', function() {
			var total = this.accounts.getTotal();
			expect(total).toBe(40);
		});
		
	});
	
}());