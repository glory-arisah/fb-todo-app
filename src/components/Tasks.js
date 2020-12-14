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
  const [listName, setListName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [tasks, setTasks] = useState([])
  const [taskName, setTaskName] = useState('')
  const [checkedValue, setCheckedValue] = useState(false)
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const fetchLists = async () => {
    return db.collection('users').doc(currentUser.uid).collection('lists').orderBy('timestamp', 'desc')
    .get()
    .then((querySnapshot) => {
      let lists = (querySnapshot.docs.map(doc => ({ listId: doc.id, ...doc.data() })))
      return lists
    })
  }

  useEffect(() => {
    const unsubscribe = db.collection('users').doc(currentUser.uid).collection('lists').doc(listId).collection('tasks').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setTasks(snapshot.docs.map(doc => ({taskId: doc.id, taskName: doc.data().taskName, checkedValue: doc.data().checkedValue })))
      setIsLoading(false)
    })

    return () => unsubscribe()
   }, [currentUser.uid])

   useEffect(() => {
    const unsubscribe = async () => {
      const lists = await fetchLists()
      if (lists.length) {
        let currentList = lists.find((list) => list.listId === listId)
        setListName(currentList.listName)
      }
    }
    return () => unsubscribe()
  })

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
      <h4 className="mt-3 mb-0 mr-auto ml-auto w-25 text-center">{listName}</h4>
      <div className="all-tasks mt-3 ml-auto mr-auto">
        { isLoading && !listName ? <Alert variant='success' className='ml-auto mr-auto text-center w-50'>Loading ...</Alert>: '' }
        { !isLoading && !tasks.length ? <Alert variant="danger" className='ml-auto mr-auto text-center w-50'>You have no tasks</Alert> : '' }
        { !isLoading && listName ? 
          <>
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
              <Button className='bg-danger'>
                Back to lists
              </Button>
            </Link>
            <Button className='bg-danger' onClick={() => deleteAllTasks()}>
              Delete All
            </Button>
          </div>
          </> : ''
        }

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
