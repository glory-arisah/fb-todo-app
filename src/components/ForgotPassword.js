import React, { useState } from "react";
import { Form, InputGroup, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ForgotPassword = () => {
  const { resetPassword } = useAuth()
  const [ email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  const onChangeHandler = (event) => {
    const { value } = event.target
    setEmail(value)
  }

  const forgotPasswordHandler = async (event) => {
    event.preventDefault()

    try {
      setLoading(true)
      resetPassword(email)
      setMsg('An email has been sent to your account')
    } catch (err) {
      setError(err.message)
    }

    setLoading(false)
  }

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh"}}>
      <div className="signup-form">	
        <Form style={{maxHeight: "750px"}} onSubmit={e => forgotPasswordHandler(e)} >
          <h2>Log In</h2>
          {msg && <Alert variant="success">{msg}</Alert>}
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
            <Button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>Send me a reset password link</Button>
          </Form.Group>
          <span></span>
        </Form>
        <br/>
        <div className="d-flex justify-content-between">
          <p><Link to="/login"><i className="fa fa-angle-left mr-3"></i>Back to login</Link></p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
