namespace('tux');
!function() {
	
	var accounts, pending, view, tmpl;
	
	function init(spec) {
		accounts = spec.accounts;
		pending = spec.pending;
		view = spec.view;
		tmpl = view.find('#pending-rows').template();
		bindui();
		render();
	}
	
	function bindui() {
		view.delegate('a.approve', 'click', approve)
	}
	
	function render() {
		var tmplData = {
				pending: pending
		},
			tmplItem = {
				getFreqName: function(freq) {
					return freqOptions[freq];
				},
				getAccountName: function(acc) {
					return accounts[acc].name;
				}
		};
		view.find('table').append($.tmpl(tmpl, tmplData, tmplItem));
	}
	
	function approve(e) {
		
	}
	
	tux.pending = {
			init: init
	}
	
}();