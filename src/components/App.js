import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";
import HomePage from "./HomePage";
import Login from "./Login";
import ProfilePage from "./ProfilePage";
import Signup from "./Signup";
import ProtectedRoute from "./ProtectedRoute";
import ListProvider from '../contexts/ListContext'
import Tasks from './Tasks'

function App() {
  return (
    <Router>
      <Switch>
        <ProtectedRoute exact path="/" component={HomePage} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/profile-page" component={ProfilePage}/>
        <Route path="/forgot-password" component={ForgotPassword} />
        <ListProvider>
          <Route path="/lists/:listId/tasks" children={<Tasks />}></Route>
        </ListProvider>
        <Route path="*" component={() => "404 NOT FOUND"} />
      </Switch>
    </Router>
  );
}

export default App;
 