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
			list.add([{
				date: new Date(2011, 0, 1),
				id: 1
			}, {
				date: new Date(2010, 0, 1),
				id: 2
			}]);
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
			var compStub = sinon.stub(TxList.prototype, 'comparator');
			// save tx
			list.each(function(tx) {
				tx.save();
			});
			
			// overwrite list with new
			list = new TxList();
			
			expect(list.length).toBeGreaterThan(0);
			compStub.restore();
		});
		
		it('should sort in alphabetical order', function() {
			expect(list.at(0).id).toBe(2);
			expect(list.at(1).id).toBe(1);
		});

	});

}());