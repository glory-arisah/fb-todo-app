import React, { useState, useEffect } from 'react';
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { ListGroup, Button, Modal, Container, Form, InputGroup, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import TaskItem from './TaskItem';
import firebase from 'firebase';
import NavigationBar from "./NavigationBar";

const Tasks = () => {
  const { currentUser } = useAuth()
  const { listId } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [tasks, setTasks] = useState([])
  const [taskName, setTaskName] = useState('')
  const [checkedValue, setCheckedValue] = useState(false)
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  useEffect(() => {
    const unsubscribe = db.collection('users').doc(currentUser.uid).collection('lists').doc(listId).collection('tasks').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setTasks(snapshot.docs.map(doc => ({taskId: doc.id, taskName: doc.data().taskName, checkedValue: doc.data().checkedValue })))
      setIsLoading(false)
    })

    return () => { unsubscribe() }
   }, [currentUser.uid])

  const addTask = (event, taskName, checkedValue) => {
    event.preventDefault()
    db.collection('users').doc(currentUser.uid).collection('lists').doc(listId).collection('tasks').add({
      taskName,
      checkedValue,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    setTaskName('')
    setTasks([...tasks, {taskName}])
    handleClose()
  }

  const deleteAllTasks = () => {
    db.collection('users').doc(currentUser.uid).collection('lists').doc(listId).collection('tasks')
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
      <NavigationBar />
      <div className="mt-5">
        { isLoading ? <Alert variant='success' className='ml-auto mr-auto text-center w-50'>Loading ...</Alert>: '' }
        { !isLoading && !tasks.length ? <Alert variant="danger" className='ml-auto mr-auto text-center w-50'>You have no tasks</Alert> : '' }
        <ListGroup key={listId}>
          {tasks.map(task => (
            <TaskItem key={task.taskId} listId={listId} taskItem={task} />
          ))}
        </ListGroup>
        <div className="d-flex justify-content-around mt-4 ml-2">
          <Button variant="info" onClick={() => handleShow()}>
            Add Task
          </Button>
          <Link to='/'>
            <Button className='bg-danger' onClick={() => deleteAllTasks()}>
              Back to lists
            </Button>
          </Link>
          <Button className='bg-danger' onClick={() => deleteAllTasks()}>
            Delete All
          </Button>
        </div>
        
        <Modal show={show} onHide={() => handleClose()} centered="true" >
          <Modal.Header closeButton>
            <Modal.Title>Add a task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Form>
                <InputGroup>
                  <Form.Control type="text" name="listName" value={taskName} onChange={e => setTaskName(e.target.value)} placeholder="Enter a task name" onKeyPress={event => handleKeyPress(event)} />
                </InputGroup>
                <Button disabled={!taskName} type="submit" variant="primary" onClick={e => addTask(e, taskName, checkedValue)}>
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
    </>
  )
}

export default Tasks
