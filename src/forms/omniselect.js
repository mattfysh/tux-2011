namespace('tux.forms');

(function() {
	'use strict';
	
	tux.forms.OmniSelect = Backbone.View.extend({
		
		tagName: 'span',
		className: 'omni-select',
	
		initialize: function(options) {
			var select = $(this.el),
				ul;
			
			// add view to DOM, wrap target input
			$(options.input).before(select);
			$(this.el)
				.append(options.input)
				.append('<span class="selection">')
				.append('<ul>');
			
			// hide input cursor with dummy text
			options.input.value = ' ';
			
			// add options
			ul = select.find('ul');
			_.each(options.options, function(option) {
				ul.append(tux.forms.omniSelectOption(option));
			});
		},
		
		events: {
			'focus input': 'activate',
			'blur input': 'deactivate',
			'mousedown .selection': 'toggle',
			'mouseup .selection': 'afterToggle',
			
			'keydown input': 'keydown',
			
			'mousedown li': 'mouseSelect'
		},
		
		/**
		 * Activation
		 */
		
		isActive: function() {
			return $(this.el).hasClass('active');
		},
		
		activate: function() {
			$(this.el).addClass('active');
		},
		
		deactivate: function() {
			this.getSelection();
			//this.$('.preselect').removeClass('preselect');
			$(this.el).removeClass('active');
		},
		
		toggle: function() {
			this[this.isActive() ? 'deactivate' : 'activate']();
		},
		
		afterToggle: function() {
			// give focus to input
			if (this.isActive()) {
				this.$('input')[0].focus();
			}
		},
		
		/**
		 * Selection
		 */
		
		getSelection: function(e) {
			var el = $(this.el),
				sel = el.find('.preselect')
			
			el.find('.selection').html(sel.html());
			el.find('input').data('value', sel.data('value'));
		},
		
		mouseSelect: function(e) {
			this.preselect(e.target);
		},
		
		preselect: function(to) {
			this.$('.preselect').removeClass('preselect');
			$(to).addClass('preselect');
		},
		
		/**
		 * Navigation
		 */
		
		keydown: function(e) {
			if (/^38|40$/.test(e.which)) {
				this.nav(e.which);
			}
			e.target.value = ' ';
		},
		
		nav: function(key) {
			var way = (key === 40) ? 'next' : 'prev',
				from = this.$('li.preselect'),
				to = from[way]('li')[0];
			
			if (from[0] && !to) {
				// dont move
				return;
			} else if (!to && way === 'next') {
				// start at first
				to = this.$('li:eq(0)')[0];
			}
			
			this.preselect(to);
			this.getSelection();
		}
		
		
	
	});
	
}());