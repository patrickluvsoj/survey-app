const keys = require('../config/keys')
const stripe = require('stripe')(keys.STRIPE_SECRET);

module.exports = function billingRoutes(app) {
    app.post('/api/checkout', async (req, res) => {
        console.log('stripe check out')
        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
              price: 'price_1L0eKsCdI0IFsUC6WDQ0r5N4',
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `http://localhost:3000/?success=true`,
          cancel_url: `http://localhost:3000/?canceled=true`,
        });

        
        // check if the check out was successful
        // IF session.url contains success
        // THEN update user model .save()
      
        res.redirect(303, session.url);
    });
} 