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
    type: {
      type: String,
      required: [true, 'Transaction type is required'],
      enum: {
        values: ['Credit', 'Debit'],
        message: 'Type should be Credit or Debit',
      },
      default: 'Credit',
    },
    payPrinciple: {
      type: Boolean,
      default: false,
      select: false,
    },
    details: {
      type: String,
      default: 'Initial credit',
      required: [true, 'Transaction details required'],
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
