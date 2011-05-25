namespace('tux');

$(function() {
	
	tux.AccountList = Backbone.Collection.extend({
		
		model: tux.Account,
		localStorage: new Store('accounts'),
		
		total: function(accounts) {
			var total = 0;
			this.each(function(account) {
				if (!accounts || _.indexOf(accounts, account.id) > -1) total += parseInt(account.get('bal'));
			})
			return total;
		},
		
		options: function() {
			return this.map(function(account) {
				return '<option value="' + account.id + '">' + account.get('name') + '</option>';
			}).join('');
		},
		
		availCredit: function() {
			var totalLimit = 0,
				totalUsed = 0,
				
				crAccs = this.filter(function(account) {
					return account.get('type') === 'c';
				});
			
			_.each(crAccs, function(account) {
				totalLimit += parseInt(account.get('limit'));
				totalUsed += parseInt(account.get('bal'));
			});
			
			return totalLimit - totalUsed;
		}
		
	});
	
});