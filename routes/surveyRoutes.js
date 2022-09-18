
const mongoose = require('mongoose');
const SurveySchema = mongoose.model('surveys');
const express = require('express');

const sgMail = require('@sendgrid/mail');
const keys = require('../config/keys');
sgMail.setApiKey(keys.SENDGRID_KEY);

const requireLogin = require('../middleware/requireLogin');
const requireCredits = require('../middleware/requireCredits');

const surveyTemplate = require('../templates/surveyTemplate');

// reference following sendgrid documentation: https://github.com/sendgrid/sendgrid-nodejs/blob/main/docs/use-cases/single-email-multiple-recipients.md
module.exports = function surveyRoutes(app) {
    
    // require credits and login to make post request
    app.post('/api/surveys', express.json(), requireLogin, requireCredits, async (req, res) => {

        const { title, subject, body, from, recipients } = req.body;

        // Check if we properly received survey submission data from client
        // console.log('user_id: ' + req.user.id + ', typeof: ' + typeof req.user.id );
    
        const survey = await new SurveySchema({
            title: title,
            subject: subject,
            body: body,
            from: from,
            recipients: recipients.split(",").map(email => ({ email: email.trim() })),
            _user: req.user.id,
            dateSent: Date.now(),
        });

        // Check if email have been parsed properly
        // const test_recipients = survey.recipients.map( recipient => recipient.email )
        // console.log('recipients: ' + test_recipients + ', typeof: ' + typeof test_recipients);
        
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
                
        // sgMail.sendMultiple(msg).then(async () => {
        //     try {
        //         await survey.save();
        //         req.user.credits -= 5;
        //         const user = await req.user.save();
        //         res.send(user);
        //     } catch (err) {
        //         res.status(422).send("Something went wrong with updating the data" + err);
        //     }            
        //     })
        //     .catch(error => {
        //     console.error(error);
        
        //     if (error.response) {
        //         const {message, code, response} = error;              
        //         const {headers, body} = response;
        
        //         console.error(message, body);
        //     }

        //     res.status(422).send("Something went wrong with sending the email(s)")
        //     });
    });

    app.get('/api/surveys/thanks', (req, res) => {
        res.send("Thank you for submitting a response!");
    });
}