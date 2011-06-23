namespace('tux.accounts');

(function() {
	'use strict';
	
	tux.accounts.AccountListView = Backbone.View.extend({
	
		initialize: function() {
			// bindings
			_(this).bindAll('renderAccount');
			// compile and cache template
			$('#account-list-view').template('accountListView');
		},
		
		render: function() {
			var data = {
					total: this.collection.getTotal()
				},
				result = $.tmpl('accountListView', data);
			
			$(this.el).empty().append(result);
			this.collection.each(this.renderAccount);
		},
		
		renderAccount: function(account) {
			this.$('tr.total').before(account.el);
		}
	
	});
	
}());
