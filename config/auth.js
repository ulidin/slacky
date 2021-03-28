module.exports = {
    ensureAuthenticated: (req, res, next) => {
      if (req.isAuthenticated()) {
        return next();
      }
      const message = 'Please login enjoy SLACKY.';
      res.render('login', { message });
    },
  };