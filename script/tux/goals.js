namespace('tux');

$(function() {
	
	var util = tux.util,
		schedules = tux.schedules,
		accounts = tux.accounts;
	
	tux.Goal = Backbone.Model.extend({
		
		findWhen: function() {
			var end = new Date(),
				txList = [],
				goal = this.get('goal'),
				credit = this.get('credit'),
				availCredit = Math.abs(accounts.totalLimit()),
				goal = goal - Math.min(credit, availCredit),
				total,
				when;
			
			// keep generating
			for (var i = 0; !when && i < 12; i += 1) {
				// push to next month
				txList = [];
				end.setMonth(end.getMonth() + 1);
				schedules.each(function(schedule) {
					if (schedule.transfer) return; // ignore transfers in calculating net worth
					schedule.next(end);
					txList.push(schedule.instances);
				});
				
				// flatten
				txList = _.flatten(txList);
				// sort
				txList = _.sortBy(txList, function(tx) {
					return util.makeDate(tx.date);
				});
				
				// add running total
				total = accounts.total()
				_.each(txList, function(tx) {
					if (when) return;
					tx.runningTotal = (total += parseInt(tx.cents));
					if (tx.runningTotal >= goal) when = tx.date;
				});
				
			}
			
			// return
			return when || 'Not in the next year';
			
		}
		
	});
	
	tux.GoalList = Backbone.Collection.extend({
		
		model: tux.Goal,
		localStorage: new Store('goals')
		
	});
	
	tux.GoalView = Backbone.View.extend({
		
		tagName: 'tr',
		template: $('#goal-tmpl').template(),
		
		events: {
			'click a.remove': 'destroy'
		},
		
		initialize: function() {
			_.bindAll(this, 'remove');
			this.model.bind('remove', this.remove);
		},
		
		render: function() {
			var tmplData = this.model.toJSON();
			tmplData.when = this.model.findWhen();
			tmplData.goal = util.formatCurrency(tmplData.goal);
			tmplData.credit = util.formatCurrency(tmplData.credit);
			$(this.el).empty().append($.tmpl(this.template, tmplData));
			return this;
		},
		
		destroy: function(e) {
			e.preventDefault();
			this.model.destroy();
		}
		
	});
	
	var goals = tux.goals = new tux.GoalList;
	
	tux.GoalApp = Backbone.View.extend({
		
		el: $('#goals'),
		
		events: {
			'submit form': 'create'
		},
		
		initialize: function() {
			_.bindAll(this, 'addOne', 'render', 'addAll');
			goals.bind('add', this.addOne);
			goals.bind('all', this.render);
			goals.bind('refresh', this.addAll);
			goals.fetch();
		},
		
		create: function(e) {
			e.preventDefault();
			goals.create(this.getNewGoal());
		},
		
		getNewGoal: function() {
			var goal = {};
			this.el.find(':text').each(function() {
				goal[this.getAttribute('name')] = $(this).val();
			});
			this.el.find('form')[0].reset();
			return goal;
		},
		
		addOne: function(goal) {
			var view = new tux.GoalView({model: goal});
			this.el.find('table').append(view.render().el);
		},
		
		addAll: function() {
			goals.each(this.addOne);
		}
		
	});
	
});