namespace('tux');

$(function() {
	
	var schedules = tux.schedules,
		accounts = tux.accounts,
		util = tux.util;
	
	/**
	 * Model
	 */
	
	tux.Report = Backbone.Model.extend({
		
		initialize: function() {
			this.generateChartData();
		},
		
		getTxList: function(accountType) {
			var txList = [],
				transferList = [],
				start = new Date(),
				end = new Date(),
				inclAcc = this.get('accountid'),
				total, tx;
			
			// remove accounts that dont match type filter
			if (accountType) {
				inclAcc = _.filter(inclAcc, function(accId) {
					return accounts.get(accId).get('type') === accountType
				});
			}
			
			// get total
			total = accounts.total(inclAcc);
			
			// set start and end dates, reset schedules
			start.setDate(start.getDate() - parseInt(this.get('behind')));
			end.setDate(end.getDate() + parseInt(this.get('ahead')));
			
			// add start marker
			var tx = {
				date: start,
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
			
			// add end marker
			var tx = {
				date: end,
				amount: 0,
				desc: 'End Marker'
			};
			tx.date = util.makeDate(util.formatDate(tx.date)); // hack to reset to midnight
			txList.push(tx)
			
			// add running total
			_.each(txList, function(tx) {
				total += parseInt(tx.amount);
				tx.runningTotal = total;
			})
			
			return txList;
		},
		
		generateChartData: function() {
			var savingsTxList = this.getTxList('s'),
				creditTxList = this.getTxList('c'),
				
				savingsChartData, creditChartData, netChartData = [],
				
				dayTotal, lastDate, gap;
			
			// map tx list to timeline chart data
			function convertToChart(tx, i, txList) {
				if (i === 0) {
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
			}
			
			// convert savings and credit tx lists to timeline chart data
			savingsChartData = _.map(savingsTxList, convertToChart);
			creditChartData = _.map(creditTxList, convertToChart);
			
			// flatten, remove undefined from array
			savingsChartData = _.flatten(savingsChartData);
			savingsChartData = _.compact(savingsChartData);
			
			creditChartData = _.flatten(creditChartData);
			creditChartData = _.compact(creditChartData);
			
			// build netChartData
			netChartData = [];
			for (var i = 0, l = savingsChartData.length; i < l; i += 1) {
				netChartData[i] = {
						date: util.formatDate(savingsChartData[i].date),
						total: savingsChartData[i].total + creditChartData[i].total
				};
			}
			
			// pluck then zip
			allChartData = [_.pluck(netChartData, 'date'), _.pluck(savingsChartData, 'total'),
			                _.pluck(creditChartData, 'total'), _.pluck(netChartData, 'total')];
			
			this.chartData = _.zip.apply(this, allChartData)
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
				// setup data
				var data = new google.visualization.DataTable();
				data.addColumn('string', 'x')
				data.addColumn('number', 'Savings');
				data.addColumn('number', 'Credit');
				data.addColumn('number', 'Net');
				data.addRows(rpt.chartData);
				
				// format data
				var formatter = new google.visualization.NumberFormat({
					prefix: '$',
					negativeColor: 'red',
					negativeParens: true
				});
				formatter.format(data, 1);
				
				// render chart
				var chart = new google.visualization.LineChart(document.getElementById('report-' + rpt.id));
				chart.draw(data, {
					width: 850,
					height: 350,
					fontSize: '11',
					legend: 'none',
					backgroundColor: 'transparent',
					chartArea: {
						top: 25,
						left: 25,
						width: 800,
						height: 300
					},
					hAxis: {
						textPosition: 'in',
						maxAlternation: 1,
						showTextEvery: 14
					},
					vAxis: {
						textPosition: 'in',
						format: '$#,###.##'
					}
				})
			});
		}
		
	});
	
});