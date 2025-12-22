const Customer = require('../models/customerModel');
const Transaction = require('../models/transactionModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const {
  calculateInterestForCustomer,
} = require('../services/interest-calc.service');

exports.createCustomer = factory.createOne(Customer);
exports.updateCustomer = factory.updateOne(Customer);
exports.deleteCustomer = factory.deleteOne(Customer);
exports.getCustomer = factory.getOne(Customer, { path: 'transactions' });
exports.getAllCustomers = factory.getAll(Customer);

// Deactivate Customer
exports.deactivateCustomer = catchAsync(async (req, res, next) => {
  await Customer.findByIdAndUpdate(req.body.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.addInitialTransaction = catchAsync(async (req, res, next) => {
  const { customer } = req;

  if (!customer) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'Customer not found in request' });
  }

  await Transaction.create({
    amount: customer.amount,
    date: customer.loanDate || new Date(),
    customerID: customer._id,
  });
  next();
});

exports.autoFillTransactions = catchAsync(async (req, res, next) => {
  const { customer } = req;
  await calculateInterestForCustomer(customer);

  res.status(201).json({
    status: 'success',
    data: {
      customer,
    },
  });
});
