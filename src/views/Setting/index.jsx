import React, { Component } from 'react';
import { Upload, Icon, message, Spin, Card, Button } from 'antd';
import axios from 'axios';
import { connect } from 'react-redux';
import { changeAvatar as changeAvatarAction, saveModifyAvatar } from '../../actions/loginActions';
/* 

 */

//判断上传文件是否符合条件
function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

const Token = "14110a48ee40816e3ae6d2aebe256f4c91651e57:p13cBebaw1-ivZ4EDLegbGuGjAI=:eyJkZWFkbGluZSI6MTU2NDgxNjYxOCwiYWN0aW9uIjoiZ2V0IiwidWlkIjoiNjk2MDE4IiwiYWlkIjoiMTYyMDQ5NSIsImZyb20iOiJmaWxlIn0=";

const stateMaptoProps = (state) => {
  return {
    avatar: state.login.useInfo.avatar
  };
};
@connect(stateMaptoProps, { changeAvatarAction, saveModifyAvatar })
class Setting extends Component {
  state = {
    isLoading: false,
  };


  changeAvatar = ({ file }) => {
    this.setState({
      isLoading: true,
    });
    const data = new FormData();
    data.append("Token", Token);
    data.append("file", file);
    axios.post("http://up.imgapi.com/", data)
      .then((resq) => {
        if (resq.status === 200) {
          let { linkurl } = resq.data;
          this.props.changeAvatarAction(linkurl);
          message.success("上传成功");
        } else {
          message.warning('上传失败,请重试');
        }
      })
      .catch(() => {
        message.warning('上传失败,请重试');
      })
      .finally(() => {
        if (!this.updater.isMounted(this)) return;
        this.setState({
          isLoading: false,
        });
      });
  }

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <Card className="clearfix"
        title={"修改头像"}
        bordered={false}
        extra={<Button disabled={this.state.isModify} onClick={this.props.saveModifyAvatar}>保存修改</Button>}
      >
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}//是否已列表显示
          beforeUpload={beforeUpload}//文件校验
          onChange={this.handleChange}
          customRequest={this.changeAvatar}
        >
          <Spin spinning={this.state.isLoading}>
            {this.props.avatar ? <img src={this.props.avatar} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
          </Spin>
        </Upload>
      </Card>
    );
  }
}

export default Setting;