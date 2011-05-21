namespace('tux');

$(function() {
	
	tux.AccountList = Backbone.Collection.extend({
		
		model: tux.Account,
		localStorage: new Store('accounts'),
		
		total: function() {
			var total = 0;
			this.each(function(account) {
				total += parseInt(account.get('bal'));
			})
			return total;
		},
		
		options: function() {
			return this.map(function(account) {
				return '<option value="' + account.id + '">' + account.get('name') + '</option>';
			}).join('');
		}
		
	});
	
});