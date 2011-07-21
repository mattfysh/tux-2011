(function() {
	'use strict';
	
	// requires
	var TxForm = tux.ledger.TxForm;
	
	describe('Tx form', function() {
		
		loadTemplate('/test/src/ledger/jst/tx-form.jst');
		
		var form, omniSelStub;
		
		beforeEach(function() {
			omniSelStub = sinon.stub(tux.forms, 'OmniSelect');
			form = new TxForm();
			setFixtures($(form.el));
		});
		
		afterEach(function() {
			omniSelStub.restore();
		});
	
		describe('init', function() {
			
			it('should allow input for account, type, amount and description', function() {
				var el = $(form.el);
				expect(el).toContain('input[name=account]');
				expect(el).toContain('input[name=tag]');
				expect(el).toContain('input[name=amount]');
				expect(el).toContain('input[name=desc]');
				expect(el).toContain(':submit');
			});
			
			xit('should replace account input with omni select', function() {
				expect(omniSelStub).toHaveBeenCalled();
				expect(omniSelStub).toHaveBeenCalledWith({
					el: form.$('input[name=account]')[0],
					items: ['accounts']
				});
			});
			
			xit('should replace tag input with omni select', function() {
				expect(omniSelStub).toHaveBeenCalled();
				expect(omniSelStub).toHaveBeenCalledWith({
					el: form.$('input[name=tag]')[0],
					items: ['tags']
				});
			});
			
		});
		
		describe('submit', function() {
			
			var eventSpy;
			
			beforeEach(function() {
				// data entry
				fillForm(form.el, {
					account: '1',
					tag: '1,in',
					amount: '$3.12',
					desc: 'test'
				});
				
				eventSpy = sinon.spy();
				form.bind('newtx', eventSpy);
			});
			
			it('should pass form data to custom event when submitted', function() {
				form.$(':submit').click();
				
				expect(eventSpy).toHaveBeenCalled();
				expect(eventSpy).toHaveBeenCalledWith({
					account: '1',
					tag: '1',
					amount: 312,
					desc: 'test'
				});
			});
			
			it('should reset the form when submitted', function() {
				form.$(':submit').click();
				
				expect(form.$('input[name=account]')).toHaveValue('');
				expect(form.$('input[name=tag]')).toHaveValue('');
				expect(form.$('input[name=amount]')).toHaveValue('');
				expect(form.$('input[name=desc]')).toHaveValue('');
			});
			
			it('should negate amounts with expense tags', function() {
				// change tag, submit
				fillForm(form.el, {
					tag: '2,ex'
				});
				form.$(':submit').click();
				
				expect(eventSpy).toHaveBeenCalledWith({
					account: '1',
					tag: '2',
					amount: -312,
					desc: 'test'
				});
			});
			
		});
	
	});
	
}());