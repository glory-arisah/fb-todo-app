import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";
import HomePage from "./HomePage";
import Login from "./Login";
import ProfilePage from "./ProfilePage";
import Signup from "./Signup";
import ProtectedRoute from "./ProtectedRoute";
import Tasks from "./Tasks";

function App() {
  const taskPath=`lists/tasks`
  console.log(taskPath)
  return (
    <Router>
      <Switch>
        <ProtectedRoute exact path="/" component={HomePage} />
        <Route path={taskPath} component={Tasks} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/profile-page" component={ProfilePage}/>
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <Route path="*" component={() => "404 NOT FOUND"} />
      </Switch>
    </Router>
  );
}

export default App;
 