import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { submitSurvey } from "../Actions/submitSurvey";
import { formState } from "../Atoms/formState";
import { previewState } from "../Atoms/previewState";
import { regex } from "../utils/regex";
import { Link } from "react-router-dom";
import { ErrorMessage } from "@hookform/error-message";
import { validateEmails } from "../utils/validateEmails";
import { useNavigate } from "react-router-dom";

import ReviewSurvey from "./ReviewSurvey";


const NewSurvey = () => {
    const [review, setReview] = useRecoilState(previewState);
    const [form, setForm] = useRecoilState(formState);
    const navigate = useNavigate();

    console.log("form state when initial component load", form);

    const { register, handleSubmit, watch, reset, getValues, formState: { errors } } = useForm(
        {defaultValues: {
            title: form.title,
            subject: form.subject,
            body: form.body,
            from: form.from,
            recipients: form.recipients
        }}
    );

    const onNext = () => {
        setReview(true);
    }

    useEffect(() => {
        // console.log("form state in use effect before watch triggers : ", form);

        const subscription = watch((value, { name, type }) => {
            // console.log("watch triggerd: ", value);
            setForm(value);
            // console.log("form state in Recoil: ", form);
        });
        return () => subscription.unsubscribe();
    }, [watch, form]);

    const handleSubmitClick = () => {
        try {
            alert("The survey has been sent!");
            submitSurvey(getValues());

            setForm({
                title: "",
                subject: "",
                body: "",
                from: "",
                recipients: "",
            });
            // console.log("recoild setForm called", form);
            
            localStorage.clear();
            // console.log("local storage cleared: ", localStorage.getItem('form'));

            reset();
            // console.log("form field reset called", getValues());
            
            setReview(false);
            // console.log("setReview to false", localStorage.getItem('preview'));

            navigate("/dashboard");
        } catch(error) {
            console.log(error);
        }   
    }


    const editForm = (
        <div className="row">
            <form className="col s10">
                <div className="row">
                    <div className="input-field col s12">
                        <input id="first_name" 
                            className="validate" 
                            placeholder={"This is a new survey"} 
                            {...register("title", { required: true })} 
                        />
                        <label className="active" htmlFor="first_name">Survey Title</label>
                        {errors.title && <span className="helper-text red-text text-darken-2" data-error="wrong">Required</span>}
                    </div>
                </div>

                <div className="row">
                    <div className="input-field col s12">
                        <input id="subject" {...register("subject", { required: true })} />
                        <label className="active" htmlFor="subject">Email Subject</label>
                        {errors.subject && <span className="helper-text red-text text-darken-2" data-error="wrong">Required</span>}
                    </div>
                </div>

                <div className="row">
                    <div className="input-field col s12">
                        <input id="body" {...register("body", { required: true })} />
                        <label className="active" htmlFor="body">Email Body</label>
                        {errors.body && <span className="helper-text red-text text-darken-2" data-error="wrong">Required</span>}
                    </div>
                </div>

                <div className="row">
                    <div className="input-field col s12">
                        <input id="from" {...register("from", { 
                            required: "Required", 
                            pattern: {
                                value: regex,
                                message: "Not a valid email!"
                            }
                        })}/>
                        <label className="active" htmlFor="from">Sender</label>
                        {<ErrorMessage
                            errors={errors}
                            name="from"
                            render={({ message }) => <span className="helper-text red-text text-darken-2">{message}</span>}
                        />}
                    </div>
                </div>

                <div className="row">
                    <div className="input-field col s12">
                        <input id="recipients" {...register("recipients", {
                            required: "Required",
                            validate: v => validateEmails(v) || "Email invalid",
                        })}/>
                        <label className="active" htmlFor="recipients">Recipients</label>
                        {<ErrorMessage
                            errors={errors}
                            name="recipients"
                            render={({ message }) => <span className="helper-text red-text text-darken-2">{message}</span>}
                        />}
                    </div>
                </div>

                <Link className="waves-effect waves-light btn grey" to="/">
                    Cancel
                </Link>
                <button className="waves-effect waves-light btn right" onClick={handleSubmit(onNext)}>Next</button>
            </form>
        </div>
    );

    const handleBackClick = () => {
        setReview(false);
    }


    return (
        <div className="container">
            {review ? 
                <ReviewSurvey
                    formValues={form} 
                    handleBackClick={() => handleBackClick}
                    handleSubmitClick={() => handleSubmitClick}
                /> : editForm}
        </div>
    )
}

export default NewSurvey;


// OUTSTANDING Item => clear form fields after submission. It's not right now.

// Solve issues with mdoule note found errors due to webpack & create react app?
    // 

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