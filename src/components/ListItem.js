import React, { useState } from 'react';
import { ListGroupItem, Button, Modal, Form, InputGroup, Container } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { db } from '../firebase';

const ListItem = ({ listItem }) => {
  const { currentUser } = useAuth()
  const [editListName, setEditListName] = useState(listItem.listName)
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const deleteListItem = () => {
    db.collection('users').doc(currentUser.uid).collection('lists').doc(listItem.id).delete()
  }
  
  const updateListName = (event) => {
    event.preventDefault()
    db.collection('users').doc(currentUser.uid).collection('lists').doc(listItem.id).set({
      listName: editListName
      }, { merge: true })
      handleClose()
  }

  const handleKeyPress = (event) => {
    if (event.target.charCode===13) {
      return
    }
  }

  return (
    <div>
      <ListGroupItem className="d-flex justify-content-between w-100">
        {listItem.listName}
        <div className="d-flex justify-content-around w-50">
          <Button className="bg-dark border-0"><i className="fa fa-plus"> task</i></Button>
          <Button variant="info" onClick={() => handleShow() } className="bg-success border-0"><i className="fa fa-pencil"></i></Button>
          <Button className="bg-danger border-0" onClick={deleteListItem}><i className="fa fa-trash"></i></Button>
        </div>
      </ListGroupItem>
      <Modal show={show} onHide={handleClose} centered="true" >
        <Modal.Header closeButton>
          <Modal.Title>Add a list</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Form>
              <InputGroup>
                <Form.Control type="text" name="editListName" placeholder="Enter a list name" value={editListName} onChange={e => setEditListName(e.target.value)} onKeyPress={event => handleKeyPress(event)} />
              </InputGroup>
              <Button disabled={!editListName} type="submit" variant="primary" onClick={e => updateListName(e)}>
                Edit List
              </Button>
            </Form>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ListItem
