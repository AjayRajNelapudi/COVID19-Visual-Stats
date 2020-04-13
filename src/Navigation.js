import React from 'react';
import {Navbar, Nav} from 'react-bootstrap';

class Navigation extends React.Component {    
    render() {
        return (
            <div>
                <Navbar bg="light" sticky="top" expand="lg">
                    <Navbar.Brand href="/globaltrends">COVID19 vStats</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="/globaltrends">&nbsp;Global Trends&nbsp;</Nav.Link>
                            <Nav.Link href="/indiatrends">&nbsp;India Trends&nbsp;</Nav.Link>
                            <Nav.Link href="/about">About</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }
}

export default Navigation;