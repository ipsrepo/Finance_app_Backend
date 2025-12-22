const Transaction = require('../models/transactionModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.createTransaction = factory.createOne(Transaction);
exports.updateTransaction = factory.updateOne(Transaction);
exports.deleteTransaction = factory.deleteOne(Transaction);
exports.getTransaction = factory.getOne(Transaction, { path: 'customerID' });
exports.getAllTransactions = factory.getAll(Transaction);

exports.deleteAllTransactions = catchAsync(async (req, res, next) => {
  await Transaction.deleteMany({ customerID: req.params.id });

  res.status(200).json({
    status: 'success',
    data: 'Customer and related transactions removed successfully',
  });
});
