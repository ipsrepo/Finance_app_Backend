const mongoose = require('mongoose');
const validator = require('validator');
const suretySchema = require('./suretyModel');
const Transaction = require('./transactionModel');

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [3, 'User name must have at least 3 characters'],
      maxlength: [100, 'User name must have less than 100 characters'],
    },
    email: {
      type: String,
      lowercase: true,
      validate: [validator.isEmail, 'email should be valid'],
    },
    mobile: {
      type: String,
      // unique: true,
      required: [true, 'Mobile number required'],
      validate: {
        validator: function (value) {
          return validator.isMobilePhone(value, 'any', { strictMode: false });
        },
        message: 'Please enter a valid mobile number',
      },
    },
    amount: {
      type: Number,
      required: [true, 'Loan amount required'],
    },
    address: {
      type: String,
      required: [true, 'address required'],
    },
    loanDate: {
      type: Date,
      default: Date.now(),
    },
    lastInterestDate: {
      type: Date,
      default: function () {
        return this.loanDate;
      },
    },
    paymentDue: Date,
    interestRate: {
      type: Number,
      require: [true, 'interest rate required'],
    },
    balance: {
      type: Number,
      default: function () {
        return this.amount;
      },
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    surety: [suretySchema],
    documents: [String],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual Referencing
customerSchema.virtual('transactions', {
  ref: 'Transaction',
  foreignField: 'customerID',
  localField: '_id',
});

customerSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
});

// 🔹 Middleware — must be before compiling model
customerSchema.pre(/^find/, async function (next) {
  if (this.getOptions().skipBalanceUpdate) return;

  const balances = await Transaction.aggregate([
    { $match: { customerID: { $exists: true } } },
    {
      $group: {
        _id: '$customerID',
        totalCredit: {
          $sum: { $cond: [{ $eq: ['$type', 'Credit'] }, '$amount', 0] },
        },
        totalDebit: {
          $sum: { $cond: [{ $eq: ['$type', 'Debit'] }, '$amount', 0] },
        },
      },
    },
    { $project: { balance: { $subtract: ['$totalCredit', '$totalDebit'] } } },
  ]);

  // When updating, skip middleware
  await Promise.all(
    balances.map((b) =>
      this.model.findByIdAndUpdate(
        b._id,
        { balance: b.balance },
        { skipBalanceUpdate: true },
      ),
    ),
  );
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
