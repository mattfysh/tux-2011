!function() {
	
	var accounts = tux.accounts,
		schedule = tux.schedule,
		reports = tux.reports,
		pending = tux.pending,
		data = window.data = store.get('tuxdata') || {};
	
	function init() {
		restoreDates();
		addAccounts();
		addPending();
		addSchedule();
		if (!data.reports) {
			defineDefaultReports();
		}
		addReports();
	}
	
	function restoreDates() {
		$.each(data.accounts, function() {
			this.ledger && $.each(this.ledger, function() {
				this.date = new Date(this.date);
			})
		})
		data.schedule && $.each(data.schedule, function(j) {
			var s = this;
			s.start && (s.start = new Date(s.start));
			s.end && (s.end = new Date(s.end));
			this.except && $.each(this.except, function() {
				this.date = new Date(this.date);
			})
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
	
	function addPending() {
		pending.init({
			view: $('#pending'),
			accounts: data.accounts,
			pending: data.pending
		});
	}
	
	init();
	
}();