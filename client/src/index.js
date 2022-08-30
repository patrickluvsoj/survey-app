import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import RecoilNexus from 'recoil-nexus';
import App from './Components/App';

import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter className="container">
      <RecoilRoot>
        <RecoilNexus/>
        <App/>
      </RecoilRoot>
    </BrowserRouter>
  </React.StrictMode>
);
