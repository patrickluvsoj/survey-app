
function Payment() {
    // call a function that will make a post request to /api/checkout
    // THEN make a call to api/current_user to get latest model

    
    return (
        <form action="/api/checkout" method="POST">
            <button className="waves-effect waves-light btn" type="submit">Buy</button>
        </form>
    )
};

export default Payment;