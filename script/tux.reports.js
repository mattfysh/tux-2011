namespace('tux');
!function() {
	
	var accounts, reports, tmpl;
	
	function init(spec) {
		view = spec.view;
		tmpl = view.find('#report').template();
		accounts = spec.accounts;
		reports = spec.reports;
		render();
	}
	
	function render() {
		generateData();
		view.empty().append($.tmpl(tmpl, reports));
	}
	
	function generateData() {
		if (!data.accounts) return;
		
		// add each schedule to the track and sort on next date
		var track = [];
		function sortTrack() {
			track.sort(function(a, b) {
				return a.next.getTime() - b.next.getTime();
			});
		}
		function resetTrack() {
			$.each(track, function(i, el) {
				el.next.setTime(el.schedule.start.getTime());
			})
		}
		$.each(data.accounts, function(i, acc) {
			$.each(acc.schedule, function(j, sch) {
				track.push({
					next: new Date(sch.start.getTime()),
					schedule: sch
				});
			});
		});
		sortTrack();
		
		// generate report data
		$.each(data.reports, function(i, report) {
			var reportData = [],
				limit, limitTest, count, nextFn;
			
			resetTrack();
			
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
			while (limitTest(track[0].next)) {
				nextFn = freqStrategy(track[0].schedule.freq);
				reportData.push({
					amount: track[0].schedule.amount,
					desc: track[0].schedule.desc,
					date: new Date(track[0].next.getTime())
				});
				nextFn(track[0].next);
				sortTrack();
			}
			report.data = reportData;
		});
		
	}
	
	function freqStrategy(freq) {
		switch (freq) {
		case 'd':
			return daily;
		case 'w':
			return weekly;
		}
	}
	
	function daily(date) {
		date.setDate(date.getDate() + 1);
	}
	
	function weekly(date) {
		date.setDate(date.getDate() + 7);
	}
	
	tux.reports = {
			init: init
	}
	
}();