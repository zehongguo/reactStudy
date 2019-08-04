import React, { Component } from 'react';
import './mainCard.css';
export default class MainCrad extends Component {
  constructor() {
    super();
    this.state = {
      isStop: false,
      number: 0,
    };
  }

  componentDidMount() {
    this.Timer = setInterval(() => {
      this.setState({
        number: this.state.number + 100
      });
    }, 10);
  }
  componentWillUnmount() {
    clearInterval(this.Timer);
  }

  render() {
    if (this.state.number >= this.props.amount) {
      clearInterval(this.Timer);
    }
    return (
      <div className="mainCard" style={this.props.style}>
        <span>
          {this.props.title.substr(0, this.props.offset - 1)}
        </span>
        <span style={{ fontSize: "25px", fontWeight: "600" }} >

          {this.state.number}
        </span>
        <span>
          {this.props.title.substr(this.props.offset)}
        </span>
      </div>
    );
  }
}
