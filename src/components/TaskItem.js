import React, { useState, useEffect } from 'react';
import { ListGroupItem, Button, Modal, Form, InputGroup, Container } from "react-bootstrap";
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const TaskItem = ({ taskItem, listId }) => {
  const { currentUser } = useAuth()
  const [isChecked, setIsChecked] = useState(taskItem.checkedValue)
  const [editTaskName, setEditTaskName] = useState(taskItem.taskName)
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const deleteTask = () => {
    db.collection('users').doc(`${currentUser.uid}/lists/${listId}/tasks/${taskItem.taskId}`).delete()
  }

  const checkBoxValue = (event) => {
    setIsChecked(event.target.checked)
    db.collection('users').doc(`${currentUser.uid}/lists/${listId}/tasks/${taskItem.taskId}`).set({
      checkedValue: event.target.checked
    }, { merge: true })
  }

  const updateTaskName = (event, taskName) => {
    event.preventDefault()
    db.collection('users').doc(`${currentUser.uid}/lists/${listId}/tasks/${taskItem.taskId}`).set({
      taskName
    }, { merge: true })
    handleClose()
  }

  const handleKeyPress = (event) => {
    if (event.target.charCode===13) {
      return
    }
  }

  return (
    <>
      <ListGroupItem key={taskItem.taskId} className="d-flex justify-content-between">
        <div className='mt-0 mb-0 task-holder d-flex w-100 justify-content-start align-items-center'>
          <input type="checkbox" checked={isChecked} onChange={(e) => checkBoxValue(e)} className='task-checked-value' />
          <span className='ml-3'>{taskItem.taskName}</span>
        </div>
        <div className="d-flex justify-content-around w-50">
          <Button variant="info" className="bg-success border-0" onClick={() => handleShow()}><i className="fa fa-pencil"></i></Button>
          <Button variant="info" className="bg-danger border-0" onClick={deleteTask}><i className="fa fa-trash"></i></Button>
        </div>
      </ListGroupItem>
      <Modal show={show} onHide={handleClose} centered="true" >
      <Modal.Header closeButton>
        <Modal.Title>Update Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <InputGroup>
              <Form.Control type="text" name="editTaskName" placeholder="Enter a list name" value={editTaskName} onChange={e => setEditTaskName(e.target.value)} onKeyPress={event => handleKeyPress(event)} />
            </InputGroup>
            <Button disabled={!editTaskName} type="submit" variant="primary" onClick={e => updateTaskName(e, editTaskName)}>
              Update
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
  </>
  )
}

export default TaskItem
