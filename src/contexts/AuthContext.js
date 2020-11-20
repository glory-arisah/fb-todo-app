import React, { useState, useEffect, createContext, useContext } from 'react';
import { auth, db } from "../firebase";

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

const AuthProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState({displayName: '', email: '', password: ''})
  const [error, setError] = useState('')

  const signupUser = async (displayName, email, password) => {
    try {
      await auth.createUserWithEmailAndPassword(email, password)
      auth.currentUser.updateProfile({
        displayName
      })
    .then(function() {
      db.collection('users').add({
        displayName,
        email,
        password
      })
    })
    } catch(err) {
      setError(err.message)
    }
    setError('')
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
    })
    return () => unsubscribe()
  }, [])

  const value = {
    currentUser,
    signupUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
