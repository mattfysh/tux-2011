namespace('tux.schedule');

(function() {
	'use strict';
	
	tux.schedule.Schedule = Backbone.Model.extend({
	
		initialize: function() {
			// restore dates
			this.set({
				start: new Date(this.get('start')),
				end: this.get('end') && new Date(this.get('end'))
			});
		},
		
		getAccountName: function() {
			var account;
			
			// caching
			if (this.accountName) {
				return this.accountName;
			}
			
			// get name
			account = this.get('account');
			this.accountName = tux.refs.accounts.list.get(account).get('name');
			return this.accountName;
		},
		
		getTagName: function() {
			var tag;
			
			// caching
			if (this.tagName) {
				return this.tagName;
			}
			
			// get name
			tag = this.get('tag');
			this.tagName = tux.refs.tags.list.get(tag).get('name');
			return this.tagName;
		},
		
		getNext: function(to) {
			var instances = [],
				next = this.get('start');
			
			do {
				instances.push(next);
				next = new Date(next.getTime());
				next.setDate(next.getDate() + 7);
			} while (to && next.getTime() <= to.getTime());
			
			return instances;
		}
	
	});
	
}());