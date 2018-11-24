const http = require('http');
const url = require('url');
const view = require('swig');
const routes = require('routes')();
const mysql = require('mysql');
let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  database: "node_js",
  user: "root",
  password: ""
})

routes.addRoute('/', function(req, res) {
  connection.query('select * from mahasiswa',
    function(err,rows,field) {
      if (err) throw err;

      res.writeHead(200, {"Content-Type" : "text/plain"});
      res.end(JSON.stringify(rows));

      // Untuk meenjejak dan menampilkan data terpilih
      // rows.forEach(function(item) {
      //   res.write(item.nama+"\n");
      // });
  });
});

http.createServer(function (req,res) {
  let pathname = url.parse(req.url).pathname;
  let match = routes.match(pathname);

  if (match) {
    match.fn(req,res);
  }else {
    res.writeHead(200, {"Content-Type" : "text/plain"});
    res.end("Page Not Found");
  }
}).listen(4000);

console.log("Server is running");
