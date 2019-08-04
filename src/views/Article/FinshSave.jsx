import React, { Component } from 'react';
import {
  Result,
  Button
} from 'antd';


export default class FinshSave extends Component {
  toArticleList = () => {
    this.props.history.push('/admin/article/');
  }
  goBack = () => {
    this.props.history.goBack();
  }
  render() {
    return (
      <Result
        status="success"
        title="成功修改一条记录"
        extra={[
          <Button type="primary" key="console" onClick={this.toArticleList}>
            返回首页
      </Button>,
          <Button key="buy" onClick={this.goBack}>继续修改</Button>,
        ]}
      />
    );
  }
}
