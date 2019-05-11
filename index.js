const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const methodOverride = require('method-override');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const config = require("./config/keys");

// Turn these on when you initiate the DB // 
require('./services/passport');

// configuration
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('keyboard cat'));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  res.locals.flashes = req.flash();
  next();
});

  app.locals.site =  {
      title: 'freewritten',
      url: 'freewritten.com',
      description: 'your daily freewriting tool. track your streak and unlock your genius.',
      support_email: `tim.pittman021@gmail.com`
  }
  app.locals.author = {
      name: 'tim pittman',
      email: 'tim.pittman021@gmail.com',
      twitter: '@pittman021',
      linkedIn: 'linkedin.com'
  }
  app.locals.google_analytics = {
    UA: 'UA-######-##'
  }
  app.locals.config = config;

// ROUTES //
require('./routes/adminRoutes')(app);
require('./routes/writeRoutes')(app);
require('./routes/api/notesRoutes')(app);
require('./routes/pageRoutes')(app);

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('server is up and running');
});