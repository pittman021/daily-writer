const db = require('../models/index');
const isLoggedIn = require('../services/isLoggedIn')
const config = require('../config/keys');
const axios = require('axios');

const stripe = require('stripe')(config.STRIPE_API_KEY);

module.exports = app => {

  app.get('/', (req,res) => {
    res.render('home');
  })

  app.get('/about', function(req, res) {
    res.render('about');
  });

  app.get('/plans', function(req, res) {

    stripe.plans.list().then(stripePlans => {

      res.render('plans', { plans: stripePlans });
    })
  })

  app.get('/purchase', function(req,res) {
    res.render('purchase', {plan: req.query.plan})
  })

  app.post('/charge', isLoggedIn, function(req,res) {

    const plan = req.query.plan;

    db.user.findOne({
      where: {id: req.user.id }
    }).then(foundUser => {

      const user = foundUser.dataValues;

      // creating customer in stripe
      stripe.customers.create({
        email: user.email,
        source: req.body.stripeToken
      }).then(newCustomer => {
          stripe.subscriptions.create({
            customer: newCustomer.id,
            items: [
              {
                plan: plan
              }
            ],
            expand: ['latest_invoice']
        }).then(newStripeSub => {
          // check on sub & payment status // 
          if(newStripeSub.status === 'active' && newStripeSub.latest_invoice.status === 'paid') {

  
            foundUser.is_trialing = false; 
            foundUser.trial_end_date = null;

            foundUser.save().then(savedUser => {

              // create a new subscription
              db.subscription.create({
                token: newStripeSub.id,
                userId: savedUser.id
              }).then(newSubscription => {

                console.log('new subscription created!:', newStripeSub)

                res.render('thank_you', { confirmation: newStripeSub });
              })

            });

          }

        });

      });

    }).catch(err => {
      console.log(err);
    })

  });

  app.get('*', function(req, res) {
    res.redirect('/');
  });
};
