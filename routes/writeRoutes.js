const isLoggedIn = require('../services/isLoggedIn');
const db = require('../models/index')
const moment = require('moment');

module.exports = app => {

    app.get('/write', isLoggedIn, (req,res) => {

      db.user.findOne({
        where: {id: req.user.id }
      }).then(user => {
        
        // check if trialing date is before or after!
        const days = moment(user.trial_end_date).toNow('dd');
        const days_remaining = moment().isAfter(user.trial_end_date) ? 0 : days;
        user.days_remaining = days_remaining;

        console.log(user);

        res.render('write', { trialStatus: user});
      }).catch(err => {
        console.log(err);
      })
    })
  
  };