
const mongoose = require('mongoose');
const SurveySchema = mongoose.model('surveys');

const keys = require('../config/keys');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(keys.SENDGRID_KEY);

const requireLogin = require('../middleware/requireLogin');
const requireCredits = require('../middleware/requireCredits');

const surveyTemplate = require('../templates/surveyTemplate');

module.exports = function surveyRoutes(app) {
    app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
        
        //dummy req.body coming from form
        req.body = {
            title: "Test Survey",
            subject: "Product Survey",
            body: "Please respond to this survey!",
            from: "hpatricksuzuki@gmail.com",
            recipients: "patricklovesoj@gmail.com, patrick@zeplin.io",
        }

        const { title, subject, body, from, recipients } = req.body;

        console.log('title: ' + req.user.id + ', typeof: ' + typeof req.user.id );
    
        //Create Survey instance
        const survey = await new SurveySchema({
            title: title,
            subject: subject,
            body: body,
            from: from,
            recipients: recipients.split(",").map(email => ({ email })),
            _user: req.user.id,
            dateSent: Date.now(),
        });

        // view https://github.com/sendgrid/sendgrid-nodejs/blob/main/docs/use-cases/single-email-multiple-recipients.md
        const test_recipients = survey.recipients.map( recipient => recipient.email )
        console.log('recipients: ' + test_recipients + ', typeof: ' + typeof test_recipients);
        
        const msg = {
            to: survey.recipients.map( recipient => recipient.email ),
            from: survey.from,
            subject: survey.subject,
            text: survey.body,
            html: surveyTemplate(survey),
            //  sure click tracking is enabled
            trackingSettings: {
                clickTracking: {
                  enable: true,
                  enableText: false
                },
            },
        };
        
        sgMail.sendMultiple(msg);

        // replace the URL based on Dev of Prod
        // save survey instance
        // deduct survey credits
        // res.send(req.user) to update credits?
    });

    app.get('/api/surveys/thanks', (req, res) => {

        res.send("Thank you for submitting a response!");
    });
}