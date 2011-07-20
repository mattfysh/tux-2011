(function() {
	'use strict';
	
	// requires
	var OmniSelect = tux.forms.OmniSelect;
	loadTemplate('/test/src/forms/jst/omni-select-option.jst');
	
	describe('Omni-select', function() {
		
		var input, origParent, omni,
			el, i, e, sel, ul;
	
		beforeEach(function() {
			// fixtures
			setFixtures('<input name="target" id="input" />');
			input = $('#input');
			origParent = input.parent();
			
			// kickoff
			omni = new OmniSelect({
				input: input.get(0),
				options: [{
					name: 'Income',
					value: 'i'
				}, {
					name: 'Expense',
					value: 'e'
				}]
			});
			
			// shortcuts
			el = $(omni.el);
			sel = el.find('span.selection');
			i = el.find('li:eq(0)');
			e = el.find('li:eq(1)');
			ul = el.find('ul');
		});
		
		describe('init', function() {
			
			it('should wrap input with markup', function() {
				expect(el).toBe('span');
				expect(el).toContain(input);
				expect(el).toContain(sel);
				expect(el).toContain('ul');
			});
			
			it('should replace input with wrapper', function() {
				expect(el.parent()).toBe(origParent);
			});
			
			it('should hide input cursor using dummy text', function() {
				expect(input).toHaveValue(' ');
			});
			
			it('should add a class to the wrapper', function() {
				expect(el).toHaveClass('omni-select');
			});
			
			it('should add options in order', function() {
				expect(i).toBe('li');
				expect(i).toHaveText('Income');
				expect(i).toHaveData('value', 'i');
				
				expect(e).toBe('li');
				expect(e).toHaveText('Expense');
				expect(e).toHaveData('value', 'e');
			});
			
		});
	
		describe('activation', function() {
			
			it('should add a class when input gains focus', function() {
				input.focusin();
				expect(el).toHaveClass('active');
			});
			
			it('should remove class when input loses focus', function() {
				input.focusin().focusout();
				expect(el).not.toHaveClass('active');
			});
			
			it('should add a class when selection clicked', function() {
				console.log('start');
				sel.mousedown();
				expect(el).toHaveClass('active');
				console.log('end');
			});
			
			it('should remove class when selection clicked again', function() {
				sel.mousedown().mousedown();
				expect(el).not.toHaveClass('active');
			});
			
		});
		
		describe('keyboard navigation', function() {
			
			var keyMap = {
					'tab': 9,
					'up': 38,
					'down': 40
			};
			
			function key(which) {
				return $.Event('keydown', {
					which: keyMap[which]
				})
			}
			
			it('should move to first on down key', function() {
				input.trigger(key('down'));
				expect(i).toHaveClass('preselect');
			});
			
			it('should move to next on down key', function() {
				input.trigger(key('down'));
				input.trigger(key('down'));
				expect(i).not.toHaveClass('preselect');
				expect(e).toHaveClass('preselect');
			});
			
			it('should not move past last', function() {
				input.trigger(key('down'));
				input.trigger(key('down'));
				input.trigger(key('down'));
				expect(i).not.toHaveClass('preselect');
				expect(e).toHaveClass('preselect');
			});
			
			it('should move to previous on up key', function() {
				input.trigger(key('down'));
				input.trigger(key('down'));
				input.trigger(key('up'));
				expect(i).toHaveClass('preselect');
				expect(e).not.toHaveClass('preselect');
			});
			
			it('should not move to first on up key', function() {
				input.trigger(key('up'));
				expect(i).not.toHaveClass('preselect');
			});
			
			it('should not move past first', function() {
				input.trigger(key('down'));
				input.trigger(key('up'));
				expect(i).toHaveClass('preselect');
			});
			
			it('should force selection', function() {
				input.trigger(key('down'));
				expect(sel).toHaveText('Income');
				expect(input).toHaveData('value', 'i');
			});
			
			it('should prevent typing in input', function() {
				input.val('test').keydown();
				expect(input).toHaveValue(' ');
			})
			
		});
		
		describe('selection', function() {
			
			it('should copy option to selection when clicked', function() {
				i.mousedown();
				input.blur();
				expect(sel).toHaveText('Income');
				expect(input).toHaveData('value', 'i');
			});
			
			xit('should remove preselect', function() {
				i.mousedown();
				input.blur();
				expect(el.find('.preselect')).not.toExist();
			});
			
		});
		
	
	});
	
}());
