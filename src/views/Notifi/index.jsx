import React, { Component } from 'react';
import { Card, Button, List, Avatar, Badge, Spin } from 'antd';
import { connect } from 'react-redux';
import { markReadById, markAllRead } from '../../actions/ntificationActions';



const mapToProps = (state) => {
  return {
    isLoading: state.notifications.isLoading,
    notificationList: state.notifications.list
  };
};


@connect(mapToProps, { markReadById, markAllRead })
class Notifit extends Component {
  render() {
    return (
      <Spin spinning={this.props.isLoading}>
        <Card title="通知列表" bordered={true}
          extra={
            <Button
              type="primary"
              ghost
              onClick={this.props.markAllRead}
              disabled={this.props.notificationList.every(item => item.hasRead)}
            >
              全部标志为已读
      </Button>
          }
        >
          <List
            itemLayout="horizontal"
            dataSource={this.props.notificationList}
            renderItem={item => (
              <List.Item extra={<Button type="primary" ghost disabled={item.hasRead} onClick={this.props.markReadById.bind(this, item.id)}>标志为已读</Button>}>
                <List.Item.Meta
                  avatar={<Badge dot={!item.hasRead}><Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /></Badge>}
                  title={item.title}
                  description={item.desc}
                />
              </List.Item>
            )}
          />
        </Card>
      </Spin>
    );
  }
}
export default Notifit;
