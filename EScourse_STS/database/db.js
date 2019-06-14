var mysql = require('mysql');
var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : 'skrv587', //'y-NR<8U8xq<W'
   port: '3306',
   database : 'StockTradingSys'
});


// connection.connect(function(err) {
//     if (err) throw err;
//     console.log('You are now connected...')
// });
/* now free with I/Os */


// connection.query();
//
//
// connection.end();

module.exports = connection;
