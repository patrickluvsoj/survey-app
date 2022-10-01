const keys = require('../config/keys');
const url = keys.URL_DOMAIN;

module.exports = (survey) => {
    console.log(JSON.stringify(survey));

    return `
        <h>Hello there!<h>
        <p>${survey.body}</p>
        <a href='${url}/api/surveys/${survey._id}/yes'>Yes</a>
        <a href='${url}/api/surveys/${survey._id}/no'>No</a>
    `
}