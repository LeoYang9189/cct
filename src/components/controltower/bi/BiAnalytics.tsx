import React, { useState, useEffect } from 'react';
import { Card, Grid, Statistic, DatePicker, Select, Table } from '@arco-design/web-react';
import { IconDashboard, IconApps, IconFile } from '@arco-design/web-react/icon';
import * as echarts from 'echarts';

const { Row, Col } = Grid;
const { RangePicker } = DatePicker;

const BiAnalytics: React.FC = () => {
  // 每个图表独立的筛选状态
  const [uvpvPage, setUvpvPage] = useState('all');
  const [uvpvDateRange, setUvpvDateRange] = useState<string[]>([]);

  const [stayTimePage, setStayTimePage] = useState('all');
  const [stayTimeDateRange, setStayTimeDateRange] = useState<string[]>([]);

  const [bounceRatePage, setBounceRatePage] = useState('all');
  const [bounceRateDateRange, setBounceRateDateRange] = useState<string[]>([]);

  // 用户统计图表状态
  const [registeredUsersDateRange, setRegisteredUsersDateRange] = useState<string[]>([]);
  const [registeredUsersType, setRegisteredUsersType] = useState('all');
  const [activeUsersDateRange, setActiveUsersDateRange] = useState<string[]>([]);
  const [certifiedCompaniesDateRange, setCertifiedCompaniesDateRange] = useState<string[]>([]);
  const [certifiedCompaniesStatus, setCertifiedCompaniesStatus] = useState('all');

  // 港口热度和失败排行图表状态
  const [portHeatDateRange, setPortHeatDateRange] = useState<string[]>([]);
  const [failureRankingDateRange, setFailureRankingDateRange] = useState<string[]>([]);

  // 询价单量统计图表状态
  const [inquiryCountDateRange, setInquiryCountDateRange] = useState<string[]>([]);
  const [inquiryCountSource, setInquiryCountSource] = useState('all');
  const [inquiryCountOriginPort, setInquiryCountOriginPort] = useState('all');
  const [inquiryCountDestPort, setInquiryCountDestPort] = useState('all');
  const [inquiryCountDataScope, setInquiryCountDataScope] = useState('group');

  const [inquiryPortRankingDateRange, setInquiryPortRankingDateRange] = useState<string[]>([]);
  const [inquiryPortRankingDataScope, setInquiryPortRankingDataScope] = useState('group');

  const [inquiryCustomerRankingDateRange, setInquiryCustomerRankingDateRange] = useState<string[]>([]);
  const [inquiryCustomerRankingDataScope, setInquiryCustomerRankingDataScope] = useState('group');

  // 报价单量统计图表状态
  const [quoteCountDateRange, setQuoteCountDateRange] = useState<string[]>([]);
  const [quoteCountSource, setQuoteCountSource] = useState('all');
  const [quoteCountOriginPort, setQuoteCountOriginPort] = useState('all');
  const [quoteCountDestPort, setQuoteCountDestPort] = useState('all');
  const [quoteCountDataScope, setQuoteCountDataScope] = useState('group');

  const [quotePortRankingDateRange, setQuotePortRankingDateRange] = useState<string[]>([]);
  const [quotePortRankingDataScope, setQuotePortRankingDataScope] = useState('group');

  const [quoterRankingDateRange, setQuoterRankingDateRange] = useState<string[]>([]);
  const [quoterRankingDataScope, setQuoterRankingDataScope] = useState('group');

  // 报价时效统计图表状态
  const [quoteTimelinessDateRange, setQuoteTimelinessDateRange] = useState<string[]>([]);
  const [quoteTimelinessQuoter, setQuoteTimelinessQuoter] = useState('all');
  const [quoteTimelinessDataScope, setQuoteTimelinessDataScope] = useState('group');

  const [quoteEfficiencyDateRange, setQuoteEfficiencyDateRange] = useState<string[]>([]);
  const [quoteEfficiencyDataScope, setQuoteEfficiencyDataScope] = useState('group');

  const [overtimeQuotesTimeout, setOvertimeQuotesTimeout] = useState('2');
  const [overtimeQuotesDataScope, setOvertimeQuotesDataScope] = useState('group');

  const [avgQuoteCountDateRange, setAvgQuoteCountDateRange] = useState<string[]>([]);
  const [avgQuoteCountDataScope, setAvgQuoteCountDataScope] = useState('group');

  // 运价维护统计图表状态
  const [rateMaintenanceCountDateRange, setRateMaintenanceCountDateRange] = useState<string[]>([]);
  const [rateMaintenanceCountCarrier, setRateMaintenanceCountCarrier] = useState('all');
  const [rateMaintenanceCountOriginPort, setRateMaintenanceCountOriginPort] = useState('all');
  const [rateMaintenanceCountDestPort, setRateMaintenanceCountDestPort] = useState('all');
  const [rateMaintenanceCountCreator, setRateMaintenanceCountCreator] = useState('all');
  const [rateMaintenanceCountDataScope, setRateMaintenanceCountDataScope] = useState('group');

  const [rateStatusDateRange, setRateStatusDateRange] = useState<string[]>([]);
  const [rateStatusDataScope, setRateStatusDataScope] = useState('group');

  // 运价平均趋势统计图表状态
  const [rateAvgTrendDateRange, setRateAvgTrendDateRange] = useState<string[]>([]);
  const [rateAvgTrendCarrier, setRateAvgTrendCarrier] = useState('all');
  const [rateAvgTrendOriginPort, setRateAvgTrendOriginPort] = useState('all');
  const [rateAvgTrendDestPort, setRateAvgTrendDestPort] = useState('all');
  const [rateAvgTrendDataScope, setRateAvgTrendDataScope] = useState('group');

  // 页面选项
  const pageOptions = [
    { label: '全部页面', value: 'all' },
    { label: '首页', value: 'home' },
    { label: '业务介绍', value: 'business' },
    { label: '关于我们', value: 'about' },
    { label: '运价查询', value: 'rate-query' },
    { label: '船期查询', value: 'schedule-query' }
  ];

  // 用户性质选项
  const userTypeOptions = [
    { label: '全部', value: 'all' },
    { label: '个人', value: 'individual' },
    { label: '已加入企业', value: 'company' }
  ];

  // 企业认证状态选项
  const companyStatusOptions = [
    { label: '全部', value: 'all' },
    { label: '待审核', value: 'pending' },
    { label: '审核拒绝', value: 'rejected' },
    { label: '审核通过', value: 'approved' }
  ];

  // 询价来源选项
  const inquirySourceOptions = [
    { label: '全部', value: 'all' },
    { label: '内部', value: 'internal' },
    { label: '外部', value: 'external' }
  ];

  // 港口选项
  const portOptions = [
    { label: '全部', value: 'all' },
    { label: 'Shanghai', value: 'shanghai' },
    { label: 'Shenzhen', value: 'shenzhen' },
    { label: 'Ningbo', value: 'ningbo' },
    { label: 'Qingdao', value: 'qingdao' },
    { label: 'Tianjin', value: 'tianjin' },
    { label: 'Guangzhou', value: 'guangzhou' },
    { label: 'Bangkok', value: 'bangkok' },
    { label: 'Singapore', value: 'singapore' },
    { label: 'Los Angeles', value: 'los-angeles' },
    { label: 'Hamburg', value: 'hamburg' },
    { label: 'Rotterdam', value: 'rotterdam' },
    { label: 'Dubai', value: 'dubai' }
  ];

  // 数据范围选项
  const dataScopeOptions = [
    { label: '本集团', value: 'group' },
    { label: '本分公司', value: 'company' },
    { label: '本部门', value: 'department' },
    { label: '本人', value: 'personal' }
  ];

  // 报价人选项
  const quoterOptions = [
    { label: '全部报价人', value: 'all' },
    { label: '张伟', value: 'zhangwei' },
    { label: '李娜', value: 'lina' },
    { label: '王强', value: 'wangqiang' },
    { label: '刘敏', value: 'liumin' },
    { label: '陈杰', value: 'chenjie' },
    { label: '杨静', value: 'yangjing' },
    { label: '赵磊', value: 'zhaolei' },
    { label: '孙丽', value: 'sunli' }
  ];

  // 超时时间选项
  const timeoutOptions = [
    { label: '2小时', value: '2' },
    { label: '6小时', value: '6' },
    { label: '12小时', value: '12' },
    { label: '24小时', value: '24' },
    { label: '48小时', value: '48' }
  ];

  // 船公司选项
  const carrierOptions = [
    { label: '全部船公司', value: 'all' },
    { label: 'COSCO', value: 'cosco' },
    { label: 'OOCL', value: 'oocl' },
    { label: 'CMA CGM', value: 'cma' },
    { label: 'MSC', value: 'msc' },
    { label: 'Maersk', value: 'maersk' },
    { label: 'Evergreen', value: 'evergreen' },
    { label: 'Yang Ming', value: 'yangming' },
    { label: 'Hapag-Lloyd', value: 'hapag' }
  ];

  // 运价创建人选项
  const rateCreatorOptions = [
    { label: '全部创建人', value: 'all' },
    { label: '张伟', value: 'zhangwei' },
    { label: '李娜', value: 'lina' },
    { label: '王强', value: 'wangqiang' },
    { label: '刘敏', value: 'liumin' },
    { label: '陈杰', value: 'chenjie' },
    { label: '杨静', value: 'yangjing' },
    { label: '赵磊', value: 'zhaolei' },
    { label: '孙丽', value: 'sunli' }
  ];

  // 模拟网站统计数据
  const getStatisticsData = (page: string) => {
    const baseData = {
      all: { uv: 15680, pv: 45230, avgStayTime: 185, bounceRate: 32.5 },
      home: { uv: 8920, pv: 18450, avgStayTime: 125, bounceRate: 28.3 },
      business: { uv: 2340, pv: 5680, avgStayTime: 245, bounceRate: 35.2 },
      about: { uv: 1560, pv: 3240, avgStayTime: 165, bounceRate: 42.1 },
      'rate-query': { uv: 4280, pv: 12850, avgStayTime: 320, bounceRate: 25.8 },
      'schedule-query': { uv: 3180, pv: 8960, avgStayTime: 280, bounceRate: 29.4 }
    };

    return baseData[page as keyof typeof baseData] || baseData.all;
  };

  // 获取综合数据用于概览卡片
  const overviewData = getStatisticsData('all');

  // 核心指标数据
  const statisticsCards = [
    {
      title: 'UV (独立访客)',
      value: overviewData.uv,
      prefix: '',
      suffix: '',
      growth: 12.5,
      description: '统计期间内的独立访客数量'
    },
    {
      title: 'PV (页面浏览量)',
      value: overviewData.pv,
      prefix: '',
      suffix: '',
      growth: 8.3,
      description: '统计期间内的页面浏览总数'
    },
    {
      title: '平均停留时长',
      value: overviewData.avgStayTime,
      prefix: '',
      suffix: '秒',
      growth: 15.2,
      description: '用户在页面的平均停留时间'
    },
    {
      title: '跳出率',
      value: overviewData.bounceRate,
      prefix: '',
      suffix: '%',
      growth: -2.1,
      description: '用户访问单个页面后离开的比例'
    }
  ];

  // 生成模拟的时间序列数据
  const generateTimeSeriesData = (days: number = 30) => {
    const data = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      const baseUV = Math.floor(Math.random() * 500) + 200;
      const basePV = baseUV * (Math.random() * 2 + 1.5);
      const avgStayTime = Math.floor(Math.random() * 200) + 100;
      const bounceRate = Math.random() * 30 + 20;

      data.push({
        date: date.toISOString().split('T')[0],
        uv: baseUV,
        pv: Math.floor(basePV),
        avgStayTime: avgStayTime,
        bounceRate: parseFloat(bounceRate.toFixed(1))
      });
    }

    return data;
  };

  const timeSeriesData = generateTimeSeriesData();

  // 初始化图表
  useEffect(() => {
    initUVPVChart();
    initStayTimeChart();
    initBounceRateChart();
    initRegisteredUsersChart();
    initActiveUsersChart();
    initCertifiedCompaniesChart();
    initPortHeatChart();
    initFailureRankingChart();
    initInquiryCountChart();
    initInquiryPortRankingChart();
    initInquiryCustomerRankingChart();
    initQuoteCountChart();
    initQuotePortRankingChart();
    initQuoterRankingChart();
    initQuoteTimelinessChart();
    initQuoteEfficiencyChart();
    initOvertimeQuotesTable();
    initAvgQuoteCountChart();
    initRateMaintenanceCountChart();
    initRateStatusChart();
    initRateAvgTrendChart();
  }, [uvpvPage, uvpvDateRange, stayTimePage, stayTimeDateRange, bounceRatePage, bounceRateDateRange, registeredUsersDateRange, registeredUsersType, activeUsersDateRange, certifiedCompaniesDateRange, certifiedCompaniesStatus, portHeatDateRange, failureRankingDateRange, inquiryCountDateRange, inquiryCountSource, inquiryCountOriginPort, inquiryCountDestPort, inquiryCountDataScope, inquiryPortRankingDateRange, inquiryPortRankingDataScope, inquiryCustomerRankingDateRange, inquiryCustomerRankingDataScope, quoteCountDateRange, quoteCountSource, quoteCountOriginPort, quoteCountDestPort, quoteCountDataScope, quotePortRankingDateRange, quotePortRankingDataScope, quoterRankingDateRange, quoterRankingDataScope, quoteTimelinessDateRange, quoteTimelinessQuoter, quoteTimelinessDataScope, quoteEfficiencyDateRange, quoteEfficiencyDataScope, overtimeQuotesTimeout, overtimeQuotesDataScope, avgQuoteCountDateRange, avgQuoteCountDataScope, rateMaintenanceCountDateRange, rateMaintenanceCountCarrier, rateMaintenanceCountOriginPort, rateMaintenanceCountDestPort, rateMaintenanceCountCreator, rateMaintenanceCountDataScope, rateStatusDateRange, rateStatusDataScope, rateAvgTrendDateRange, rateAvgTrendCarrier, rateAvgTrendOriginPort, rateAvgTrendDestPort, rateAvgTrendDataScope]);

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? '#00B42A' : '#F53F3F';
  };

  // UV/PV趋势图
  const initUVPVChart = () => {
    const chartDom = document.getElementById('uv-pv-chart');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);
    const option = {
      title: {
        text: 'UV/PV趋势分析',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' }
      },
      legend: {
        data: ['UV (独立访客)', 'PV (页面浏览量)'],
        top: 30
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: timeSeriesData.map(item => item.date),
        axisLabel: {
          formatter: (value: string) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }
        }
      },
      yAxis: [
        {
          type: 'value',
          name: 'UV',
          position: 'left',
          axisLabel: { formatter: '{value}' }
        },
        {
          type: 'value',
          name: 'PV',
          position: 'right',
          axisLabel: { formatter: '{value}' }
        }
      ],
      series: [
        {
          name: 'UV (独立访客)',
          type: 'line',
          yAxisIndex: 0,
          data: timeSeriesData.map(item => item.uv),
          smooth: true,
          lineStyle: { color: '#1890ff' },
          itemStyle: { color: '#1890ff' }
        },
        {
          name: 'PV (页面浏览量)',
          type: 'line',
          yAxisIndex: 1,
          data: timeSeriesData.map(item => item.pv),
          smooth: true,
          lineStyle: { color: '#52c41a' },
          itemStyle: { color: '#52c41a' }
        }
      ]
    };

    myChart.setOption(option);

    // 响应式处理
    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  // 页面停留时长图
  const initStayTimeChart = () => {
    const chartDom = document.getElementById('stay-time-chart');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);
    const option = {
      title: {
        text: '页面停留时长趋势',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>${data.seriesName}: ${data.value}秒`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: timeSeriesData.map(item => item.date),
        axisLabel: {
          formatter: (value: string) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '停留时长(秒)',
        axisLabel: { formatter: '{value}s' }
      },
      series: [
        {
          name: '平均停留时长',
          type: 'bar',
          data: timeSeriesData.map(item => item.avgStayTime),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#ffd666' },
              { offset: 1, color: '#fa8c16' }
            ])
          }
        }
      ]
    };

    myChart.setOption(option);

    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  // 跳出率图表
  const initBounceRateChart = () => {
    const chartDom = document.getElementById('bounce-rate-chart');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);
    const option = {
      title: {
        text: '页面跳出率趋势',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>${data.seriesName}: ${data.value}%`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: timeSeriesData.map(item => item.date),
        axisLabel: {
          formatter: (value: string) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '跳出率(%)',
        min: 0,
        max: 100,
        axisLabel: { formatter: '{value}%' }
      },
      series: [
        {
          name: '跳出率',
          type: 'line',
          data: timeSeriesData.map(item => item.bounceRate),
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(255, 77, 79, 0.3)' },
              { offset: 1, color: 'rgba(255, 77, 79, 0.1)' }
            ])
          },
          lineStyle: { color: '#ff4d4f' },
          itemStyle: { color: '#ff4d4f' }
        }
      ]
    };

    myChart.setOption(option);

    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  // 注册用户数图表
  const initRegisteredUsersChart = () => {
    const chartDom = document.getElementById('registered-users-chart');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    // 根据用户性质生成不同的数据
    const generateUserData = () => {
      if (registeredUsersType === 'individual') {
        return timeSeriesData.map(() => Math.floor(Math.random() * 30) + 5);
      } else if (registeredUsersType === 'company') {
        return timeSeriesData.map(() => Math.floor(Math.random() * 20) + 3);
      } else {
        return timeSeriesData.map(() => Math.floor(Math.random() * 50) + 10);
      }
    };

    const getSeriesName = () => {
      if (registeredUsersType === 'individual') {
        return '新增个人用户';
      } else if (registeredUsersType === 'company') {
        return '新增企业用户';
      } else {
        return '新增注册用户';
      }
    };

    const option = {
      title: {
        text: '注册用户数趋势',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>${data.seriesName}: ${data.value}人`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: timeSeriesData.map(item => item.date),
        axisLabel: {
          formatter: (value: string) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '注册用户数',
        axisLabel: { formatter: '{value}人' }
      },
      series: [
        {
          name: getSeriesName(),
          type: 'bar',
          data: generateUserData(),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#87d068' },
              { offset: 1, color: '#52c41a' }
            ])
          }
        }
      ]
    };

    myChart.setOption(option);

    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  // 活跃用户数图表
  const initActiveUsersChart = () => {
    const chartDom = document.getElementById('active-users-chart');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);
    const option = {
      title: {
        text: '活跃用户数趋势',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>${data.seriesName}: ${data.value}人`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: timeSeriesData.map(item => item.date),
        axisLabel: {
          formatter: (value: string) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '活跃用户数',
        axisLabel: { formatter: '{value}人' }
      },
      series: [
        {
          name: '日活跃用户',
          type: 'line',
          data: timeSeriesData.map(() => Math.floor(Math.random() * 200) + 50),
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.1)' }
            ])
          },
          lineStyle: { color: '#1890ff' },
          itemStyle: { color: '#1890ff' }
        }
      ]
    };

    myChart.setOption(option);

    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  // 认证企业数图表
  const initCertifiedCompaniesChart = () => {
    const chartDom = document.getElementById('certified-companies-chart');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    // 根据认证状态生成不同的数据
    const generateCompanyData = () => {
      if (certifiedCompaniesStatus === 'pending') {
        return timeSeriesData.map(() => Math.floor(Math.random() * 8) + 2);
      } else if (certifiedCompaniesStatus === 'rejected') {
        return timeSeriesData.map(() => Math.floor(Math.random() * 3) + 1);
      } else if (certifiedCompaniesStatus === 'approved') {
        return timeSeriesData.map(() => Math.floor(Math.random() * 6) + 1);
      } else {
        return timeSeriesData.map(() => Math.floor(Math.random() * 10) + 1);
      }
    };

    const getSeriesName = () => {
      if (certifiedCompaniesStatus === 'pending') {
        return '待审核企业';
      } else if (certifiedCompaniesStatus === 'rejected') {
        return '审核拒绝企业';
      } else if (certifiedCompaniesStatus === 'approved') {
        return '审核通过企业';
      } else {
        return '认证企业总数';
      }
    };

    const getColor = () => {
      if (certifiedCompaniesStatus === 'pending') {
        return [{ offset: 0, color: '#fadb14' }, { offset: 1, color: '#d48806' }];
      } else if (certifiedCompaniesStatus === 'rejected') {
        return [{ offset: 0, color: '#ff7875' }, { offset: 1, color: '#f5222d' }];
      } else if (certifiedCompaniesStatus === 'approved') {
        return [{ offset: 0, color: '#95de64' }, { offset: 1, color: '#52c41a' }];
      } else {
        return [{ offset: 0, color: '#ffd666' }, { offset: 1, color: '#fa8c16' }];
      }
    };

    const option = {
      title: {
        text: '认证企业数趋势',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>${data.seriesName}: ${data.value}家`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: timeSeriesData.map(item => item.date),
        axisLabel: {
          formatter: (value: string) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '认证企业数',
        axisLabel: { formatter: '{value}家' }
      },
      series: [
        {
          name: getSeriesName(),
          type: 'bar',
          data: generateCompanyData(),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, getColor())
          }
        }
      ]
    };

    myChart.setOption(option);

    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  // 港口热度排行图表
  const initPortHeatChart = () => {
    const chartDom = document.getElementById('port-heat-chart');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    // 生成TOP20港口组合数据
    const portCombinations = [
      'Shanghai -- Bangkok', 'Shenzhen -- Singapore', 'Ningbo -- Los Angeles',
      'Qingdao -- Hamburg', 'Tianjin -- Rotterdam', 'Guangzhou -- Dubai',
      'Shanghai -- Long Beach', 'Dalian -- Busan', 'Xiamen -- Manila',
      'Yantai -- Yokohama', 'Shanghai -- New York', 'Shenzhen -- Mumbai',
      'Ningbo -- Felixstowe', 'Qingdao -- Antwerp', 'Tianjin -- Valencia',
      'Guangzhou -- Jeddah', 'Shanghai -- Oakland', 'Dalian -- Kobe',
      'Xiamen -- Jakarta', 'Yantai -- Kaohsiung'
    ];

    const queryData = portCombinations.map((port) => ({
      name: port,
      value: Math.floor(Math.random() * 3000) + 1000 + Math.floor(Math.random() * 500)
    })).sort((a, b) => b.value - a.value);

    const option = {
      title: {
        text: '港口热度排行 TOP20',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>查询次数: ${data.value}次`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: '查询次数',
        axisLabel: { formatter: '{value}次' }
      },
      yAxis: {
        type: 'category',
        data: queryData.map(item => item.name).reverse(),
        axisLabel: {
          interval: 0,
          fontSize: 10
        }
      },
      series: [
        {
          name: '查询次数',
          type: 'bar',
          data: queryData.map(item => item.value).reverse(),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#1890ff' },
              { offset: 1, color: '#69c0ff' }
            ])
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}次',
            fontSize: 10
          }
        }
      ]
    };

    myChart.setOption(option);

    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  // 失败次数排行图表
  const initFailureRankingChart = () => {
    const chartDom = document.getElementById('failure-ranking-chart');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    // 生成TOP20失败港口组合数据
    const failurePortCombinations = [
      'Shanghai -- Bangkok', 'Shenzhen -- Singapore', 'Ningbo -- Los Angeles',
      'Qingdao -- Hamburg', 'Tianjin -- Rotterdam', 'Guangzhou -- Dubai',
      'Shanghai -- Long Beach', 'Dalian -- Busan', 'Xiamen -- Manila',
      'Yantai -- Yokohama', 'Shanghai -- New York', 'Shenzhen -- Mumbai',
      'Ningbo -- Felixstowe', 'Qingdao -- Antwerp', 'Tianjin -- Valencia',
      'Guangzhou -- Jeddah', 'Shanghai -- Oakland', 'Dalian -- Kobe',
      'Xiamen -- Jakarta', 'Yantai -- Kaohsiung'
    ];

    const failureData = failurePortCombinations.map((port) => ({
      name: port,
      value: Math.floor(Math.random() * 200) + 10 + Math.floor(Math.random() * 50)
    })).sort((a, b) => b.value - a.value);

    const option = {
      title: {
        text: '港口组合失败次数排行 TOP20',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>失败次数: ${data.value}次`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: '失败次数',
        axisLabel: { formatter: '{value}次' }
      },
      yAxis: {
        type: 'category',
        data: failureData.map(item => item.name).reverse(),
        axisLabel: {
          interval: 0,
          fontSize: 10
        }
      },
      series: [
        {
          name: '失败次数',
          type: 'bar',
          data: failureData.map(item => item.value).reverse(),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#ff4d4f' },
              { offset: 1, color: '#ff7875' }
            ])
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}次',
            fontSize: 10
          }
        }
      ]
    };

    myChart.setOption(option);

    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  // 询价数量统计图表
  const initInquiryCountChart = () => {
    const chartDom = document.getElementById('inquiry-count-chart');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    // 根据筛选条件生成不同的数据
    const generateInquiryData = () => {
      const baseMultiplier = inquiryCountDataScope === 'group' ? 1 :
                           inquiryCountDataScope === 'company' ? 0.6 :
                           inquiryCountDataScope === 'department' ? 0.3 : 0.1;

      return timeSeriesData.map(() => {
        const baseValue = Math.floor(Math.random() * 200) + 50;
        return Math.floor(baseValue * baseMultiplier);
      });
    };

    const getSeriesName = () => {
      const scopeMap = {
        group: '集团',
        company: '分公司',
        department: '部门',
        personal: '个人'
      };
      return `询价单量 (${scopeMap[inquiryCountDataScope as keyof typeof scopeMap]})`;
    };

    const option = {
      title: {
        text: '询价单量统计',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>${data.seriesName}: ${data.value}单`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: timeSeriesData.map(item => item.date),
        axisLabel: {
          formatter: (value: string) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '询价单量',
        axisLabel: { formatter: '{value}单' }
      },
      series: [
        {
          name: getSeriesName(),
          type: 'line',
          data: generateInquiryData(),
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
              { offset: 1, color: 'rgba(82, 196, 26, 0.1)' }
            ])
          },
          lineStyle: { color: '#52c41a' },
          itemStyle: { color: '#52c41a' }
        }
      ]
    };

    myChart.setOption(option);

    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  // 询价港口排名图表
  const initInquiryPortRankingChart = () => {
    const chartDom = document.getElementById('inquiry-port-ranking-chart');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    // 生成TOP20港口组合询价数据
    const portCombinations = [
      'Shanghai -- Bangkok', 'Shenzhen -- Singapore', 'Ningbo -- Los Angeles',
      'Qingdao -- Hamburg', 'Tianjin -- Rotterdam', 'Guangzhou -- Dubai',
      'Shanghai -- Long Beach', 'Dalian -- Busan', 'Xiamen -- Manila',
      'Yantai -- Yokohama', 'Shanghai -- New York', 'Shenzhen -- Mumbai',
      'Ningbo -- Felixstowe', 'Qingdao -- Antwerp', 'Tianjin -- Valencia',
      'Guangzhou -- Jeddah', 'Shanghai -- Oakland', 'Dalian -- Kobe',
      'Xiamen -- Jakarta', 'Yantai -- Kaohsiung'
    ];

    const baseMultiplier = inquiryPortRankingDataScope === 'group' ? 1 :
                          inquiryPortRankingDataScope === 'company' ? 0.6 :
                          inquiryPortRankingDataScope === 'department' ? 0.3 : 0.1;

    const inquiryData = portCombinations.map((port) => ({
      name: port,
      value: Math.floor((Math.random() * 800 + 200) * baseMultiplier)
    })).sort((a, b) => b.value - a.value);

    const option = {
      title: {
        text: '港口组合询价排名 TOP20',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>询价数量: ${data.value}单`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: '询价数量',
        axisLabel: { formatter: '{value}单' }
      },
      yAxis: {
        type: 'category',
        data: inquiryData.map(item => item.name).reverse(),
        axisLabel: {
          interval: 0,
          fontSize: 10
        }
      },
      series: [
        {
          name: '询价数量',
          type: 'bar',
          data: inquiryData.map(item => item.value).reverse(),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#52c41a' },
              { offset: 1, color: '#95de64' }
            ])
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}单',
            fontSize: 10
          }
        }
      ]
    };

    myChart.setOption(option);

    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  // 询价客户排名图表
  const initInquiryCustomerRankingChart = () => {
    const chartDom = document.getElementById('inquiry-customer-ranking-chart');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    // 生成TOP20客户询价数据
    const customers = [
      '中远海运集团', '招商局集团', '中国外运', '顺丰控股', '德邦物流',
      '圆通速递', '申通快递', '韵达股份', '百世集团', '京东物流',
      '菜鸟网络', '安能物流', '壹米滴答', '货拉拉', '满帮集团',
      '传化智联', '华贸物流', '飞马国际', '长久物流', '新宁物流'
    ];

    const baseMultiplier = inquiryCustomerRankingDataScope === 'group' ? 1 :
                          inquiryCustomerRankingDataScope === 'company' ? 0.6 :
                          inquiryCustomerRankingDataScope === 'department' ? 0.3 : 0.1;

    const customerData = customers.map((customer) => ({
      name: customer,
      value: Math.floor((Math.random() * 500 + 100) * baseMultiplier)
    })).sort((a, b) => b.value - a.value);

    const option = {
      title: {
        text: '客户询价排名 TOP20',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>询价数量: ${data.value}单`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: '询价数量',
        axisLabel: { formatter: '{value}单' }
      },
      yAxis: {
        type: 'category',
        data: customerData.map(item => item.name).reverse(),
        axisLabel: {
          interval: 0,
          fontSize: 10
        }
      },
      series: [
        {
          name: '询价数量',
          type: 'bar',
          data: customerData.map(item => item.value).reverse(),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#fa8c16' },
              { offset: 1, color: '#ffd666' }
            ])
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}单',
            fontSize: 10
          }
        }
      ]
    };

    myChart.setOption(option);

    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  // 报价数量统计图表
  const initQuoteCountChart = () => {
    const chartDom = document.getElementById('quote-count-chart');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    // 根据筛选条件生成不同的数据
    const generateQuoteData = () => {
      const baseMultiplier = quoteCountDataScope === 'group' ? 1 :
                           quoteCountDataScope === 'company' ? 0.6 :
                           quoteCountDataScope === 'department' ? 0.3 : 0.1;

      return timeSeriesData.map(() => {
        const baseValue = Math.floor(Math.random() * 150) + 30;
        return Math.floor(baseValue * baseMultiplier);
      });
    };

    const getSeriesName = () => {
      const scopeMap = {
        group: '集团',
        company: '分公司',
        department: '部门',
        personal: '个人'
      };
      return `报价单量 (${scopeMap[quoteCountDataScope as keyof typeof scopeMap]})`;
    };

    const option = {
      title: {
        text: '报价单量统计',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>${data.seriesName}: ${data.value}单`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: timeSeriesData.map(item => item.date),
        axisLabel: {
          formatter: (value: string) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '报价单量',
        axisLabel: { formatter: '{value}单' }
      },
      series: [
        {
          name: getSeriesName(),
          type: 'line',
          data: generateQuoteData(),
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.1)' }
            ])
          },
          lineStyle: { color: '#1890ff' },
          itemStyle: { color: '#1890ff' }
        }
      ]
    };

    myChart.setOption(option);

    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  // 报价港口排名图表
  const initQuotePortRankingChart = () => {
    const chartDom = document.getElementById('quote-port-ranking-chart');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    // 生成TOP20港口组合报价数据
    const portCombinations = [
      'Shanghai -- Bangkok', 'Shenzhen -- Singapore', 'Ningbo -- Los Angeles',
      'Qingdao -- Hamburg', 'Tianjin -- Rotterdam', 'Guangzhou -- Dubai',
      'Shanghai -- Long Beach', 'Dalian -- Busan', 'Xiamen -- Manila',
      'Yantai -- Yokohama', 'Shanghai -- New York', 'Shenzhen -- Mumbai',
      'Ningbo -- Felixstowe', 'Qingdao -- Antwerp', 'Tianjin -- Valencia',
      'Guangzhou -- Jeddah', 'Shanghai -- Oakland', 'Dalian -- Kobe',
      'Xiamen -- Jakarta', 'Yantai -- Kaohsiung'
    ];

    const baseMultiplier = quotePortRankingDataScope === 'group' ? 1 :
                          quotePortRankingDataScope === 'company' ? 0.6 :
                          quotePortRankingDataScope === 'department' ? 0.3 : 0.1;

    const quoteData = portCombinations.map((port) => ({
      name: port,
      value: Math.floor((Math.random() * 600 + 150) * baseMultiplier)
    })).sort((a, b) => b.value - a.value);

    const option = {
      title: {
        text: '港口组合报价排名 TOP20',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>报价数量: ${data.value}单`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: '报价数量',
        axisLabel: { formatter: '{value}单' }
      },
      yAxis: {
        type: 'category',
        data: quoteData.map(item => item.name).reverse(),
        axisLabel: {
          interval: 0,
          fontSize: 10
        }
      },
      series: [
        {
          name: '报价数量',
          type: 'bar',
          data: quoteData.map(item => item.value).reverse(),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#1890ff' },
              { offset: 1, color: '#69c0ff' }
            ])
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}单',
            fontSize: 10
          }
        }
      ]
    };

    myChart.setOption(option);

    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  // 报价人排名图表
  const initQuoterRankingChart = () => {
    const chartDom = document.getElementById('quoter-ranking-chart');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    // 生成TOP20报价人数据
    const quoters = [
      '张伟', '李娜', '王强', '刘敏', '陈杰', '杨静', '赵磊', '孙丽',
      '周勇', '吴艳', '郑波', '王芳', '李军', '张敏', '刘伟', '陈静',
      '杨勇', '赵丽', '孙强', '周敏'
    ];

    const baseMultiplier = quoterRankingDataScope === 'group' ? 1 :
                          quoterRankingDataScope === 'company' ? 0.6 :
                          quoterRankingDataScope === 'department' ? 0.3 : 0.1;

    const quoterData = quoters.map((quoter) => ({
      name: quoter,
      value: Math.floor((Math.random() * 300 + 50) * baseMultiplier)
    })).sort((a, b) => b.value - a.value);

    const option = {
      title: {
        text: '报价人排名 TOP20',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>报价数量: ${data.value}单`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: '报价数量',
        axisLabel: { formatter: '{value}单' }
      },
      yAxis: {
        type: 'category',
        data: quoterData.map(item => item.name).reverse(),
        axisLabel: {
          interval: 0,
          fontSize: 10
        }
      },
      series: [
        {
          name: '报价数量',
          type: 'bar',
          data: quoterData.map(item => item.value).reverse(),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#722ed1' },
              { offset: 1, color: '#b37feb' }
            ])
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}单',
            fontSize: 10
          }
        }
      ]
    };

    myChart.setOption(option);

    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  // 报价时效统计图表
  const initQuoteTimelinessChart = () => {
    const chartDom = document.getElementById('quote-timeliness-chart');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    // 根据筛选条件生成不同的数据
    const generateTimelinessData = () => {
      const baseMultiplier = quoteTimelinessDataScope === 'group' ? 1 :
                           quoteTimelinessDataScope === 'company' ? 0.6 :
                           quoteTimelinessDataScope === 'department' ? 0.3 : 0.1;

      return timeSeriesData.map(() => {
        // 生成报价时效数据（小时）
        const avgTime = Math.random() * 12 + 2; // 2-14小时
        return parseFloat((avgTime * baseMultiplier).toFixed(1));
      });
    };

    const getSeriesName = () => {
      const scopeMap = {
        group: '集团',
        company: '分公司',
        department: '部门',
        personal: '个人'
      };
      return `平均报价时效 (${scopeMap[quoteTimelinessDataScope as keyof typeof scopeMap]})`;
    };

    const option = {
      title: {
        text: '报价时效统计',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>${data.seriesName}: ${data.value}小时`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: timeSeriesData.map(item => item.date),
        axisLabel: {
          formatter: (value: string) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '报价时效(小时)',
        axisLabel: { formatter: '{value}h' }
      },
      series: [
        {
          name: getSeriesName(),
          type: 'line',
          data: generateTimelinessData(),
          smooth: true,
          lineStyle: { color: '#fa8c16' },
          itemStyle: { color: '#fa8c16' },
          markLine: {
            data: [
              { yAxis: 24, name: '24小时基准线', lineStyle: { color: '#ff4d4f', type: 'dashed' } }
            ]
          }
        }
      ]
    };

    myChart.setOption(option);

    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  // 报价效率排名图表
  const initQuoteEfficiencyChart = () => {
    const chartDom = document.getElementById('quote-efficiency-chart');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    // 生成TOP20报价人效率数据
    const quoters = [
      '张伟', '李娜', '王强', '刘敏', '陈杰', '杨静', '赵磊', '孙丽',
      '周勇', '吴艳', '郑波', '王芳', '李军', '张敏', '刘伟', '陈静',
      '杨勇', '赵丽', '孙强', '周敏'
    ];

    const baseMultiplier = quoteEfficiencyDataScope === 'group' ? 1 :
                          quoteEfficiencyDataScope === 'company' ? 0.6 :
                          quoteEfficiencyDataScope === 'department' ? 0.3 : 0.1;

    const efficiencyData = quoters.map((quoter) => ({
      name: quoter,
      value: parseFloat(((Math.random() * 8 + 2) * baseMultiplier).toFixed(1)) // 2-10小时
    })).sort((a, b) => a.value - b.value); // 按时效从低到高排序（效率从高到低）

    const option = {
      title: {
        text: '报价效率排名 TOP20',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>平均报价时效: ${data.value}小时`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: '平均时效(小时)',
        axisLabel: { formatter: '{value}h' }
      },
      yAxis: {
        type: 'category',
        data: efficiencyData.map(item => item.name).reverse(),
        axisLabel: {
          interval: 0,
          fontSize: 10
        }
      },
      series: [
        {
          name: '平均报价时效',
          type: 'bar',
          data: efficiencyData.map(item => item.value).reverse(),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#52c41a' },
              { offset: 0.5, color: '#fadb14' },
              { offset: 1, color: '#ff4d4f' }
            ])
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}h',
            fontSize: 10
          }
        }
      ]
    };

    myChart.setOption(option);

    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  // 超时未报价列表
  const initOvertimeQuotesTable = () => {
    // 这个函数主要用于触发重新渲染，实际的表格数据在JSX中生成
  };

  // 生成超时未报价数据
  const generateOvertimeQuotesData = () => {
    const baseMultiplier = overtimeQuotesDataScope === 'group' ? 1 :
                          overtimeQuotesDataScope === 'company' ? 0.6 :
                          overtimeQuotesDataScope === 'department' ? 0.3 : 0.1;

    const timeoutHours = parseInt(overtimeQuotesTimeout);
    const sampleData = [];

    for (let i = 0; i < Math.floor(20 * baseMultiplier); i++) {
      const inquiryId = `INQ${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
      const customer = ['中远海运', '招商局', '中国外运', '顺丰控股', '德邦物流'][Math.floor(Math.random() * 5)];
      const route = ['Shanghai -- Bangkok', 'Shenzhen -- Singapore', 'Ningbo -- Los Angeles'][Math.floor(Math.random() * 3)];
      const submittedTime = new Date(Date.now() - (timeoutHours + Math.random() * 24) * 60 * 60 * 1000);
      const overtimeHours = Math.floor((Date.now() - submittedTime.getTime()) / (1000 * 60 * 60));

      sampleData.push({
        inquiryId,
        customer,
        route,
        submittedTime: submittedTime.toLocaleString(),
        overtimeHours
      });
    }

    return sampleData.sort((a, b) => b.overtimeHours - a.overtimeHours);
  };

  // 人均报价数量统计图表
  const initAvgQuoteCountChart = () => {
    const chartDom = document.getElementById('avg-quote-count-chart');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    // 生成人均报价数据
    const quoters = [
      '张伟', '李娜', '王强', '刘敏', '陈杰', '杨静', '赵磊', '孙丽',
      '周勇', '吴艳', '郑波', '王芳', '李军', '张敏', '刘伟', '陈静',
      '杨勇', '赵丽', '孙强', '周敏'
    ];

    const baseMultiplier = avgQuoteCountDataScope === 'group' ? 1 :
                          avgQuoteCountDataScope === 'company' ? 0.6 :
                          avgQuoteCountDataScope === 'department' ? 0.3 : 0.1;

    const avgQuoteData = quoters.map((quoter) => ({
      name: quoter,
      value: Math.floor((Math.random() * 50 + 10) * baseMultiplier)
    })).sort((a, b) => b.value - a.value);

    const option = {
      title: {
        text: '人均报价数量统计',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>报价数量: ${data.value}单`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: '报价数量',
        axisLabel: { formatter: '{value}单' }
      },
      yAxis: {
        type: 'category',
        data: avgQuoteData.map(item => item.name).reverse(),
        axisLabel: {
          interval: 0,
          fontSize: 10
        }
      },
      series: [
        {
          name: '报价数量',
          type: 'bar',
          data: avgQuoteData.map(item => item.value).reverse(),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#13c2c2' },
              { offset: 1, color: '#87e8de' }
            ])
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}单',
            fontSize: 10
          }
        }
      ]
    };

    myChart.setOption(option);

    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  // 运价维护数量统计图表
  const initRateMaintenanceCountChart = () => {
    const chartDom = document.getElementById('rate-maintenance-count-chart');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    // 根据筛选条件生成不同的数据
    const generateRateData = () => {
      const baseMultiplier = rateMaintenanceCountDataScope === 'group' ? 1 :
                           rateMaintenanceCountDataScope === 'company' ? 0.6 :
                           rateMaintenanceCountDataScope === 'department' ? 0.3 : 0.1;

      return timeSeriesData.map(() => {
        const baseValue = Math.floor(Math.random() * 100) + 20;
        return Math.floor(baseValue * baseMultiplier);
      });
    };

    const getSeriesName = () => {
      const scopeMap = {
        group: '集团',
        company: '分公司',
        department: '部门',
        personal: '个人'
      };
      return `运价维护数量 (${scopeMap[rateMaintenanceCountDataScope as keyof typeof scopeMap]})`;
    };

    const option = {
      title: {
        text: '运价维护数量统计',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>${data.seriesName}: ${data.value}条`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: timeSeriesData.map(item => item.date),
        axisLabel: {
          formatter: (value: string) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '运价数量',
        axisLabel: { formatter: '{value}条' }
      },
      series: [
        {
          name: getSeriesName(),
          type: 'bar',
          data: generateRateData(),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#722ed1' },
              { offset: 1, color: '#b37feb' }
            ])
          }
        }
      ]
    };

    myChart.setOption(option);

    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  // 运价状态分布图表
  const initRateStatusChart = () => {
    const chartDom = document.getElementById('rate-status-chart');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    const baseMultiplier = rateStatusDataScope === 'group' ? 1 :
                          rateStatusDataScope === 'company' ? 0.6 :
                          rateStatusDataScope === 'department' ? 0.3 : 0.1;

    const statusData = [
      { name: '正常', value: Math.floor(450 * baseMultiplier), color: '#52c41a' },
      { name: '已过期', value: Math.floor(180 * baseMultiplier), color: '#ff4d4f' },
      { name: '草稿', value: Math.floor(120 * baseMultiplier), color: '#d9d9d9' }
    ];

    const option = {
      title: {
        text: '运价状态分布',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: statusData.map(item => item.name)
      },
      series: [
        {
          name: '运价状态',
          type: 'pie',
          radius: '50%',
          data: statusData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            formatter: '{b}: {c}条\n({d}%)'
          }
        }
      ]
    };

    myChart.setOption(option);

    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  // 运价平均趋势统计图表
  const initRateAvgTrendChart = () => {
    const chartDom = document.getElementById('rate-avg-trend-chart');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    // 根据筛选条件生成不同的运价数据
    const generateRateAvgData = () => {
      const baseMultiplier = rateAvgTrendDataScope === 'group' ? 1 :
                           rateAvgTrendDataScope === 'company' ? 0.8 :
                           rateAvgTrendDataScope === 'department' ? 0.6 : 0.4;

      // 根据港口组合调整基础价格
      let basePrice = 1500; // 默认基础价格 USD
      if (rateAvgTrendOriginPort !== 'all' && rateAvgTrendDestPort !== 'all') {
        // 如果选择了具体港口，根据距离调整价格
        basePrice = Math.random() * 1000 + 1000; // 1000-2000 USD
      }

      // 根据船公司调整价格
      const carrierMultiplier = rateAvgTrendCarrier === 'maersk' ? 1.2 :
                               rateAvgTrendCarrier === 'msc' ? 1.1 :
                               rateAvgTrendCarrier === 'cosco' ? 0.9 : 1.0;

      return timeSeriesData.map(() => {
        const fluctuation = (Math.random() - 0.5) * 200; // ±100 USD波动
        const price = (basePrice + fluctuation) * baseMultiplier * carrierMultiplier;
        return Math.round(price);
      });
    };

    const getSeriesName = () => {
      const scopeMap = {
        group: '集团',
        company: '分公司',
        department: '部门',
        personal: '个人'
      };

      let name = `平均运价 (${scopeMap[rateAvgTrendDataScope as keyof typeof scopeMap]})`;

      if (rateAvgTrendCarrier !== 'all') {
        const carrierName = carrierOptions.find(opt => opt.value === rateAvgTrendCarrier)?.label || '';
        name += ` - ${carrierName}`;
      }

      if (rateAvgTrendOriginPort !== 'all' && rateAvgTrendDestPort !== 'all') {
        const originName = portOptions.find(opt => opt.value === rateAvgTrendOriginPort)?.label || '';
        const destName = portOptions.find(opt => opt.value === rateAvgTrendDestPort)?.label || '';
        name += ` - ${originName} to ${destName}`;
      }

      return name;
    };

    const option = {
      title: {
        text: '运价平均趋势统计',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>${data.seriesName}: $${data.value}`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: timeSeriesData.map(item => item.date),
        axisLabel: {
          formatter: (value: string) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '运价 (USD)',
        axisLabel: { formatter: '${value}' }
      },
      series: [
        {
          name: getSeriesName(),
          type: 'line',
          data: generateRateAvgData(),
          smooth: true,
          lineStyle: {
            color: '#722ed1',
            width: 3
          },
          itemStyle: { color: '#722ed1' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(114, 46, 209, 0.3)' },
              { offset: 1, color: 'rgba(114, 46, 209, 0.1)' }
            ])
          },
          markLine: {
            data: [
              {
                type: 'average',
                name: '平均值',
                lineStyle: { color: '#fa8c16', type: 'dashed' }
              }
            ]
          }
        }
      ]
    };

    myChart.setOption(option);

    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };





  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 核心指标概览 */}
      <Row gutter={16} className="mb-6">
        {statisticsCards.map((item, index) => (
          <Col span={6} key={index}>
            <Card>
              <Statistic
                title={item.title}
                value={item.value}
                prefix={item.prefix}
                suffix={item.suffix}
                precision={item.prefix === '¥' ? 0 : undefined}
                extra={
                  <div className="flex items-center">
                    <span
                      className="text-sm"
                      style={{ color: getGrowthColor(item.growth) }}
                    >
                      {item.growth > 0 ? '+' : ''}{item.growth}%
                    </span>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 图表展示区域 */}
      <Row gutter={16}>
        {/* UV/PV趋势图 */}
        <Col span={24} className="mb-4">
          <Card
            title={
              <div className="flex items-center">
                <span className="mr-2 text-blue-600">
                  <IconDashboard />
                </span>
                <span>UV/PV趋势分析</span>
              </div>
            }
          >
            {/* UV/PV图表筛选条件 */}
            <div className="mb-4">
              <Row gutter={8} align="center">
                <Col span={12}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">时间:</span>
                    <RangePicker
                      size="small"
                      onChange={(dateString) => setUvpvDateRange(dateString)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">页面:</span>
                    <Select
                      size="small"
                      value={uvpvPage}
                      onChange={setUvpvPage}
                      style={{ width: '100%' }}
                    >
                      {pageOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
              </Row>
            </div>
            <div id="uv-pv-chart" style={{ width: '100%', height: '400px' }}></div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 页面停留时长图 */}
        <Col span={24} className="mb-4">
          <Card
            title={
              <div className="flex items-center">
                <span className="mr-2 text-orange-600">
                  <IconApps />
                </span>
                <span>页面停留时长趋势</span>
              </div>
            }
          >
            {/* 停留时长图表筛选条件 */}
            <div className="mb-4">
              <Row gutter={8} align="center">
                <Col span={12}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">时间:</span>
                    <RangePicker
                      size="small"
                      onChange={(dateString) => setStayTimeDateRange(dateString)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">页面:</span>
                    <Select
                      size="small"
                      value={stayTimePage}
                      onChange={setStayTimePage}
                      style={{ width: '100%' }}
                    >
                      {pageOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
              </Row>
            </div>
            <div id="stay-time-chart" style={{ width: '100%', height: '400px' }}></div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 跳出率图表 */}
        <Col span={24} className="mb-4">
          <Card
            title={
              <div className="flex items-center">
                <span className="mr-2 text-red-600">
                  <IconFile />
                </span>
                <span>页面跳出率趋势</span>
              </div>
            }
          >
            {/* 跳出率图表筛选条件 */}
            <div className="mb-4">
              <Row gutter={8} align="center">
                <Col span={12}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">时间:</span>
                    <RangePicker
                      size="small"
                      onChange={(dateString) => setBounceRateDateRange(dateString)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">页面:</span>
                    <Select
                      size="small"
                      value={bounceRatePage}
                      onChange={setBounceRatePage}
                      style={{ width: '100%' }}
                    >
                      {pageOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
              </Row>
            </div>
            <div id="bounce-rate-chart" style={{ width: '100%', height: '400px' }}></div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 注册用户数图表 */}
        <Col span={24} className="mb-4">
          <Card
            title={
              <div className="flex items-center">
                <span className="mr-2 text-green-600">
                  <IconDashboard />
                </span>
                <span>注册用户数趋势</span>
              </div>
            }
          >
            {/* 注册用户数图表筛选条件 */}
            <div className="mb-4">
              <Row gutter={8} align="center">
                <Col span={12}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">时间范围:</span>
                    <RangePicker
                      size="small"
                      onChange={(dateString) => setRegisteredUsersDateRange(dateString)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">性质:</span>
                    <Select
                      size="small"
                      value={registeredUsersType}
                      onChange={setRegisteredUsersType}
                      style={{ width: '100%' }}
                    >
                      {userTypeOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
              </Row>
            </div>
            <div id="registered-users-chart" style={{ width: '100%', height: '400px' }}></div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 活跃用户数图表 */}
        <Col span={24} className="mb-4">
          <Card
            title={
              <div className="flex items-center">
                <span className="mr-2 text-blue-600">
                  <IconApps />
                </span>
                <span>活跃用户数趋势</span>
              </div>
            }
          >
            {/* 活跃用户数图表筛选条件 */}
            <div className="mb-4">
              <Row gutter={8} align="center">
                <Col span={24}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">时间范围:</span>
                    <RangePicker
                      size="small"
                      onChange={(dateString) => setActiveUsersDateRange(dateString)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </Col>
              </Row>
            </div>
            <div id="active-users-chart" style={{ width: '100%', height: '400px' }}></div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 认证企业数图表 */}
        <Col span={24} className="mb-4">
          <Card
            title={
              <div className="flex items-center">
                <span className="mr-2 text-orange-600">
                  <IconFile />
                </span>
                <span>认证企业数趋势</span>
              </div>
            }
          >
            {/* 认证企业数图表筛选条件 */}
            <div className="mb-4">
              <Row gutter={8} align="center">
                <Col span={12}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">时间范围:</span>
                    <RangePicker
                      size="small"
                      onChange={(dateString) => setCertifiedCompaniesDateRange(dateString)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">状态:</span>
                    <Select
                      size="small"
                      value={certifiedCompaniesStatus}
                      onChange={setCertifiedCompaniesStatus}
                      style={{ width: '100%' }}
                    >
                      {companyStatusOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
              </Row>
            </div>
            <div id="certified-companies-chart" style={{ width: '100%', height: '400px' }}></div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 港口热度排行图表 */}
        <Col span={12} className="mb-4">
          <Card
            title={
              <div className="flex items-center">
                <span className="mr-2 text-blue-600">
                  <IconDashboard />
                </span>
                <span>港口热度排行 TOP20</span>
              </div>
            }
          >
            {/* 港口热度图表筛选条件 */}
            <div className="mb-4">
              <Row gutter={8} align="center">
                <Col span={24}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">时间范围:</span>
                    <RangePicker
                      size="small"
                      onChange={(dateString) => setPortHeatDateRange(dateString)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </Col>
              </Row>
            </div>
            <div id="port-heat-chart" style={{ width: '100%', height: '500px' }}></div>
          </Card>
        </Col>

        {/* 失败次数排行图表 */}
        <Col span={12} className="mb-4">
          <Card
            title={
              <div className="flex items-center">
                <span className="mr-2 text-red-600">
                  <IconFile />
                </span>
                <span>港口组合失败次数排行 TOP20</span>
              </div>
            }
          >
            {/* 失败次数图表筛选条件 */}
            <div className="mb-4">
              <Row gutter={8} align="center">
                <Col span={24}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">时间范围:</span>
                    <RangePicker
                      size="small"
                      onChange={(dateString) => setFailureRankingDateRange(dateString)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </Col>
              </Row>
            </div>
            <div id="failure-ranking-chart" style={{ width: '100%', height: '500px' }}></div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 询价数量统计图表 */}
        <Col span={24} className="mb-4">
          <Card
            title={
              <div className="flex items-center">
                <span className="mr-2 text-green-600">
                  <IconDashboard />
                </span>
                <span>询价单量统计</span>
              </div>
            }
          >
            {/* 询价数量统计筛选条件 */}
            <div className="mb-4">
              <Row gutter={8} align="center">
                <Col span={6}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">时间:</span>
                    <RangePicker
                      size="small"
                      onChange={(dateString) => setInquiryCountDateRange(dateString)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </Col>
                <Col span={4}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">来源:</span>
                    <Select
                      size="small"
                      value={inquiryCountSource}
                      onChange={setInquiryCountSource}
                      style={{ width: '100%' }}
                    >
                      {inquirySourceOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
                <Col span={4}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">起运港:</span>
                    <Select
                      size="small"
                      value={inquiryCountOriginPort}
                      onChange={setInquiryCountOriginPort}
                      style={{ width: '100%' }}
                    >
                      {portOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
                <Col span={4}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">目的港:</span>
                    <Select
                      size="small"
                      value={inquiryCountDestPort}
                      onChange={setInquiryCountDestPort}
                      style={{ width: '100%' }}
                    >
                      {portOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
                <Col span={4}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">数据范围:</span>
                    <Select
                      size="small"
                      value={inquiryCountDataScope}
                      onChange={setInquiryCountDataScope}
                      style={{ width: '100%' }}
                    >
                      {dataScopeOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
              </Row>
            </div>
            <div id="inquiry-count-chart" style={{ width: '100%', height: '400px' }}></div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 询价港口排名图表 */}
        <Col span={12} className="mb-4">
          <Card
            title={
              <div className="flex items-center">
                <span className="mr-2 text-green-600">
                  <IconApps />
                </span>
                <span>港口组合询价排名 TOP20</span>
              </div>
            }
          >
            {/* 询价港口排名筛选条件 */}
            <div className="mb-4">
              <Row gutter={8} align="center">
                <Col span={12}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">时间:</span>
                    <RangePicker
                      size="small"
                      onChange={(dateString) => setInquiryPortRankingDateRange(dateString)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">数据范围:</span>
                    <Select
                      size="small"
                      value={inquiryPortRankingDataScope}
                      onChange={setInquiryPortRankingDataScope}
                      style={{ width: '100%' }}
                    >
                      {dataScopeOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
              </Row>
            </div>
            <div id="inquiry-port-ranking-chart" style={{ width: '100%', height: '500px' }}></div>
          </Card>
        </Col>

        {/* 询价客户排名图表 */}
        <Col span={12} className="mb-4">
          <Card
            title={
              <div className="flex items-center">
                <span className="mr-2 text-orange-600">
                  <IconFile />
                </span>
                <span>客户询价排名 TOP20</span>
              </div>
            }
          >
            {/* 询价客户排名筛选条件 */}
            <div className="mb-4">
              <Row gutter={8} align="center">
                <Col span={12}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">时间:</span>
                    <RangePicker
                      size="small"
                      onChange={(dateString) => setInquiryCustomerRankingDateRange(dateString)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">数据范围:</span>
                    <Select
                      size="small"
                      value={inquiryCustomerRankingDataScope}
                      onChange={setInquiryCustomerRankingDataScope}
                      style={{ width: '100%' }}
                    >
                      {dataScopeOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
              </Row>
            </div>
            <div id="inquiry-customer-ranking-chart" style={{ width: '100%', height: '500px' }}></div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 报价数量统计图表 */}
        <Col span={24} className="mb-4">
          <Card
            title={
              <div className="flex items-center">
                <span className="mr-2 text-blue-600">
                  <IconDashboard />
                </span>
                <span>报价单量统计</span>
              </div>
            }
          >
            {/* 报价数量统计筛选条件 */}
            <div className="mb-4">
              <Row gutter={8} align="center">
                <Col span={6}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">时间:</span>
                    <RangePicker
                      size="small"
                      onChange={(dateString) => setQuoteCountDateRange(dateString)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </Col>
                <Col span={4}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">来源:</span>
                    <Select
                      size="small"
                      value={quoteCountSource}
                      onChange={setQuoteCountSource}
                      style={{ width: '100%' }}
                    >
                      {inquirySourceOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
                <Col span={4}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">起运港:</span>
                    <Select
                      size="small"
                      value={quoteCountOriginPort}
                      onChange={setQuoteCountOriginPort}
                      style={{ width: '100%' }}
                    >
                      {portOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
                <Col span={4}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">目的港:</span>
                    <Select
                      size="small"
                      value={quoteCountDestPort}
                      onChange={setQuoteCountDestPort}
                      style={{ width: '100%' }}
                    >
                      {portOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
                <Col span={4}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">数据范围:</span>
                    <Select
                      size="small"
                      value={quoteCountDataScope}
                      onChange={setQuoteCountDataScope}
                      style={{ width: '100%' }}
                    >
                      {dataScopeOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
              </Row>
            </div>
            <div id="quote-count-chart" style={{ width: '100%', height: '400px' }}></div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 报价港口排名图表 */}
        <Col span={12} className="mb-4">
          <Card
            title={
              <div className="flex items-center">
                <span className="mr-2 text-blue-600">
                  <IconApps />
                </span>
                <span>港口组合报价排名 TOP20</span>
              </div>
            }
          >
            {/* 报价港口排名筛选条件 */}
            <div className="mb-4">
              <Row gutter={8} align="center">
                <Col span={12}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">时间:</span>
                    <RangePicker
                      size="small"
                      onChange={(dateString) => setQuotePortRankingDateRange(dateString)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">数据范围:</span>
                    <Select
                      size="small"
                      value={quotePortRankingDataScope}
                      onChange={setQuotePortRankingDataScope}
                      style={{ width: '100%' }}
                    >
                      {dataScopeOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
              </Row>
            </div>
            <div id="quote-port-ranking-chart" style={{ width: '100%', height: '500px' }}></div>
          </Card>
        </Col>

        {/* 报价人排名图表 */}
        <Col span={12} className="mb-4">
          <Card
            title={
              <div className="flex items-center">
                <span className="mr-2 text-purple-600">
                  <IconFile />
                </span>
                <span>报价人排名 TOP20</span>
              </div>
            }
          >
            {/* 报价人排名筛选条件 */}
            <div className="mb-4">
              <Row gutter={8} align="center">
                <Col span={12}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">时间:</span>
                    <RangePicker
                      size="small"
                      onChange={(dateString) => setQuoterRankingDateRange(dateString)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">数据范围:</span>
                    <Select
                      size="small"
                      value={quoterRankingDataScope}
                      onChange={setQuoterRankingDataScope}
                      style={{ width: '100%' }}
                    >
                      {dataScopeOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
              </Row>
            </div>
            <div id="quoter-ranking-chart" style={{ width: '100%', height: '500px' }}></div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 报价时效统计图表 */}
        <Col span={12} className="mb-4">
          <Card
            title={
              <div className="flex items-center">
                <span className="mr-2 text-orange-600">
                  <IconDashboard />
                </span>
                <span>报价时效统计</span>
              </div>
            }
          >
            {/* 报价时效统计筛选条件 */}
            <div className="mb-4">
              <Row gutter={8} align="center">
                <Col span={8}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">时间:</span>
                    <RangePicker
                      size="small"
                      onChange={(dateString) => setQuoteTimelinessDateRange(dateString)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </Col>
                <Col span={8}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">报价人:</span>
                    <Select
                      size="small"
                      value={quoteTimelinessQuoter}
                      onChange={setQuoteTimelinessQuoter}
                      style={{ width: '100%' }}
                    >
                      {quoterOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">数据范围:</span>
                    <Select
                      size="small"
                      value={quoteTimelinessDataScope}
                      onChange={setQuoteTimelinessDataScope}
                      style={{ width: '100%' }}
                    >
                      {dataScopeOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
              </Row>
            </div>
            <div id="quote-timeliness-chart" style={{ width: '100%', height: '400px' }}></div>
          </Card>
        </Col>

        {/* 报价效率排名图表 */}
        <Col span={12} className="mb-4">
          <Card
            title={
              <div className="flex items-center">
                <span className="mr-2 text-green-600">
                  <IconApps />
                </span>
                <span>报价效率排名 TOP20</span>
              </div>
            }
          >
            {/* 报价效率排名筛选条件 */}
            <div className="mb-4">
              <Row gutter={8} align="center">
                <Col span={12}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">时间:</span>
                    <RangePicker
                      size="small"
                      onChange={(dateString) => setQuoteEfficiencyDateRange(dateString)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">数据范围:</span>
                    <Select
                      size="small"
                      value={quoteEfficiencyDataScope}
                      onChange={setQuoteEfficiencyDataScope}
                      style={{ width: '100%' }}
                    >
                      {dataScopeOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
              </Row>
            </div>
            <div id="quote-efficiency-chart" style={{ width: '100%', height: '400px' }}></div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 超时未报价列表 */}
        <Col span={12} className="mb-4">
          <Card
            title={
              <div className="flex items-center">
                <span className="mr-2 text-red-600">
                  <IconFile />
                </span>
                <span>超时未报价列表</span>
              </div>
            }
          >
            {/* 超时未报价筛选条件 */}
            <div className="mb-4">
              <Row gutter={8} align="center">
                <Col span={12}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">超时时间:</span>
                    <Select
                      size="small"
                      value={overtimeQuotesTimeout}
                      onChange={setOvertimeQuotesTimeout}
                      style={{ width: '100%' }}
                    >
                      {timeoutOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">数据范围:</span>
                    <Select
                      size="small"
                      value={overtimeQuotesDataScope}
                      onChange={setOvertimeQuotesDataScope}
                      style={{ width: '100%' }}
                    >
                      {dataScopeOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
              </Row>
            </div>
            <Table
              columns={[
                { title: '询价单号', dataIndex: 'inquiryId', width: 100 },
                { title: '客户', dataIndex: 'customer', width: 80 },
                { title: '航线', dataIndex: 'route', width: 120 },
                { title: '提交时间', dataIndex: 'submittedTime', width: 140 },
                { title: '超时(小时)', dataIndex: 'overtimeHours', width: 80 }
              ]}
              data={generateOvertimeQuotesData()}
              pagination={{ pageSize: 10 }}
              size="small"
              style={{ height: '400px' }}
            />
          </Card>
        </Col>

        {/* 人均报价数量统计图表 */}
        <Col span={12} className="mb-4">
          <Card
            title={
              <div className="flex items-center">
                <span className="mr-2 text-cyan-600">
                  <IconDashboard />
                </span>
                <span>人均报价数量统计</span>
              </div>
            }
          >
            {/* 人均报价数量筛选条件 */}
            <div className="mb-4">
              <Row gutter={8} align="center">
                <Col span={12}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">时间:</span>
                    <RangePicker
                      size="small"
                      onChange={(dateString) => setAvgQuoteCountDateRange(dateString)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">数据范围:</span>
                    <Select
                      size="small"
                      value={avgQuoteCountDataScope}
                      onChange={setAvgQuoteCountDataScope}
                      style={{ width: '100%' }}
                    >
                      {dataScopeOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
              </Row>
            </div>
            <div id="avg-quote-count-chart" style={{ width: '100%', height: '400px' }}></div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 运价维护数量统计图表 */}
        <Col span={24} className="mb-4">
          <Card
            title={
              <div className="flex items-center">
                <span className="mr-2 text-purple-600">
                  <IconDashboard />
                </span>
                <span>运价维护数量统计</span>
              </div>
            }
          >
            {/* 运价维护数量统计筛选条件 */}
            <div className="mb-4">
              <Row gutter={8} align="center">
                <Col span={4}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">时间:</span>
                    <RangePicker
                      size="small"
                      onChange={(dateString) => setRateMaintenanceCountDateRange(dateString)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </Col>
                <Col span={4}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">船公司:</span>
                    <Select
                      size="small"
                      value={rateMaintenanceCountCarrier}
                      onChange={setRateMaintenanceCountCarrier}
                      style={{ width: '100%' }}
                    >
                      {carrierOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
                <Col span={4}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">起运港:</span>
                    <Select
                      size="small"
                      value={rateMaintenanceCountOriginPort}
                      onChange={setRateMaintenanceCountOriginPort}
                      style={{ width: '100%' }}
                    >
                      {portOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
                <Col span={4}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">目的港:</span>
                    <Select
                      size="small"
                      value={rateMaintenanceCountDestPort}
                      onChange={setRateMaintenanceCountDestPort}
                      style={{ width: '100%' }}
                    >
                      {portOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
                <Col span={4}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">创建人:</span>
                    <Select
                      size="small"
                      value={rateMaintenanceCountCreator}
                      onChange={setRateMaintenanceCountCreator}
                      style={{ width: '100%' }}
                    >
                      {rateCreatorOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
                <Col span={4}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">数据范围:</span>
                    <Select
                      size="small"
                      value={rateMaintenanceCountDataScope}
                      onChange={setRateMaintenanceCountDataScope}
                      style={{ width: '100%' }}
                    >
                      {dataScopeOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
              </Row>
            </div>
            <div id="rate-maintenance-count-chart" style={{ width: '100%', height: '400px' }}></div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 运价状态分布图表 */}
        <Col span={12} className="mb-4">
          <Card
            title={
              <div className="flex items-center">
                <span className="mr-2 text-purple-600">
                  <IconApps />
                </span>
                <span>运价状态分布</span>
              </div>
            }
          >
            {/* 运价状态分布筛选条件 */}
            <div className="mb-4">
              <Row gutter={8} align="center">
                <Col span={12}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">时间:</span>
                    <RangePicker
                      size="small"
                      onChange={(dateString) => setRateStatusDateRange(dateString)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">数据范围:</span>
                    <Select
                      size="small"
                      value={rateStatusDataScope}
                      onChange={setRateStatusDataScope}
                      style={{ width: '100%' }}
                    >
                      {dataScopeOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
              </Row>
            </div>
            <div id="rate-status-chart" style={{ width: '100%', height: '400px' }}></div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 运价平均趋势统计图表 */}
        <Col span={24} className="mb-4">
          <Card
            title={
              <div className="flex items-center">
                <span className="mr-2 text-purple-600">
                  <IconDashboard />
                </span>
                <span>运价平均趋势统计</span>
              </div>
            }
          >
            {/* 运价平均趋势筛选条件 */}
            <div className="mb-4">
              <Row gutter={8} align="center">
                <Col span={5}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">时间范围:</span>
                    <RangePicker
                      size="small"
                      onChange={(dateString) => setRateAvgTrendDateRange(dateString)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </Col>
                <Col span={4}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">船公司:</span>
                    <Select
                      size="small"
                      value={rateAvgTrendCarrier}
                      onChange={setRateAvgTrendCarrier}
                      style={{ width: '100%' }}
                    >
                      {carrierOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
                <Col span={4}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">起运港:</span>
                    <Select
                      size="small"
                      value={rateAvgTrendOriginPort}
                      onChange={setRateAvgTrendOriginPort}
                      style={{ width: '100%' }}
                    >
                      {portOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
                <Col span={4}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">目的港:</span>
                    <Select
                      size="small"
                      value={rateAvgTrendDestPort}
                      onChange={setRateAvgTrendDestPort}
                      style={{ width: '100%' }}
                    >
                      {portOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
                <Col span={4}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm whitespace-nowrap">数据范围:</span>
                    <Select
                      size="small"
                      value={rateAvgTrendDataScope}
                      onChange={setRateAvgTrendDataScope}
                      style={{ width: '100%' }}
                    >
                      {dataScopeOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
              </Row>
            </div>
            <div id="rate-avg-trend-chart" style={{ width: '100%', height: '400px' }}></div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BiAnalytics;
