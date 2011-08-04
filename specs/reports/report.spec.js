(function() {
	'use strict';
	
	// requires
	var Report = tux.reports.Report;
	
	describe('Report model', function() {
		
		var jan = {
				date: new Date(2011, 0, 1),
				amount: 1,
				tag: 1
			},
			jan2 = {
				date: new Date(2011, 0, 2),
				amount: 100,
				tag: 1
			},
			jan3 = {
				date: new Date(2011, 0, 3),
				amount: 2,
				tag: 1
			},
			jan4 = {
				date: new Date(2011, 0, 4),
				amount: 3,
				tag: 3
			},
			jan5 = {
				date: new Date(2011, 0, 5),
				amount: 4,
				tag: 2
			},
			jan10 = {
				date: new Date(2011, 0, 10),
				amount: 5,
				tag: 2
			},
			jan11 = {
				date: new Date(2011, 0, 11),
				amount: 6,
				tag: 2
			},
			jan15 = {
				date: new Date(2011, 0, 15),
				amount: 7,
				tag: 1
			},
			jan16 = {
				date: new Date(2011, 0, 16),
				amount: 8,
				tag: 1
			},
			first, second,
			rep, txs;
		
		function makeReport(start, end) {
			rep = new Report({
				start: start,
				end: end
			});
			txs = rep.getTxList();
		}
		
		beforeEach(function() {
			// stub ledger
			namespace('ledger');
			ledger.list = new Backbone.Collection([jan, jan3]);
			ledger.pending = new Backbone.Collection([jan2, jan4, jan5]);
			
			// stub schedule
			namespace('schedule');
			first = new Backbone.Model();
			first.getInstances = sinon.stub().returns([jan10, jan15]);
			second = new Backbone.Model();
			second.getInstances = sinon.stub().returns([jan11, jan16]);
			schedule.list = new Backbone.Collection([first, second]);
			
			// stub accounts
			namespace('accounts');
			accounts.list = {
					getTotal: sinon.stub().returns(3)
			};
		});
		
		describe('with all txs included', function() {
			
			beforeEach(function() {
				// kickoff
				makeReport(new Date(2011, 0, 1), new Date(2011, 7, 1));
			});
			
			it('should compile a list of txs from the ledger', function() {
				expect(txs[0].date).toEqual(jan.date);
				expect(txs[2].date).toEqual(jan3.date);
			});
			
			it('should include txs from pending', function() {
				expect(txs[3].date).toEqual(jan4.date);
				expect(txs[4].date).toEqual(jan5.date);
			});
			
			it('should include txs from schedule', function() {
				expect(txs[5].date).toEqual(jan10.date);
				expect(txs[6].date).toEqual(jan11.date);
				expect(txs[7].date).toEqual(jan15.date);
				expect(txs[8].date).toEqual(jan16.date);
			});
			
			it('should pass end date to getinstances function', function() {
				var end = rep.get('end');
				expect(first.getInstances).toHaveBeenCalledWith(end);
				expect(second.getInstances).toHaveBeenCalledWith(end);
			});
			
			it('should correctly sort pending with ledger', function() {
				expect(txs[1].date).toEqual(jan2.date);
			});
			
		});
		
		describe('with exclusions', function() {
			
			it('should filter all before start date', function() {
				makeReport(new Date(2011, 0, 3), new Date(2011, 7, 1));
				expect(txs[0].date).toEqual(jan3.date);
			});
			
			it('should filter all after end date', function() {
				first.getInstances.returns([]);
				second.getInstances.returns([]);
				
				makeReport(new Date(2011, 0, 3), new Date(2011, 0, 4));
				
				expect(txs[1].date).toEqual(jan4.date);
				expect(txs[2]).toBeUndefined();
			});
			
			it('should add running total where no ledger/pending', function() {
				makeReport(new Date(2011, 0, 10), new Date(2011, 7, 1));
			});
			
			it('should return empty array if no txs', function() {
				first.getInstances.returns([]);
				second.getInstances.returns([]);
				makeReport(new Date(2011, 0, 6), new Date(2011, 0, 7));
				expect(txs.length).toBe(0); // dont check for [] as format function will fail this
			})
			
		});
		
		describe('charting', function() {
			
			beforeEach(function() {
				first.getInstances.returns([]);
				second.getInstances.returns([]);
				// kickoff
				makeReport(new Date(2010, 11, 30), new Date(2011, 0, 7));
			});

			it('should add a running total', function() {
				expect(_.pluck(txs, 'total')).toEqual([1, 101, 103, 106, 110]);
			});
			
			it('should add a formatter to the array', function() {
				expect(typeof txs.formatBy).toBe('function');
			});
			
			it('should format by date', function() {
				expect(txs.formatBy('date')).toEqual([{
					date: new Date(2010, 11, 30),
					total: 0
				}, {
					date: new Date(2010, 11, 31),
					total: 0
				}, {
					date: new Date(2011, 0, 1),
					total: 1
				}, {
					date: new Date(2011, 0, 2),
					total: 101
				}, {
					date: new Date(2011, 0, 3),
					total: 103
				}, {
					date: new Date(2011, 0, 4),
					total: 106
				}, {
					date: new Date(2011, 0, 5),
					total: 110
				}, {
					date: new Date(2011, 0, 6),
					total: 110
				}, {
					date: new Date(2011, 0, 7),
					total: 110
				}]);
			});
			
			it('should format by tag', function() {
				expect(txs.formatBy('tag')).toEqual([{
					tag: '1',
					total: 103
				}, {
					tag: '2',
					total: 4
				}, {
					tag: '3',
					total: 3
				}]);
			});
			
			it('should return empty array if no txs', function() {
				first.getInstances.returns([]);
				second.getInstances.returns([]);
				makeReport(new Date(2011, 0, 6), new Date(2011, 0, 7));
				expect(txs.formatBy('date')).toEqual([]);
				expect(txs.formatBy('tag')).toEqual([]);
			});
			
		});
		
	});
	
}());