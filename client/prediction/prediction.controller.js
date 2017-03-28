(function(){
	app.controller('predictionCtrl', ['$scope', 'utilService', 'mockService', '$q', '$uibModal', 'meanData',
		function($scope, utilService, mockService, $q, $uibModal, meanData){
		var _this = this;
		// initial controller level val here...
		_this.showStatements = false;
		_this.events;
		_this.currentFinanceSafe = true;
		_this.statements;
		_this.calendarDisplayerOptions = {};  // Calendar Settings
		// ngModel can't handle moment object, so still using Date object here...
		_this.selectedDate = new Date();
		_this.endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());

		var getDayClass = function(data) {
			var date = data.date;
			var mode = data.mode;
			if(mode === 'day') {
				var dayToCheck = new Date(date).setHours(0,0,0,0);
				for(var i = 0; i < _this.events.length; i++){
					var eventDay = new Date(_this.events[i].date).setHours(0,0,0,0);
					if(dayToCheck === eventDay) {
						return _this.events[i].financeStatus;
					}
				}
			}
			return '';
		}

		var showSelectedDateModal = function(statement) {
			$uibModal.open({
				templateUrl: '/prediction/statement.modal.html',
				controller: function(){
					var _this = this;
					_this.statement = statement;
				},
				controllerAs: "showSelectedDateModalCtrl",
				size: 'lg'
			}).result.then(function () {
				
			}, function () {
				
			});
		}

		_this.calculatePending = function(account) {
			account.pending = 0;
			account.pendingTransactions.forEach(function(pt){
				account.pending += pt.amount;
			});
		}

		_this.doPredict = function(startDate, endDate) {
			if(typeof startDate === 'undefined' || startDate === null || startDate == '')
				startDate = moment();
			if(typeof endDate === 'undefined' || endDate === null || endDate == '')
				endDate = moment();
			
			startDate = utilService.dateFormat(startDate, 1);
			endDate = utilService.dateFormat(endDate, 1);

			meanData.doFinancialPrediction(startDate, endDate).then(function(res){
				_this.events = res.data.events;
				_this.currentFinanceSafe = res.data.currentFinanceSafe;
				_this.statements = res.data.statements;
				_this.lowestBalanceInAccountList = res.data.lowestBalanceInAccountList;

				_this.calendarDisplayerOptions = {
					customClass: getDayClass,
					minDate: new Date(startDate),
					maxDate: new Date(endDate)
				}
			});
		};

		_this.dateSelected = function(date) {
			for(var i = 0; i < _this.statements.length; i++) {
				if(_this.statements[i].date === utilService.dateFormat(date, 0)) {
					showSelectedDateModal(_this.statements[i]);
					return;
				}
			}
		}
		/*
		// TODO: It may cause infinite changes.... After changes, the index may change...

		$scope.deleteTransaction = function(parentIndex, index, startDate, endDate) {
			getAccountsAndPaymentsData().then(function(res){
				res[1].splice(index, 1);
				doPredict(startDate, endDate, res[0], res[1], res[2]);
			});
		}
		
		$scope.addTransactions = function(startDate, endDate) {
			var transactions = mockService.getMockTransactions;

			getAccountsAndPaymentsData().then(function(res){
				transactions.forEach(function(transaction){
					res[1].push(transaction);
				});
				doPredict(startDate, endDate, res[0], res[1], res[2], res[3]);
			});
		}*/

		_this.doPredict(undefined, _this.endDate);
	}]);
})();