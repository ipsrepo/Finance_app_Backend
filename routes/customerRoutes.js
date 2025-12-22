const express = require('express');
const customerController = require('../controllers/customerController');
const transactionController = require('../controllers/transactionController');

const router = express.Router();

router
  .route('/')
  .get(customerController.getAllCustomers)
  .post(
    customerController.createCustomer,
    customerController.addInitialTransaction,
    customerController.autoFillTransactions,
  );

router.delete('/deactivate', customerController.deactivateCustomer);

router
  .route('/:id')
  .get(customerController.getCustomer)
  .patch(customerController.updateCustomer)
  .delete(
    customerController.deleteCustomer,
    transactionController.deleteAllTransactions,
  );

module.exports = router;
