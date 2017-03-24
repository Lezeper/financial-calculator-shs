(function(){
  app.service('utilService', [function(){
		var loading = false;
    // flag -1: return moment object
		// flag 0: return string; add weekday, 2/17/2017 Tuesday
		// flag 1: return string; month day year, 2/2/2017
		var dateFormat = function(date, flag){
			if(flag === -1) 
				return moment(new Date(date));

			if (date instanceof Date) {
				if(typeof flag === 'undefined')
					return moment(date).format('MM/DD/YYYY');
				if (flag === 0)
					return moment(date).format('MM/DD/YYYY, dddd');
				if (flag === 1)
					return moment(date).format('MM/DD/YYYY');
			}
					
			if (date instanceof moment) {
				if(typeof flag === 'undefined')
					return date.format('MM/DD/YYYY');
				if (flag === 0)
					return date.format('MM/DD/YYYY, dddd');
				if (flag === 1)
					return date.format('MM/DD/YYYY');
			}
			
			return console.log("Can't regonize...");
		}
		
		var accountType = function(type) {
			if (type === 'cc')
				return 'CreditCard';
			if(type === 'cash')
				return 'Cash';
			if(type === 'checking')
				return 'Checking';
			if(type === 'saving')
				return 'Saving';
		}

		var transactionType = function(type) {
			if(type === 'debit')
				return 'Debit';
			if(type === 'credit')
				return 'Credit';
		}

    return {
      dateFormat: dateFormat,
			accountType: accountType,
			transactionType: transactionType,
			loading: loading
    }
  }]);
})();