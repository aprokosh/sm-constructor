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

var port = process.env.PORT;
app.listen(process.env.PORT ||port, () => {
  console.log(`Listening on port ${port}`)
})

const mongoClient = require("mongodb").MongoClient;
const url = process.env.MONGODB_URI || "mongodb://user:user2ndpass@ds159546.mlab.com:59546/smart-contracts";

app.use(session({
      secret: 'mylittlesecret',
      store: new MongoStore({url: process.env.MONGODB_URI || "mongodb://user:user2ndpass@ds159546.mlab.com:59546/smart-contracts"}),
      cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 1000
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
        console.log("Имя пользователя уже используется")
        res.redirect('/sign-up')
      }
      else if (req.body.password1 != req.body.password2){
        console.log("Введенные пароли не совпадают!")
        res.redirect('/sign-up')
      }
      else if (!check) {
        console.log("Слабый пароль")
        res.redirect('/sign-up')
      }
      else {
        client.db("smart-contracts").collection("users").insertOne({login: req.body.name, password: Crypto.SHA256(req.body.password1).toString(), role: 'user', fav: []});
        res.sendFile(__dirname + '/login.html')
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
          req.session.role = result.role;
          res.redirect('/my-contracts');
        }
        else {
          console.log('Неверный пароль');
          res.redirect('/')
        }
      }
      else {
        console.log('Пользователя с таким именем не существует');
        res.redirect('/')
      }
    });
  });
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

