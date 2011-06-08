describe('Account model', function() {
	
	describe('when created', function() {
		
		it('should default to zero balance', function() {
			var account = new tux.accounts.Account({
				name: 'test',
				typeCode: 's'
			});
			expect(account.get('balance')).toEqual(0);
		});
		
		it('should allow a balance to be set', function() {
			var account = new tux.accounts.Account({
				name: 'test',
				balance: 100,
				typeCode: 's'
			});
			expect(account.get('balance')).toEqual(100);
		});
		
	});
	
	describe('balance adjustments', function() {
		
		beforeEach(function() {
			this.account = new tux.accounts.Account({
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
		
		it('should not allow direct updates post-creation', function() {
			var account = this.account,
				errorSpy = sinon.spy();
			account.bind('error', errorSpy);
			expect(errorSpy.called).toBeTruthy();
			expect(account.get('balance')).toNotEqual(200);
		});
		
	});
	
});