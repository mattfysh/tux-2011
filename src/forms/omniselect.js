namespace('tux.forms');

(function() {
	'use strict';
	
	tux.forms.OmniSelect = Backbone.View.extend({
		
		tagName: 'span',
		className: 'omni-select',
	
		initialize: function(options) {
			var select = $(this.el),
				input = options.input,
				ul;
			
			// add view to DOM, wrap target input
			$(input).before(select);
			$(this.el)
				.append(input)
				.append('<span class="selection">')
				.append('<ul>');
			
			// add options
			ul = select.find('ul');
			_.each(options.options, function(option) {
				ul.append(tux.forms.omniSelectOption(option));
			});
			
			// bind to form reset, perform reset and set default value
			$(this.el).parents('form:eq(0)').bind('reset', _.bind(this.reset, this));
			this.reset();
			input.defaultValue = input.value;
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
		
		reset: function() {
			this.preselect(this.$('li:eq(0)'));
			this.deactivate();
		},
		
		/**
		 * Selection
		 */
		
		getSelection: function() {
			var el = $(this.el),
				sel = el.find('.preselect')
			
			el.find('.selection').html(sel.html());
			el.find('input').val(sel.data('value'));
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
			if (!/^9|13$/.test(e.which)) {
				e.preventDefault();
			}
		},
		
		nav: function(key) {
			var way = (key === 40) ? 'next' : 'prev',
				from = this.$('li.preselect'),
				to = from[way]('li')[0];
			
			if (from[0] && !to) {
				// dont move
				return;
			}
			
			this.preselect(to);
			this.getSelection();
		}
		
		
	
	});
	
}());