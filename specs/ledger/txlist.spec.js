(function() {
	'use strict';

	// requires
	var TxList = tux.ledger.TxList;

	describe('Tx list', function() {
		
		var list, txSpy, origTx;
		
		beforeEach(function() {
			origTx = tux.ledger.Tx;
			tux.ledger.Tx = Backbone.Model;
			txSpy = sinon.spy(tux.ledger, 'Tx');
			list = new TxList();
			list.add({
				foo : 'bar'
			});
		});
		
		afterEach(function() {
			// restore tx model
			tux.ledger.Tx = origTx;
			// clear local storage
			localStorage.clear();
		});

		it('should use transaction model', function() {
			expect(txSpy).toHaveBeenCalled();
		});
		
		it('should maintain txs between sessions', function() {
			// save tx
			list.each(function(tx) {
				tx.save();
			});
			
			// overwrite list with new
			list = new TxList();
			
			expect(list.length).toBe(1);
			expect(list.at(0).get('foo')).toBe('bar');
		});

	});

}());