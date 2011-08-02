namespace('tux.schedule');

(function() {
	'use strict';
	
	tux.schedule.Schedule = Backbone.Model.extend({
	
		initialize: function() {
			var now = new Date(),
				isOnceOff = this.get('freqCode') === 'o',
				pending, next, end;
			
			// restore dates
			this.set({
				start: new Date(this.get('start')),
				end: this.get('end') && new Date(this.get('end')),
				next: this.get('next') && new Date(this.get('next'))
			});
			end = this.get('end');

			// set next date if not present
			if (!this.get('expired') && !this.get('next')) {
				this.set({
					next: this.get('start')
				});
			}
			
			// process pending
			pending = this.getInstances(now);
			if (pending.length) {
				
				_.each(pending, _.bind(function(tx) {
					tux.refs.ledger.pending.create(tx);
				}, this));
				
				// update next
				if (!isOnceOff) {
					this.set({
						next: this.getNext(pending.pop().date)
					});
				}
			}
			
			// expire track if past end date
			if (end && end.getTime() <= now.getTime()
					|| pending.length === 1 && isOnceOff) {
				
				this.unset('next');
				this.set({
					expired: true
				});
				
			}
		},
		
		/**
		 * Instancing
		 */
		
		getInstances: function(to) {
			var instances = [],
				date = this.get('next'),
				end = this.get('end');
			
			if (!this.get('expired')) {
				// not expired, generate instances
				if (this.get('freqCode') === 'o') {
					// once off, check if date has passed
					if (date.getTime() <= to.getTime()) {
						instances.push(this.makeInstance(date));
					}
				} else {
					// repeat until given date
					if (end && to.getTime() > end.getTime()) {
						// dont generate past end date
						to = end;
					}
					
					while (date.getTime() <= to.getTime()) {
						// add instances to array and move to next
						instances.push(this.makeInstance(date));
						date = this.getNext(date);
					}
				}
			}
			
			return instances;
		},
		
		makeInstance: function(date) {
			return {
				date: date,
				account: this.get('account'),
				tag: this.get('tag'),
				amount: this.get('amount'),
				desc: this.get('desc')
			}
		},
		
		freqMap: {
			d: 'Date/1',
			w: 'Date/7',
			f: 'Date/14',
			m: 'Month/1',
			y: 'FullYear/1'
		},
		
		getNext: function(from) {
			var freq = this.freqMap[this.get('freqCode')].split('/'),
				unit = freq[0],
				num = parseInt(freq[1], 10),
				next = new Date(from.getTime());
			
			next['set' + unit](next['get' + unit]() + num);
			return next;
		},
		
		/**
		 * Linked model name replacement
		 */
		
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
		}
	
	});
	
}());