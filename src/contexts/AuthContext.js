import React, { useState, useEffect, createContext, useContext } from 'react';
import { auth, db } from "../firebase";
import firebase from "firebase";

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({displayName: '', email: '', password: ''})

  const addUserDocumenmt = async (currentUser) => {
    if (!currentUser) return null;
    const userRef = db.doc(`users/${currentUser.uid}`)
    const snapshot = await userRef.get()

    if (!snapshot.exist) {
      const { displayName, email } = currentUser
      await userRef.set({
        displayName,
        email
      }, { merge: true })
    }
  }

  const signupUser = async (displayName, email, password) => {
    await auth.createUserWithEmailAndPassword(email, password)
    await auth.currentUser.updateProfile({
      displayName
    })
  }

  const loginWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    await auth.signInWithPopup(provider)
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
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user)
        addUserDocumenmt(user)
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
