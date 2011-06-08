(function() {
	
	TestCase('Account model when created', {
		
		'test should default to zero balance': function() {
			var account = new tux.accounts.Account({
				name: 'test',
				typeCode: 's'
			});
			assertEquals(account.get('balance'), 0);
		},
		
		'test should allow a balance to be set': function() {
			var account = new tux.accounts.Account({
				name: 'test',
				balance: 100,
				typeCode: 's'
			});
			assertEquals(account.get('balance'), 100);
		}
		
	});
	
	TestCase('Account model balance adjustment', {
		
		setUp: function() {
			this.account = new tux.accounts.Account({
				name: 'test',
				balance: 10000,
				typeCode: 's'
			});
		},
		
		'test should adjust the balance': function() {
			var account = this.account;
			account.adjustBalance(200);
			assertEquals(account.get('balance'), 10200);
		},
		
		'test should not allow direct updates post-creation': function() {
			var account = this.account,
				errorSpy = sinon.spy();
			
			account.bind('error', errorSpy);
			account.set({
				balance: 200
			});
			
			assertTrue(errorSpy.called);
			assertTrue(errorSpy.calledWith(account, 'cannot set balance post-creation'));
			assertEquals(account.get('balance'), 10000);
		}
		
	});
	
}());