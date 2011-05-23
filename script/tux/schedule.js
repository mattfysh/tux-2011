namespace('tux');

$(function() {
	
	var accounts = tux.accounts,
		util = tux.util;
	
	tux.Schedule = Backbone.Model.extend({
		
		initialize: function() {
			var end = this.get('end');
			if (end) this.set({end: new Date(end)});
			this.set({start: new Date(this.get('start'))});
			console.dir(this);
			// getting account model
			this.account = accounts.get(this.get('accountid'));
			_.bindAll(this, 'destroy', 'changeAccName');
			this.account.bind('remove', this.destroy)
				.bind('change:name', this.changeAccName);
		},
		
		changeAccName: function() {
			this.trigger('change:name');
		}
		
	});
	
	tux.ScheduleList = Backbone.Collection.extend({
		
		model: tux.Schedule,
		localStorage: new Store('schedules')
		
	});
	
	window.schedules = new tux.ScheduleList;
	
	tux.ScheduleView = Backbone.View.extend({
		
		tagName: 'tr',
		template: $('#schedule-tmpl').template(),
		
		events: {
			'click a.remove': 'destroy'
		},
		
		initialize: function(model) {
			_.bindAll(this, 'render', 'remove');
			this.model.bind('change:name', this.render)
				.bind('remove', this.remove)
		},
		
		render: function() {
			var tmplData = this.model.toJSON();
			tmplData.amount = util.formatCurrency(tmplData.amount);
			tmplData.start = util.formatDate(tmplData.start);
			tmplData.end && (tmplData.end = util.formatDate(tmplData.end));
			tmplData.frequency = this.freqNameMap[tmplData.frequency];
			tmplData.account = this.model.account.toJSON();
			$(this.el).empty().append($.tmpl(this.template, tmplData));
			return this;
		},
		
		freqNameMap: {
			o: 'Only Once',
			d: 'Daily',
			w: 'Weekly',
			f: 'Fortnightly',
			m: 'Monthly',
			y: 'Yearly'
		},
		
		destroy: function(e) {
			e.preventDefault();
			this.model.destroy();
		}
		
	});
	
	tux.ScheduleApp = Backbone.View.extend({
		
		el: $('#schedules'),
		events: {
			'submit form': 'create'
		},
		
		initialize: function() {
			_.bindAll(this, 'addOne', 'addAll');
			schedules.bind('add', this.addOne);
			schedules.bind('refresh', this.addAll);
			schedules.fetch();
		},
		
		create: function(e) {
			e.preventDefault();
			schedules.create(this.getNewSchedule());
		},
		
		getNewSchedule: function() {
			var schedule = {};
			this.el.find(':input:not(:submit)').each(function() {
				 if ($(this).val()) schedule[this.getAttribute('name')] = $(this).val();
			});
			schedule.start = util.makeDate(schedule.start);
			if (schedule.end) schedule.end = util.makeDate(schedule.end);
			this.el.find('form')[0].reset();
			console.dir(schedule);
			return schedule;
		},
		
		addOne: function(schedule) {
			var view = new tux.ScheduleView({model: schedule});
			this.el.find('table').append(view.render().el);
		},
		
		addAll: function() {
			schedules.each(this.addOne);
		}
		
	});
	
});