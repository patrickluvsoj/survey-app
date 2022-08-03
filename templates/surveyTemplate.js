const keys = require('../config/keys');
const url = keys.URL_DOMAIN;

module.exports = (survey) => {
    return `
        <h>Hello there!<h>
        <p>${survey.body}</p>
        <a href='${url}/api/surveys/thanks'>Yes</a>
        <a href='${url}/api/surveys/thanks'>No</a>
    `
}