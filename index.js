import * as Route from './app/index.js';

import { graphqlHTTP } from 'express-graphql';
import { fileURLToPath } from 'url';
import { schema } from './configs/index.js';

import express from 'express';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
mongoose.connect(process.env.MONGODB_URL);

const db = mongoose.connection;
const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use('/', Route.default);
app.use('/products', Route.product);
app.use('/suppliers', Route.supplier);
app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'Error', navs: [{ path: '/', label: 'Back' }] });
});

db.on('open', () => {
  app.listen(process.env.PORT || 3000, () =>
    console.log(
      'Running a Express MongoDB GraphQL App on http://localhost:4000'
    )
  );
});
db.on('error', (err) => console.log(`Connection Failed, Error: ${err}`));