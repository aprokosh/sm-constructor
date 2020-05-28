const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname))
const urlencodedParser = bodyParser.urlencoded({extended: false});
var Crypto = require('crypto-js')
ObjectId = require("mongodb").ObjectID;

var port = process.env.PORT||3000;
app.listen(process.env.PORT ||port, () => {
  console.log(`Listening on port ${port}`)
})

var error_message="None";

const mongoClient = require("mongodb").MongoClient;
const url = process.env.MONGODB_URI || "mongodb://user:user2ndpass@ds159546.mlab.com:59546/smart-contracts";

app.use(session({
      secret: 'mylittlesecret',
      store: new MongoStore({url: process.env.MONGODB_URI || "mongodb://user:user2ndpass@ds159546.mlab.com:59546/smart-contracts"}),
      cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 1000 * 30
      },
      resave: false,
      saveUninitialized: false
    })
);

check_regex = function (regex, string){
  let ch = string.match(regex);
  if ((ch==null)||(ch[0]!==string)) return false;
  else return true;
}

app.post("/sign-up", urlencodedParser, function (req, res) {
  const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,16}/;
  let check = check_regex(regex, req.body.password1)
  mongoClient.connect(url, function (err, client) {
    client.db("smart-contracts").collection("users").findOne({login: req.body.name}, function(err,result){
      if (result) {
        console.log("Имя пользователя занято");
        error_message="Имя пользователя занято";
        res.redirect('/sign-up')
      }
      else if (req.body.password1 != req.body.password2){
        console.log("Введенные пароли не совпадают!")
        error_message="Введенные пароли не совпадают!";
        res.redirect('/sign-up')
      }
      else if (!check) {
        console.log("Слабый пароль")
        res.redirect('/sign-up')
        error_message="Слабый пароль";
      }
      else {
        client.db("smart-contracts").collection("users").insertOne({login: req.body.name, password: Crypto.SHA256(req.body.password1).toString(), role: 'user', fav: []});
        res.sendFile(__dirname + '/login.html');
      }
    });
  });
});

app.post("/login", urlencodedParser, function (req, res) {
  mongoClient.connect(url, function (err, client) {
    client.db("smart-contracts").collection("users").findOne({login: req.body.login}, function(err,result){
      if (result) {
        if (Crypto.SHA256(req.body.password).toString() === result.password) {
          req.session.authorized = true;
          req.session.username = req.body.login;
          res.redirect('/my-contracts');
        }
        else {
          console.log('Неверный пароль');
          error_message="Неверный пароль";
          res.redirect('/');
        }
      }
      else {
        console.log('Пользователя с таким именем не существует');
        error_message="Пользователя с таким именем не существует";
        res.redirect('/');
      }
    });
  });
});

app.get("/geterror", (request, result)=>{
  result.send(error_message);
  error_message="None";
});

app.get('/logout', (req, res) => {
  delete req.session.authorized;
  delete req.session.username;
  delete req.session.role;
  res.redirect('/')
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html')
});

app.get('/create', (req, res) => {
  if (req.session.authorized)
      res.sendFile(__dirname + '/create.html')
  else
    res.redirect('/404')
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html')
});

app.get('/sign-up', (req, res) => {
  res.sendFile(__dirname + '/sign-up.html')
});

app.get('/my-contracts', (req, res) => {
  if (req.session.authorized) {
    res.sendFile(__dirname + '/my-contracts.html')
  }
  else
    res.redirect('/404')
});

app.get('/saved', (req, res) => {
  if (req.session.authorized) {
    res.sendFile(__dirname + '/saved.html')
  }
  else
    res.redirect('/404')
});

app.get('/404', (req, res) => {
  res.sendFile(__dirname + '/404.html')
});

app.get('/getrole', (req, res) => {
  res.send(req.session.role);
});


async function postText (req, res) {
  mongoClient.connect(url, async function (err, client) {
    client.db("smart-contracts").collection("contractTextes").findOne({
      "creator": req.session.username, "name": req.body.name
    }, function (err, result) {
      if (result) {
        client.db("smart-contracts").collection("contractTextes").findOneAndUpdate({
          "creator": req.session.username, "name": req.body.name}, { $set: {"platform": req.body.platform, "text": req.body.text}});
      } else client.db("smart-contracts").collection("contractTextes").insertOne({
        "creator": req.session.username, "name": req.body.name, "platform": req.body.platform, "text": req.body.text
      });
    });
  });
  res.send("ok")
}
app.post("/savetext", urlencodedParser, postText);

async function postCode (req, res) {
  await mongoClient.connect(url, async function (err, client) {
    await client.db("smart-contracts").collection("contractCodes").findOne({
      "creator": req.session.username, "name": req.body.name
    }, function (err, result) {
      if (result) {
        client.db("smart-contracts").collection("contractCodes").findOneAndUpdate({
          "creator": req.session.username, "name": req.body.name
        }, {$set: {"code": req.body.code}});
      } else client.db("smart-contracts").collection("contractCodes").insertOne({
        "creator": req.session.username, "name": req.body.name, "code": req.body.code
      });
    });
  });
  res.send("Saved")
}
app.post("/saveproject", urlencodedParser, postCode);

function getTextes(req, res) {
  mongoClient.connect(url, function (err, client) {
    client.db("smart-contracts").collection("contractTextes").find({creator: req.session.username}).toArray(function(err, results){
      let contracts = []
      for (let res of results) {
        contracts.push({ id: res._id, name: res.name, platform: res.platform, text: res.text})
      }
      res.status(200).send({ data: contracts })
    });
  });
}
app.get("/gettextes", urlencodedParser, getTextes);

async function deleteText (req, res) {
  let id = req.body.id;
  mongoClient.connect(url, function (err, client) {
    client.db("smart-contracts").collection("contractTextes").deleteOne({"_id": ObjectId(id)})
  });
}
app.post("/deleteText", urlencodedParser, deleteText);

function getCodes(req, res) {
  mongoClient.connect(url, function (err, client) {
    client.db("smart-contracts").collection("contractCodes").find({creator: req.session.username}).toArray(function(err, results){
      let contracts = []
      for (let res of results) {
        contracts.push({ id: res._id, name: res.name, code: res.code})
      }
      res.status(200).send({ data: contracts })
    });
  });
}
app.get("/getcodes", urlencodedParser, getCodes);

async function deleteCode (req, res) {
  let id = req.body.id;
  mongoClient.connect(url, function (err, client) {
    client.db("smart-contracts").collection("contractCodes").deleteOne({"_id": ObjectId(id)})
  });
}
app.post("/deleteCode", urlencodedParser, deleteCode);