'use strict';
require('dotenv').config();
require('./utils/pass');
const express = require('express');
const cors = require('cors');
var graphqlHTTP = require('express-graphql');
const db = require('./db');
const app = express();
const resolvers = require('./resolvers');
const schema = require('./schema');
const { graphqlUploadExpress } = require('graphql-upload');
const imageService = require('./utils/ImageService');
const authController = require('./controllers/authController');

// Constants
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use(
  '/graphql',
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  (req, res) => {
    graphqlHTTP({
      schema: schema,
      rootValue: resolvers,
      graphiql: true,
      context: { req, res, authController, imageService },
    })(req, res);
  }
);

db.on('connected', () => {
  app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
});
