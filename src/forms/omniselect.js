namespace('tux.forms');

(function() {
	'use strict';
	
	tux.forms.OmniSelect = Backbone.View.extend({
	
		initialize: function(options) {
			var wrapper = $('<div class="omni-select">'),
				input = this.el;
			
			// proxy methods
			_(this).bindAll('addOption', 'removeOption', 'renameOption');
			
			// wrap input with omni select template
			this.el = $(input).wrap(wrapper)
				.parent()
				.append('<span class="selection">Make selection</span>')
				.append('<ul>')[0];
				
			// add items
			tux.refs[options.items[0]].list.each(_(this.addOption).bind(this, options.items[0]));
			
			// event binding
			tux.refs[options.items[0]].list 
				.bind('add', _(this.addOption).bind(this, options.items[0]))
				.bind('remove', this.removeOption)
				.bind('change:name', this.renameOption);
			
			// late bind events after wrapper becomes new view
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
		 * Option list
		 */
		
		addOption: function(item, option) {
			// generate item markup and append to list
			var data = option.toJSON(),
				result;
			
			data.item = item;
			if (!data.type) {
				data.type = '';
			}
			result = $(tux.forms.omniSelectOption(data));
			
			this.$('ul').append(result);
		},
		
		removeOption: function(option) {
			this.$('ul li[data-id=' + option.id + ']').remove();
		},
		
		renameOption: function(option) {
			this.$('ul li[data-id=' + option.id + ']').text(option.get('name'));
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
			var itemData = $(e.target).data(),
				val = itemData.id;
			
			if (itemData.type) {
				val += ',' + itemData.type;
			}
			
			this.$('input').val(val);
			this.deactivate();
			this.$('span.selection').text($(e.target).text());
			
			e.preventDefault();
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