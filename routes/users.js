const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

const User = require('../models/users');
const { ensureAuthenticated } = require('../config/auth.js');

router.use(express.urlencoded({ extended: true }));

router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = '';
  console.log(
    'Only for testing. The login submitted was email: ' +
      email +
      ' and password: ' +
      password
  );
  //Controls
  if (!name || !email || !password || !password2) {
    errors += 'Please fill in all fields.';
  }
  if (password !== password2) {
    errors += `Passwords doesn't match.`;
  }
  if (password.length < 6) {
    errors += 'Your password must be at least 6 characters long.';
  }
  if (errors !== '') {
    res.render('register', {
      message: errors,
      name: name,
      email: email,
      password: password,
      password2: password2,
    });
  } else {
    User.findOne({ email: email }).exec((err, user) => {
      if (err) console.log(err);
      if (user) {
        errors += 'Email already registered. Change or Login to your account';
        res.render('register', {
          message: errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name: name,
          email: email,
          password: password,
        });
        bcrypt.genSalt(10, (err, salt) => {
          if (err) console.log(err);
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //Save pass to hash
            newUser.password = hash;
            //Save user
            newUser
              .save()
              .then((value) => {
                console.log('The following user was created:');
                console.log(value);
                const message = 'You have successfuly registered!';
                res.render('login', { message });
              })
              .catch((value) => console.log(value));
          });
        });
      }
    });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/channels',
    failureRedirect: '/users/login',
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  const success_msg = 'You are now logged out.';
  res.render('login', { message: success_msg });
});

//get and post to profile page
router.get('/profile', ensureAuthenticated, (req, res) => {
  res.render('profile', { user: req.user });
});

router.post('/profile', ensureAuthenticated, (req, res) => {
  const userName = req.body.newUserName;
  const userEmail = req.body.newUserEmail;
  User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { name: userName, email: userEmail } },
    { new: true },
    (err, data) => {
      if (err) console.log(err);
      const message = 'Sucessfully edited user details.';
      res.render('profile', { user: data, message });
    }
  );
});

router.post('/profile/uploadPhoto', ensureAuthenticated, (req, res) => {
  if (req.files) {
    const profile_pic = req.files.profile_photo;
    const extension = profile_pic.name.split('.').slice(-1)[0];
    const file_name = `/uploads/${req.user._id}.${extension}`;
    profile_pic.mv(`.${file_name}`);
    User.updateOne(
      { _id: req.user._id },
      { $set: { profilePhoto: file_name } },
      (err) => {
        if (err) console.log(err);
        const message = 'Sucessfully uploaded';
        res.render('profile', { user: req.user, message });
      }
    );
  } else {
    const message = 'No file uploaded';
    res.render('profile', { user: req.user, message });
  }
});

module.exports = router;
