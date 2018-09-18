const express = require('express');
const app = express();

const database = require('./mocks/database.json');

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/books', (req, res) => res.send(database));

app.get('/books/featured', (req, res) => res.send(database.slice(0, 8)));

app.get('/books/recent', (req, res) => res.send(database.slice(8, 16)));

app.get('/books/:bookId', (req, res) =>
  res.send(
    database.find(item => item.recid === parseInt(req.params.bookId, 10))
  )
);

app.listen(3001, () => console.log('App listening on port 3001'));
