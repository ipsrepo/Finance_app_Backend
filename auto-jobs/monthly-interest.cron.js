const { CronJob } = require('cron');
const Customer = require('../models/customerModel');
const {
  calculateInterestForCustomer,
} = require('../services/interest-calc.service');

// Runs every day at 12:00 AM
exports.customerJob = new CronJob(
  '0 15 15 * * *', // second minute hour day month week
  async () => {
    try {
      console.log('Interest cron started');

      const cursor = Customer.find().cursor();

      await cursor.eachAsync(async (customer) => {
        await calculateInterestForCustomer(customer);
      });

      console.log('Interest cron completed');
    } catch (err) {
      console.error('Interest cron failed:', err);
    }
  },
  null,
  true, // start immediately
  'Asia/Kolkata', // ⚠️ IMPORTANT: timezone
);
