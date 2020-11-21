import React, { useState, useEffect, createContext, useContext } from 'react';
import { auth, db } from "../firebase";

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

const AuthProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState({displayName: '', email: '', password: ''})

  const signupUser = async (displayName, email, password) => {
    await auth.createUserWithEmailAndPassword(email, password)
    return await auth.currentUser.updateProfile({
      displayName
    })
    .then(function() {
      db.collection('users').add({
        displayName,
        email,
        password
      })
    })
  }

  const loginUser = async (email, password) => {
    return auth.signInWithEmailAndPassword(email, password)
  }

  const logoutUser = async () => {
    return await auth.signOut()
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
    })
    return () => unsubscribe()
  }, [])

  const value = {
    currentUser,
    signupUser,
    loginUser,
    logoutUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
