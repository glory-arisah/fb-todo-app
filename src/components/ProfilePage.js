import React from 'react';
import { Container, Button } from "react-bootstrap";
import logo from "../profile-picture.png";
import { useAuth } from "../contexts/AuthContext";
import { Redirect } from "react-router-dom"

const ProfilePage = () => {
  const { currentUser } = useAuth()

  return (
    <Container bg="dark">
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh"}}>
        <div className="signup-form">	
          <div className="row user-detail">
            <div className="col-lg-12 col-sm-12 col-12">
              <img src={logo} className="rounded-circle img-thumbnail" alt="thumbnail" />
                <h5>{currentUser && currentUser.displayName}</h5>
                <span><i className="fa fa-envelop"></i>{currentUser.email}</span>
                <hr/>
            </div>
            
            <div className="d-flex justify-content-between">
            <Button onClick={<Redirect to="/" />}>Lists</Button>
            </div>
          </div>
         <br/>
        </div>
      </div>
    </Container>
  )
}

export default ProfilePage
