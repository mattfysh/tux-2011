store.set('tuxdata', {
	accounts: [{
		name: 'ANZ',
		balance: 100,
		ledger: [{
			date: new Date(2011, 04, 01),
			amount: -50,
			desc: 'minus fiddy cent'
		}]
	}, {
		name: 'ME Bank',
		balance: 200
	}],
	
	schedule: [{
		amount: 100,
		desc: 'weekly dollar',
		freq: 'w',
		start: new Date(2011, 04, 09),
		end: new Date(2011, 04, 30),
		account: 0,
		except: {
			'1306677600000': {
				amount: 200
			}
		}
	}, {
		amount: 200,
		desc: 'monthly',
		freq: 'm',
		start: new Date(2011, 04, 12),
		account: 1
	}, {
		amount: 20000,
		desc: 'once only',
		freq: 'o',
		start: new Date(2011, 04, 13),
		account: 0
	}, {
		amount: 1000,
		desc: 'transfer',
		freq: 'o',
		start: new Date(2011, 04, 15),
		account: 0,
		to: 1
	}],
	
	reports: [{
		name: 'Next 60 Days &mdash; All Accounts',
		end: 60
	}, {
		name: 'Next 10 Transactions &mdash; All Accounts',
		max: 10
	}]
});