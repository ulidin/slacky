const express = require('express');
const router = express.Router();

router.use(express.urlencoded({ extended: true }));

const Channel = require('../models/channel');

const { ensureAuthenticated } = require('../config/auth')

// Login page
router.get('/', (request, response) => {
    response.render('welcome')
})

// Dashboard
router.get('/dashboard', ensureAuthenticated, (request, response) => {
    response.render('dashboard', { user: request.user })
})


// Register page
router.get('/register', (request, response) => {
    response.render('register')
})

// Channels page
router.get('/index', (req, res) => {
  Channel.find((err, data) => {
    if (err) return console.error(err);
    res.render('index.ejs', { channels: data });
  });
});

// Create channels
router.post('/create', (req, res) => {
  const channel = new Channel({
    name: req.body.name,
    description: req.body.description || '',
    private: req.body.private ? true : false,
  });
  channel.save((err) => {
    if (err) return console.error(err);
    console.log('Channel created.');
    res.redirect('/index');
  });
});

//Delete channels
router.get('/delete/:id', (req, res) => {
  Channel.deleteOne({ _id: req.params.id }, (err, data) => {
    if (err) return console.error(err);
    console.log(req.params.id + 'deleted');
    res.redirect('/index');
  });
});

module.exports = router;
