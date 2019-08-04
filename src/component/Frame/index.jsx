import React, { Component } from 'react';
import { Layout, Menu, Icon, Badge, Avatar, notification } from 'antd';
import { withRouter } from 'react-router-dom';
import './index.css';
import { getContificationList } from '../../actions/ntificationActions';
import { loginFailed } from '../../actions/loginActions';
import { connect } from 'react-redux';
import logo from "./logo.png";
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const mapToProps = (state) => {
  return {
    hasReadlength: state.notifications.list.filter(item => !item.hasRead).length,
    userInfo: state.login.useInfo,
  };
};
@connect(mapToProps, { getContificationList, loginFailed })
@withRouter//让不是route的组件也拥有route的props
class Frame extends Component {
  state = {
    collapsed: true,
    SiderIconMargin: "25px",
  };
  choicePage = ({ key }) => {
    if (key === "/login") {
      this.props.loginFailed();
    } else {
      this.props.history.push(key);
    }
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
      SiderIconMargin: this.state.SiderIconMargin === "25px" ? "0" : "25px"
    });
  };
  componentDidMount() {
    this.props.getContificationList();
    notification["success"]({
      message: '欢迎您的到来',
      description: this.props.userInfo.usename
    });
  }

  render() {
    const pathArr = this.props.location.pathname.split('/');
    pathArr.length = 3;//分割路径，保持侧边栏的高亮
    return (
      <Layout style={{ minHeight: '100%' }}>
        <Sider trigger={null}
          collapsible
          collapsed={this.state.collapsed}>
          <Menu theme="dark" mode="inline" selectedKeys={[pathArr.join('/')]} style={{ marginTop: "40px" }}>
            <SubMenu
              key="sub1"
              title={
                <span style={{ marginLeft: "-10px", display: "inline-flex" }} >
                  <Badge count={this.props.hasReadlength} style={{ transform: "scale(0.8)" }} >
                    <Avatar src={this.props.userInfo.avatar} />
                  </Badge>
                  <span style={{ marginLeft: this.state.SiderIconMargin, color: "#a6adb4" }}>个人中心</span>
                </span>
              }
            >
              <Menu.Item key="/admin/notifit" onClick={this.choicePage}>
                <Badge dot={Boolean(this.props.hasReadlength)}>
                  <Icon type="notification" />
                </Badge>
                通知中心
              </Menu.Item>
              <Menu.Item key="/admin/setting" onClick={this.choicePage}>
                <Icon type="setting" />
                用户设置
              </Menu.Item>
              <Menu.Item key="/login" onClick={this.choicePage} >
                <Icon type="close-circle" />
                退出登录
                </Menu.Item>
            </SubMenu>
            {this.props.navRoutes.map((route) => {
              return (
                <Menu.Item key={route.pathName} onClick={this.choicePage}>
                  <Icon type={route.icon} />
                  <span>{route.title}</span>
                </Menu.Item>
              );
            })}
          </Menu>
        </Sider>
        <Layout >
          <Header className="content-style">
            <div className="header-logo">
              <img src={logo} alt="logo" />
            </div>
            <Icon
              className="trigger Icon-Side"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 18,
              background: '#fff',
              minHeight: 280,
            }}
          >
            {this.props.children}
          </Content>
        </Layout>
      </Layout >
    );
  }
}

export default Frame;