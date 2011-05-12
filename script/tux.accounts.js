namespace('tux');
!function() {
	
	var data, view, tmpl, self;
	
	function init(spec) {
		view = spec.view;
		tmpl = view.find('#accounts-rows').template();
		
		data = {
				accounts: spec.accounts
		}
		
		bindui();
		updateTotal();
		render();
	}
	
	function bindui() {
		view.bind('submit', add)
			.delegate('a.delete', 'click', remove)
			.delegate('a.edit', 'click', edit)
			.delegate('a.save', 'click', update)
			.delegate('a.cancel', 'click', cancelUpdate);
	}
	
	function render() {
		view.find('table').append($.tmpl(tmpl, data));
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
	
	function edit(e) {
		var tr = $(e.target).parents('tr'),
			index = tr.data('index')
			acc = data.accounts[index],
			formEls = tr.parents('div').find('form input'),
			tds = tr.find('td')
		
		$(e.target).replaceWith('<span class="edit-tools"><a href="#" class="save">save</a> | <a href="#" class="cancel">cancel</a></span>')
		
		tds.each(function(i, el) {
			if (i === tds.length - 1) return;
			$(el).empty().append(formEls.eq(i).clone().attr('value', function() {
				return acc[$(this).attr('name')];
			}));
		})
	}
	
	function stopEditing(tr) {
		
	}
	
	function update(e) {
		stopEditing($(e.target).parents('tr:eq(0)'));
		$(self).trigger('accountsupdated');
	}
	
	function cancelUpdate(e) {
		$(e.target).parents('.edit-tools').replaceWith('<a href="#" class="edit">edit</a>');
		stopEditing($(e.target).parents('tr:eq(0)'));
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
	
	self = tux.accounts = {
			init: init
	}
}();