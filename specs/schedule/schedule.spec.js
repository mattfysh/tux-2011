(function() {
	'use strict';
	
	// requires
	var Schedule = tux.schedule.Schedule;
	
	describe('Schedule model', function() {
		
		var schedule, clock, pending, createStub;
		
		function createSchedule(attr, now) {
			attr = _.extend({
				account: 1,
				tag: 1,
				amount: 213,
				desc: 'bus',
				freqCode: 'w',
				start: JSON.stringify(new Date(2011, 6, 13))
			}, attr);
			
			if (attr.end) {
				attr.end = JSON.stringify(attr.end);
			}
			
			// fake now
			clock = sinon.useFakeTimers((now || new Date(2011, 6, 20)).getTime(), 'Date');
			
			// kickoff
			schedule = new Schedule(attr);
			
			// restore
			clock.restore();
		}
		
		beforeEach(function() {
			var account = {},
				tag = {};
			
			// stub account
			account.get = sinon.stub().withArgs('name').returns('Bank abc');
			tag.get = sinon.stub().withArgs('name').returns('Tag abc');
			
			// stub accounts module
			namespace('tux.refs');
			tux.refs.accounts = new Backbone.View();
			tux.refs.accounts.list = new Backbone.Collection();
			sinon.stub(tux.refs.accounts.list, 'get').returns(account);
			
			// tags
			tux.refs.tags = new Backbone.View();
			tux.refs.tags.list = new Backbone.Collection();
			sinon.stub(tux.refs.tags.list, 'get').returns(tag);
			
			// pending
			namespace('tux.refs.ledger');
			pending = new Backbone.Collection();
			tux.refs.ledger.pending = pending;
			createStub = sinon.stub(pending, 'create', function() {
				pending.add.apply(pending, arguments);
			});
			
			createSchedule();

		});
		
		describe('init', function() {
			
			it('should restore start to proper date object', function() {
				expect(schedule.get('start')).toEqual(new Date(2011, 6, 13));
				
			});
			
			it('should allow end to be blank', function() {
				createSchedule();
				expect(schedule.get('end')).not.toBeDefined();
			});
			
			it('should restore end to proper date object', function() {
				createSchedule({
					end: new Date(2020, 6, 13)
				});
				expect(schedule.get('end')).toEqual(new Date(2020, 6, 13));
			});
			
			it('should create the pending txs', function() {
				var first = pending.at(0),
					second = pending.at(1);
				
				expect(createStub).toHaveBeenCalledTwice();
				expect(pending.length).toBe(2);
				
				expect(pending.at(0).attributes).toEqual({
					date: new Date(2011, 6, 13),
					account: 1,
					tag: 1,
					amount: 213,
					desc: 'bus'
				});
				
				expect(pending.at(1).attributes).toEqual({
					date: new Date(2011, 6, 20),
					account: 1,
					tag: 1,
					amount: 213,
					desc: 'bus'
				});
			});
			
			it('should update the next date', function() {
				expect(schedule.get('next')).toEqual(new Date(2011, 6, 27));
			});
			
			it('should restore next date to proper date object', function() {
				var attr = JSON.parse(JSON.stringify(schedule.attributes));
				createSchedule(attr);
				expect(schedule.get('next')).toEqual(new Date(2011, 6, 27));
			});
			
			it('should not create duplicate pending txs when restored', function() {
				var attr = JSON.parse(JSON.stringify(schedule.attributes));
				createSchedule(attr);
				expect(createStub).toHaveBeenCalledTwice();
			});
			
			it('should expire the track if no instances left', function() {
				createSchedule({
					end: new Date(2011, 8, 1)
				}, new Date(2011, 8, 1));
				
				expect(schedule.get('expired')).toBe(true);
				expect(schedule.get('next')).not.toBeDefined();
			});
			
			it('should expire once-off', function() {
				createSchedule({
					freqCode: 'o'
				}, new Date(2011, 8, 1));
				
				expect(schedule.get('expired')).toBe(true);
				expect(schedule.get('next')).not.toBeDefined();
			});
			
			it('should not create next date when schedule has expired', function() {
				createSchedule({
					freqCode: 'o'
				}, new Date(2011, 8, 1));
				expect(schedule.get('expired')).toBe(true);
				expect(schedule.get('next')).not.toBeDefined();
				var attr = JSON.parse(JSON.stringify(schedule.attributes));
				createSchedule(attr);
				expect(schedule.get('next')).not.toBeDefined();
			});
			
		});
		
		describe('instance generation', function() {
			
			function makeInstances(dateArr) {
				return _.map(dateArr, function(date) {
					return {
						date: date,
						account: 1,
						tag: 1,
						amount: 213,
						desc: 'bus'
					}
				});
			}
			
			it('should calculate next weekly instances', function() {
				createSchedule({
					freqCode: 'w'
				});
				var instances = schedule.getInstances(new Date(2011, 7, 10));
				expect(instances).toEqual(makeInstances([new Date(2011, 6, 27),
				                      new Date(2011, 7, 3),
				                      new Date(2011, 7, 10)]));
			});
			
			it('should calculate next daily instances', function() {
				createSchedule({
					freqCode: 'd'
				});
				var instances = schedule.getInstances(new Date(2011, 6, 23));
				expect(instances).toEqual(makeInstances([new Date(2011, 6, 21),
				                      new Date(2011, 6, 22),
				                      new Date(2011, 6, 23)]));
			});
			
			it('should calculate next fortnightly instances', function() {
				createSchedule({
					freqCode: 'f'
				});
				var instances = schedule.getInstances(new Date(2011, 7, 25));
				expect(instances).toEqual(makeInstances([new Date(2011, 6, 27),
				                      new Date(2011, 7, 10),
				                      new Date(2011, 7, 24)]));
			});
			
			it('should calculate next monthly instances', function() {
				createSchedule({
					freqCode: 'm'
				});
				var instances = schedule.getInstances(new Date(2011, 9, 13));
				expect(instances).toEqual(makeInstances([new Date(2011, 7, 13),
				                      new Date(2011, 8, 13),
				                      new Date(2011, 9, 13)]));
			});
			
			it('should calculate next yearly instances', function() {
				createSchedule({
					freqCode: 'y'
				});
				var instances = schedule.getInstances(new Date(2014, 6, 13));
				expect(instances).toEqual(makeInstances([new Date(2012, 6, 13),
				                      new Date(2013, 6, 13),
				                      new Date(2014, 6, 13)]));
			});
			
			it('should not generate past end date', function() {
				createSchedule({
					freqCode: 'd',
					end: new Date(2011, 6, 15)
				}, new Date(2011, 6, 12));
				var instances = schedule.getInstances(new Date(2011, 6, 18));
				expect(instances).toEqual(makeInstances([new Date(2011, 6, 13),
						                      new Date(2011, 6, 14),
						                      new Date(2011, 6, 15)]));
			});
			
			it('should not generate anything for expired schedules', function() {
				createSchedule({
					expired: true
				});
				var instances = schedule.getInstances(new Date(2011, 6, 18));
				expect(instances).toEqual([]);
			});
			
		});
		
		describe('name replacement', function() {
			
			it('should return the linked account name', function() {
				var accName = schedule.getAccountName();
				expect(accName).toBe('Bank abc');
			});
			
			it('should cache the linked account name', function() {
				schedule.getAccountName();
				schedule.getAccountName();
				expect(tux.refs.accounts.list.get).toHaveBeenCalledOnce();
			});
			
			it('should return the linked tag name', function() {
				var tagName = schedule.getTagName();
				expect(tagName).toBe('Tag abc');
			});
			
			it('should cache the linked tag name', function() {
				schedule.getTagName();
				schedule.getTagName();
				expect(tux.refs.tags.list.get).toHaveBeenCalledOnce();
			});
			
		});
	
	});
	
}());