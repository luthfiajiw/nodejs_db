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

routes.addRoute('/insert', function(req, res) {
  connection.query("insert into mahasiswa set ?", {
    no_induk: "123456799",
    nama: "Afin Dwi",
    alamat: "Beran"
  }, function(err, field) {
    if(err) throw err;

    let html = view.compileFile('./template/index.html')({
      h1: field.affectedRows + " Rows Affected"
    });
    res.writeHead(200, {"Content-Type" : "text/html"});
    res.end(html);
  })


});

routes.addRoute('/update', function(req, res) {
  connection.query("update mahasiswa set ? where ?", [
    {nama: "Afin Dwi Widandari"},
    {no_induk: "123456799"}
  ], function(err, fields) {
    if (err) throw err;

     let html = view.compileFile('./template/index.html')({
       h1: fields.affectedRows + " Rows Updated"
     });
     res.writeHead(200, {"Content-Type" : "text/html"});
     res.end(html);

  })
});

routes.addRoute('/delete', function(req, res) {
  connection.query("delete from mahasiswa where ?",
  {no_induk: "123456789"},
  function(err, fields) {
    if (err) throw err;

    let html = view.compileFile('./template/index.html')({
      h1: fields.affectedRows + " Rows Deleted"
    });
    res.writeHead(200, {"Content-Type" : "text/html"});
    res.end(html);
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
