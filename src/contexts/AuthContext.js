import React, { useState, useEffect, createContext, useContext } from 'react';
import { auth, db } from "../firebase";
import firebase from "firebase";
import { useHistory } from 'react-router-dom';

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

const AuthProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState({displayName: '', email: '', password: ''})

  const history = useHistory()

  const signupUser = async (displayName, email, password) => {
    await auth.createUserWithEmailAndPassword(email, password)
    await auth.currentUser.updateProfile({
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

  const loginWithGoogle = async (props) => {
    const provider = await new firebase.auth.GoogleAuthProvider()
    await auth.signInWithPopup(provider)
    .then((res) => {
      const currentUser = res.user
      console.log(currentUser)
      let userObj = {
        displayName: currentUser.displayName,
        email: currentUser.email,
        uid: currentUser.uid
      }
      localStorage.setItem('GDrive', JSON.stringify(userObj))
    })
    .then(res => {
      console.log(res)
    })
  }

  const loginUser = async (email, password) => {
    return auth.signInWithEmailAndPassword(email, password)
  }

  const resetPassword = email => {
    return auth.sendPasswordResetEmail(email)
  }

  const logout = () => {
    return auth.signOut()
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user)
      } else {
        setCurrentUser(null)
      }
    })
    return () => unsubscribe()
  }, [])

  const value = {
    currentUser,
    signupUser,
    loginUser,
    resetPassword,
    loginWithGoogle,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
