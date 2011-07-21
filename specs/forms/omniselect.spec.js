(function() {
	'use strict';
	
	// requires
	var OmniSelect = tux.forms.OmniSelect;
	loadTemplate('/test/src/forms/jst/omni-select-option.jst');
	
	describe('Omni-select', function() {
		
		var input, origParent, omni,
			el, i, e, sel, ul, form;
	
		beforeEach(function() {
			// fixtures
			setFixtures('<form><input name="target" id="input" /></form>');
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
			form = input.parents('form:eq(0)');
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
			
			it('should select first by default', function() {
				expect(sel).toHaveText('Income');
				expect(input).toHaveValue('i');
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
				sel.mousedown();
				expect(el).toHaveClass('active');
			});
			
			it('should remove class when selection clicked again', function() {
				sel.mousedown().mousedown();
				expect(el).not.toHaveClass('active');
			});
			
			it('should reset on form reset', function() {
				e.mousedown();
				sel.mousedown();
				form[0].reset();
				
				expect(sel).toHaveText('Income');
				expect(input).toHaveValue('i');
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
					which: keyMap[which] || which
				})
			}
			
			it('should move to next on down key', function() {
				input.trigger(key('down'));
				expect(i).not.toHaveClass('preselect');
				expect(e).toHaveClass('preselect');
			});
			
			it('should not move past last', function() {
				input.trigger(key('down'));
				input.trigger(key('down'));
				expect(i).not.toHaveClass('preselect');
				expect(e).toHaveClass('preselect');
			});
			
			it('should move to previous on up key', function() {
				input.trigger(key('down'));
				input.trigger(key('up'));
				expect(i).toHaveClass('preselect');
				expect(e).not.toHaveClass('preselect');
			});
			
			it('should not move past first', function() {
				input.trigger(key('up'));
				expect(i).toHaveClass('preselect');
			});
			
			it('should force selection', function() {
				console.log('before down', input.val());
				input.trigger(key('down'));
				console.log('after down', input.val());
				expect(sel).toHaveText('Expense');
				expect(input).toHaveValue('e');
			});
			
			it('should prevent typing in input', function() {
				var typing = key(68);
				input.val('test').trigger(typing)
				expect(typing.isDefaultPrevented()).toBeTruthy();
			});
			
			it('should allow tabbing', function() {
				var tab = key(9);
				input.val('test').trigger(tab)
				expect(tab.isDefaultPrevented()).toBeFalsy();
			});
			
			it('should allow enter submission', function() {
				var enter = key(13);
				input.val('test').trigger(enter)
				expect(enter.isDefaultPrevented()).toBeFalsy();
			})
			
		});
		
		describe('selection', function() {
			
			it('should copy option to selection when clicked', function() {
				i.mousedown();
				input.blur();
				expect(sel).toHaveText('Income');
				expect(input).toHaveValue('i');
			});
			
		});
		
	
	});
	
}());
