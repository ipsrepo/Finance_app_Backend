const Customer = require('../models/customerModel.js');
const factory = require('./handlerFactory');

exports.createCustomer = factory.createOne(Customer);
exports.updateCustomer = factory.updateOne(Customer);
exports.deleteCustomer = factory.deleteOne(Customer);
exports.getCustomer = factory.getOne(Customer, { path: 'transactions' });
exports.getAllCustomers = factory.getAll(Customer);
