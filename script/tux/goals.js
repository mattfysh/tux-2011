namespace('tux');

$(function() {
	
	var util = tux.util,
		schedules = tux.schedules,
		accounts = tux.accounts;
	
	tux.Goal = Backbone.Model.extend({
		
		findWhen: function(txList, start) {
			var goal = this.get('goal'),
				when, altTotal, found;
			
			if (typeof start === 'undefined') start = 0;
			
			// look through txList and find when goal can be met
			_.each(txList, function(tx, i) {
				if (i < start) return;
				if (tx.runningTotal >= goal && !altTotal) {
					// first possible date found, need to continue and ensure purchase doesnt push balance into red
					tx.runningTotal -= parseInt(goal);
					when = tx.date;
					found = i;
					altTotal = true;
				} else if (altTotal) {
					tx.runningTotal -= parseInt(goal);
					if (when && tx.runningTotal < 0) {
						// bal is back in red when total is affected by purchase, cancel when
						when = undefined;
						found = undefined;
					} else if (!when && tx.runningTotal >= 0) {
						// bal is back above 0, store when
						when = tx.date;
						found = i;
					}
				}
			});
			
			// store when
			this.when = when || 'Outside 12-months';
			
			return found;
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
			tmplData.when = this.model.when;
			if (typeof tmplData.when !== 'string') tmplData.when = util.formatDate(tmplData.when);
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
			this.txList = this.calcNet();
			this.availCredit = Math.abs(accounts.totalLimit());
			
			_.bindAll(this, 'addOne', 'render', 'addAll');
			goals.bind('add', this.addOne);
			goals.bind('all', this.render);
			goals.bind('refresh', this.addAll);
			goals.fetch();
		},
		
		calcNet: function() {
			var end = new Date(),
				txList = [],
				total;
		
			// push one year away and get all non-transfer schedules
			txList = [];
			end.setFullYear(end.getFullYear() + 1);
			schedules.each(function(schedule) {
				if (schedule.transfer) return; // ignore transfers in calculating net worth
				schedule.next(end);
				txList.push(schedule.getInstances(end));
			});
			
			// flatten, sort
			txList = _.flatten(txList);
			txList = _.sortBy(txList, function(tx) {
				return tx.date;
			});
			
			// transform to just date and running total
			total = accounts.total();
			_.each(txList, function(tx, i, list) {
				list[i] = {
						date: tx.date,
						runningTotal: (total += parseInt(tx.amount))
				}
			});
	
			// return 1 year tx list
			return txList;
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
			// calc when
			this.lastFoundIndex = goal.findWhen(this.txList, this.lastFoundIndex);
			
			// create view
			var view = new tux.GoalView({model: goal});
			this.el.find('table').append(view.render().el);
		},
		
		addAll: function() {
			goals.each(this.addOne);
		}
		
	});
	
});