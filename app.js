'use strict';
require('dotenv').config();
const express = require('express');
var graphqlHTTP = require('express-graphql');
const db = require('./db');
const app = express();
const resolvers = require('./resolvers');
const schema = require('./schema');

// Constants
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
  })
);

db.on('connected', () => {
  app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
});