//some functions
/*
count_new = function(){
  return new Promise(function (resolve, reject) {
    mongoClient.connect(url, function (err, client) {
      client.db("metodbase").collection("mero").find({
        status: 'review'
      }).count(function (err, result) {
        resolve(result);
      });
    });
  });
}

is_fav = function(username, mero){
  if ((mero.fav).includes(username)) return true;
  else return false;
}
find_mero_by_id = function(id) {
  return new Promise(function (resolve, reject) {
    mongoClient.connect(url, async function (err, client) {
      await client.db("metodbase").collection("mero").findOne({"_id": ObjectId(id)}).then((res) => {
        resolve(res);
      });
    });
  });
}

module.exports = {
  count_new, is_fav, find_mero_by_id, check_regex
}

app.post("/add", urlencodedParser, function (req, res) {
  let check = true;
  const regex1 = /([0-9\s\D]*)([a-zA-Zа-яА-Я]+)([0-9\s\D]*){3,}/g;
  const regex2 = /([a-zA-Z0-9/]+)([a-zA-Z0-9/:-]*)([.]+)([a-zA-Z]+)([a-zA-Z0-9/-]*){5,}/g;
  let check1 = check_regex(regex1, req.body.name)
  let check2 = check_regex(regex1, req.body.desc)
  let check3 = check_regex(regex2, req.body.link)

  if ((!check1)||(!check2)||(!check3)) {
    res.redirect('/add')
    check = false;
  }
  else res.redirect('/menu')
  mongoClient.connect(url, function (err, client) {
    client.db("metodbase").collection("schema").findOne(function(error, result){
      if ((check) && (result.age.includes(req.body.age)) && (result.type.includes(req.body.type)) && (result.hard.includes(req.body.hard)) && (result.place.includes(req.body.place))){
        if (req.session.role === 'admin')
          client.db("metodbase").collection("mero").insertOne({
            name: req.body.name,
            type: req.body.type,
            age: req.body.age,
            hard: req.body.hard,
            place: req.body.place,
            desc: req.body.desc,
            link: req.body.link,
            status: 'confirmed',
            author: req.session.username,
            fav: []
          });
        else
          client.db("metodbase").collection("mero").insertOne({
            name: req.body.name,
            type: req.body.type,
            age: req.body.age,
            hard: req.body.hard,
            place: req.body.place,
            desc: req.body.desc,
            link: req.body.link,
            status: 'review',
            author: req.session.username,
            fav: []
          });
      }
    });
  });
});

app.get('/getnew', (req, res) => {
  mongoClient.connect(url, function (err, client) {
    client.db("metodbase").collection("mero").find({status: 'review'
    }).toArray(function(err, results){
      let meros = []
      for (let res of results) {
        meros.push({ id: res._id, name: res.name, type: res.type, age: res.age, hard: res.hard, place: res.place, desc: res.desc, link: res.link })
      }
      res.status(200).send({ data: meros })
    });
  });
})

var cat_value;
var age_value;
var hard_value;
var place_value;

app.post("/getres", urlencodedParser, function (req, res) {
  if (req.session.authorized) {
    res.sendFile(__dirname + '/res.html');
    cat_value = req.body.type;
    age_value = req.body.age;
    hard_value = req.body.hard;
    place_value = req.body.place;
  }
  else
    res.redirect('/404')
});

app.get("/getmero", (req, res) => {
  mongoClient.connect(url, function (err, client) {
    client.db("metodbase").collection("mero").find({
      type: cat_value,
      age: { $in: [ age_value, 'Любой'] },
      hard: { $in: [ hard_value] },
      place: { $in: [ place_value, 'Любое'] },
      status: 'confirmed'
    }).toArray(function(err, results){
      let meros = []
      for (let res of results) {
        console.log(is_fav(req.session.username,res))
        if (is_fav(req.session.username,res))
          meros.push({ id: res._id, name: res.name, type: res.type, age: res.age, hard: res.hard, place: res.place, desc: res.desc, link: res.link, f: true})
        else
          meros.push({ id: res._id, name: res.name, type: res.type, age: res.age, hard: res.hard, place: res.place, desc: res.desc, link: res.link, f: false})
      }
      console.log(JSON.stringify(meros));
      res.status(200).send({ data: meros })
    });
  });
});


app.get('/getusername', (req, res) => {
  res.send(req.session.username);
});

app.get('/countnew', (req, res) => {
  count_new().then(function(cnt){
    res.send(cnt);
  })
});

ObjectId = require("mongodb").ObjectID;

app.post('/confirm', (req, res) => {
  let id = req.body.id;
  mongoClient.connect(url, function (err, client) {
    client.db("metodbase").collection("mero").findOneAndUpdate(
        { "_id" : ObjectId(id) },{$set: { status: "confirmed"}});
    client.db("metodbase").collection("mero").findOne({"_id" : ObjectId(id)}, function (error, result) {
      client.db("metodbase").collection("schema").findOneAndUpdate({},
          {$addToSet: {age: result.age, type: result.type, hard: result.hard, place: result.place}})
    });
  });
});

app.post('/reject', (req, res) => {
  let id = req.body.id;
  mongoClient.connect(url, function (err, client) {
    client.db("metodbase").collection("mero").deleteOne({"_id": ObjectId(id)})
  });
});

app.post('/fav', (req, res) => {
  let id = req.body.id;
  mongoClient.connect(url, function (err, client) {
    client.db("metodbase").collection("users").findOneAndUpdate(
        { "login" : req.session.username},{$addToSet: { fav: ObjectId(id)}})
    client.db("metodbase").collection("mero").findOneAndUpdate(
        { "_id" : ObjectId(id)},{$addToSet: { fav: req.session.username}})
  });
});

app.post('/unfav', (req, res) => {
  let id = req.body.id;
  mongoClient.connect(url, function (err, client) {
    client.db("metodbase").collection("users").findOneAndUpdate(
        { "login" : req.session.username},{$pull: { fav: ObjectId(id)}})
    client.db("metodbase").collection("mero").findOneAndUpdate(
        { "_id" : ObjectId(id)},{$pull: { fav: req.session.username}})
  });
});

app.get('/getfav', (req, res) => {
  let meros = [];
  mongoClient.connect(url, async function (err, client) {
    client.db("metodbase").collection("users").findOne({login: req.session.username}, async function (err, result) {
      for (var i = 0; i < result.fav.length; ++i) {
        find_mero_by_id(result.fav[i]).then(function(res) {
          meros.push({
            id: res._id,
            name: res.name,
            type: res.type,
            age: res.age,
            hard: res.hard,
            place: res.place,
            desc: res.desc,
            link: res.link
          });
        });
      }
      setTimeout(function() {
        console.log(JSON.stringify(meros));
        res.status(200).send({data: meros})
      }, 3000);
    });
  });
});

app.get('/geteverything', (req, res) => {
  mongoClient.connect(url, function (err, client) {
    client.db("metodbase").collection("schema").findOne(function(err, result){
      res.send({age: result.age, type: result.type, hard: result.hard, place: result.place});
    });
  });
});
*/