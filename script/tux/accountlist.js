namespace('tux');

$(function() {
	
	tux.AccountList = Backbone.Collection.extend({
		
		model: tux.Account,
		localStorage: new Store('tuxaccounts'),
		
		nextId: function() {
			if (!this.length) return 1;
			return this.last().get('id') + 1;
		}
		
	});
	
});