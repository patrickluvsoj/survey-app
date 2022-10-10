import { Link } from "react-router-dom";
import { surveysState } from "../Atoms/surveysState";
import { useRecoilState } from "recoil";
import "./Dashboard.css";
import { fetchSurveys } from "../Actions/fetchSurveys";
import { useEffect } from "react";

const Dashboard = () => {

  const [ surveys ] = useRecoilState(surveysState);

  useEffect( () => {
    fetchSurveys();
  }, [])

  console.log(surveys);

  const renderList = () => {
    return surveys.map( survey => {
      return (
        <li className="collection-item">
          <div className="title">
            {survey.title}
          </div>
          <p>
            Subject: {survey.subject} <br></br>
            Question: {survey.body} <br></br>
            Sent: {survey.dateSent} <br></br>
            Last Response: {survey.lastResponded} <br></br>
            Yes: {survey.yes} / No: {survey.no}
          </p>
        </li>
      )
    });

  }

  return (
    <div className="dashboard">
      <div className="container">
        <ul className="collection with-header">
          <li className="collection-header"><h4>Surveys</h4></li>
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