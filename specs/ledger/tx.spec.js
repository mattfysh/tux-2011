(function() {
	'use strict';
	
	// requires
	var Tx = tux.ledger.Tx;
	
	describe('Tx model', function() {
		
		var tx;
		
		beforeEach(function() {
			var account = {},
				tag = {};
			
			// stub account
			account.get = sinon.stub().withArgs('name').returns('Bank abc');
			tag.get = sinon.stub().withArgs('name').returns('Tag abc');
			
			// stub accounts module
			namespace('tux.refs');
			tux.refs.accounts = new Backbone.View();
			tux.refs.accounts.list = new Backbone.Collection();
			sinon.stub(tux.refs.accounts.list, 'get').returns(account);
			
			// tags
			tux.refs.tags = new Backbone.View();
			tux.refs.tags.list = new Backbone.Collection();
			sinon.stub(tux.refs.tags.list, 'get').returns(tag);
			
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
			expect(tux.refs.accounts.list.get).toHaveBeenCalledOnce();
		});
		
		it('should return the linked tag name', function() {
			var tagName = tx.getTagName();
			expect(tagName).toBe('Tag abc');
		});
		
		it('should cache the linked tag name', function() {
			tx.getTagName();
			tx.getTagName();
			expect(tux.refs.tags.list.get).toHaveBeenCalledOnce();
		});
	
	});
	
}());