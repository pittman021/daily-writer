const isLoggedIn = require('../services/isLoggedIn');
const db = require('../models/index')
const moment = require('moment');

module.exports = app => {

    app.get('/write', isLoggedIn, (req,res) => {

      db.user.findOne({
        where: {id: req.user.id }
      }).then(user => {
        // user = user.toJSON();
        const days_remaining = moment(user.trial_end_date).toNow('dd');
        user.days_remaining = days_remaining;

        res.render('write', { trialUser: user});
      }).catch(err => {
        console.log(err);
      })
    })
  
  };