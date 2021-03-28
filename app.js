const express = require('express');
const app = express();
const expressEjsLayout = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');

const passport = require('passport');
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
require('./socket')(io);

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.use(expressEjsLayout);

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(fileUpload({ createParentPath: true }));


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/slacky', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(express.urlencoded({ extended: true }));

const indexRouter = require('./routes/index');
const channelsRouter = require('./routes/channel');
const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');

app.use('/', indexRouter);
app.use('/channels/', channelsRouter);
app.use('/users/', usersRouter);
app.use('/api/', apiRouter);

http.listen(3000, () => {
  console.log('App listening on port 3000');
});
