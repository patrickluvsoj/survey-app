const express = require('express');
const keys = require('../config/keys');
const stripe = require('stripe')(keys.STRIPE_SECRET);

const mongoose = require('mongoose')
const UserSchema = mongoose.model('users')

const endpointSecret = keys.ENDPOINT_SECRET;

const requireLogin = require('../middleware/requireLogin');



module.exports = function billingRoutes(app, io) {

    app.post('/api/checkout', requireLogin, async (req, res) => {
        
        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
              price: 'price_1L0eKsCdI0IFsUC6WDQ0r5N4',
              quantity: 1,
            },
          ],
          metadata: {'user': JSON.stringify(req.user)},
          mode: 'payment',
          success_url: 'http://localhost:3000/?success=true',
          cancel_url: 'http://localhost:3000/?canceled=true',
        });
        
        console.log(`stripe check out created for: ${JSON.stringify(session.metadata)}`)

        res.redirect(303, session.url);
    }); 

    const fulfillOrder = async (session) => {
        console.log(`Fullfill order for: ${session.metadata.user}`)
        
        const user = JSON.parse(session.metadata.user);

        if (mongoose.Types.ObjectId.isValid(user._id)) {
          const mongoUsr = await UserSchema.findById(user._id);

          mongoUsr.credits += 5;
          const updatedUser = await mongoUsr.save();
          console.log(`updated order in mongoDB: ${updatedUser}`) 

          // Broadcast event to client
          io.to(user._id).emit("monogoDB updated");

        } else {
          console.log("cannot find user in Mongo")
        }

    }

    app.post('/webhook', express.raw({type: '*/*'}), (request, response) => {
      
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

