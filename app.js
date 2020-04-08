'use strict';
require('dotenv').config();
const express = require('express');
const db = require('./db');
const app = express();

// Constants
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World');
});

db.on('connected', () => {
  app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
});
