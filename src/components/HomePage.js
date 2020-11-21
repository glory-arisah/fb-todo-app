import React from 'react';
import { useAuth } from "../contexts/AuthContext";
import NavigationBar from "./NavigationBar"

const HomePage = () => {
  const { currentUser } = useAuth()

  return (
    <div>
      <>
       <NavigationBar />
      <h3>Welcome { currentUser && currentUser.displayName },</h3>
      </>
    </div>
  )
}

export default HomePage
