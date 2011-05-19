namespace('tux');

$(function() {
	
	tux.Schedule = Backbone.Model.extend({
		
		initialize: function() {
			// getting account model
			this.account = accounts.get(this.get('accountid'));
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
			'click a.remove': 'remove'
		},
		
		initialize: function(model) {
			_.bindAll(this, 'remove', 'render');
			this.model.account.bind('remove', this.remove)
				.bind('change:name', this.render);
		},
		
		render: function() {
			var tmplData = this.model.toJSON();
			tmplData.account = this.model.account.toJSON();
			$(this.el).empty().append($.tmpl(this.template, tmplData));
			return this;
		},
		
		remove: function(e) {
			e && e.preventDefault && e.preventDefault();
			this.model.destroy();
			$(this.el).remove();
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
				schedule[this.getAttribute('name')] = $(this).val();
			});
			this.el.find('form')[0].reset();
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