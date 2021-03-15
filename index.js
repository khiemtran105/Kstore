var express = require ('express');
var app = express();
var publicDir = require('path').join(__dirname,'/public');


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://tommy:1052000k@cluster0.j0uua.mongodb.net/test";

var hbs = require('hbs')
app.set('view engine','hbs')

var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extented: false}))

var PORT = process.env.PORT || 2000
app.listen(PORT);
console.log("server is running at "+ PORT)

app.get('/myhome', async(req, res)=>{
    let client= await MongoClient.connect(url);
        let dbo = client.db("KhiemDB");
        let results = await dbo.collection("Product").find({}).toArray();
        res.render('home', {model: results});
})

app.post('/addProduct', async(req, res)=>{
    let client = await MongoClient.connect(url);
    let dbo = client.db("KhiemDB");
    let name = req.body.Name;
    let madein = req.body.Madein;
    let price = req.body.Price;
    let color = req.body.Color; 
    
    let newProduct = {Name: name,Madein: madein, Price: price,Color: color };
    await dbo.collection('Product').insertOne(newProduct);
    res.redirect('/myhome');
})

app.get("/delete", async(req, res)=>{
    let id = req.query.id;
    var ObjectID = require("mongodb").ObjectID;
    let condition ={_id: ObjectID(id)};
    let client = await MongoClient.connect(url);
    let dbo = client.db("KhiemDB");
    await dbo.collection("Product").deleteOne(condition);
    let results = await dbo.collection("Product").find({}).toArray({});
    res.redirect('/myhome')
})

app.post('/search', async(req, res)=>{
    let searchText = req.body.txtSearch;
    let client = await MongoClient.connect(url)
    let dbo = client.db("KhiemDB");
    let results = await dbo.collection("Product").find({Name: new RegExp(searchText, 'i')}).toArray();
    res.render('home',{model: results} )
})

app.get('/addProduct', (req,res)=>{
    res.render('addProduct')
})
app.get('/contact', (req,res)=>{
    res.render('contact')
})
app.get('/', (req, res)=>{
    res.render('home');
})
