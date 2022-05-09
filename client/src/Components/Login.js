
import { fetchUser } from "../Services/checkLoginState";

function Login() {
    const loggedIn = fetchUser()

}

export default Login;