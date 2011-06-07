describe('Account model', function() {
	
	describe('when created', function() {
		
		it('should default to zero balance', function() {
			var account = new tux.accounts.Account({
				name: 'test',
				typeCode: 's'
			});
			expect(account.get('balance')).toEqual(0);
		});
		
	});
	
});