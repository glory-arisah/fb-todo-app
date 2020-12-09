import React, { useState, useEffect } from 'react';
import { ListGroup, Container,Button, Modal, Form, InputGroup, Alert } from "react-bootstrap";
import ListItem from "./ListItem";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import firebase from "firebase";

const Lists = () => {
  const { currentUser } = useAuth()
  const [listName, setListName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [lists, setLists] = useState([])
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  
  useEffect(() => {
    const unsubscribe = db.collection('users').doc(`${currentUser.uid}`).collection('lists').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setLists(snapshot.docs.map(doc => ({ id: doc.id , listName: doc.data().listName } )))
      setIsLoading(false)
    })
    return () => unsubscribe()
  }, [currentUser.uid])

  const addList = (event, listName) => {
    event.preventDefault()
    
    db.collection('users').doc(currentUser.uid).collection('lists').add({
      listName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    
    setLists([...lists ,listName])
    setListName('')
    handleClose()
  }

  const deleteAllLists = () => {
    db.collection('users').doc(currentUser.uid).collection('lists')
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        doc.ref.delete()
      })
    })
  }

  const handleKeyPress = (event) => {
    if (event.target.charCode === 13) {
      return
    }
  }

  return (
    <>
      { isLoading ? <Alert variant='success' className='ml-auto mr-auto mt-3 text-center w-50'>Loading...</Alert> : '' }
      { !isLoading && !lists.length ? <Alert variant='danger' className='ml-auto mr-auto mt-3 text-center w-50'>You have no lists</Alert> : '' }
      {lists.length && <h4 className="ml-auto mr-auto w-50 text-center mt-4">Your Lists</h4> }
      <div className="mt-4">
        <ListGroup>
          {lists.map(list => (
            <ListItem listItem={list} key={list.id} />
        ))}
        </ListGroup>
        <div className="d-flex justify-content-around mt-4 ml-2">
          <Button variant="info" onClick={() => handleShow()}>
            Add List
          </Button>
          <Button className='bg-danger' onClick={() => deleteAllLists()} disabled={!lists.length}>
            Delete All
          </Button>
        </div>
        <Modal show={show} onHide={() => handleClose()} centered="true" >
          <Modal.Header closeButton>
            <Modal.Title>Add a list</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Form>
                <InputGroup>
                  <Form.Control type="text" name="listName" value={listName} placeholder="Enter a list name" onChange={e => setListName(e.target.value)} onKeyPress={event => handleKeyPress(event)} />
                </InputGroup>
                <Button disabled={!listName} type="submit" variant="primary" onClick={e => addList(e, listName)}>
                  Add List
                </Button>
              </Form>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => handleClose()}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  )
}

export default Lists
