import { Container, Row, Col } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import React from "react";

import Admin from "./Admin/Admin";
import Home from "./Home/Home";
import Stats from "./Stats/Stats";

import "./styles/navbar.css";
function NavBar(props) {
  return (
    <Router>
      <nav className="navbar navbar-dark bg-dark">
        <Container fluid="md" id="navbar">
          <Row className="justify-content-md-center">
            <Col>
              <Link to="/admin">Admin</Link>
            </Col>
            <Col>
              <Link to="/home"> Home </Link>
            </Col>
            <Col>
              <Link to="/stats"> Stats </Link>
            </Col>
          </Row>
        </Container>
      </nav>
      <Switch>
        <Route path="/" exact render={() => <Home list={props.list}></Home>} />
        <Route
          path="/admin"
          exact
          render={() => <Admin list={props.list}></Admin>}
        />
        <Route
          path="/home"
          exact
          render={() => <Home list={props.list}></Home>}
        />
        <Route path="/stats" exact component={Stats} />
      </Switch>
    </Router>
  );
}

export default NavBar;
