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
		data.schedule && $.each(data.schedule, function(j) {
			var s = this;
			s.start && (s.start = new Date(s.start));
			s.end && (s.end = new Date(s.end));
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
			accounts: data.accounts,
			schedule: data.schedule
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
			name: 'Next 60 Days &mdash; All Accounts',
			days: 60
		}];
	}
	
	function addReports() {
		reports.init({
			view: $('#reports'),
			accounts: data.accounts,
			schedule: data.schedule,
			reports: data.reports
		});
		
	}
	
	function refreshReports() {
		
	}
	
	init();
	
}();