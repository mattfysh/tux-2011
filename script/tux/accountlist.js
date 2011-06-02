namespace('tux');

$(function() {
	
	tux.AccountList = Backbone.Collection.extend({
		
		model: tux.Account,
		localStorage: new Store('accounts'),
		
		total: function(accounts) {
			var total = 0;
			
			// get account totals
			this.each(function(account) {
				if (!accounts || _.indexOf(accounts, account.id) > -1) total += parseInt(account.get('bal'));
			})
			
			// get pending totals
			tux.pending.each(function(pending) {
				var accScope = !accounts || _(accounts).indexOf(pending.get('accountid')) > -1,
					isTransfer = pending.get('transfer'),
					transferScope = isTransfer && _(accounts).indexOf(pending.get('transfer')) > -1;
					
				// if pending tx is a transfer, and both accounts are in scope, ignore
				if (accScope && transferScope) return;
				// otherwise update total
				if (accScope) {
					total += parseInt(pending.get('amount'));
				} else if (transferScope) {
					total -= parseInt(pending.get('amount'));
				}
			});
			
			return total;
		},
		
		options: function() {
			return this.map(function(account) {
				return '<option value="' + account.id + '">' + account.get('name') + '</option>';
			}).join('');
		},
		
		totalLimit: function() {
			var limit = 0;
			this.each(function(account) {
				if (account.get('type') === 'c' && account.get('limit')) limit += parseInt(account.get('limit'));
			});
			return limit;
		}
		
	});
	
});