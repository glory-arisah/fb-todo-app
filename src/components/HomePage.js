import React from 'react';
import { useAuth } from "../contexts/AuthContext";
import NavigationBar from "./NavigationBar";
import Lists from "./Lists";

const HomePage = () => {
  const { currentUser } = useAuth()

  return (
    <>
      <NavigationBar />
      <h3 className="mt-3">Welcome { currentUser && currentUser.displayName }</h3>
      <Lists />
    </>
  )
}

export default HomePage
