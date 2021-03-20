const express = require('express');
const app = express();
const path = require('path')
const router = express.Router()

const http = require('http').Server(app)

const mongoose = require('mongoose');

const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')


require('./config/passport')(passport)



// Connection to mognodb
mongoose.connect('mongodb://localhost:27017/slacky', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});



// EJS
app.set('view engine', 'ejs')
app.use(expressEjsLayout)

app.use(express.urlencoded({ extended: true }))

app.use('/public', express.static(path.join(__dirname, 'public')));


// Sessions
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// Passport
app.use(passport.initialize())
app.use(passport.session())

// Flash
app.use(flash())
app.use((request, response, next) => {
  response.locals.success_msg = request.flash('success_msg')
  response.locals.error_msg = request.flash('error_msg')
  response.locals.error = request.flash('error')
  next()
})


// Routes
const indexRouter = require('./routes/index');
const channelRouter = require('./routes/channel');
const usersRouter = require('./routes/users');

app.use('/', indexRouter);
app.use('/channel/', channelRouter);
app.use('/users', usersRouter);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.ejs')
});


app.listen(3000, () => {
  console.log('App listening on port 3000');
});
