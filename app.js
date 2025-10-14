const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const genericErrorHandler = require('./controllers/errorController');
const customerRouter = require('./routes/customerRoutes.js');
const transactionRouter = require('./routes/transactionRouter.js');

const app = express();

// MiddleWare
// Set Security HTTP Middleware
app.use(helmet()); // It'll produce middleware function and add it to here

app.use(morgan('dev'));

// Limiter Middleware
const limiter = rateLimit({
  max: 3,
  windowM: 60 * 60 * 1000,
  message: `Too many request from this IP, try after sometime`,
});
// app.use('/api', limiter); // For all API call
app.use('/api/v1/users/login', limiter); // For login only

// Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: '10kb', // Read only if body content in less than 10kb
  }),
);

// Prevent HTTP parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingAverage',
      'ratingQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
      'sort',
    ],
  }),
);

// Setting static file path
app.use(express.static(`${__dirname}/public`));

// Testing middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/customers', customerRouter);
app.use('/api/v1/transactions', transactionRouter);

// Handle all the unhandled Routes
app.all('/{*any}', (req, res, next) => {
  next(
    new AppError(`Unable to find the ${req.originalUrl} in the server!!!`, 404),
  );
});

// Generic Error Handler
app.use(genericErrorHandler);

module.exports = app;
