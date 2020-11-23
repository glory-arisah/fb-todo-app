import React, { useState, useEffect } from 'react';
import TaskItem from "./TaskItem";
import { db, auth } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { ListGroup, Button, Modal, Container, Form, InputGroup } from 'react-bootstrap';
import ListItem from './ListItem';

const Task = () => {
  const { currentUser } = useAuth()
  const [taskName, setTaskName] = useState('')
  const [checkedValue, setCheckedValue] = useState(false)
  const [tasks, setTasks] = useState([])
  const [show, setShow] = useState(false)
  const [listId, setListId] = useState('')
  const [taskId, setTaskId] = useState('')
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  
  useEffect(() => {
    const unsubscribe = db.collection('users').doc(currentUser.uid).collection('lists')
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        setListId(doc.id)
      })
    })
      return unsubscribe
  }, [currentUser.uid, setListId])

  useEffect(() => {
    const unsubscribe = db.collection('users').doc(`${currentUser.uid}`).collection('lists')
    .doc(listId).collection('tasks').get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        setTaskId(doc.id)
      })
    
    })
    return unsubscribe
  }, [listId, currentUser.uid])

  const addTask = (event, taskName, checkedValue) => {
    event.preventDefault()
    db.collection('users').doc(currentUser.uid).collection('lists').doc(listId).id.collection('tasks').set({
      taskName,
      checked: checkedValue,
      listRef: db.collection('users').doc(currentUser.uid).collection('lists')
    })
    setTasks([...tasks, taskName])
    setTaskName('')
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
        {tasks.map(task => (
          <ListItem TaskItem={task} key={task.id} />
        ))}
      </ListGroup>bnvjhm
      <TaskItem />
      <Modal show={show} onHide={() => handleClose()} centered="true" >
        <Modal.Header closeButton>
          <Modal.Title>Add a task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Form>
              <InputGroup>
                <Form.Control type="text" name="listName" value={taskName} placeholder="Enter a task name" onChange={e => setTaskName(e.target.value)} onKeyPress={event => handleKeyPress(event)} />
              </InputGroup>
              <Button disabled={!taskName} type="submit" variant="primary" onClick={e => addTask(e, taskName)}>
                Add Task
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

export default Task
