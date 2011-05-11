namespace('tux');
!function() {
	
	var accounts, reports, tmpl;
	
	function init(spec) {
		view = spec.view;
		tmpl = view.find('#report').template();
		accounts = spec.accounts;
		schedule = spec.schedule;
		reports = spec.reports;
		bindui();
		render();
	}
	
	function bindui() {
		view.delegate('a.edit', 'click', edit)
			.delegate('a.delete', 'click', remove)
	}
	
	function edit(e) {
		var t = $(e.target);
		console.dir(accounts);
	}
	
	function remove(e) {
		var t = $(e.target);
	}
	
	function render() {
		// generate report data
		generateData();
		view.empty().append($.tmpl(tmpl, reports));
		
		// generate chart data
		generateChartData();
		$.each(reports, function(i, el) {
			// create chart
			new Highcharts.Chart({
				chart: {
					renderTo: 'report-' + i,
					defaultSeriesType: el.chartType
				},
				series: [{
					name: 'Balance',
					data: el.chartData
				}]
			});
			
			// delete report data and index
			delete el.data;
			delete el.chartData;
			delete el.chartType;
			delete el.index;
		});
	}
	
	function generateData() {
		if (!data.accounts) return;

		var track = [];
		function sortTrack() {
			track.sort(function(a, b) {
				if (a.expired) {
					return 1;
				} else if (b.expired) {
					return -1;
				}
				return a.next.getTime() - b.next.getTime();
			});
		}
		
		// generate report data
		$.each(data.reports, function(i, report) {
			
			var reportData = [],
			limit, limitTest, count, nextFn, total, except;
			
			// get beginning total
			total = 0;
			$.each(data.accounts, function(i, acc) {
				if (!report.accounts || report.accounts.indexOf(i) > -1) total += parseFloat(acc.balance);
			});
			
			/**
			 * Get past transactions
			 */
			if (report.start) {
				var start = new Date();
				start.setDate(start.getDate() - report.start);
				$.each(accounts, function(i, acc) {
					if (acc.ledger && (!report.accounts || report.accounts.indexOf(i) > -1)) {
						for (var i = acc.ledger.length - 1; i >= 0; i -= 1) {
							var t = acc.ledger[i];
							if (t.date >= start) {
								reportData.unshift({
									amount: t.amount,
									runningTotal: total,
									desc: t.desc,
									date: t.date,
									tag: t.tag
								});
								total -= parseInt(t.amount);
							}
						}
					}
				})
			}
			
			// reset total
			total = 0;
			$.each(data.accounts, function(i, acc) {
				if (!report.accounts || report.accounts.indexOf(i) > -1) total += parseFloat(acc.balance);
			});
			
			
			/**
			 * Get future transactions
			 */
			
			if (report.end || report.max) {
				// add each schedule to the track
				track.length = 0;
				$.each(schedule, function(i, sch) {
					if (!report.accounts || report.accounts.indexOf(sch.account) > -1) {
						track.push({
							next: new Date(sch.start.getTime()),
							schedule: sch,
							expired: false
						});
					}
				});
				sortTrack();
				
				// determine function to test if limit has been reached
				if (report.end) {
					limit = new Date();
					limit.setDate(limit.getDate() + report.end);
					limitTest = function(date) {
						return date < limit;
					}
					
				} else if (report.max) {
					limit = report.max;
					count = 0;
					limitTest = function() {
						count += 1;
						return count <= limit;
					}
				} else {
					return;
				}
				
				// ping each track and get future transactions within limit
				while (!track[0].expired && limitTest(track[0].next)) {
					nextFn = freqStrategy(track[0].schedule.freq);
					except = track[0].schedule.except && track[0].schedule.except[track[0].next.getTime()];
					
					if (except) {
						reportData.push({
							amount: except.amount || track[0].schedule.amount,
							runningTotal: total += parseFloat(except.amount || track[0].schedule.amount),
							desc: except.desc || track[0].schedule.desc,
							date: new Date((except.date || track[0].next).getTime()),
							tag: except.tag || track[0].schedule.tag
						});
						
					} else {
						reportData.push({
							amount: track[0].schedule.amount,
							runningTotal: total += parseFloat(track[0].schedule.amount),
							desc: track[0].schedule.desc,
							date: new Date(track[0].next.getTime()),
							tag: track[0].schedule.tag
						});
					}
					
					nextFn(track[0]);
					if (track[0].schedule.end && track[0].next > track[0].schedule.end) {
						track[0].expired = true;
					}
					sortTrack();
				}
			}
			
			/**
			 * Add data to report obj
			 */
			report.data = reportData;
			report.index = i;
		});
		
	}
	
	function freqStrategy(freq) {
		return {
			o: once,
			d: daily,
			w: weekly,
			f: fortnightly,
			m: monthly,
			y: yearly
		}[freq];
	}
	
	function once(track) {
		track.expired = true;
	}
	
	function daily(track) {
		track.next.setDate(track.next.getDate() + 1);
	}
	
	function weekly(track) {
		track.next.setDate(track.next.getDate() + 7);
	}
	
	function fortnightly(track) {
		track.next.setDate(track.next.getDate() + 14);
	}
	
	function monthly(track) {
		track.next.setMonth(track.next.getMonth() + 1);
	}
	
	function yearly(track) {
		track.next.setFullYear(track.next.getFullYear() + 1);
	}
	
	function generateChartData() {
		$.each(reports, function(i, report) {
			if (!report.type) return;
			var typeTokens = report.type.split(':'),
				data;
			
			if (typeTokens[0] === 'timeline') {
				// defaults to timeline
				var dayTotal, lastDate, gap;
				report.chartType = 'line';
				report.chartData = $.map(report.data, function(el, i) {
					gap = []
					if (i === 0) {
						lastDate = new Date(el.date.getTime());
						dayTotal = el.runningTotal;
						return null;
					} else if (el.date.getTime() === lastDate.getTime()) {
						dayTotal = el.runningTotal;
						return null;
					} else {
						// this is a new date, save the last date being worked on to the new map
						gap.push(dayTotal);
						lastDate.setDate(lastDate.getDate() + 1);
						while(lastDate.getTime() !== el.date.getTime()) {
							gap.push(dayTotal)
							lastDate.setDate(lastDate.getDate() + 1);
						}
						dayTotal = el.runningTotal;
						if (i === (report.data.length - 1)) {
							gap.push(dayTotal);
						}
						return gap;
					}
				});
			} else if (typeTokens[0] === 'pie') {
				var tally = {}, pieData = [];
				report.chartType = 'pie';
				$.each(report.data, function(i, el) {
					var what = typeTokens[1];
					if (typeof tally[el[what]] === 'undefined') {
						tally[el[what]] = Math.abs(el.amount);
					} else {
						tally[el[what]] += Math.abs(el.amount);
					}
				});
				$.each(tally, function(key, val) {
					pieData.push([key, val]);
				})
				report.chartData = pieData;
			}
		});
	}
	
	tux.reports = {
			init: init
	}
	
}();