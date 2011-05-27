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
			
			// add start marker
			var tx = {
				date: new Date(),
				amount: total,
				desc: 'Start Marker'
			};
			tx.date = util.makeDate(util.formatDate(tx.date)); // hack to reset to midnight
			txList.push(tx)
			total = 0;
			
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
				return tx.date;
			});
			
			// add running total
			_.each(txList, function(tx) {
				total += parseInt(tx.amount);
				tx.runningTotal = total;
			})
			
			return txList;
		},
		
		generateChartData: function() {
			var txList = this.getTxList(),
				dayTotal, lastDate, gap, chartData;
			
			// map tx list to timeline chart data
			
			chartData = _.map(txList, function(tx, i) {
				if (!lastDate) {
					lastDate = tx.date;
					dayTotal = tx.runningTotal;
				} else if (tx.date.getTime() === lastDate.getTime()) {
					dayTotal = tx.runningTotal;
				} else  {
					// new date, save last total, fill gap and start again
					gap = [];
					lastDate = new Date(lastDate.getTime());
					while (lastDate.getTime() !== tx.date.getTime()) {
						gap.push({
							date: new Date(lastDate.getTime()),
							total: dayTotal
						});
						lastDate.setDate(lastDate.getDate() + 1);
					}
					dayTotal = tx.runningTotal;
					if (i === txList.length - 1) gap.push({
						date: new Date(lastDate.getTime()),
						total: dayTotal
					});
					return gap;
				}
			});
			
			// flatten, remove undefined from array
			chartData = _.flatten(chartData);
			chartData = _.filter(chartData, function(t) {
				return t;
			});
			chartData = _.pluck(chartData, 'total');
			
			this.chartData = _.map(chartData, function(row) {
				return [row / 100];
			});
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
			this.model.generateChartData();
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
		},
		
		chartLoad: function() {
			reports.each(function(rpt) {
				var data = new google.visualization.DataTable();
				data.addColumn('number', 'Total');
				data.addRows(rpt.chartData);
				
				var chart = new google.visualization.AreaChart(document.getElementById('report-' + rpt.id));
				chart.draw(data, {
					width: 1100,
					height: 350,
					fontSize: '11',
					legend: 'none',
					backgroundColor: 'transparent'
				})
			});
		}
		
	});
	
});