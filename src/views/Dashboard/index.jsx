import React, { Component, createRef } from 'react';
import { Card, Row, Col, Spin } from 'antd';
import { MainCard } from '../../component';
import echarts from 'echarts';
import { getStatisticsdata } from '../../server';
export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false
    };
    this.chartRef = createRef();
    this.chartAmountRef = createRef();
  }
  //线形图
  initCharts = () => {
    const myChart = echarts.init(this.chartRef.current);
    myChart.option = {
      backgroundColor: '#c35c5c',
      xAxis: {
        type: 'category',
        data: ['一月', '二月', '三月', '四月']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [6000, 10000, 12000, 20000],
        type: 'line'
      }]
    };
    myChart.setOption(myChart.option);
  }
  //饼状图
  initChartAmount = () => {
    this.setState({
      isLoading: true
    });
    getStatisticsdata()
      .then((data) => {
        if (!this.updater.isMounted(this)) return;
        const myChart = echarts.init(this.chartAmountRef.current);
        myChart.option = {
          backgroundColor: '#2c343c',//整个图的背景
          title: {
            text: '平台收入占比',
            left: 'center',
            top: 20,
            textStyle: {
              color: '#978'
            }
          },
          tooltip: {//放上去显示的提示文字
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',//图形的类型
              radius: '55%',
              center: ['50%', '50%'],
              data: data.sort(function (a, b) { return a.value - b.value; }),
              roseType: 'radius',
              label: {//显示文字
                normal: {
                  textStyle: {
                    color: 'rgba(15, 225, 255, 0.3)'
                  }
                }
              },
              labelLine: {
                normal: {
                  lineStyle: {
                    color: 'rgba(22, 255, 255, 0.3)'
                  },
                  smooth: 0.2,
                  length: 10,
                  length2: 20
                }
              },
              itemStyle: {//图形的属性
                normal: {
                  color: "#945",//
                  shadowBlur: 200,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              animationType: 'scale',//放上去的动画
              animationEasing: 'elasticOut',
              animationDelay: function (idx) {
                return Math.random() * 200;
              }
            }
          ]
        };
        myChart.setOption(myChart.option);
      })
      .finally(() => {
        if (!this.updater.isMounted(this)) return;
        this.setState({
          isLoading: false
        });
      });
  }
  componentDidMount() {
    this.initCharts();
    this.initChartAmount();
  }
  componentWillUnmount() {
    // this.chartAmountRef = null;
  }
  render() {
    return (
      <>
        <Card title={<h2>近况概览</h2 >} bordered={false}>
          <Row gutter={16}>
            <Col className="gutter-row"
              style={{ marginBottom: "30px", }}
              xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 6 }}>
              <MainCard
                title={"共有位新的作者加入"}
                amount={2500}
                offset={3}
                style={{ background: "linear-gradient(140deg, rgba(23, 8, 86, 0.5), rgba(23, 132, 219, 0.906))" }}
              />
            </Col >
            <Col className="gutter-row"
              style={{ marginBottom: "30px" }}
              xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 6 }}>
              <MainCard
                title={"共有篇新的文章发布"}
                amount={25000}
                offset={3}
                style={{ background: "linear-gradient(140deg, rgba(23, 8, 86, 0.5), rgba(54, 192, 219, 0.906))" }}

              />
            </Col>
            <Col className="gutter-row"
              style={{ marginBottom: "30px" }}
              xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 6 }}>
              <MainCard
                title={"共有的浏览量"}
                amount={30000}
                offset={3}
                style={{ background: "linear-gradient(140deg, rgba(213, 8, 86, 0.5), rgba(98, 145, 174, 0.906))" }}
              />
            </Col>
            <Col className="gutter-row"
              style={{ marginBottom: "30px" }}
              xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 6 }}>
              <MainCard
                title={"获得收益元"}
                amount={10000}
                offset={4}
                style={{ background: "linear-gradient(140deg, rgba(45, 8, 126, 0.5), rgba(123, 13, 219, 0.906))" }}
              />
            </Col>
          </Row>
        </Card>
        <Card title={<h2>近期浏览量</h2>} bordered={false}>
          <div ref={this.chartRef} style={{ height: "400px" }} />
        </Card>
        <Card title={<h2>平台收入占比</h2>} bordered={false}>
          <Spin spinning={this.state.isLoading}>
            <div ref={this.chartAmountRef} style={{ height: "400px" }} />
          </Spin >

        </Card>
      </>
    );
  }
}
