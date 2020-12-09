import React from 'react';
import NavigationBar from './NavigationBar'
import { useAuth } from "../contexts/AuthContext";
import Lists from "./Lists";

const HomePage = () => {
  const { currentUser } = useAuth()

  return (
    <>
      <NavigationBar />
      <h4 className="mt-4 ml-3 text-5 text-lg">Welcome { currentUser && currentUser.displayName }</h4>
      <Lists />
    </>
  )
}

export default HomePage
