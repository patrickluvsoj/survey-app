module.exports = (survey) => {
    return `
        <h>Hello there!<h>
        <p>${survey.body}</p>
        <a href='http://localhost:3000/api/surveys/thanks'>Yes</a>
        <a href='http://localhost:3000/api/surveys/thanks'>No</a>
    `
}