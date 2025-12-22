const Customer = require('../models/customerModel');
const Transaction = require('../models/transactionModel');
const dateUtils = require('../utils/dateUtils');

exports.calculateInterestForCustomer = async (customer) => {
  const today = new Date();

  const { _id, loanDate, lastInterestDate, amount, interestRate } = customer;

  if (!loanDate || !interestRate || !amount || today <= lastInterestDate) {
    return;
  }

  let nextTransactionDate = dateUtils.addMonth(lastInterestDate);
  let updatedLastInterestDate = lastInterestDate;
  const transactionsEntries = [];

  while (nextTransactionDate <= today) {
    updatedLastInterestDate = nextTransactionDate;

    const interestAmount = (amount * interestRate) / 100;

    transactionsEntries.push({
      amount: interestAmount,
      date: nextTransactionDate,
      details: `Interest till ${dateUtils.convertDate(nextTransactionDate)}`,
      customerID: _id,
    });

    nextTransactionDate = dateUtils.addMonth(nextTransactionDate);
  }

  if (lastInterestDate.getTime() !== updatedLastInterestDate.getTime()) {
    await Customer.findByIdAndUpdate(_id, {
      lastInterestDate: updatedLastInterestDate,
    });
  }

  if (transactionsEntries.length > 0) {
    await Transaction.insertMany(transactionsEntries);
  }
};
