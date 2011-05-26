namespace('tux');

$(function() {
	
	var schedules = tux.schedules,
		accounts = tux.accounts,
		util = tux.util;
	
	/**
	 * Model
	 */
	
	tux.Report = Backbone.Model.extend({
		
		getTxList: function() {
			var txList = [],
				transferList = [],
				start = new Date(),
				end = new Date(),
				inclAcc = this.get('accountid'),
				total = accounts.total(inclAcc),
				tx;
			
			// set start and end dates, reset schedules
			start.setDate(start.getDate() - parseInt(this.get('behind')));
			end.setDate(end.getDate() + parseInt(this.get('ahead')));
			
			// generate tx list
			schedules.each(function(schedule) {
				var isScopedTx = _.indexOf(inclAcc, schedule.get('accountid')) > -1,
					isScopedTransfer = _.indexOf(inclAcc, schedule.get('transfer')) > -1;
				
				if (!isScopedTx && !isScopedTransfer) return;
				
				// push schedule out to end date
				schedule.next(end);
				if (isScopedTx) {
					// add to tx list
					txList.push(schedule.instances);
				}
				
				if (isScopedTransfer) {
					// add to transfer list
					txList.push(schedule.transfers);
				}
			})
			
			// flatten and sort array
			txList = _.flatten(txList);
			txList = _.sortBy(txList, function(tx) {
				return util.makeDate(tx.date);
			});
			
			// add running total
			_.each(txList, function(tx) {
				tx.runningTotal = util.formatCurrency(total += parseInt(tx.cents));
			})
			
			return txList;
		}
		
	});
	
	/**
	 * Collection
	 */
	
	tux.ReportList = Backbone.Collection.extend({
		
		model: tux.Report,
		localStorage: new Store('reports')
	
	});
	
	var reports = tux.reports = new tux.ReportList;
	
	/**
	 * View
	 */
	
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
			tmplData.txList = this.model.getTxList();
			$(this.el).empty().append($.tmpl(this.template, tmplData));
			return this;
		},
	
		destroy: function(e) {
			e.preventDefault();
			this.model.destroy();
		}
		
	});
	
	/**
	 * App
	 */
	
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
			if (!report.ahead) report.ahead = 0;
			if (!report.behind) report.behind = 0;
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