namespace('tux');
!function() {
	
	var accounts, reports, tmpl;
	
	function init(spec) {
		view = spec.view;
		tmpl = view.find('#report').template();
		accounts = spec.accounts;
		reports = spec.reports;
		bindui();
		render();
	}
	
	function bindui() {
		view.bind('click', click)
	}
	
	function click(e) {
		var t = $(e.target);
		t.filter('h2').length && t.next('table').toggle();
	}
	
	function render() {
		generateData();
		view.empty().append($.tmpl(tmpl, reports));
		// generate the charts
		$.each(reports, function(i, el) {
			new Highcharts.Chart({
				chart: {
					renderTo: 'report-' + i,
					defaultSeriesType: 'areaspline'
				},
				series: [{
					name: 'Balance',
					data: window.debug = $.map(el.data, function(pt) {
						console.log(pt);
						return pt.runningTotal;
					})
				}]
			});
		});
	}
	
	function generateData() {
		if (!data.accounts) return;
		
		// add each schedule to the track and sort on next date
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
		function resetTrack() {
			$.each(track, function(i, el) {
				el.expired = false;
				el.next.setTime(el.schedule.start.getTime());
			})
			sortTrack();
		}
		$.each(data.accounts, function(i, acc) {
			$.each(acc.schedule, function(j, sch) {
				track.push({
					next: new Date(sch.start.getTime()),
					schedule: sch
				});
			});
		});
		resetTrack();
		
		// generate report data
		$.each(data.reports, function(i, report) {
			var reportData = [],
				limit, limitTest, count, nextFn, total;
			
			resetTrack();
			total = 0;
			$.each(data.accounts, function(i, acc) {
				total += parseFloat(acc.balance);
			});
			
			if (report.days) {
				limit = new Date();
				limit.setDate(limit.getDate() + report.days);
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
			}
			
			// ping each track and get future transactions within limit
			while (!track[0].expired && limitTest(track[0].next)) {
				nextFn = freqStrategy(track[0].schedule.freq);
				reportData.push({
					amount: track[0].schedule.amount,
					runningTotal: total += parseFloat(track[0].schedule.amount),
					desc: track[0].schedule.desc,
					date: new Date(track[0].next.getTime())
				});
				nextFn(track[0]);
				if (track[0].schedule.end && track[0].next > track[0].schedule.end) {
					track[0].expired = true;
				}
				sortTrack();
			}
			report.data = reportData;
			report.index = i;
		});
		
	}
	
	function freqStrategy(freq) {
		switch (freq) {
		case 'o':
			return once
		case 'd':
			return daily;
		case 'w':
			return weekly;
		case 'f':
			return fortnightly;
		case 'm':
			return monthly;
		case 'y':
			return yearly;
		}
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
	
	tux.reports = {
			init: init
	}
	
}();