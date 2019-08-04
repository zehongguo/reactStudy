import React, { Component, createRef } from 'react';
import {
  Card,
  Button,
  Form,
  Input,
  Icon,
  DatePicker,
  LocaleProvider,
  message,
  Spin
} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import E from 'wangeditor';
import "./index.less";
import {
  getArticleById,
  saveAricle
} from '../../server';
import moment from 'moment';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 15 },
  },
};
// 表单需要这个高阶组件高阶组件
@Form.create()
class ArticleEdit extends Component {
  constructor() {
    super();
    this.state = {
      mode: 'time',
      isLoading: false,
      toArtcleList: false,
    };
    this.wangEditorRef = createRef();
  }

  //初始化富编辑器
  initWangEditor = () => {
    this.editor = new E(this.wangEditorRef.current);
    // 当文本改变之后就会触发这个时间，需要把这个html传递给getFieldDecorator，这样提交的时候就会把内容也提交上去
    this.editor.customConfig.onchange = html => {
      this.props.form.setFieldsValue({
        articleContent: html//这样就完成了表单联动
      });
    };
    this.editor.create();
  }

  initForm = () => {
    this.setState({
      isLoading: true
    });
    getArticleById(this.props.match.params.id)
      .then((data) => {
        data.createAt = moment(data.createAt);
        // console.log(data);
        this.props.form.setFieldsValue(data);
        this.editor.txt.html(data.articleContent);

      })
      .finally(() => {
        this.setState({
          isLoading: false
        });
      });
  }
  //初始化内容
  componentDidMount() {
    this.initWangEditor();
    this.initForm();
  }


  //提交按钮 -> 发送请求 ->跳转到成功页面
  handleSubmit = e => {
    this.setState({
      isLoading: true
    });
    e.preventDefault();
    //这是用来获取其他控件的值
    // this.props.form.setFieldsValue({
    //   content: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
    // });
    this.props.form.validateFields((err, values) => {
      // TODO:
      if (!err) {
        values.createAt = moment(values.createAt).valueOf();
        saveAricle(this.props.match.params.id, values)
          .then((data) => {
            // pathname: "/admin/article/edit/saveFinsh",
            // msg: data.msg
            this.setState({
              toArtcleList: true
            });
          })
          .catch(() => {
            message.warning("服务器发生错误");
          })
          .finally(() => {
            this.setState({
              isLoading: false
            }, () => {
              if (this.state.toArtcleList) {
                this.props.history.push("/admin/finish");
              }
            });
          });

      } else {
        message.warning("请输入正确的信息");
      }
    });
  };


  //日期面板
  handleOpenChange = open => {
    if (open) {
      this.setState({ mode: 'time' });
    }
  };
  handlePanelChange = (value, mode) => {
    this.setState({ mode });
  };

  //取消按钮
  cancelBtn = () => {
    this.props.history.push('/admin/article/');
  }




  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <LocaleProvider locale={zh_CN}>
        <Spin spinning={this.state.isLoading}>
          <Card title="编辑文章"
            bordered={true}
            extra={<Button type="primary" ghost onClick={this.cancelBtn}>返回</Button>}
          >

            <Form onSubmit={this.handleSubmit} className="login-form" {...formItemLayout}>
              <Form.Item label="标题"  >
                {getFieldDecorator('title', {
                  rules: [
                    {
                      required: true,
                      message: '必选项',
                    },
                    {
                      required: true,
                      message: '限制6-20个字符',
                      min: 6,
                      max: 20,
                    }
                  ],
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="标题"
                  />,
                )}
              </Form.Item>


              <Form.Item label="作者" >
                {getFieldDecorator('author', {
                  rules: [
                    {
                      required: true,
                      message: '必选项',
                    },
                    {
                      required: true,
                      message: '限制2-10个字符',
                      min: 2,
                      max: 10
                    }
                  ],
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="作者名称"
                  />,
                )}
              </Form.Item>


              <Form.Item
                label="创建时间"
              >
                {getFieldDecorator('createAt', {
                  rules: [
                    {
                      required: true,
                      message: '必选项',
                    }
                  ]
                })(
                  <DatePicker
                    mode={this.state.mode}
                    showTime
                    onOpenChange={this.handleOpenChange}
                    onPanelChange={this.handlePanelChange}
                    placeholder="创建时间"
                    style={{ width: "260px" }}
                  />
                )}
              </Form.Item>


              <Form.Item
                label="文章内容"
                wrapperCol={{
                  xs: { span: 24 },
                  sm: { span: 15 },
                }}
              >
                {getFieldDecorator('articleContent')(
                  <div
                    ref={this.wangEditorRef}
                    className="wangEditor"
                  />
                )}
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  xs: { span: 24, offset: 0 },
                  sm: { span: 16, offset: 5 },
                }}
              >
                <Button type="primary" htmlType="submit" ghost>
                  保存修改
          </Button>
              </Form.Item>
            </Form>
          </Card>
        </Spin>
      </LocaleProvider>
    );
  }
}

export default ArticleEdit;