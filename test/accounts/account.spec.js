var Account = tux.accounts.Account;

describe('Account model', function() {
	
	describe('when created', function() {
		
		it('should default to zero balance', function() {
			var account = new Account({
				name: 'test',
				typeCode: 's'
			});
			expect(account.get('balance')).toEqual(0);
		});
		
	});
	
	describe('validation', function() {
		
		beforeEach(function() {
			this.account = new Account({
				name: 'test',
				typeCode: 's'
			});
		});
		
		it('should require balance to be a number', function() {
			var errorSpy = sinon.spy();
			
			this.account.bind('error', errorSpy);
			this.account.set({
				balance: 20
			});
			
			expect(errorSpy).toNotHaveBeenCalled();
		});
		
		it('should throw error if balance is not a number', function() {
			
		});
		
	});
	
	describe('balance adjustments', function() {
		
		beforeEach(function() {
			this.account = new Account({
				name: 'test',
				balance: 10000,
				typeCode: 's'
			});
		});
		
		it('should adjust the balance', function() {
			var account = this.account;
			account.adjustBalance(200);
			expect(account.get('balance')).toEqual(10200);
		}); 
		
	});
	
});