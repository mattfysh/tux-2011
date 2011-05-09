!function() {
	
	var accounts = tux.accounts,
		schedule = tux.schedule,
		reports = tux.reports,
		data = window.data = store.get('tuxdata') || {};
	
	function init() {
		restoreDates();
		addAccounts();
		addSchedule();
		if (!data.reports) {
			defineDefaultReports();
		}
		addReports();
	}
	
	function restoreDates() {
		data.accounts && $.each(data.accounts, function(i, acc) {
			acc.schedule && $.each(acc.schedule, function(j) {
				var s = acc.schedule[j]
				s.start && (s.start = new Date(s.start));
				s.end && (s.end = new Date(s.end));
			});
		});
	}
	
	function addAccounts() {
		if (typeof data.accounts === 'undefined') {
			data.accounts = [];
		}
		accounts.init({
			view: $('#accounts'),
			accounts: data.accounts
		});
		$(accounts).bind('accountsupdated', updateAccounts);
	}
	
	function addSchedule() {
		schedule.init({
			view: $('#schedule'),
			accounts: data.accounts
		});
		$(schedule).bind('scheduleupdated', updateSchedule);
	}
	
	function updateAccounts() {
		persist();
		refreshAccounts();
	}
	
	function persist() {
		store.set('tuxdata', data)
	}
	
	function refreshAccounts() {
		schedule.refresh();
	}
	
	function updateSchedule() {
		persist();
		refreshReports();
	}
	
	function defineDefaultReports() {
		data.reports = [{
			name: 'Next 7 Days &mdash; All Accounts',
			days: 7,
			readOnly: true
		}, {
			name: 'Next 10 Transactions & mdash; All Accounts',
			max: 10,
			readOnly: true
		}];
	}
	
	function addReports() {
		reports.init({
			view: $('#reports'),
			accounts: data.accounts,
			reports: data.reports
		});
		
	}
	
	function refreshReports() {
		
	}
	
	init();
	
}();