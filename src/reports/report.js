namespace('tux.reports');

(function() {
	'use strict';
	
	function formatBy(start, end, facet) {
		var totals = {},
			entries = [],
			dateCursor = new Date(start.getTime()),
			cursor = 0,
			total;
		
		if (!this.length) {
			return entries;
		}
		
		if (facet === 'date') {
			// get implied starting total
			total = this[0].total - this[0].amount;
			
			// add entries
			while (dateCursor <= end) {
				// find total
				while (this[cursor] && this[cursor].date <= dateCursor) {
					total = this[cursor].total;
					cursor += 1;
				}
				// add it and move to next date
				totals[dateCursor.getTime()] = total;
				dateCursor.setDate(dateCursor.getDate() + 1);
			}
			
			// format output
			_.each(totals, function(total, date) {
				entries.push({
					date: new Date(parseInt(date, 10)),
					total: total
				})
			})
			
		} else if (facet === 'tag') {
			// add entries
			_.each(this, function(tx) {
				totals[tx.tag] = (totals[tx.tag] || 0) + tx.amount;
			});
			
			// format output
			_.each(totals, function(total, tag) {
				entries.push({
					tag: tag,
					total: total
				});
			});
		}
		
		return entries;
	}
	
	tux.reports.Report = Backbone.Model.extend({
	
		initialize: function() {
			
		},
		
		getTxList: function() {
			var txs = [],
				scheduleTxs = [],
				start = this.get('start'),
				end = this.get('end'),
				ledgerCount, total;
			
			// concat tx list
			txs = txs.concat(ledger.list.toJSON());
			txs = txs.concat(ledger.pending.toJSON());
			
			// exclude those out of range
			txs = _.reject(txs, function(tx) {
				return tx.date < start || tx.date > end;
			});
			ledgerCount = txs.length;
			
			// add scheduled instances
			schedule.list.each(function(track) {
				scheduleTxs = scheduleTxs.concat(track.getInstances(end));
			});
			scheduleTxs = _.sortBy(scheduleTxs, function(tx) {
				return tx.date;
			});
			txs = txs.concat(scheduleTxs);
			
			// sort
			txs = _.sortBy(txs, function(tx) {
				return tx.date;
			});
			
			// calc total
			total = accounts.list.getTotal();
			total += ledger.pending.reduce(function(memo, tx) {
				return memo + tx.get('amount');
			}, 0);
			
			// set baseline
			if (ledgerCount) {
				txs[ledgerCount - 1].total = total;
			} else if (txs.length) {
				txs[ledgerCount].total = total + txs[ledgerCount];
				ledgerCount += 1;
			}
			
			// backwards runner
			for (var i = ledgerCount - 2; i >= 0; i -= 1) {
				txs[i].total = txs[i + 1].total - txs[i + 1].amount;
			}
			
			// forwards runner
			for (var i = ledgerCount, l = txs.length; i < l; i += 1) {
				txs[i].total = txs[i - 1].total + txs[i].amount;
			}
			
			// return tx list
			txs.formatBy = _.bind(formatBy, txs, start, end);
			return txs;
		}
	
	});
	
}());