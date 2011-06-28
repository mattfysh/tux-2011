(function() {
	'use strict';
	
	// requires
	var TotalView = tux.accounts.TotalView;
	
	describe('Account list view', function() {
		
		loadTemplate('/test/src/accounts/jst/total-view.jst');
		
		beforeEach(function() {
			this.list = new Backbone.Collection();
			this.list.getTotal = sinon.stub().returns(320);
			
			this.view = new TotalView({
				collection: this.list
			});
		});
		
		it('should use a li with total class as the view', function() {
			expect($(this.view.el)).toBe('li.total');
		});
		
		it('should get and display the total', function() {
			var el = $(this.view.el);
			
			expect(this.list.getTotal).toHaveBeenCalled();
			expect(el.find('span.total')).toHaveText('$3.20');
		});
		
		it('should refresh when an account is added or removed', function() {
			var el = $(this.view.el);
			
			this.list.getTotal.returns(620);
			this.list.trigger('add');
			expect(el.find('span.total')).toHaveText('$6.20');
			
			this.list.getTotal.returns(600);
			this.list.trigger('remove');
			expect(el.find('span.total')).toHaveText('$6.00');
		});
		
		it('should refresh when an account balance changes', function() {
			var el = $(this.view.el);
			this.list.getTotal.returns(1000);
			this.list.trigger('change');
			this.list.trigger('change:balance');
			expect(el.find('span.total')).toHaveText('$10.00');
		});
		
		it('should not refresh for other account attribute updates', function() {
			var el = $(this.view.el);
			this.list.trigger('change');
			this.list.trigger('change:name');
			expect(this.list.getTotal).toHaveBeenCalledOnce();
		});
	
	});
	
}());
