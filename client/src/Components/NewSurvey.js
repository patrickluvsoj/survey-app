import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { submitSurvey } from "../Actions/submitSurvey";
import { formState } from "../Atoms/formState";
import { regex } from "../utils/regex";


const NewSurvey = () => {
    const [review, setReview] = useState(false)
    const [form, setForm] = useRecoilState(formState);

    const { register, handleSubmit, watch, reset, getValues, formState: { errors } } = useForm(
        {defaultValues: {
            title: form.title,
            subject: form.subject,
            body: form.body,
            from: form.from,
            recipients: form.recipients
        }}
    );

    const onReview = data => {
        setReview(true);
    }

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            setForm(value);
        });
        return () => subscription.unsubscribe();
    }, [watch, form]);


    const editForm = (
        <div>
            <form>
                <input placeholder={"This is a new survey"} {...register("title", { required: true })} />
                {errors.title && <span>This field is required</span>}
                
                <input {...register("subject", { required: true })} />
                {errors.subject && <span>This field is required</span>}

                <input {...register("body", { required: true })} />
                {errors.body && <span>This field is required</span>}

                <input {...register("from", { required: true, pattern: regex })} />
                {errors.from && <span>This field is required</span>}

                <input {...register("recipients", { required: true})} />
                {errors.emails && <span>This field is required</span>}
                
                <button onClick={handleSubmit(onReview)}>Review</button>
            </form>
        </div>
    );

    const handleBackClick = () => {
        setReview(false);
    }

    const handleSubmitClick = () => {
        try {
            alert("posted message to survey routes");
            submitSurvey(getValues());
            setForm({
                title: "A new survey",
                subject: "",
                body: "",
                from: "",
                recipients: ""
            })
            reset();
            setReview(false);
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <div className="container">
            {review ? 
                <ReviewForm 
                    formValues={getValues()} 
                    handleBackClick={() => handleBackClick}
                    handleSubmitClick={() => handleSubmitClick}
                /> : editForm}
        </div>
    )
}


const ReviewForm = (props) => {
    const { formValues, handleBackClick, handleSubmitClick } = props;

    const invalidEmails = formValues.recipients.split(",")
    .map(email => email.trim())
    .filter(email => {
        console.log(`${email} is a valid email? ${regex.test(email)}`);
        return !regex.test(email);
    });

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


export default NewSurvey;



//TODO
// Re-organize the structure of app
    // How to keep header always visible while routes change?
// Create a Add icon using Material //add_circle
// Add container so that content is centered
// A way to matain form value on refresh
    // have a way to observe chnages in component using watch()
    // added recoil-persist to persist after refresh
// Need to update how email is parsed in emails field
    // Figure out how to pass emails to survey routes
    // Check email parsing mechanism for surveyRoutes
// TEST the submission. Make sure emails are validates AND emails are sent
    // Resolve req.body undefined issue by using express.json().

// Preserve Form preview state on refresh
// Finish styling
    // Add styling to form preview
    // Add styling to edit form
    // Add way to pin Add icon to right bottom


// TODO
// Create a preview of data in reviewForm 
// re-route to editForm
// Clear form when re-routing
// Figure out how to POST to survey routes
    // Wrap in try catch so that it doesn't re-route if submissin doesn;t work
// Persist the data and reviewForm state when hitting refresh button
// Re-organize the structure of app


//4. Figure out how to use Recoil and React Hook Form**
//  - Should data live as Recoil Atom? 
//  - Or can it just be a higher order component state?

// TODO
// 	1. Create a scaffolding
//  3. Create one field and state so that any updates to the field is updated to state
//  4. Make it so you can switch to ReviewSurvey with the updated state
//  5. Once you click submit, clear state and re-route to EditSurvey
//  6. Test situation of moving to other routes and then coming back
//  7. Introduce validation 
//  8. Add email field and validation
// 	2. READ: https://react-hook-form.com/get-started#Integratingwithglobalstate