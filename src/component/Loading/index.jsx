import React, { Component } from 'react';
import { Skeleton } from 'antd';

export default class Loading extends Component {
  render() {
    return (
      <div>
        <Skeleton active />
      </div>
    );
  }
}
