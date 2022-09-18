import { Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
    return (
      <div className="fixed-action-btn">
        <Link className="btn-floating btn-large red accent-2" to="/newsurvey">
          <i className="large material-icons">add</i>
        </Link>
      </div>
    )
}

export default Dashboard;