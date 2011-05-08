namespace('tux');
!function() {
	
	function date(when) {
		if (typeof when === 'string') {
			when = parseDate(when);
		}
		return when;
	}
	
	function parseDate(str) {
		if (!str) return;
		var bits = str.split('/');
		return new Date(bits[2], bits[1] - 1, bits[0]);
	}
	
	tux.date = date
	
}();