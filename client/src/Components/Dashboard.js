import { Link, Navigate } from "react-router-dom";
import { surveysState } from "../Atoms/surveysState";
import { useRecoilState, useRecoilValue } from "recoil";
import "./Dashboard.css";
import { fetchSurveys } from "../Actions/fetchSurveys";
import { useEffect } from "react";
import { userState } from "../Atoms/userState";

const Dashboard = () => {

  const [ surveys ] = useRecoilState(surveysState);
  const isAuthenticated = useRecoilValue(userState);
  console.log('user state in dashboard: ' + JSON.stringify(isAuthenticated));

  useEffect( () => {
    fetchSurveys();
  }, []);

  // Validate if surveys were properly fetched
  // console.log(surveys);

  const renderList = () => {
    const sortedDates = [];
    const prevDate = undefined;
    
    //sort the list of surveys based on date sent
    surveys.forEach( obj => {
      if (obj.dateSent !== prevDate) {
        sortedDates.unshift(obj)
      }
      else if (obj.dateSent < prevDate) {
        sortedDates.unshift(obj)
      } else {
        sortedDates.append(obj)
      }
    });

    return sortedDates.map( survey => {
      console.log(survey._id);
      return (
        <li key={survey._id} className="collection-item">
          <div className="title">
            <h5>{survey.title}</h5>
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

  const sortedSurveys = renderList();

  const renderComponent = () => {
    if (isAuthenticated === null) {
      return (
        <div>Loading...</div>
      )
    } else if (isAuthenticated === false) {
      return <Navigate to="/" replace={true} />
    } else {
      return (
        <div className="list-content">
          <div className="container">
            <h4>Surveys</h4>
            <ul className="collection with-header">
              {sortedSurveys}
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
  }

  return (
    <div className="dashboard">
      {renderComponent()}
    </div>
  )
}

export default Dashboard;