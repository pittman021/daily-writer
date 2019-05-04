const isLoggedIn = require('../services/isLoggedIn');

module.exports = app => {

    app.get('/write', isLoggedIn, (req,res) => {
      res.render('write');
    })
  
  };