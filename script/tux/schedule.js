namespace('tux');

$(function() {
	
	var accounts = tux.accounts,
		util = tux.util;
	
	tux.Schedule = Backbone.Model.extend({
		
		initialize: function() {
			var end = this.get('end');
			if (end) this.set({end: new Date(end)});
			this.set({start: new Date(this.get('start'))});
			
			this.reset();
			
			// getting account model
			this.account = accounts.get(this.get('accountid'));
			this.transfer = accounts.get(this.get('transfer'));
			_.bindAll(this, 'destroy', 'changeAccName', 'reset');
			this.account.bind('remove', this.destroy)
				.bind('change:name', this.changeAccName);
			this.bind('change', this.reset);
		},
		
		changeAccName: function() {
			this.trigger('change:name');
		},
		
		freqMap: {
			o: 'expire',
			d: ['Date', 1],
			w: ['Date', 7],
			f: ['Date', 14],
			m: ['Month', 1],
			y: ['FullYear', 1]
		},
		
		reset: function() {
			this.nextDate = new Date(this.get('start').getTime());
			this.expired = false;
			this.instances = [];
			this.transfers = [];
			this.freqFn = this.freqMap[this.get('frequency')];
		},
		
		next: function(limit) {
			var nextTx, except, limitFn;
			
			if (typeof limit === 'number') {
				limitFn = function(count) {
					return count < limit;
				}
			} else {
				limitFn = function(count, nextDate) {
					return nextDate < limit;
				}
			}
			
			// add instances to the instances array property until the limit is reached or the track has expired
			for (var i = 0; !this.expired && limitFn(i, this.nextDate); i += 1) {
				// create next instance
				nextTx = {
					date: new Date(this.nextDate.getTime()),
					amount: this.get('amount'),
					desc: this.get('desc')
				};
				nextTx.iso = util.getISO8601(nextTx.date)
				
				// see if there's an exception
				except = this.get('except')[nextTx.iso];
				if (except) {
					if (except.date) except.date = new Date(except.date);
					_.extend(nextTx, except);
				}
				
				// get account name and push to list
				nextTx.account = this.account.get('name');
				this.instances.push(nextTx);
				
				// push transfer tx
				if (this.transfer) {
					nextTx = _.clone(nextTx);
					nextTx.amount = nextTx.amount * -1;
					nextTx.account = this.transfer.get('name');
					this.transfers.push(nextTx);
				}
				
				// calculate next date and if expired
				if (this.freqFn === 'expire') {
					this.expired = true;
				} else {
					this.nextDate['set' + this.freqFn[0]](this.nextDate['get' + this.freqFn[0]]() + this.freqFn[1]);
					if (this.get('end') && this.get('end') < this.nextDate) this.expired = true;
				}
			}
		},
		
		getInstances: function(end) {
			var end = new Date(end.getTime() + 1), // +1 hack to make end date inclusive
				endIndex = _(this.instances).chain().pluck('date').sortedIndex(end).value();
		
			return this.instances.slice(0, endIndex);
		},
		
		getTransfers: function(end) {
			var end = new Date(end.getTime() + 1), // +1 hack to make end date inclusive
				endIndex = _(this.transfers).chain().pluck('date').sortedIndex(end).value();
		
			return this.transfers.slice(0, endIndex);
		}
		
	});
	
	tux.ScheduleList = Backbone.Collection.extend({
		
		model: tux.Schedule,
		localStorage: new Store('schedules')
		
	});
	
	var schedules = tux.schedules = new tux.ScheduleList;
	
	tux.ScheduleView = Backbone.View.extend({
		
		tagName: 'tbody',
		template: $('#schedule-tmpl').template(),
		editTemplate: $('#schedule-edit-tmpl').template(),
		editTxTemplate: $('#schedule-edit-tx-tmpl').template(),
		
		events: {
			'click a.edit': 'edit',
			'click a.remove': 'destroy',
			'click a.save': 'save',
			'click a.next': 'displayNext',
			'click a.edit-tx': 'editTx',
			'click a.remove-tx': 'removeTx',
			'click a.save-tx': 'saveTx',
			'click a.hide-txs': 'hideInstances'
		},
		
		initialize: function(model) {
			_.bindAll(this, 'render', 'remove', 'resetInstances');
			this.model.bind('change:name', this.render)
				.bind('change', this.resetInstances)
				.bind('remove', this.remove);
		},
		
		render: function() {
			var tmplData = this.model.toJSON();
			tmplData.amount = util.formatCurrency(tmplData.amount);
			tmplData.start = util.formatDate(tmplData.start);
			tmplData.end && (tmplData.end = util.formatDate(tmplData.end));
			tmplData.frequency = this.freqNameMap[tmplData.frequency];
			tmplData.account = this.model.account.toJSON();
			if (this.model.transfer) tmplData.transfer = this.model.transfer.toJSON();
			tmplData.instances = this.nextInstances;
			$(this.el).empty().append($.tmpl(this.template, tmplData));
			return this;
		},
		
		edit: function(e) {
			e.preventDefault();
			var tmplData = this.model.toJSON();
			tmplData.start = util.formatDate(tmplData.start);
			tmplData.end && (tmplData.end = util.formatDate(tmplData.end));
			tmplData.account = this.model.account.toJSON();
			$(this.el).empty().append($.tmpl(this.editTemplate, tmplData));
			this.$('select[name=accountid]').append(accounts.options()).val(tmplData.accountid);
			this.$('select[name=transfer]').append(accounts.options()).val(tmplData.transfer);
			this.$('select[name=frequency]').val(tmplData.frequency);
		},
		
		save: function(e) {
			e.preventDefault();
			var schedule = {};
			this.$(':input').each(function() {
				 schedule[this.getAttribute('name')] = $(this).val();
			});
			schedule.start = util.makeDate(schedule.start);
			if (schedule.end) schedule.end = util.makeDate(schedule.end);
			this.model.set(schedule).save();
			this.model.account = accounts.get(this.model.get('accountid'));
			this.model.transfer = accounts.get(this.model.get('transfer'));
			this.render();
		},
		
		freqNameMap: {
			o: 'Only Once',
			d: 'Daily',
			w: 'Weekly',
			f: 'Fortnightly',
			m: 'Monthly',
			y: 'Yearly'
		},
		
		destroy: function(e) {
			e.preventDefault();
			this.model.destroy();
		},
		
		displayNext: function(e) {
			e.preventDefault();
			// make sure cache stretches far enough
			if (!this.nextInstances) this.nextInstances = [];
			var i = this.nextInstances.length,
				l = i + 5;
			if (this.model.instances.length < l) {
				this.model.next(l - this.model.instances.length);
			}
			// add to view instances
			for (; i < l && this.model.instances[i]; i += 1) {
				this.nextInstances[i] = this.model.instances[i];
			}
			// render
			this.render();
		},
		
		resetInstances: function() {
			this.nextInstances = [];
		},
		
		editTx: function(e) {
			e.preventDefault();
			var index = $(e.target).parents('tr').data('index'),
				instance = this.nextInstances[index];
			
			$(e.target).parents('tr').empty().append($.tmpl(this.editTxTemplate, instance));
		},
		
		saveTx: function(e) {
			e.preventDefault();
			var newTx = {},
				index = $(e.target).parents('tr').data('index'),
				instances = this.nextInstances,
				except = this.model.get('except');
			
			$(e.target).parents('tr').find(':input:not(:submit)').each(function() {
				 newTx[this.getAttribute('name')] = $(this).val();
			});
			newTx.date = util.makeDate(newTx.date);
			
			except[instances[index].iso] = newTx;
			instances[index] = newTx;
			this.model.save();
			this.render();
		},
		
		removeTx: function(e) {
			e.preventDefault();
			var index = $(e.target).parents('tr').data('index'),
				instance = this.nextInstances[index],
				except = this.model.get('except');
				
			except[instance.iso] = {
					amount: 0,
					desc: '*deleted*'
			};
			instance.amount = util.formatCurrency(0);
			instance.desc = '*deleted*';
			this.model.save();
			this.render();
		},
		
		hideInstances: function(e) {
			e.preventDefault();
			this.nextInstances = [];
			this.render();
		}
		
	});
	
	tux.ScheduleApp = Backbone.View.extend({
		
		el: $('#schedules'),
		events: {
			'submit form': 'create'
		},
		
		initialize: function() {
			_.bindAll(this, 'addOne', 'addAll', 'renderAccounts');
			schedules.bind('add', this.addOne);
			schedules.bind('refresh', this.addAll);
			schedules.fetch();
			
			accounts.bind('all', this.renderAccounts);
			this.renderAccounts();
		},
		
		create: function(e) {
			e.preventDefault();
			schedules.create(this.getNewSchedule());
		},
		
		getNewSchedule: function() {
			var schedule = {};
			this.el.find(':input:not(:submit)').each(function() {
				 if ($(this).val()) schedule[this.getAttribute('name')] = $(this).val();
			});
			schedule.start = util.makeDate(schedule.start);
			if (schedule.end) schedule.end = util.makeDate(schedule.end);
			schedule.except = {};
			this.el.find('form')[0].reset();
			return schedule;
		},
		
		addOne: function(schedule) {
			var view = new tux.ScheduleView({model: schedule});
			this.el.find('table').append(view.render().el);
		},
		
		addAll: function() {
			schedules.each(this.addOne);
		},
		
		renderAccounts: function() {
			$('select.transfer-account').empty().append('<option value="">Select for transfer</option>').append(accounts.options());
		}
		
	});
	
});