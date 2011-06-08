describe('tux util', function() {
	
	describe('namespace', function() {
		
		it('should create a namespace', function() {
			namespace('test.spec.namespace');
			expect(test.spec.namespace).toBeDefined();
		});
		
		it('should not overwrite existing values', function() {
			namespace('test');
			test.namespace = 'exists';
			namespace('test.namespace');
			expect(test.namespace).toBe('exists');
		});
	
	});
	
	describe('noop', function() {
		
		it('should define an empty function', function() {
			expect(noop).toBeDefined();
		});
		
	});

});