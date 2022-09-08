import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { submitSurvey } from "../Actions/submitSurvey";


const NewSurvey = () => {
    const [review, setReview] = useState(false)
    const { register, handleSubmit, watch, reset, getValues, formState: { errors } } = useForm(
        {defaultValues: {
            title: "",
            subject: "",
            body: "",
            from: "",
            email: ""
        }}
    );

    // console.log(watch("from"));

    const onReview = data => {
        console.log(data);
        setReview(true);
    }

    // add a Atom for from values and useRecoilValue
    console.log(watch());

    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    const editForm = (
        <div>
            <form>
                <input {...register("title", { required: true })} />
                {errors.title && <span>This field is required</span>}
                
                <input {...register("subject", { required: true })} />
                {errors.subject && <span>This field is required</span>}

                <input {...register("body", { required: true })} />
                {errors.body && <span>This field is required</span>}

                <input {...register("from", { required: true, pattern: regex })} />
                {errors.from && <span>This field is required</span>}

                <input {...register("emails", { required: true, pattern: regex })} />
                {errors.emails && <span>This field is required</span>}
                
                {/* <input type="submit" /> */}
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
            submitSurvey();
            reset();
            setReview(false);
        } catch(error) {
            console.log(error);
        }
    }

    const renderPreview = () => {
        const formValues = getValues();

        return (
            <div>
                <h3>Title</h3>
                <label>{formValues.title}</label>
                <h3>Subject</h3>
                <label>{formValues.subject}</label>
                <h3>Body</h3>
                <label>{formValues.body}</label>
                <h3>From</h3>
                <label>{formValues.email}</label>
                <h3>Emails</h3>
                <label>{formValues.emails}</label>
            </div>
        )
    }

    const reviewForm = (
        <div>
            <h2>ReviewForm</h2>
            {renderPreview()}
            <button onClick={handleBackClick}>Back</button>
            <button onClick={handleSubmitClick}>Submit</button>
        </div>
    );

    return (
        <div className="container">
            {review ? reviewForm : editForm}
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
    // have a way to observe chnages in component
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