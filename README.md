## Financial Calculator
        Financial Calculator for self-use (currently). 
        This project is part of my SHS (Smart Home System).
        Will change to Angular 2 and Angular 2 material when it
        release the final version.
## Main Features
        * Personal budget forecast for a period. Remind me what is
          the lowest balance for each accounts during this period.
        * Calculate purchase category rewards.
        * Determine whether this transaction will crash me. If no,
          tell me what account I can use and show me transactions.
        * Tell me how much money I can spend on specific date for each 
          account.
        ~ Determine how much money you need for current plan.
## Library
        Angular 1.6
        Node.js 6.9.1
        async 2.1.5
        UI Bootstrap 2.5.0
        moment.js
        MongoDB 3.2.5
        lodash 4.17.4
        pm2
## REST Api (/rest)
#### Financial Prediction (/finance)
        GET     /budget?sd=&ed=         
        GET     /budget/coms-cap?date    - Comsumption capability
        PUT     /budget/trans-perm       - Can I have those transactions
        PUT     /budget/salary-need      - Salary need for current plan
        GET     /recurring               - Get All recurring payments
        POST    /recurring               - Add recurring payment
        PUT     /recurring               - Update recurring payment
        DELETE  /recurring/:id           - Delete a recurring payment
        GET     /transaction?isPending   
        POST    /transaction             - Add recurring payment
        PUT     /transaction             - Update recurring payment
        DELETE  /transaction/:id         - Delete a recurring payment
        GET     /account                 - Get all accounts
        GET     /account/not-cc          - Not CreditCard accounts
        POST    /account                  
        PUT     /account           
        DELETE  /account                 
        GET     /account-default         - Get Acccount Default
        POST    /account-default         - Add Account Default
        DELETE  /account-default/:id     - Delete account Default
        GET     /reward-rule
        POST    /reward-rule
        DELETE  /reward-rule/:id
        GET     /settings?need
        PUT     /settings/db-backup?
        PUT     /settings/db-restore?
        PUT     /settings
## DB Model (Model Name)
#### Statement (Statement)
        date: Date ("MM/DD/YYYY")
        payBy: Account(ObjectId)
        transaction: [Transaction(ObjectId)]
#### Recurring Payment (Recurring)
        type: String ("Credit", "Debit")
        category: String
        description: String
        recurringPeriod: String ("days", "months", "weeks", "2weeks")
        recurringDate: String ("1", "Saturday")
        amount: Number
        payAhead: Number
        payBy: Account(ObjectId)
        startDate: Date ("11/11/1111")
        endDate: Date ("9/9/9999")
        isPending: Boolean
#### Transaction (Transaction)
        description: String
        type: String ("Credit", "Debit")
        amount: Number
        category: String
        date: Date ("MM/DD/YYYY")
        payBy: Account(ObjectId)
        isPending: Boolean
#### Account  (Account)
        _id: String
        updatedDate: Date
        accountName: String
        last4Num: Number
        type: String ("Cash", "Checking", "Saving", "CreditCard", "GiftCard")
        dueDate: Date
        closingDate: Date
        creditLine: Number
        minPayment: Number
        lastBalance: Number
        pendingTransactions: [{description, date, amount, type, 
                category, (payBy)}]
        balance: Number
        avaliableBalance: Number
        apr0Valid: Boolean
        apr0Date: {startDate, endDate} {}
        threshold: Number
        payBy: Account(ObjectId)
        rewards: Number
        rewardRules: [{rule: (RewardAccount ObjectId), earned: Number}]
        order: Number
        backupPaymentAccount: Account(ObjectId)
#### AccountDefault (AccountDefault)
        _id: String
        accountName: String
        type: String ("Cash", "Checking", "Saving", "CreditCard")
        rewardType: String ("Point", "Cash")
        rewardRules: [RewardRule(ObjectId)]
#### Reward Rule (RewardRule)
        description: String
        rewardType: String ("Point", "Cash")
        rewardMax: Number　(-1, > 0)
        redeemMin: Number  (-1, > 0)
        startDate: Date ("1/1/1")
        endDate: Date ("9/9/9999")
        rewardStrategy: {[rewardCategory], rewardRatio}
#### Settings (Settings)
        accountConfirmDate: Date
        transactionCategory: [String]
        dbVersion: String
## Terminology
        Accounts: credit card, checking, saving, cash
        AccountsDetails/AccountInfo: without updated date/with upated date
        Transaction: include Credit and Debit behavior, one-off payment
        Wallet: include date and accounts Details
        Statement: include wallet and transaction
        AccountDefault: some value never changed
        Pending: Credit Card have debit behavior, take one weekday to convert to balance
## Q&A
####   Why you move business logic to backend?
        Because I may change front-end framework quite frequently.
        For backend, I only want to use MongoDB and Node as my framework.
####   Is it data validator in front and backend do different job?
        Yes, it will do more job in the front-end for displaying purpose.
        For backend, we assume the date is valid Date or moment object,
        not null or undefined.
####   Is this application support multiple user?
        No. Currently it is only designed for self-use.
####   When should I update my account?
        By the end of the day. Because all the transaction on the 
        updated day will not accounted.
####   When should I use schema reference?
        When you want to add other schema with the latest info.
####   Why Reward Rule can't update?
        Reward Rule is defined as a single instance attached to
        account default.
## TODO
        Auto Generate Statement
        Monthly Statement
        direct deposit center
        pending show change
        how much rates I need to have?
        use reward to pay options
        add transaction will modify recurring record
        pending positive negative
## Issue
        1. moment object add/substract method will replace variable.
        But format method will not.
        2. need to delete _id to update records in mongodb v2.4