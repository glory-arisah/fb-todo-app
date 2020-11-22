import React, { useState, useEffect } from 'react';
import { ListGroup, Container,Button, Modal, Form, InputGroup } from "react-bootstrap";
import ListItem from "./ListItem";
import { db, auth } from "../firebase";
import { useAuth } from "../contexts/AuthContext"
import firebase from "firebase";

const Lists = () => {
  const { currentUser } = useAuth()
  const [listName, setListName] = useState('')
  const [lists, setLists] = useState([])
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  
  useEffect(() => {
    // this code fires when the lists.js loads and watchs for any changes in the database, or concerning a given dependency
    db.collection('users').doc(currentUser.uid).collection('lists').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setLists(snapshot.docs.map(doc => ({ id: doc.id , listName: doc.data().listName } )))
    })
  }, [currentUser.uid])

  const addList = (event, listName) => {
    event.preventDefault()
    const { uid, displayName } = auth.currentUser

    db.collection('users').doc(currentUser.uid).collection('lists').add({
      listName,
      userRef: uid,
      userName: displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })

    setLists([...lists ,listName])
    setListName('')
    handleClose()
  }

  const handleKeyPress = (event) => {
    if (event.target.charCode === 13) {
      return
    }
  }

  return (
    <div className="mt-5"> 
      <ListGroup>
        {lists.map(list => (
          <ListItem listItem={list} key={list.id} />
        )
        )}
      </ListGroup>

      <Button variant="info" onClick={() => handleShow()} className="mt-4 ml-2">
        Add List
      </Button>

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
  )
}

export default Lists
