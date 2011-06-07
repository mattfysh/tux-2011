describe('Account model', function() {
	
	var Account = tux.accounts.Account;
	
	describe('when created', function() {
		
		it('should default to zero balance', function() {
			var account = new Account({
				name: 'test',
				typeCode: 's'
			});
			expect(account.get('balance')).toEqual(0);
		});
		
	});
	
});