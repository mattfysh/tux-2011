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
			namespace('accounts');
			accounts = new Backbone.View();
			accounts.list = new Backbone.Collection();
			sinon.stub(accounts.list, 'get').returns(account);
			
			// tags
			namespace('tags');
			tags = new Backbone.View();
			tags.list = new Backbone.Collection();
			sinon.stub(tags.list, 'get').returns(tag);
			
			// create tx model
			tx = new Tx({
				account: 1,
				date: JSON.stringify(new Date(2011, 1, 12))
			});
		});
		
		it('should restore the date to proper date object', function() {
			expect(tx.get('date').getTime()).toBe(new Date(2011, 1, 12).getTime());
		});
	
		it('should return the linked account name', function() {
			var accName = tx.getAccountName();
			expect(accName).toBe('Bank abc');
		});
		
		it('should cache the linked account name', function() {
			tx.getAccountName();
			tx.getAccountName();
			expect(accounts.list.get).toHaveBeenCalledOnce();
		});
		
		it('should return the linked tag name', function() {
			var tagName = tx.getTagName();
			expect(tagName).toBe('Tag abc');
		});
		
		it('should cache the linked tag name', function() {
			tx.getTagName();
			tx.getTagName();
			expect(tags.list.get).toHaveBeenCalledOnce();
		});
	
	});
	
}());