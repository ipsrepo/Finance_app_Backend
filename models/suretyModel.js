const mongoose = require('mongoose');
const validator = require('validator');

const suretySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  mobile: {
    type: String,
    validate: {
      validator: function (value) {
        // Validate Indian numbers
        return validator.isMobilePhone(value, 'en-IN');
      },
      message: 'Invalid mobile number',
    },
  },
  address: {
    type: String,
  },
});

module.exports = suretySchema;
