'use strict';
const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log('DB connected successfully');
  } catch (err) {
    console.error('Connection to database failed', err.message);
  }
})();

module.exports = mongoose.connection;
