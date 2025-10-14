// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception...❌❌❌');
  const error = Object.create(err);
  console.log(error.name, error.message);
  process.exit(1);
});

const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB Connected Successfully');
  });

// console.log(app.get('env'));
// console.log(process.env);

// Start the Server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App Running in post ${PORT}`);
});

// console.log(x); // caught on uncaught exception

process.on('unhandledRejection', (err) => {
  console.log('UnHandled Rejection...❌❌❌');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
