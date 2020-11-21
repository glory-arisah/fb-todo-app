import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"

const ProtectedRoute = ({ component: Component, authenticated, ...rest }) => {
  const { currentUser } = useAuth()
  return (
    <Route
      render={(props) => (
        currentUser ? <Component {...props} /> : <Redirect to="/login" />
      )}
      {...rest}
    />
  )
}

export default ProtectedRoute