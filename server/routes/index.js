var express = require('express');
const { NoSQLDatabase } = require('../dbConnection');
var router = express.Router();

/* GET home page. */
let customers = new NoSQLDatabase('customers');
let client = new NoSQLDatabase('client');


router.get('/', async function (req, res, next) {
  result = await customers.insert({ "name": 'abcd' });
  result = await client.insert({ "name": 'abcd' });
  res.render('index', { title: 'Express' });
});

module.exports = router;
