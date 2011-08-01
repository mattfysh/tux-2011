(function() {
	'use strict';
	
	// requires
	var ScheduleController = tux.schedule.ScheduleController;
	
	describe('Schedule controller', function() {
		
		var el, form, formStub,
			list, listStub,
			rent, pay,
			rentView, payView, viewStub;
	
		beforeEach(function() {
			// form
			form = new Backbone.View();
			formStub = sinon.stub(tux.schedule, 'ScheduleForm');
			formStub.returns(form);
			
			// list
			list = new Backbone.Collection();
			listStub = sinon.stub(tux.schedule, 'ScheduleList');
			listStub.returns(list);
			
			// models
			rent = new Backbone.Model();
			pay = new Backbone.Model();
			list.add([rent, pay]);
			
			// views
			rentView = $('<li>')[0];
			payView = $('<li>')[0];
			viewStub = sinon.stub(tux.schedule, 'ScheduleView');
			viewStub.withArgs({
				model: rent
			}).returns(new Backbone.View({
				el: rentView
			}));
			viewStub.withArgs({
				model: pay
			}).returns(new Backbone.View({
				el: payView
			}));
			
			// kickoff
			var ctrl = new ScheduleController();
			el = $(ctrl.el);
		});
		
		afterEach(function() {
			formStub.restore();
			listStub.restore();
			viewStub.restore();
		});
		
		describe('init', function() {
		
			it('should add a form', function() {
				expect(el).toContain(form.el);
			});
			
			it('should create a list', function() {
				expect(listStub).toHaveBeenCalled();
			});
			
			it('should add a UL to the page', function() {
				expect(el).toContain('ul.table-list');
			});
			
			it('should add a view for each model', function() {
				expect(el.find('li:eq(0)')).toBe(rentView);
				expect(el.find('li:eq(1)')).toBe(payView);
			});
			
		});
	
		describe('routing', function() {
			
			it('should pass new schedules from form to list', function() {
				var sch = {
						name: 'test'
					},
					createStub = sinon.stub(list, 'create');
				
				form.trigger('newschedule', sch);
				expect(createStub).toHaveBeenCalledWithExactly(sch);
				createStub.restore();
			});
			
			it('should display new txs added to list', function() {
				var bills = new Backbone.Model(),
					billsView = $('<li>')[0];
				
				viewStub.withArgs({
					model: bills
				}).returns(new Backbone.View({
					el: billsView
				}));
				
				list.add(bills);
				expect(el.find('li:eq(2)')).toBe(billsView);
			});
		});
	
	});
	
}());