import React, { Component } from 'react';
import { Card, Table, Button, Modal } from 'antd';
import { LocaleProvider, message, Tag } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { getArticle, deleteArticle } from '../../server';
import moment from 'moment';
import XLSX from 'xlsx';
const ButtonGroup = Button.Group;

//将标题映射为中文
const columnsMapTitle = {
  "id": "id",
  "title": "文章标题",
  "author": "作者",
  "amount": "阅读量",
  "createAt": "发表日期"
};
export default class ArticleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      columns: [],
      total: 0,
      offset: 0,//数据偏移量
      limited: 10,//一次请求多少条数据
      isLoding: false,
      visible: false,//导出Excel模态框
      deleteVisible: false,//删除模态框是否显示
      confirmLoading: false,//删除模态框加载
      deleteArticleTitle: '',
      deleteArticleId: ''
    };
  }
  //获取文章的头部信息
  getColums(listHead) {
    const columns = Object.keys(listHead).map((item) => {
      //给阅读量上色
      if (item === "amount") {
        return {
          title: columnsMapTitle[item],
          key: item,
          dataIndex: item,
          render: (record) => (<Tag color={record > 500 ? "green" : "magenta"}>{record}</Tag>)
        };
      }

      //格式化事件戳
      if (item === "createAt") {
        return {
          title: columnsMapTitle[item],
          key: item,
          dataIndex: item,
          render: (text, record) => {
            return moment(record.createAt).format("YYYY年MM月DD日 HH:mm:ss");
          }
        };
      }
      return {
        title: columnsMapTitle[item],
        dataIndex: item,
        key: item
      };
    });
    //最后在加上一个操作按钮
    columns.push({
      title: "操作",
      key: "action",
      render: (text, record) => {
        return (
          <ButtonGroup>
            <Button type="primary" ghost onClick={this.toArticleEdit.bind(this, record.id)}>编辑</Button>
            <Button type="danger" ghost onClick={this.showDeleteModal.bind(this, record)}>删除</Button>
          </ButtonGroup>
        );
      }
    });
    return columns;
  }

  //发送ajax请求并设置内容，
  getData = () => {
    if (!this.updater.isMounted(this)) return;
    this.setState({
      isLoding: true
    });
    getArticle(this.state.offset, this.state.limited)
      .then((result) => {
        const columns = this.getColums(result.list[0]);
        //如果组件已经卸载，这不执行setState()
        if (!this.updater.isMounted(this)) return;
        this.setState({
          total: result.total,
          dataSource: result.list,
          columns
        });
      })
      .catch((err) => {
        message.error('服务器出错' + err);
      })
      .finally(() => {
        if (!this.updater.isMounted(this)) return;
        this.setState({
          isLoding: false
        });
      });
  }

  componentDidMount() {
    this.getData();
  }

  //改变页数时，更改offset和limited，再发送请求
  changePageContent = (page, pageSize) => {
    this.setState({
      offset: (page - 1) * pageSize,
      limited: pageSize
    }, () => {
      this.getData();
    });
  }

  //改变每页显示的条数
  onShowSizeChange = (current, size) => {
    this.setState({
      offset: 0,
      limited: size
    }, () => {
      this.getData();
    });
  }


  //这是excle模块
  showExcelModal = () => {
    this.setState({
      visible: true,
    });
  };
  handleOk = () => {
    this.toExcle()
      .then((result) => {
        message.success(result);
      })
      .finally(() => {
        this.setState({
          visible: false,
        });
      });
  }
  handleCancel = () => {
    this.setState({
      visible: false,
      deleteVisible: false
    });
  }
  toExcle = () => {
    return new Promise((resolve, reject) => {
      const execlData = [Object.keys(this.state.dataSource[0])];
      this.state.dataSource.forEach(element => {
        execlData.push([
          element.id,
          element.title,
          element.author,
          element.amount,
          moment(element.createAt).format("YYYY年MM月DD日 HH:mm:ss")
        ]);
      });
      const ws = XLSX.utils.aoa_to_sheet(execlData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
      XLSX.writeFile(wb, `${new Date().getTime()}.xlsx`);
      resolve("正在下载");
    });
  }

  //触发删除键的模态框
  showDeleteModal = ({ id, title }) => {
    this.setState({
      deleteVisible: true,
      deleteArticleTitle: title,
      deleteArticleId: id
    });
  }

  //删除模态框按确定触发的时事件
  deleteHandleOk = () => {
    this.setState({
      confirmLoading: true
    }, () => {
      //发送删除数据
      deleteArticle(this.state.deleteArticleId)
        .then((data) => {
          message.success(data.deleteData);
          this.getData();
        })
        .finally(() => {
          this.setState({
            offset: 0,//删除后返回到第一页
            deleteVisible: false,
            confirmLoading: false,
            deleteArticleTitle: '',
            deleteArticleId: '',
          });
        });
    });
  }
  //跳转到编辑页面
  toArticleEdit = (id) => {
    this.props.history.push(`/admin/article/edit/${id}`);
  }


  render() {
    return (
      <LocaleProvider locale={zh_CN}>
        <div style={{ padding: '10px' }}>
          <Card title="文章列表"
            bordered={true}
            extra={<Button type="primary" ghost onClick={this.showExcelModal}>导出Excel</Button>}
          >
            <Table
              rowKey={record => record.id}
              columns={this.state.columns}
              dataSource={this.state.dataSource}
              loading={this.state.isLoding}
              pagination={{
                current: this.state.offset / this.state.limited + 1,//当前页数
                total: parseInt(this.state.total),//总共有多少数据
                onChange: this.changePageContent,//当选择分页的时候，触发的事件
                hideOnSinglePage: true,//只有一页是否显示分布脚
                showQuickJumper: true,//快速跳转选择框
                showSizeChanger: true,//是否可以改变每页显示的条数
                onShowSizeChange: this.onShowSizeChange,//改变之后触发的事件
                destroyOnClose: true
              }}
            />
          </Card>
          {/* 模态框 */}
          <div>
            <Modal
              title="是否确认下载 "
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <p>确认下载？</p>
            </Modal>
          </div>
          <div>
            <Modal
              title="是否确认删除，从操作不可以逆"
              visible={this.state.deleteVisible}
              onOk={this.deleteHandleOk}
              confirmLoading={this.state.confirmLoading}
              onCancel={this.handleCancel}
              keyboard={true}
              maskClosable={false}
            >
              <span>
                是否删除题目为：<Tag color="magenta">{this.state.deleteArticleTitle}</Tag> 的文章
              </span>
            </Modal>
          </div>
        </div >
      </LocaleProvider>
    );
  }
}
