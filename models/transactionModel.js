const mongoose = require('mongoose');

const transactionModel = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Loan amount required'],
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    payPrinciple: {
      type: Boolean,
      default: false,
      select: false,
    },
    closingAccount: {
      type: Boolean,
      default: false,
      select: false,
    },
    customerID: {
      type: mongoose.Schema.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer ID is required'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Transaction = mongoose.model('Transaction', transactionModel);

module.exports = Transaction;
