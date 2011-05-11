namespace('tux');
!function() {
	
	var date = tux.date,
		view, tmpl, self, tmplAcc, accounts, schedule,
		
		freqOptions = {
			o: 'Once only',
			d: 'Daily',
			w: 'Weekly',
			f: 'Fortnightly',
			m: 'Monthly',
			y: 'Yearly'
		};
	
	function init(spec) {
		accounts = spec.accounts;
		schedule = spec.schedule;
		view = spec.view;
		tmpl = view.find('#schedule-row').template();
		tmplAcc = view.find('#schedule-account-option').template();
		bindui();
		render();
	}
	
	function bindui() {
		view.bind('submit', add)
			.delegate('a.delete', 'click', remove);
	}
	
	function render() {
		var tmplData = schedule,
			tmplItem = {
				getFreqName: function(freq) {
					return freqOptions[freq];
				},
				getAccountName: function(acc) {
					return accounts[acc].name;
				}
			}
		
		view.find('table').append($.tmpl(tmpl, tmplData, tmplItem)).end()
			.find('select[name=account]').append($.tmpl(tmplAcc, tmplData)).end();
	}
	
	function add(e) {
		e.preventDefault();
		var accountIndex = view.find('select[name=account]').val(),
			newScheduledTx = {
				amount: view.find('input[name=amount]').val(),
				desc: view.find('input[name=desc]').val(),
				start: date(view.find('input[name=start]').val()),
				freq: view.find('select[name=frequency]').val(),
				end: date(view.find('input[name=end]').val())
			};
		
		schedule.push(newScheduledTx);
		view.find('form')[0].reset();
		refresh();
	}
	
	function refresh() {
		// FIXME
		try {
			view.find('select[name=account] option').tmplItem().update();
			view.find('table tr').tmplItem().update();
		} catch(e) {}
		$(self).trigger('scheduleupdated');
	}
	
	function remove(e) {
		var index = $(e.target).parents('tr').data('index');
		schedule[index].splice(index, 1);
		refresh();
	}
	
	self = tux.schedule = {
			init: init,
			refresh: refresh
	}
	
}();