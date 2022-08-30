
const mongoose = require('mongoose');
const SurveySchema = mongoose.model('surveys');
const UserSchema = mongoose.model('users');

const sgMail = require('@sendgrid/mail');
const keys = require('../config/keys');
sgMail.setApiKey(keys.SENDGRID_KEY);

const requireLogin = require('../middleware/requireLogin');
const requireCredits = require('../middleware/requireCredits');

const surveyTemplate = require('../templates/surveyTemplate');

// reference following sendgrid documentation: https://github.com/sendgrid/sendgrid-nodejs/blob/main/docs/use-cases/single-email-multiple-recipients.md
module.exports = function surveyRoutes(app) {
    
    // require credits and login to make post request
    app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
        
        //mock-up req.body data coming from a form submission
        req.body = {
            title: "Test Survey",
            subject: "Product Survey",
            body: "Please respond to this survey!",
            from: "hpatricksuzuki@gmail.com",
            recipients: "patricklovesoj@gmail.com, patrick@zeplin.io",
        }

        const { title, subject, body, from, recipients } = req.body;

        console.log('title: ' + req.user.id + ', typeof: ' + typeof req.user.id );
    
        const survey = await new SurveySchema({
            title: title,
            subject: subject,
            body: body,
            from: from,
            recipients: recipients.split(",").map(email => ({ email })),
            _user: req.user.id,
            dateSent: Date.now(),
        });

        const test_recipients = survey.recipients.map( recipient => recipient.email )
        console.log('recipients: ' + test_recipients + ', typeof: ' + typeof test_recipients);
        
        const msg = {
            to: survey.recipients.map( recipient => recipient.email ),
            from: survey.from,
            subject: survey.subject,
            text: survey.body,
            html: surveyTemplate(survey),
            trackingSettings: {
                clickTracking: {
                  enable: true,
                  enableText: false
                },
            },
        };
        
        sgMail.sendMultiple(msg).then(async () => {
            
            try {
                await survey.save();
                req.user.credits -= 5;
                const user = await req.user.save();
            } catch (err) {
                res.status(422).send("Something went wrong with updating the data" + err);
            }

            // const mongoUsr = await UserSchema.findById(req.user.id);
            // console.log(`user data from Mongo: ${mongoUsr}`) 

            // mongoUsr.credits -= 5;
            // const updatedUser = await mongoUsr.save();
            // console.log(`updated order in mongoDB: ${updatedUser}`) 
            
            res.send(user);
          })
          .catch(error => {
            console.error(error);
        
            if (error.response) {
              const {message, code, response} = error;
              
              const {headers, body} = response;
        
              console.error(message, body);
            }

            res.status(422).send("Something went wrong with sending the email(s)")
          });
        ;


    });

    app.get('/api/surveys/thanks', (req, res) => {
        res.send("Thank you for submitting a response!");
    });
}