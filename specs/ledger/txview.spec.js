(function() {
	'use strict';
	
	// requires
	var TxView = tux.ledger.TxView;
	
	describe('Tx view', function() {
		
		var view, model;
	
		loadTemplate('/test/src/ledger/jst/tx-view.jst');
		
		beforeEach(function() {
			var accounts;
			
			model = new Backbone.Model({
				account: 1,
				tag: 'food',
				amount: 312,
				desc: 'lunch'
			});
			model.getAccountName = sinon.stub().returns('Bank abc');
			
			view = new TxView({
				model: model
			});
		});
	
		it('should use an li element as the view', function() {
			expect($(view.el)).toBe('li');
		});
		
		it('should display account name', function() {
			expect($(view.el)).toContain('span.account');
			expect(view.$('span.account')).toHaveText('Bank abc');
		});
		
		it('should display tag, amount and description', function() {
			expect(view.$('span.tag')).toHaveText('food');
			expect(view.$('span.amount')).toHaveText('$3.12');
			expect(view.$('span.desc')).toHaveText('lunch');
		});
	
	});
	
}());