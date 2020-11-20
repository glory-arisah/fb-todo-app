import "bootstrap/dist/css/bootstrap.min.css"
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AuthProvider from "./contexts/AuthContext";
import App from './components/App';

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>
  ,
  document.getElementById('root')
);
