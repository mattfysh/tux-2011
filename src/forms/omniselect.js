namespace('tux.forms');

(function() {
	'use strict';
	
	tux.forms.OmniSelect = Backbone.View.extend({
		
		tagName: 'span',
		className: 'omni-select',
	
		initialize: function(options) {
			var select = $(this.el),
				input = options.input,
				ul = $('<ul>');
			
			// add view to DOM, wrap target input
			$(input).before(select);
			$(this.el)
				.append(input)
				.append('<span class="selection">')
				.append(ul);
			
			// bind callbacks
			_.bindAll(this, 'addOption', 'removeOption');
			
			// add options
			_.each(options.options, _.bind(function(option) {
				var list;
				
				if (typeof option === 'string') {
					list = tux.refs[option].list;
					
					// add models from collection
					list.each(this.addOption);

					// bind events
					list.bind('add', this.addOption)
						.bind('remove', this.removeOption);
				
				} else {
					// regular option
					ul.append(tux.forms.omniSelectOption(option));
				}
				
			}, this));
			
			// bind to form reset
			$(this.el).parents('form:eq(0)')
				.bind('reset', _.bind(this.reset, this));
			
			if (this.$('ul').is(':empty')) {
				$(input).attr('disabled', true);
			} else {
				// perform reset and set default value
				this.reset();
				input.defaultValue = input.value;
			}
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
		 * Collection bindings
		 */
		addOption: function(model) {
			var data = model.toJSON();
			data.value = data.id;
			this.$('ul').append(tux.forms.omniSelectOption(data));
		},
		
		removeOption: function(model) {
			this.$('li[data-value=' + model.id + ']').remove();
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
				sel = el.find('.preselect'),
				data = sel.data();
			
			el.find('.selection').html(sel.html());
			el.find('input').val(data.value);
			
			// add code if present
			if (data.code) {
				el.find('input').data('code', data.code);
			}
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