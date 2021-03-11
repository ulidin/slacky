const express = require('express');
const router = express.Router();

router.use(express.urlencoded({ extended: true }));

const Channel = require('../models/channel');
const Post = require('../models/post');

router.get('/:id', (req, res) => {
  Channel.findById(req.params.id, (err, data) => {
    if (err) return console.error(err);
    res.render('channel.ejs', { channel: data });
  });
});

router.post('/:id', (req, res) => {
  const post = new Post({
    by: req.body.by,
    content: req.body.content,
  });
  Channel.updateOne(
    { _id: req.params.id },
    { $push: { posts: post } },
    (err) => {
      if (err) return console.error(err);
      res.redirect(`/channel/${req.params.id}`);
    }
  );
});

module.exports = router;
