namespace('tux.forms');

(function() {
	'use strict';
	
	tux.forms.OmniSelect = Backbone.View.extend({
	
		initialize: function() {
			var wrapper = $('<div class="account-select">'),
				input = this.el;
			
			// event binding
			_(this).bindAll('addAccount', 'removeAccount', 'renameAccount');
			tux.refs.accounts.list
				.bind('add', this.addAccount)
				.bind('remove', this.removeAccount)
				.bind('change:name', this.renameAccount);
			
			// wrap input with account select template
			this.el = $(input).wrap(wrapper)
				.parents('div.account-select')
				.append('<span class="selection">Select account...</span>')
				.append('<ul>')[0];
			
			// add accounts
			tux.refs.accounts.list.each(this.addAccount);
			
			// event binding
			this.events = this.wrapperEvents;
			this.delegateEvents();
		},
		
		wrapperEvents: {
			'mouseenter': 'activate',
			'mouseleave': 'deactivate',
			
			'mouseenter li': 'preselect',
			'click li': 'select',
			'mouseleave ul': 'deselect',
			
			'click span.selection': 'focusInput',
			'focus input': 'enableSearch',
			'blur input': 'disableSearch',
			'keyup input': 'filter',
			'keydown input': 'navigate'
		},
		
		/**
		 * Bindings
		 */
		
		addAccount: function(account) {
			// generate item markup and append to list
			var option = $(tux.forms.omniSelectOption(account.toJSON()));
			this.$('ul').append(option);
		},
		
		removeAccount: function(account) {
			this.$('ul li[data-id=' + account.id + ']').remove();
		},
		
		renameAccount: function(account) {
			this.$('ul li[data-id=' + account.id + ']').text(account.get('name'));
		},
		
		/**
		 * Selection
		 */
		
		preselect: function(e) {
			this.$('li.preselect').add(e.target).toggleClass('preselect');
		},
		
		deselect: function() {
			this.$('li.preselect').removeClass('preselect');
		},
		
		select: function(e) {
			e.preventDefault();
			this.$('input').val($(e.target).data('id'));
			this.deactivate();
			this.$('span.selection').text($(e.target).text());
		},
		
		/**
		 * Activation
		 */
		
		activate: function() {
			$(this.el).addClass('active');
		},
		
		deactivate: function() {
			if ($(this.el).hasClass('search')) {
				// do not deactivate while search is active
				return;
			}
			$(this.el).removeClass('active');
		},
		
		focusInput: function() {
			this.$('input').focus();
		},
		
		/**
		 * Filtering and result nav
		 */
		
		enableSearch: function() {
			this.prevSel = this.$('input').val();
			$(this.el).addClass('search');
			this.$('input').val('');
			this.activate();
		},
		
		disableSearch: function(e) {
			$(this.el).removeClass('search');
			this.deactivate();
			this.$('input').val('').keyup().val(this.prevSel);
			this.$('li.preselect').click().removeClass('preselect');
		},
		
		filter: function(e) {
			// get search term and create regular expression
			var searchTerm = $(e.target).val().replace(/^\s|\s$/g, ''),
				rsearch = new RegExp(searchTerm, 'i');
			
			// loop through each item
			this.$('li').each(function() {
				var item = $(this),
					content = item.text(),
					isMatch = rsearch.test(content);
				
				// update class
				item[isMatch ? 'removeClass' : 'addClass']('filtered');
				
				// update strong
				if (isMatch) {
					item.html(content.replace(rsearch, function(term) {
						return term && '<strong>' + term + '</strong>';
					}));
				} else {
					item.html(content);
					item.removeClass('preselect');
				}
			});
		},
		
		navigate: function(e) {
			var direct, from, to;
			
			if (e.which !== 40 && e.which !== 38) {
				// not a nav key
				return;
			}
			
			// determine direction
			direct = (e.which === 40) ? 'next' : 'prev';
			// find next valid item
			from = this.$('li.preselect');
			to = from[direct + 'All']('li:not(.filtered):eq(0)');
			
			if (!from.length && direct === 'next') {
				// no current preselect, go to first
				to = this.$('li:not(.filtered):eq(0)');
			}
			
			// move preselect only if there is somewhere to move to
			if (to.length || direct === 'prev') {
				this.preselect({
					target: to
				});
			}
			
			e.preventDefault();
		}
		
		
	
	});
	
}());