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

async function postAdd (req, res) {
  async function addTask() {
    await mongoClient.connect(url, async function (err, client) {
      await client.db("tododo").collection("tasks").insertOne({
        name: req.body.name,
        description: req.body.description,
        deadline: req.body.deadline,
        author: req.session.username,
        status: "active"
      })
    });
    await add_to_list()
  }
  async function add_to_list(callback) {
    new_id = await get_task_id(req.body.name, req.session.username);
    console.log("this function is add_to_list and it returned ", new_id)
    await find_(new_id)
  }

  async function find_(some_id) {
    await mongoClient.connect(url, async function (err, client) {
      await client.db("tododo").collection("users").findOneAndUpdate(
          {"login": req.session.username}, {$addToSet: {tasks: some_id}})
      console.log("added ", some_id)
    });
  }

  await addTask()
  res.send()
};
app.post("/save", urlencodedParser, postAdd);