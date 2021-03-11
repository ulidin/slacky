const express = require('express');
const router = express.Router();

router.use(express.urlencoded({ extended: true }));

const Channel = require('../models/channel');

router.get('/', (req, res) => {
  Channel.find((err, data) => {
    if (err) return console.error(err);
    res.render('index.ejs', { channels: data });
  });
});

router.post('/create', (req, res) => {
  const channel = new Channel({
    name: req.body.name,
    description: req.body.description || '',
    private: req.body.private ? true : false,
  });
  channel.save((err) => {
    if (err) return console.error(err);
    console.log('Channel created.');
    res.redirect('/');
  });
});

router.get('/delete/:id', (req, res) => {
  Channel.deleteOne({ _id: req.params.id }, (err, data) => {
    if (err) return console.error(err);
    console.log(req.params.id + 'deleted');
    res.redirect('/');
  });
});

module.exports = router;
