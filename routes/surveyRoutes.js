const mongoose = require('mongoose');
const SurveySchema = mongoose.model('surveys');
const express = require('express');
// const bodyParser = require('body-parser');
const { URL } = require('url');
const { Path } = require('path-parser')
const _ = require('lodash');

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
                
        sgMail.sendMultiple(msg).then(async () => {
            try {
                await survey.save();
                req.user.credits -= 5;
                const user = await req.user.save();
                res.send(user);
            } catch (err) {
                res.status(422).send("Something went wrong with updating the data" + err);
            }            
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
    });


    app.post('/api/surveys/webhooks', express.json(), (req, res) => {
        // console.log(`Received webhook event: ${JSON.stringify(req.body)}`);
        // UPDATE sendgrid URL after running NGROK

        // Set NGROK to receive sendgrid events
            // Enable sendgrid events
        // Parse the Sendgrid event to get relevant information
        const responses = _.chain(req.body).map( ({event, email, url}) => {
            console.log(event);
            return event === 'click' ? {email, url} : null
        })


        // Encode survey_id in the URL so you can parse and idenity which survey user responded to
        // Filter the event coming from Sendgrid
            // We should return survey_id, email & choice
                // Remove any ones that are not click events
                // Remove undefined events
                // use url, lodash & Parse libraries => use chain function
        // Save the events in MongoDB
            // Do all search and update in a query
                // First find the right user using survey_id, email & choice
                // then update using $inc, $set
                // add last responded date lastreponded: new Date()
        // Make sure thank you route is updated
        console.log(`Received webhook event: ${JSON.stringify(responses)}`);


        res.send(`Received webhook event: ${req.body}`);
    });


    app.get('/api/surveys/thanks', (req, res) => {
        res.send("Thank you for submitting a response!");
    });
}




// SENDGRID EVENT STRUCTURE
// [{"email":"example@test.com","timestamp":1664123380,"smtp-id":"\u003c14c5d75ce93.dfd.64b469@ismtpd-555\u003e","event":"processed","category":["cat facts"],"sg_event_id":"EFlb32iXNb_XmuV29w95PQ==","sg_message_id":"14c5d75ce93.dfd.64b469.filter0001.16648.5515E0B88.0"},
// {"email":"example@test.com","timestamp":1664123380,"smtp-id":"\u003c14c5d75ce93.dfd.64b469@ismtpd-555\u003e","event":"deferred","category":["cat facts"],"sg_event_id":"BFq3tAKmWmzYLWRTZU5s3A==","sg_message_id":"14c5d75ce93.dfd.64b469.filter0001.16648.5515E0B88.0","response":"400 try again later","attempt":"5"},
// {"email":"example@test.com","timestamp":1664123380,"smtp-id":"\u003c14c5d75ce93.dfd.64b469@ismtpd-555\u003e","event":"delivered","category":["cat facts"],"sg_event_id":"vC8wJnv4_2PRpRRY9VcZsg==","sg_message_id":"14c5d75ce93.dfd.64b469.filter0001.16648.5515E0B88.0","response":"250 OK"},
// {"email":"example@test.com","timestamp":1664123380,"smtp-id":"\u003c14c5d75ce93.dfd.64b469@ismtpd-555\u003e","event":"open","category":["cat facts"],"sg_event_id":"6_LJGllWCDMwzfCIlYHKCA==","sg_message_id":"14c5d75ce93.dfd.64b469.filter0001.16648.5515E0B88.0","useragent":"Mozilla/4.0 (compatible; MSIE 6.1; Windows XP; .NET CLR 1.1.4322; .NET CLR 2.0.50727)","ip":"255.255.255.255"},
// {"email":"example@test.com","timestamp":1664123380,"smtp-id":"\u003c14c5d75ce93.dfd.64b469@ismtpd-555\u003e","event":"click","category":["cat facts"],"sg_event_id":"9g9u5Sk1Hrp-avFieGR2pg==","sg_message_id":"14c5d75ce93.dfd.64b469.filter0001.16648.5515E0B88.0","useragent":"Mozilla/4.0 (compatible; MSIE 6.1; Windows XP; .NET CLR 1.1.4322; .NET CLR 2.0.50727)","ip":"255.255.255.255","url":"http://www.sendgrid.com/"},
// {"email":"example@test.com","timestamp":1664123380,"smtp-id":"\u003c14c5d75ce93.dfd.64b469@ismtpd-555\u003e","event":"bounce","category":["cat facts"],"sg_event_id":"Qn_R5pH5Z4napfBubqGi7Q==","sg_message_id":"14c5d75ce93.dfd.64b469.filter0001.16648.5515E0B88.0","reason":"500 unknown recipient","status":"5.0.0"},
// {"email":"example@test.com","timestamp":1664123380,"smtp-id":"\u003c14c5d75ce93.dfd.64b469@ismtpd-555\u003e","event":"dropped","category":["cat facts"],"sg_event_id":"X1ADYFP3kM5id94plECz3w==","sg_message_id":"14c5d75ce93.dfd.64b469.filter0001.16648.5515E0B88.0","reason":"Bounced Address","status":"5.0.0"},
// {"email":"example@test.com","timestamp":1664123380,"smtp-id":"\u003c14c5d75ce93.dfd.64b469@ismtpd-555\u003e","event":"spamreport","category":["cat facts"],"sg_event_id":"WK_OfaHiqnKFvzFy6vGETw==","sg_message_id":"14c5d75ce93.dfd.64b469.filter0001.16648.5515E0B88.0"},
// {"email":"example@test.com","timestamp":1664123380,"smtp-id":"\u003c14c5d75ce93.dfd.64b469@ismtpd-555\u003e","event":"unsubscribe","category":["cat facts"],"sg_event_id":"cFDjKZsZIHT2m4aO8IUW3g==","sg_message_id":"14c5d75ce93.dfd.64b469.filter0001.16648.5515E0B88.0"},
// {"email":"example@test.com","timestamp":1664123380,"smtp-id":"\u003c14c5d75ce93.dfd.64b469@ismtpd-555\u003e","event":"group_unsubscribe","category":["cat facts"],"sg_event_id":"pN-oCBlWxYVTxTGdLDtzgA==","sg_message_id":"14c5d75ce93.dfd.64b469.filter0001.16648.5515E0B88.0","useragent":"Mozilla/4.0 (compatible; MSIE 6.1; Windows XP; .NET CLR 1.1.4322; .NET CLR 2.0.50727)","ip":"255.255.255.255","url":"http://www.sendgrid.com/","asm_group_id":10},
// {"email":"example@test.com","timestamp":1664123380,"smtp-id":"\u003c14c5d75ce93.dfd.64b469@ismtpd-555\u003e","event":"group_resubscribe","category":["cat facts"],"sg_event_id":"Btihg1bdIDlM1oVGexvRLw==","sg_message_id":"14c5d75ce93.dfd.64b469.filter0001.16648.5515E0B88.0","useragent":"Mozilla/4.0 (compatible; MSIE 6.1; Windows XP; .NET CLR 1.1.4322; .NET CLR 2.0.50727)","ip":"255.255.255.255","url":"http://www.sendgrid.com/","asm_group_id":10}]