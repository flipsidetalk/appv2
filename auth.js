module.exports = function(app, connection) {
  const SALT = '5b07cd5bff16426a86cc0cb50f481dbfbdd518c762dd83aea420c3b1895852fc';
  const auth = require('passport-local-authenticate');
  const passport = require('passport');
  const localStrategy = require('passport-local').Strategy;
  const facebookStrategy = require('passport-facebook').Strategy;
  const expressValidator = require('express-validator');
  const expressSession = require('express-session');
  const crypto = require('crypto');
  const sendWelcomeEmail = require('./email.js');

  passport.use(new localStrategy({
      usernameField: 'email'
    },
    function(email, password, cb) {
      return verifyLocalAccount(email, password, cb);
    }
  ));

  passport.use(new facebookStrategy({
      clientID: "433907406968232",
      clientSecret: "95c08757c0702ae0c091c372133eb067",
      callbackURL: 'https://www.flipsidetalk.com/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'first_name', 'email']
    },
    function(accessToken, refreshToken, profile, cb) {
      hasFBAccount(profile, accessToken);
      profile.name = profile.displayName;
      profile.displayName = undefined;
      return cb(null, profile);
    }
  ));

  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });

  app.use(expressSession({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 2629746000
    }
  }));

  app.use(expressValidator());

  app.use(passport.initialize());

  app.use(passport.session());

  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email']
  }));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/interactive',
      failureRedirect: '/'
    }),
    function(req, res) {
      res.redirect('loggedin');
    });

  app.post('/localSignin',
    passport.authenticate('local', {
      failureRedirect: '/error'
    }),
    function(req, res) {
      res.send('success');
    });

  app.post('/localSignup', function(req, res) {
    var email = req.sanitizeBody('email').escape();
    var password = req.sanitizeBody('password').escape();
    var fn = req.sanitizeBody('firstName').escape();
    var ln = req.sanitizeBody('lastName').escape();
    var query = 'SELECT id FROM local WHERE email = ' + connection.escape(email);
    connection.query(query,
      function(err, results) {
        if (err) {
          console.log(err);
          return false;
        }
        if (results.length >= 1) {
          res.send("acct_exists");
        } else {
          makeLocalAccount(email, password, fn, ln, res);
          res.send("success");
        }
      });
  });

  function makeLocalAccount(email, password, fn, ln, res) {
    crypto.pbkdf2(password, SALT, 25000, 256, 'sha1', function(err, derivedKey) {
      var query = 'INSERT INTO local (id, email, firstname, lastname, password, salt) VALUES (null, "' + email + '", "' + fn + '", "' + ln + '", "' + derivedKey.toString('hex') + '", "' + SALT + '")';
      connection.query(query,
        function(err, results) {
          if (err) {
            console.log(err);
          }
        });
    });
    var fullname = fn + " " + ln;
    sendWelcomeEmail(fn, fullname, email);
  }

  function verifyLocalAccount(email, password, cb) {
    crypto.pbkdf2(password, SALT, 25000, 256, 'sha1', function(err, derivedKey) {
      console.log(err)
      if (err) throw err;
      var query = 'SELECT id, firstname, lastname FROM local WHERE email = ' + connection.escape(email) + ' AND password = "' + derivedKey.toString('hex') + '"';
      connection.query(query,
        function(err, results) {
          if (err) {
            console.log(err);
            return cb(null, false);
          } else {
            if (JSON.stringify(results) == "[]") {
              return cb(null, false);
            }
            var user = {
              id: results[0].id,
              firstname: results[0].firstname,
              name: results[0].firstname + " " + results[0].lastname
            };
            return cb(null, user);
          }
        });
    });
  }

  function hasFBAccount(profile, token) {
    var query = 'SELECT COUNT(1) FROM facebook WHERE fbid = "' + profile.id + '"';
    connection.query(query,
      function(err, results) {
        if (err) {
          console.log(err);
        }
        if (results[0]["COUNT(1)"] == 0) makeFBAccount(profile, token);
      });
  }

  function makeFBAccount(profile, token) {
    var params = {
      token: token,
      name: profile.name,
      firstname: profile._json.first_name,
      email: profile.emails[0].value,
      fbid: profile.id
    }
    var query = 'INSERT INTO facebook (id, token, name, email, fbid) VALUES (null, "' + params.token + '", "' + params.name + '", "' + params.email + '", "' + params.fbid + '")';
    connection.query(query,
      function(err, results) {
        if (err) {
          console.log(err);
        }
      });
    sendWelcomeEmail(params.firstname, params.name, params.email);
  }

  app.get('/error', function(req, res) {
    res.send('wrong_password');
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
}
