var express = require('express');
var router = express.Router();
var budgetCtrl = require('../controllers/finance/budget');
var recurringCtrl = require('../controllers/finance/recurring');
var transactionCtrl = require('../controllers/finance/transaction');
var AccountCtrl = require('../controllers/finance/account');
var accountDefaultCtrl = require('../controllers/finance/account-default');
var rewardRuleCtrl = require('../controllers/finance/reward-rule');
var settingsCtrl = require('../controllers/finance/settings');

router.get('/budget?', budgetCtrl.calculateBudget);
router.get('/budget/coms-cap', budgetCtrl.comsumptionCapacityByDateReq);
router.put('/budget/trans-perm', budgetCtrl.canHasTransactionReq);
router.put('/budget/salary-need', budgetCtrl.salaryNeedForPlan);
/* Recurring Payment */
router.get('/recurring?', recurringCtrl.getRecurringPaymentsReq);
router.post('/recurring', recurringCtrl.addRecurringPaymentReq);
router.put('/recurring', recurringCtrl.updateRecurringPaymentReq);
router.delete('/recurring/:id', recurringCtrl.deleteRecurringPaymentReq);
/* Transaction */
router.get('/transaction', transactionCtrl.getTransactionsReq);
router.post('/transaction', transactionCtrl.addTransactionReq);
router.put('/transaction', transactionCtrl.updateTransactionReq);
router.delete('/transaction/:id', transactionCtrl.deleteTransactionReq);
/* Account */
router.get('/account', AccountCtrl.getAccountsReq);
router.get('/account/not-cc', AccountCtrl.getAccountsNoCreditCardReq);
router.post('/account', AccountCtrl.addAccountReq);
router.put('/account', AccountCtrl.updateAccountReq);
router.delete('/account/:id', AccountCtrl.deleteAccountReq);
/* Account Default */
router.get('/account-default', accountDefaultCtrl.getAccountDefaultReq);
router.post('/account-default', accountDefaultCtrl.addAccountDefaultReq);
router.delete('/account-default/:id', accountDefaultCtrl.deleteAccountDefaultReq);
/* Reward Rule */
router.get('/reward-rule', rewardRuleCtrl.getRewardRulesReq);
router.post('/reward-rule', rewardRuleCtrl.addRewardRuleReq);
router.put('/reward-rule', rewardRuleCtrl.updateRewardRuleReq);
router.delete('/reward-rule/:id', rewardRuleCtrl.deleteRewardRuleReq);
/* Settings */
router.get('/settings?', settingsCtrl.getSettingsReq);
router.put('/settings/db-backup?', settingsCtrl.backupDB);
router.put('/settings/db-restore?', settingsCtrl.restoreDB);
router.put('/settings', settingsCtrl.updateSettingsReq);

module.exports = router;