namespace('tux.accounts');namespace('tux.accounts');

(function() {
	'use strict';
	
	tux.accounts.Account = Backbone.Model.extend({
		
		// model defaults
		defaults: {
			balance: 0
		},
		
		// adjust balance by given amount
		adjustBalance: function (amount) {
			this.set({
				balance: this.get('balance') + amount
			});
		},
		
		// validate model
		validate: function (attrs) {
			if (typeof attrs.balance !== 'number') {
				return 'balance must be a number';
			}
		}
		
	});
	
}());
namespace('tux.accounts');

(function() {
	'use strict';
	
	// balance validation
	var rBalance = /^(|(-?\$?|\$?-?)\d+\.?\d*)$/;
	
	tux.accounts.AccountForm = Backbone.View.extend({
		
		initialize: function() {
			// render
			this.render();
		},
		
		render: function() {
			var result = tux.accounts.accountForm();
			$(this.el).empty().append(result);
		},
		
		events: {
			'submit form': 'process'
		},
		
		process: function(e) {
			var account, error;
			e.preventDefault();
			
			// get form data
			account = this.getAccountFormData();
			// clear previous error
			this.$('p.error').remove();
			// validate form
			error = this.validate(account);
			if (error) {
				$(this.el).append($('<p>', {
					'class': 'error',
					text: error
				}));
			} else {
				// parse balance
				account.balance = parse(account.balance);
				// custom event
				this.trigger('newaccount', account);
				// reset form
				e.target.reset();
			}
		},
		
		getAccountFormData: function() {
			// build account object from form data
			var account = {};
			this.$(':input:not(:submit)').each(function() {
				account[this.getAttribute('name')] = $(this).val();
			});
			return account;
		},
		
		validate: function(account) {
			if (!account.name) {
				return 'name required';
			} else if(!rBalance.test(account.balance)) {
				return 'invalid balance format';
			}
		}
		
	});
	
}());
namespace('tux.accounts');

(function() {
	'use strict';
	
	tux.accounts.AccountList = Backbone.Collection.extend({
		
		initialize: function() {
			this.model = tux.accounts.Account;
			this.localStorage = new Store('accounts');
			this.fetch();
		},
		
		getTotal: function() {
			// calculate totals from all accounts
			return _(this.models).reduce(function(memo, account) {
				return memo + account.get('balance');
			}, 0);
		}
		
	});
	
}());
namespace('tux.accounts');

(function() {
	'use strict';
	
	tux.accounts.AccountsApp = Backbone.View.extend({
	
		id: 'accounts',
		
		initialize: function() {
			var totals, form;
			
			// add table to view
			$('<table>').appendTo(this.el);
			
			// event binding
			_(this).bindAll('addAccountToList', 'displayAccount');
			
			// accounts list
			this.list = new tux.accounts.AccountList();
			
			// totals view
			totals = new tux.accounts.TotalView({
				collection: this.list
			});
			this.$('table').append(totals.el);
			
			// form
			form = new tux.accounts.AccountForm();
			form.bind('newaccount', this.addAccountToList);
			$(this.el).append(form.el);
			
			// accounts models
			this.list.each(this.displayAccount);
			this.list.bind('add', this.displayAccount);
		},
		
		addAccountToList: function(account) {
			this.list.create(account);
		},
		
		displayAccount: function(account) {
			var view = new tux.accounts.AccountView({
				model: account
			});
			this.$('table tr.total').before(view.el);
		}
	
	});
	
}());
namespace('tux.accounts');

(function() {
	'use strict';
	
	tux.accounts.AccountView = Backbone.View.extend({
		
		tagName: 'tr',
		
		initialize: function() {
			// event binding
			_(this).bindAll('remove');
			this.model.bind('remove', this.remove);
			// render view
			this.render();
		},
		
		events: {
			'click a.destroy': 'destroy'
		},
		
		render: function() {
			var data = this.model.toJSON(),
				result = tux.accounts.accountView(data);
			$(this.el).empty().append(result);
			return this;
		},
		
		destroy: function(e) {
			e.preventDefault();
			this.model.destroy();
		}
	
	});
	
}());
namespace('tux.accounts');

(function() {
	'use strict';
	
	tux.accounts.TotalView = Backbone.View.extend({
		
		tagName: 'tr',
		className: 'total',
	
		initialize: function() {
			// event binding
			_(this).bindAll('render');
			this.collection
				.bind('add', this.render)
				.bind('remove', this.render)
				.bind('change:balance', this.render);
			
			// render
			this.render();
		},
		
		render: function() {
			var result = tux.accounts.totalView({
					total: this.collection.getTotal()
				});
			$(this.el).empty().append(result);
		}
	
	});
	
}());
tux.accounts.accountForm = function(obj) {
    var __p = [], print = function () {
        __p.push.apply(__p, arguments);
    };
    with (obj || {}) {
        __p.push("<form>\r\n\t<input type=\"text\" name=\"name\" />\r\n\t<input type=\"text\" name=\"balance\" />\r\n\t<input type=\"submit\" />\r\n</form>");
    }
    return __p.join("");
};
tux.accounts.accountView = function(obj) {
    var __p = [], print = function () {
        __p.push.apply(__p, arguments);
    };
    with (obj || {}) {
        __p.push("<td>", name, "</td><td>", format(balance), "</td><td><a class=\"destroy\" href=\"destroy\">delete</a></td>\r\n");
    }
    return __p.join("");
};
tux.accounts.totalView = function(obj) {
    var __p = [], print = function () {
        __p.push.apply(__p, arguments);
    };
    with (obj || {}) {
        __p.push("<td>Total</td><td>", format(total), "</td>\r\n");
    }
    return __p.join("");
};
