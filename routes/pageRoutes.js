const db = require('../models/index');
const isLoggedIn = require('../services/isLoggedIn')
const isRegistered = require('../services/isRegistered');
const config = require('../config/keys');

const stripe = require('stripe')(config.STRIPE_SECRET_KEY);

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

  app.get('/purchase', isRegistered, function(req,res) {
    res.render('purchase', {plan: req.query.plan, message: ''})
  })

  app.get('/user/:id/subscriptions', isLoggedIn, async function(req,res) {

    try {
    const stripeID = await db.user.findOne({ where: {id: req.params.id }});
    const id = stripeID.dataValues.stripe_customer_id;

    const customer = await stripe.customers.retrieve(id);
    const invoices = await stripe.invoices.list({ customer: id });

    console.log(invoices);

    res.render('subscriptions', { customer: customer, invoices: invoices })


  } catch(err) {
    console.log(err);
  }

  });

  app.post('/charge', isLoggedIn, async function(req,res) {

    const plan = req.query.plan;

    try {
      // find the customer in db // 
      const user = await db.user.findOne({ where: {id: req.user.id }});

      if(user.stripe_customer_id == null) {

      console.log('no customer id!');

      // create customer in stripe using stored email & stripeToken from req
      const customer = await stripe.customers.create({
        email: user.dataValues.email,
        source: req.body.stripeToken
      });

      const updatedUser = await user.update({ stripe_customer_id: customer.id });
      
      // create a new subscription for new created customer above // 
      const stripeSub = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            plan: plan
          }
        ],
        expand: ['latest_invoice']
      });
      const subStatus = stripeSub.status;
      const invoiceStatus = stripeSub.latest_invoice.status;

      // handle the payment status
      // if sub is created & payment is success remove free trial attribute
      // and store subscription token in db
      // although creating the customer throws an error if the card is bad /shrug?
      if(subStatus === 'active' && invoiceStatus === 'paid') {

        user.is_trialing = false;

        const savedUser = await user.save();

        const subscription = await db.subscription.create({
          token: stripeSub.id,
          userId: savedUser.id
        });

        console.log('new subscription created!:', subscription);

        res.render('thank_you', { confirmation: stripeSub });
      }
    }

      // if payment method does not go through 
      // send data back to client & display it on the page
    //   if(subStatus === 'incomplete' && paymentIntent.status  === 'requires_payment_method') {

    //     res.json(stripeSub)
    //   }
    // }

  //   else {

  //     try {
        
  //       const customer = await stripe.customers.update(
  //         user.stripe_customer_id,
  //         { source: req.body.stripeToken }
  //       );

  //       console.log(customer);

  //   } catch(err) {
  //     console.log(err);
  //   }
  // }

    } catch(err) {
       
        res.render('purchase', { message: err.message, plan: req.query.plan});
    }
  
  });

  app.get('*', function(req, res) {
    res.redirect('/');
  });
};
