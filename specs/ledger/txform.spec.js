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
			
			it('should replace account input with account selector', function() {
				expect(omniSelStub).toHaveBeenCalled();
				expect(omniSelStub).toHaveBeenCalledWith({
					el: form.$('input[name=account]')[0],
					items: ['accounts']
				});
			});
			
		});
		
		describe('submit', function() {
			
			beforeEach(function() {
				// data entry
				fillForm(form.el, {
					account: '1',
					tag: 'lunch',
					amount: '$3.12',
					desc: 'maccas'
				});
			});
			
			it('should pass form data to custom event when submitted', function() {
				var eventSpy = sinon.spy();
				
				form.bind('newtx', eventSpy);
				form.$(':submit').click();
				
				expect(eventSpy).toHaveBeenCalled();
				expect(eventSpy).toHaveBeenCalledWith({
					account: '1',
					tag: 'lunch',
					amount: 312,
					desc: 'maccas'
				});
			});
			
			it('should reset the form when submitted', function() {
				form.$(':submit').click();
				
				expect(form.$('input[name=account]')).toHaveValue('');
				expect(form.$('input[name=tag]')).toHaveValue('');
				expect(form.$('input[name=amount]')).toHaveValue('');
				expect(form.$('input[name=desc]')).toHaveValue('');
			});
			
		});
	
	});
	
}());