import socketIO from "socket.io-client";
import React, { Component } from "react";
import { Container } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Direction } from "./lib/Direction";

class App extends Component {
  private readonly socket = socketIO("http://localhost:8080");

  componentDidMount() {
    document.body.addEventListener("keydown", this.onKeyDown);
  }
  componentWillUnmount() {
    document.body.removeEventListener("keydown", this.onKeyDown);
  }

  onKeyDown = (evt: KeyboardEvent) => {
    const keyMappings: {[key: string]: Direction} = {
      "ArrowUp": Direction.Up,
      "w": Direction.Up,
      "ArrowDown": Direction.Down,
      "s": Direction.Down,
      "ArrowLeft": Direction.Left,
      "a": Direction.Left,
      "ArrowRight": Direction.Right,
      "d": Direction.Right
    };
    const direction: Direction | undefined = keyMappings[evt.key];
    if (direction === undefined) return;
    this.socket.emit("move", direction);
  };

  render() {
    return (
      <Container>
        <Col xs={12} md={8} lg={6}>
          <pre
            style={{height: "100%"}}
          >Hi there!
          </pre>
        </Col>
      </Container>
    );
  }
}

export default App;
