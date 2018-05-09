var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');


var app = express();

// Body-parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var port = 4001;

app.listen(port)


var db = new mongodb.Db(
    'pivii',
    new mongodb.Server('localhost', 27017, {}),
    {}
)

console.log("Sever on listen [" + port + "]");


app.get("/", (req, res) => { })

app.post("/register-user", (req, res) => {


    db.open(function (err, mongoclient) {
        mongoclient.collection('users', function (err, collection) {
            collection.insert(data, function (err, records) {
                if (err) {
                    res.json({ 'status': 'erro' });
                } else {
                    res.json({ 'status': 'inclusao realizada com sucesso', code: 200, data: data });
                }
                mongoclient.close();
            });
        });
    });
})



app.post("/register-hardware", (req, res) => {
    var data = req.body;
    res.send(data)
})



