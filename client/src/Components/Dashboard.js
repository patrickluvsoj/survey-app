import { Link } from "react-router-dom";
import { surveysState } from "../Atoms/surveysState";
import { useRecoilState } from "recoil";
import "./Dashboard.css";
import { fetchSurveys } from "../Actions/fetchSurveys";

const Dashboard = () => {
  // use dummy data for now
  let surveys = [
    {title: "first survey"},
    {title: "second survey"},
    {title: "third survey"}
  ];

  fetchSurveys();

  // wire up w/ atom  
  [ surveys ] = useRecoilState(surveysState);

  console.log(surveys);


  const renderList = () => {
    return surveys.map( survey => <li>{survey.title}</li>);

  }

  return (
    <div className="dashboard">
      <div>
        List surveys here
        <ul>
          {renderList()}
        </ul>
      </div>
      <div className="fixed-action-btn">
        <Link className="btn-floating btn-large red accent-2" to="/newsurvey">
          <i className="large material-icons">add</i>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard;