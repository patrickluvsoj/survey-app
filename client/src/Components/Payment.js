
function Payment() {
    return (
        <form action="/api/checkout" method="POST">
            <button className="waves-effect waves-light btn" type="submit">Buy</button>
        </form>
    )
};

export default Payment;