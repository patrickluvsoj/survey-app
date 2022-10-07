const mongoose = require('mongoose');
const SurveySchema = mongoose.model('surveys');
const express = require('express');
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

        console.log(recipients.split(",").map( email => ({email: email.trim()})));
    
        const survey = await new SurveySchema({
            title: title,
            subject: subject,
            body: body,
            from: from,
            recipients: recipients.split(",").map( email => ({email: email.trim()})),
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

        const responses = _.chain(req.body).map( ({event, email, url}) => {
            console.log(event);
            
            if (event === 'click') {
                const path = new Path('/api/surveys/:survey_id/:choice');
                const urlObj = new URL(url);
                pathname = urlObj.pathname;

                // check if URL matches the survey URL
                if (path.test(pathname)) {
                    const pathArr = pathname.split('/');
                    console.log(pathArr);
                    return {email: email, survey_id: pathArr[3], choice: pathArr[4]};
                }
            } 
        })
        .compact()
        .uniqBy()
        .forEach( async ({email, survey_id, choice}) => {
            const filter = { $and: [
                    { _id: survey_id },
                    { recipients: { $elemMatch: { email: email, responded: {$ne: true} } } } ] };

            const update = { 
                $inc: { [choice]: 1 },
                $set: { 'recipients.$.responded': true } };

            const results = await SurveySchema.findOneAndUpdate(filter, update);

            console.log(results);
        })

        res.send(`Received webhook event: ${req.body}`);
    });


    app.get('/api/surveys/list', async (req, res) => {
        // get the right list of data
        // creat an Atom
        // create action to call API
        // Component that parses data and displays as list

        let current_date = new Date()
        current_date.setDate( current_date.getDate() - 5 );

        const results = await SurveySchema.find(
            { dateSent: { $gte: current_date } },
            { title: 1 }
        );

        res.send(results);
    });


    app.get('/api/surveys/:survey_id/:choice', (req, res) => {
        res.send("Thank you for submitting a response!");
    });
}

        // Set NGROK to receive sendgrid events
            // Enable sendgrid events
        // Parse the Sendgrid event to get relevant information
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
