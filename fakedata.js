store.set('tuxdata', {
	accounts: [{
		name: 'ANZ',
		balance: 100,
		ledger: [{
			date: new Date(2011, 04, 01),
			amount: -50,
			desc: 'minus fiddy cent',
			tag: 'lunch'
		}, {
			date: new Date(2011, 04, 02),
			amount: -50,
			desc: 'minus fiddy cent',
			tag: 'lunch'
		}, {
			date: new Date(2011, 04, 03),
			amount: 300,
			desc: 'income',
			tag: 'pay'
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
				amount: 200,
				date: new Date(2011, 04, 29)
			}
		},
		tag: 'pay'
	}, {
		amount: 200,
		desc: 'monthly',
		freq: 'm',
		start: new Date(2011, 04, 12),
		account: 1,
		tag: 'rental income'
	}, {
		amount: 20000,
		desc: 'once only',
		freq: 'o',
		start: new Date(2011, 04, 13),
		account: 0,
		tag: 'tax return'
	}, {
		amount: 1000,
		desc: 'transfer',
		freq: 'o',
		start: new Date(2011, 04, 15),
		account: 0,
		to: 1,
		tag: 'transfer'
	}],
	
	reports: [{
		name: '60 Days Either Way &mdash; All Accounts',
		start: 60,
		end: 60
	}, {
		name: 'Last 60 Days &mdash; All Accounts',
		start: 60
	}, {
		name: 'Last 60 Days &mdash; ANZ',
		start: 60,
		accounts: [0]
	}, {
		name: 'Last 60 Days &mdash; AMP',
		start: 60,
		accounts: [1]
	}, {
		name: 'Next 60 Days &mdash; ME Bank',
		end: 60,
		accounts: [1]
	}, {
		name: 'Next 60 Days &mdash; All Accounts',
		end: 60
	}, {
		name: 'Next 10 Transactions &mdash; All Accounts',
		max: 10
	}]
});