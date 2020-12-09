import React, { useState, useEffect, createContext, useContext } from 'react'
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { cleanup } from '@testing-library/react';

const ListContext = createContext()

export const useLists = () => {
  return useContext(ListContext)
}

const ListProvider = ({ children }) => {
  const [lists, setLists] = useState([])
  const { currentUser } = useAuth()

  const getUserLists = () => {
    db.collection('users').doc(`${currentUser.uid}`).collection('lists').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setLists(snapshot.docs.map(doc => ({ id: doc.id , listName: doc.data().listName } )))
    })
    console.log(lists)
  }

  const value = {
    lists,
    getUserLists
  }

  return (
    <ListContext.Provider value={value}>
      { children }
    </ListContext.Provider>
  )
}

export default ListProvider
