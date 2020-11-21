import React, { useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import { Form, Button, InputGroup, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const { loginUser, currentUser } = useAuth()
  console.log(currentUser)

  const onChangeHandler = event => {
    const { name, value } = event.target

      if (name === 'email') {
        setEmail(value)
      } else if (name === 'password') {
        setPassword(value)
      }
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    if (password.length < 6) {
      setError('Password must be more than six characters')
      setLoading(false)
    }
  
    try {
      setLoading(true)
      await loginUser(email, password)
      history.push("/")
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
    setLoading(false)
  }
  
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh"}}>
      <div className="signup-form">	
        <Form style={{maxHeight: "750px"}} onSubmit={e => handleLogin(e)}>
          <h2 className="text-uppercase">Log In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <br/>
          <Form.Group>
            <InputGroup>
              <span className="input-group-addon"><i className="fa fa-paper-plane"></i></span>
              <input type="email" className="form-control" name="email" placeholder="Email" value={email} onChange={e => onChangeHandler(e)} required="required" />
            </InputGroup>
          </Form.Group>
          <br/>
          <Form.Group>
            <InputGroup>
              <span className="input-group-addon"><i className="fa fa-lock"></i></span>
              <input type="password" className="form-control" name="password" value={password} onChange={e => onChangeHandler(e)} placeholder="Password" required="required" />
            </InputGroup>
          </Form.Group>
          <br/>
          <Form.Group>
            <Button type="submit" className="btn btn-primary btn-block btn-md" disabled={loading}>Sign In With Email</Button>
          </Form.Group>
          <br />
        </Form>
        <br/>
        <div className="d-flex justify-content-between">
          <p>Don't have an acount?<Link to="/signup">Sign up here</Link></p>
          <p><Link to="/forgot-password">Forgot your password?</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Login