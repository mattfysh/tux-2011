(function() {
	'use strict';
	
	// requires
	var LedgerController = tux.ledger.LedgerController;
	
	describe('Ledger controller', function() {
		
		var form, formStub,
			tx1, tx2,
			txList, listStub,
			txView1, txView2,
			viewStub,
			ledger;
		
		beforeEach(function() {
			// stub form
			form = new Backbone.View({
				el: $('<form><ul></ul></form>')[0]
			});
			formStub = sinon.stub(tux.ledger, 'TxForm')
				.returns(form);
			
			// stub models and list
			tx1 = new Backbone.Model();
			tx2 = new Backbone.Model();
			txList = new Backbone.Collection([tx1, tx2]);
			listStub = sinon.stub(tux.ledger, 'TxList').returns(txList);
			
			// stub tx view
			txView1 = $('<li>')[0];
			txView2 = $('<li>')[0];
			viewStub = sinon.stub(tux.ledger, 'TxView');
			
			viewStub.withArgs({
				model: tx1
			}).returns(new Backbone.View({
				el: txView1
			}));
			
			viewStub.withArgs({
				model: tx2
			}).returns(new Backbone.View({
				el: txView2
			}));
			
			// kick off module
			ledger = new LedgerController();
		});
		
		afterEach(function() {
			formStub.restore();
			listStub.restore();
			viewStub.restore();
		});
		
		describe('init', function() {
			
			it('should create a new form', function() {
				expect(formStub).toHaveBeenCalled();
			});
			
			it('should add the form to the view', function() {
				expect($(ledger.el)).toContain('form');
			});
			
			it('should create a new tx list', function() {
				expect(listStub).toHaveBeenCalled();
			});
			
			it('should add a list after the form', function() {
				expect(ledger.$('form').next()).toBe('ul.tx-list');
			});
			
			it('should create a new tx view for each tx', function() {
				expect(viewStub.getCall(0)).toHaveBeenCalledWith({
					model: tx1
				});
				expect(viewStub.getCall(1)).toHaveBeenCalledWith({
					model: tx2
				});
			});
			
			it('should append each tx view to the DOM', function() {
				expect(ledger.$('li:eq(0)')).toBe(txView1);
				expect(ledger.$('li:eq(1)')).toBe(txView2);
			});
			
		});
		
		describe('event binding', function() {
			
			var newTx, newView;
			
			beforeEach(function() {
				newTx = {
					foo: 'bar'
				};
				newView = $('<li>')[0];
				
				viewStub.withArgs({
					model: newTx
				}).returns(new Backbone.View({
					el: newView
				}));
			});
			
			it('should listen for new txs from the form and send to list', function() {
				var createStub = sinon.stub(txList, 'create');
				form.trigger('newtx', newTx);
				expect(createStub).toHaveBeenCalledWithExactly(newTx);
				createStub.restore();
			});
			
			it('should create a tx view for new accounts', function() {
				txList.add(newTx);
				expect(viewStub.getCall(2)).toHaveBeenCalledWithExactly({
					model: txList.at(2)
				});
			});
			
			it('should append the new view to the DOM', function() {
				txList.trigger('add', newTx);
				expect(ledger.$('li:eq(2)')).toBe(newView);
			});
			
		});
	
		
	
	});
	
}());