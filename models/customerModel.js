const mongoose = require('mongoose');
const validator = require('validator');
const suretySchema = require('./suretyModel.js');

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
      unique: true,
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
    paymentDue: Date,
    interestRate: {
      type: Number,
      require: [true, 'interest rate required'],
    },
    balance: Number,
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

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
