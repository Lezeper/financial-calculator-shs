(function(){
  app.service('mockService', ['utilService', function(utilService){
    var getMockTransactions = [
      {
        type: "Debit",
        description: "Mock Tran 1",
        date: "2/19/2017",
        amount: 1200,
        accountName: "Citi Double Cash"
      },
      {
        type: "Credit",
        description: "Mock Tran 2",
        date: "3/3/2017",
        amount: 55,
        accountName: "Citi Check"
      },
      {
        type: "Debit",
        description: "Mock Tran 3",
        date: "3/4/2017",
        amount: 7777,
        accountName: "Chase Amazon Prime"
      },
    ]

    return {
      getMockTransactions: getMockTransactions
    }
  }]);
})();