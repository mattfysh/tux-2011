namespace('tux');
!function() {
	
	var accounts, reports;
	
	function init(spec) {
		accounts = spec.accounts;
		reports = spec.reports;
		render();
	}
	
	function render() {
		var reportData = generateData();
	}
	
	function generateData() {
		// generate each schedule into a track
		var track = [];
		$.each(data.accounts, function(i, acc) {
			$.each(acc.schedule, function(j, sch) {
				track.push({
					next: sch.start,
					schedule: sch
				});
			});
		});
		// for now, just use the first report
		var report = reports[0],
			limit = new Date(),
			reportData = [];
		limit.setDate(limit.getDate() + report.days);
		// ping each track and get future transactions within limit
		$.each(track, function(i, el) {
			var next = freqStrategy(el.schedule.freq);
			while(el.next < limit) {
				reportData.push({
					amount: el.schedule.amount,
					desc: el.schedule.desc
				});
				el.next = next(el.next);
			}
		});
		console.log(reportData);
		return reportData;
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
		return date.setDate(date.getDate() + 1);
	}
	
	function weekly(date) {
		return date.setDate(date.getDate() + 7);
	}
	
	tux.reports = {
			init: init
	}
	
}();