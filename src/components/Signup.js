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
  const { signupUser, loginWithGoogle } = useAuth()
  const history = useHistory()

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
      history.push("/")
    } catch (err) {
      console.log(err.message)
      setError(err.message)
    }
    setLoading(false)
  }

  const googleSignIn = async (event) => {
    event.preventDefault()
    try {
      await loginWithGoogle()
      history.push("/")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh"}}>
      <div className="signup-form">	
        <Form style={{maxHeight: "750px"}} onSubmit={e => handleSignup(e)}>
          <h2 className="text-uppercase">Create Account</h2>
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
          <br />
          <Form.Group>
            <Button type="submit" className="btn btn-primary btn-block btn-md" disabled={loading}>Sign Up With Email</Button>
          </Form.Group>
          <Form.Group>
            <Button className="bg-danger btn btn-primary btn-block btn-md" disabled={loading} onClick={e => googleSignIn(e)}>Sign In With Google</Button>
          </Form.Group>
          <br />
        </Form>
          <br/>
          <div className="text-center">Already have an account? <Link to="/login">Login here</Link></div>
      </div>
    </div>
  )
}

export default Signup