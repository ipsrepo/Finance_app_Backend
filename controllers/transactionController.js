const Transaction = require('../models/transactionModel.js');
const factory = require('./handlerFactory');

exports.createTransaction = factory.createOne(Transaction);
exports.updateTransaction = factory.updateOne(Transaction);
exports.deleteTransaction = factory.deleteOne(Transaction);
exports.getTransaction = factory.getOne(Transaction, { path: 'customerID' });
exports.getAllTransactions = factory.getAll(Transaction);
