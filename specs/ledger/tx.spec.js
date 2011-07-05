(function() {
	'use strict';
	
	// requires
	var Tx = tux.ledger.Tx;
	
	describe('Tx model', function() {
		
		var tx;
		
		beforeEach(function() {
			var account = {};
			
			// stub account
			account.get = sinon.stub().withArgs('name').returns('Bank abc');
			
			// stub accounts module
			namespace('tux.refs');
			tux.refs.accounts = new Backbone.View();
			tux.refs.accounts.get = sinon.stub().returns(account);
			
			// create tx model
			tx = new Tx({
				account: 1
			});
		});
	
		it('should return the linked account name', function() {
			var accName = tx.getAccountName();
			expect(accName).toBe('Bank abc');
		});
		
		it('should cache the linked account name', function() {
			tx.getAccountName();
			tx.getAccountName();
			expect(tux.refs.accounts.get).toHaveBeenCalledOnce();
		});
	
	});
	
}());