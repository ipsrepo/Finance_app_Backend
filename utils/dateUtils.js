exports.convertDate = function (isoString) {
  const date = new Date(isoString);

  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };

  const formatter = new Intl.DateTimeFormat('en-US', options);
  return formatter.format(date).replace(' ', ', ');
};

exports.addMonth = function (date, noOfMonths = 1) {
  let nextTransactionDate = new Date(date);
  nextTransactionDate = new Date(
    nextTransactionDate.setMonth(nextTransactionDate.getMonth() + noOfMonths),
  );

  return nextTransactionDate;
};
