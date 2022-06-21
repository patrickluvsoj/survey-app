const bodyParser = require('body-parser');
const axios = require('axios');
const express = require('express');

const keys = require('../config/keys');
const stripe = require('stripe')(keys.STRIPE_SECRET);
const endpointSecret = keys.ENDPOINT_SECRET;
const requireLogin = require('../middleware/requireLogin');

module.exports = function billingRoutes(app) {
    app.post('/api/checkout', async (req, res, requireLogin) => {
      console.log(req.user)
        
        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
              price: 'price_1L0eKsCdI0IFsUC6WDQ0r5N4',
              quantity: 1,
            },
          ],
          metadata: {'user': JSON.stringify(req.user)},
          client_reference_id: 'hello',
          mode: 'payment',
          success_url: 'http://localhost:3000/?success=true',
          cancel_url: 'http://localhost:3000/?canceled=true',
        });
        
        console.log(`stripe check out created for: ${JSON.stringify(session)}`)

        res.redirect(303, session.url);
    }); 

    // Apply credits to DB and return user info to browser if check out was successful
    app.get('/api/add_credits', async (req, res) => {
        console.log(`Applying credits to the following user: ${req.user}`)
        req.user.credits += 5;
        const user = await req.user.save();
        res.send(user);
    });

    const fulfillOrder = async (session) => {
        // TODO: fill me in
        // console.log("Fulfilling order", session);
        console.log(`Fullfull order for: ${session.metadata.user}`)
        
        const mongoUsr = JSON.parse(session.metadata.user);

        // mongoUsr.credits += 5;
        // const user = await mongoUsr.save();
        console.log(user) 
    }

    app.post('/webhook', express.raw({type: '*/*'}), (request, response) => {
      // 'application/json'
      let event = request.body;
      // Only verify the event if you have an endpoint secret defined.
      // Otherwise use the basic event deserialized with JSON.parse
      if (endpointSecret) {
        // Get the signature sent by Stripe
        const signature = request.headers['stripe-signature'];
        try {
          event = stripe.webhooks.constructEvent(
            request.body,
            signature,
            endpointSecret
          );
        } catch (err) {
          console.log(`⚠️ Webhook signature verification failed.`, err.message);
          return response.sendStatus(400);
        }
      }
      console.log(`event captured ${event.type}`)
    
      // Handle the event
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          
          fulfillOrder(session);
          // Then define and call a method to handle the successful payment intent.
          // handlePaymentIntentSucceeded(paymentIntent);
          break;
        default:
          // Unexpected event type
          console.log(`Unhandled event type ${event.type}.`);
      }
    
      // Return a 200 response to acknowledge receipt of the event
      response.send();
    });
}    

