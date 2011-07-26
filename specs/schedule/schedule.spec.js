(function() {
	'use strict';
	
	// requires
	var Schedule = tux.schedule.Schedule;
	
	describe('Schedule module', function() {
		
		var schedule;
		
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
			
			schedule = new Schedule({
				start: JSON.stringify(new Date(2011, 6, 13)),
				end: JSON.stringify(new Date(2011, 6, 13)),
				frequency: 'w'
			});
		});
		
		it('should restore the dates to proper date object', function() {
			expect(schedule.get('start').getTime()).toBe(new Date(2011, 6, 13).getTime());
			expect(schedule.get('end').getTime()).toBe(new Date(2011, 6, 13).getTime());
		});
		
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
	
		it('should calculate next instance', function() {
			var next = schedule.getNext();
			expect(next).toEqual([new Date(2011, 6, 13)]);
		});
		
		it('should calculate next instances up to a date', function() {
			var next = schedule.getNext(new Date(2011, 6, 27));
			expect(next).toEqual([new Date(2011, 6, 13),
			                      new Date(2011, 6, 20),
			                      new Date(2011, 6, 27)]);
		});
		
		it('should allow end to be blank', function() {
			schedule = new Schedule({
				start: JSON.stringify(new Date(2011, 6, 13)),
				frequency: 'w'
			});
			expect(schedule.get('end')).not.toBeDefined();
		})
	
	});
	
}());