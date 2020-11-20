import React from 'react';
import { useAuth } from "../contexts/AuthContext";

const HomePage = () => {
  const { currentUser } = useAuth()
  console.log(currentUser)
  return (
    <div>
      
    </div>
  )
}

export default HomePage
