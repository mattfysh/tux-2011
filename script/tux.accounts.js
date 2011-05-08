namespace('tux');
!function() {
	
	var data, view, tmpl, self;
	
	function init(spec) {
		view = spec.view;
		tmpl = view.find('#accounts-rows').template();
		
		data = {
				accounts: spec.accounts || []
		}
		
		bindui();
		updateTotal();
		render();
	}
	
	function bindui() {
		view.bind('submit', add)
			.delegate('a.delete', 'click', remove);
	}
	
	function render() {
		view.find('table').append($.tmpl(tmpl, data))
	}
	
	function add(e) {
		e.preventDefault();
		var newAccount = {
				name: view.find('input[name=name]').val(),
				balance: view.find('input[name=balance]').val(),
				schedule: [],
				ledger: []
		};
		data.accounts.push(newAccount);
		view.find('form')[0].reset();
		refresh();
	}
	
	function remove(e) {
		var index = $(e.target).parents('tr').data('index');
		data.accounts.splice(index, 1);
		refresh();
	}
	
	function refresh() {
		updateTotal();
		view.find('table tr').tmplItem().update();
		$(self).trigger('accountsupdated');
	}
	
	function updateTotal() {
		data.total = 0;
		data.accounts && $.each(data.accounts, function(i, el) {
			data.total += parseFloat(el.balance);
		})
	}
	
	function throwUpdate() {
		
	}
	
	self = tux.accounts = {
			init: init
	}
}();