import { useState } from "react";


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

    const handleClick = () => {
        setReview(!review)
    }

    return (
        <div>
            <button onClick={handleClick}>Review</button>
            {review ? <EditSurvey/> : <ReviewSurvey/>}
        </div>
        
    )
}

const EditSurvey = () => {
    return (
        <div>EditSurvey</div>
    )
}

const ReviewSurvey = () => {
    return (
        <div>ReviewSurvey</div>
    )
}

export default NewSurvey;