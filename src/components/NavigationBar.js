import React from 'react';
import { Navbar, Nav } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

const NavigationBar = () => {
  const { logoutUser } = useAuth()

  return (
    <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
      <Navbar.Brand href="#home">TODO</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link href="/login"><p onClick={logoutUser}>Logout</p></Nav.Link>
          <Nav.Link href="/update-profile">Update Profile</Nav.Link>
        </Nav>
      </Navbar.Collapse>
  </Navbar>
  )
}

export default NavigationBar
