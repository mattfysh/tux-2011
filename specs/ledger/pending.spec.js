(function() {
	'use strict';
	
	// requires
	var Pending = tux.ledger.Pending;
	
	describe('Pending collection', function() {
		
		var pending, txSpy, origTx;
	
		beforeEach(function() {
			// model spy
			origTx = tux.ledger.Tx;
			tux.ledger.Tx = Backbone.Model;
			txSpy = sinon.spy(tux.ledger, 'Tx');
			
			// kickoff
			pending = new Pending();
			pending.add([{
				date: new Date(2011, 0, 1),
				id: 1
			}, {
				date: new Date(2010, 0, 1),
				id: 2
			}]);
		});
		
		afterEach(function() {
			tux.ledger.Tx = origTx;
			localStorage.clear();
		});
	
		it('should use transaction model', function() {
			expect(txSpy).toHaveBeenCalled();
		});
		
		it('should persist', function() {
			var compStub = sinon.stub(Pending.prototype, 'comparator');
			
			pending.each(function(tx) {
				tx.save();
			});
			pending = new Pending();
			
			expect(pending.length).toBeGreaterThan(0);
			compStub.restore();
		});
		
		it('should sort by date', function() {
			expect(pending.at(0).id).toBe(2);
			expect(pending.at(1).id).toBe(1);
		});
	
	});
	
}());