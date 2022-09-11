import { regex } from '../utils/regex';


const ReviewSurvey = (props) => {
    const { formValues, handleBackClick, handleSubmitClick } = props;

    const invalidEmails = formValues.recipients.split(",")
                            .map(email => email.trim())
                            .filter(email => !regex.test(email));

    const renderInvalidEmails = (invalidEmails) => {
        if (invalidEmails.length !== 0) {
            return (
                <div>
                    <h6>Warning. The following emails entered are invalid:</h6>
                    <ul>
                        {invalidEmails.map(email => <div>{email}</div>)}
                    </ul>
                </div>
            )
        } else {
            return null
        }
    }

    return (
        <div>
            {renderInvalidEmails(invalidEmails)}
            <h2>ReviewForm</h2>
                <div>
                    <h3>Title</h3>
                    <label>{formValues.title}</label>
                    <h3>Subject</h3>
                    <label>{formValues.subject}</label>
                    <h3>Body</h3>
                    <label>{formValues.body}</label>
                    <h3>From</h3>
                    <label>{formValues.from}</label>
                    <h3>Emails</h3>
                    <label>{formValues.recipients}</label>
                </div>
            <button onClick={handleBackClick()}>Back</button>
            <button onClick={handleSubmitClick()}>Submit</button>
        </div>
    )
}

export default ReviewSurvey;