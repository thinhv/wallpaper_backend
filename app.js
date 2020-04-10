'use strict';
require('dotenv').config();
require('./utils/pass');
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

app.use('/graphql', (req, res) => {
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
    context: { req, res },
  })(req, res);
});

db.on('connected', () => {
  app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
});
