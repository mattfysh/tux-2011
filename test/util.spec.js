(function() {
	
	TestCase('tux util', {
		
		'test namespace should create a namespace': function() {
			namespace('test.spec.namespace');
			assertNotUndefined(test.spec.namespace);
		},
		
		'test namespace should not overwriting existing value': function() {
			namespace('test');
			test.namespace = 'exists';
			namespace('test.namespace');
			assertEquals(test.namespace, 'exists');
		}
	});
	
}());