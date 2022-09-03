import { useState } from "react";
import { useForm } from "react-hook-form";


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


const NewSurvey = () => {
    const [review, setReview] = useState(false)
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    console.log(watch("example"));

    const onSubmit = data => console.log(data);

    const handleReviewClick = () => {
        setReview(!review)
    }

    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input defaultValue="test" {...register("title", { required: true })} />
                {errors.title && <span>This field is required</span>}
                
                <input {...register("subject", { required: true })} />
                {errors.subject && <span>This field is required</span>}

                <input {...register("email", { required: true, pattern: regex })} />
                {errors.email && <span>This field is required</span>}
                
                {/* <input type="submit" /> */}
                <button onClick={handleSubmit(onSubmit)}>Review</button>
            </form>
            {/* <button onClick={handleReviewClick}>Review</button>
            {review ? <EditSurvey/> : <ReviewSurvey/>} */}
        </div>
        
    )
}

const EditSurvey = () => {
    return (
        <div>EditSurvey</div>
    )
}

const ReviewSurvey = () => {

    const handleBackClick = () => {
        console.log("clicked back button")
    }

    return (
        <div>ReviewSurvey</div>
    )
}

export default NewSurvey;