(function() {
	'use strict';
	
	// requires
	var Vitals = tux.core.Vitals;
	
	describe('Vitals', function() {
	
		loadTemplate('/test/src/core/jst/vitals.jst');
		
		var vitals, el, netWorth, pending, getTotal,
			accountsList, pendingList;
		
		beforeEach(function() {
			accountsList = new Backbone.Collection();
			pendingList = new Backbone.Collection();
			
			// stub accounts
			namespace('accounts');
			accounts.list = accountsList;
			accountsList.getTotal = sinon.stub().returns(123);
			
			// stub ledger
			namespace('ledger');
			ledger.pending = pendingList;
			pendingList.add([{}, {}]);
			
			// kickoff
			vitals = new Vitals();
			el = $(vitals.el);
			netWorth = el.find('.net-worth');
			pending = el.find('.pending');
		});
	
		it('should have correct id', function() {
			expect(el).toHaveId('vitals');
		});
		
		describe('net worth', function() {
			
			it('should display net worth', function() {
				expect(netWorth).toHaveText('$1.23');
			});
			
			it('should update for all accounts events', function() {
				accountsList.getTotal = sinon.stub().returns(333);
				accountsList.trigger('add');
				
				expect(netWorth).toHaveText('$3.33');
				
				accountsList.getTotal.returns(111);
				accountsList.trigger('remove');
				expect(netWorth).toHaveText('$1.11');
				
				accountsList.getTotal.returns(222);
				accountsList.trigger('change');
				expect(netWorth).toHaveText('$2.22');
			});
			
		});
		
		describe('pending', function() {
			
			it('should display pending', function() {
				expect(pending).toHaveText('2 pending');
			});
			
			it('should update for pending size changes', function() {
				pendingList.add({});
				expect(pending).toHaveText('3 pending');
				
				pendingList.at(0).destroy();
				pendingList.at(0).destroy();
				expect(pending).toHaveText('1 pending');
			});
			
		});
	
	});
	
}());