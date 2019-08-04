import { Card, Form, Input, Icon, Checkbox, Button, message } from 'antd';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { toLogin } from '../../actions/loginActions';
import { Redirect } from 'react-router-dom';
import './login.less';


const stateMapToPros = (state) => {
  return {
    isLogin: state.login.isLogin,
    isLoading: state.login.isLoading
  };
};
@connect(stateMapToPros, { toLogin })
@Form.create()
class Login extends Component {
  //点击登录
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.toLogin.bind(this, values)();
      } else {
        message.warning("请输入正确信息");
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      !this.props.isLogin
        ?
        <Card title="欢迎您，请登录" bordered={false} className="zh-style-login">
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '用户名必须填' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                  disabled={this.props.isLoading}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '密码必须填' }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="密码"
                  disabled={this.props.isLoading}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(<Checkbox>记住我</Checkbox>)}
              <Button loading={this.props.isLoading} type="primary" htmlType="submit" className="login-form-button">
                登录
          </Button>
            </Form.Item>
          </Form>
        </Card>
        :
        <Redirect to='/admin' />
    );
  }
}

export default Login;