import { Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
    return (
      <div className="container">
        <div className="add_circle">Dashboard component</div>
        <Link to="/newsurvey"><i className="material-icons">add_circle</i></Link>
      </div>
    )
}

export default Dashboard;