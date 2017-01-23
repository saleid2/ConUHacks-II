var express      = require('express');
var router       = express.Router();
var getBankAcc   = require('../models/exampleApi.js').exampleAPI;

router.post('/', function(req, res) {
    res.send("OK");
})

module.exports = router;
