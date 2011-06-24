/*global test */
(function() {
	'use strict';
	
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
		
		describe('formatter', function() {
			
			it('should format cent values to dollar amounts', function() {
				expect(format(200)).toBe('$2.00');
			});
			
			it('should convert negative cent amounts correctly', function() {
				expect(format(-312)).toBe('-$3.12');
			});
			
			it('should add thousand seperators to amounts', function() {
				expect(format(123456789)).toBe('$1,234,567.89');
			});
			
		});
		
		describe('parseter', function() {
			
			it('should convert simple whole dollars to cents', function() {
				expect(parse(12)).toBe(1200);
			});
			
			it('should convert decimal dollars to cents', function() {
				expect(parse(123.45)).toBe(12345);
			});
			
			it('should remove all decimal places from cents value', function() {
				expect(parse(1234.567)).toBe(123456);
			});
			
			it('should convert dollar strings to cents', function() {
				expect(parse('12.34')).toBe(1234);
			});
			
			it('should successfully convert values with symbols', function() {
				expect(parse('$123,456.00')).toBe(12345600);
			});
			
			it('should successfully convert negative string values', function() {
				expect(parse('-12')).toBe(-1200);
			});
		});

	});
	
}());
