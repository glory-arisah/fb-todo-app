import React, { useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import { Form, Button, InputGroup, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

function Signup() {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signupUser, currentUser } = useAuth()
  const history = useHistory()
  console.log(currentUser, history)
  

  const onChangeHandler = (event) => {
    const { name, value } = event.target

    if (name === 'name') {
      setDisplayName(value)
    } else if (name === 'email') {
      setEmail(value)
    } else if (name === 'password') {
      setPassword(value)
    }
  }

  const handleSignup = async e => {
    e.preventDefault()
    
    if(password.length < 6) {
      setError('Password must be more than six characters')
      return
    }
    
    try {
      setError('')
      setLoading(true)
      await signupUser(displayName, email, password)
      history.push("/profile-page")
    } catch(error) {
      setError(error.message)
      console.log(error.message)
    }
    setLoading(false)
  }

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh"}}>
      <div className="signup-form">	
        <Form style={{maxHeight: "750px"}} onSubmit={e => handleSignup(e)}>
          <h2>Create Account</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <br/>
          <Form.Group>
            <InputGroup>
              <span className="input-group-addon"><i className="fa fa-user"></i></span>
              <input type="text" className="form-control" name="name" placeholder="Name" value={displayName} onChange={e => onChangeHandler(e)} required="required" />
            </InputGroup>
          </Form.Group>

          <br/>

          <Form.Group>
            <InputGroup>
              <span className="input-group-addon"><i className="fa fa-paper-plane"></i></span>
              <input type="email" className="form-control" name="email" placeholder="Email Address" value={email} onChange={e => onChangeHandler(e)} required="required" />
            </InputGroup>
          </Form.Group>

          <br/>

          <Form.Group>
            <InputGroup>
              <span className="input-group-addon"><i className="fa fa-lock"></i></span>
              <input type="password" className="form-control" name="password" placeholder="Password" value={password} onChange={e => onChangeHandler(e)} required="required" />
            </InputGroup>
          </Form.Group>

          <Form.Group>
            <Button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>Sign Up</Button>
          </Form.Group>

          </Form>
          <br/>
          <div className="text-center">Already have an account? <Link to="/login">Login here</Link></div>
      </div>
    </div>
  )
}

export default Signup