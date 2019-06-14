var express = require('express');
// Router-level middleware
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');

});

module.exports = router;
