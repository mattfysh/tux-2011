namespace('tux');

$(function() {
	
	tux.Report = Backbone.Model.extend({
		
	});
	
	tux.ReportList = Backbone.Collection.extend({
		
		model: tux.Report,
		localStorage: new Store('reports')
	
	});
	
	var reports = tux.reports = new tux.ReportList;
	
	tux.ReportView = Backbone.View.extend({
		
		tagName: 'div',
		template: $('#report-tmpl').template(),
		
		events: {
			'click a.remove': 'destroy'
		},
		
		initialize: function() {
			_.bindAll(this, 'remove');
			this.model.bind('remove', this.remove);
		},
		
		render: function() {
			var tmplData = this.model.toJSON();
			$(this.el).empty().append($.tmpl(this.template, tmplData));
			return this;
		},
	
		destroy: function(e) {
			e.preventDefault();
			this.model.destroy();
		}
		
	});
	
	tux.ReportApp = Backbone.View.extend({
		
		el: $('#reports'),
		
		events: {
			'submit form': 'create'
		},
		
		initialize: function() {
			_.bindAll(this, 'addOne', 'addAll');
			reports.bind('add', this.addOne);
			reports.bind('refresh', this.addAll);
			reports.fetch();
		},
		
		create: function(e) {
			e.preventDefault();
			reports.create(this.getNewReport());
		},
		
		getNewReport: function() {
			var report = {};
			this.el.find(':input:not(:submit)').each(function() {
				 if ($(this).val()) report[this.getAttribute('name')] = $(this).val();
			});
			this.el.find('form')[0].reset();
			return report;
		},
		
		addOne: function(report) {
			var view = new tux.ReportView({model: report});
			this.el.append(view.render().el);
		},
		
		addAll: function() {
			reports.each(this.addOne);
		}
		
	});
	
});