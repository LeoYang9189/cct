import React, { useState } from 'react';
import { Card, Grid, Typography, Button, Space, Tag, Input } from '@arco-design/web-react';
import { IconCode, IconSettings, IconList, IconUser, IconFile, IconSearch } from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';
import apiBannerImage from '../../../assets/apibanner.png';

const { Row, Col } = Grid;
const { Title, Text } = Typography;
// const { TabPane } = Tabs;

interface ApiCardProps {
  title: string;
  description: string;
  status: 'active' | 'inactive' | 'development';
  category: string;
  endpoint?: string;
}

const ApiCard: React.FC<ApiCardProps> = ({ title, description, status, category, endpoint }) => {
  const navigate = useNavigate();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'development': return 'orange';
      default: return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '可用';
      case 'inactive': return '不可用';
      case 'development': return '开发中';
      default: return '未知';
    }
  };

  /**
   * 处理查看文档按钮点击事件
   */
  const handleViewDocs = () => {
    // 生成API ID，用于路由参数
    const apiId = title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-').toLowerCase();
    navigate(`/controltower/api-docs/${apiId}`, {
      state: { title, description, status, category, endpoint }
    });
  };

  return (
    <Card
      className="api-card"
      style={{ height: '100%' }}
      hoverable
      actions={[
        <Button type="primary" size="small" onClick={handleViewDocs}>查看文档</Button>,
        <Button type="outline" size="small">测试接口</Button>
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Title heading={6} style={{ margin: 0 }}>{title}</Title>
          <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
        </div>
        <Text type="secondary" style={{ fontSize: 12 }}>{category}</Text>
      </div>
      
      <Text style={{ display: 'block', marginBottom: 12, lineHeight: 1.5 }}>
        {description}
      </Text>
      
      {endpoint && (
        <div style={{ 
          backgroundColor: '#f7f8fa', 
          padding: '8px 12px', 
          borderRadius: 4, 
          fontSize: 12,
          fontFamily: 'monospace',
          color: '#666'
        }}>
          {endpoint}
        </div>
      )}
    </Card>
  );
};

const ApiCenter: React.FC = () => {
  // 搜索和筛选状态
  const [searchValue, setSearchValue] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');

  // 分类选项
  const categories = [
    { key: '全部', label: '全部' },
    { key: '系统设置', label: '系统设置' },
    { key: '订单中心', label: '订单中心' },
    { key: '客商中心', label: '客商中心' },
    { key: '超级运价', label: '超级运价' }
  ];

  // 系统设置类API
  const systemApis = [
    {
      title: '员工管理API',
      description: '提供员工信息的增删改查功能，包括员工基本信息、部门分配、权限设置等操作接口。',
      status: 'active' as const,
      category: '系统设置',
      endpoint: 'GET /api/v1/employees'
    },
    {
      title: '组织架构API',
      description: '管理公司组织架构，支持部门创建、修改、删除以及层级关系维护等功能。',
      status: 'active' as const,
      category: '系统设置',
      endpoint: 'GET /api/v1/organizations'
    }
  ];

  // 订单中心类API
  const orderApis = [
    {
      title: '订单综合管理API',
      description: '提供订单全生命周期管理，包括订单创建、状态更新、查询统计等核心功能。',
      status: 'active' as const,
      category: '订单中心',
      endpoint: 'GET /api/v1/orders'
    },
    {
      title: '订舱管理API',
      description: '处理货物订舱相关业务，包括舱位查询、预订、确认以及舱单管理等功能。',
      status: 'active' as const,
      category: '订单中心',
      endpoint: 'GET /api/v1/bookings'
    },
    {
      title: '拖车管理API',
      description: '管理拖车运输业务，提供拖车调度、路线规划、状态跟踪等相关接口。',
      status: 'active' as const,
      category: '订单中心',
      endpoint: 'GET /api/v1/trucking'
    },
    {
      title: '仓库管理API',
      description: '仓储业务管理接口，包括入库、出库、库存查询、仓位管理等功能。',
      status: 'active' as const,
      category: '订单中心',
      endpoint: 'GET /api/v1/warehouse'
    },
    {
      title: '报关管理API',
      description: '处理货物报关业务，提供报关单据管理、状态查询、审核流程等接口。',
      status: 'active' as const,
      category: '订单中心',
      endpoint: 'GET /api/v1/customs'
    },
    {
      title: 'VGM管理API',
      description: '集装箱重量验证管理，提供VGM数据录入、验证、提交等相关功能接口。',
      status: 'active' as const,
      category: '订单中心',
      endpoint: 'GET /api/v1/vgm'
    },
    {
      title: '舱单管理API',
      description: '船舶舱单数据管理，包括舱单创建、修改、提交、查询等业务接口。',
      status: 'active' as const,
      category: '订单中心',
      endpoint: 'GET /api/v1/manifest'
    },
    {
      title: '补料管理API',
      description: '订单补充资料管理，提供文件上传、资料补充、审核状态查询等功能。',
      status: 'active' as const,
      category: '订单中心',
      endpoint: 'GET /api/v1/supplements'
    }
  ];

  // 客商中心类API
  const customerApis = [
    {
      title: '客商管理API',
      description: '客户和供应商信息管理，包括客商档案维护、信用评级、合作历史等功能。',
      status: 'active' as const,
      category: '客商中心',
      endpoint: 'GET /api/v1/customers'
    }
  ];

  // 超级运价类API
  const rateApis = [
    {
      title: '运价管理API',
      description: '运输价格管理系统，提供运价录入、修改、查询、生效管理等核心功能。',
      status: 'active' as const,
      category: '超级运价',
      endpoint: 'GET /api/v1/rates'
    },
    {
      title: '附加费管理API',
      description: '各类附加费用管理，包括燃油费、港杂费、操作费等费用项目的维护和计算。',
      status: 'active' as const,
      category: '超级运价',
      endpoint: 'GET /api/v1/surcharges'
    },
    {
      title: '运价查询API',
      description: '运价查询服务，支持多条件组合查询、价格比较、有效期验证等功能。',
      status: 'active' as const,
      category: '超级运价',
      endpoint: 'GET /api/v1/rate-query'
    },
    {
      title: '询价单管理API',
      description: '客户询价业务管理，包括询价单创建、处理、跟进、转化等全流程管理。',
      status: 'active' as const,
      category: '超级运价',
      endpoint: 'GET /api/v1/inquiries'
    },
    {
      title: '报价单管理API',
      description: '报价单生成和管理，提供自动报价、手动调整、版本控制、发送跟踪等功能。',
      status: 'active' as const,
      category: '超级运价',
      endpoint: 'GET /api/v1/quotes'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '系统设置': return <IconSettings />;
      case '订单中心': return <IconList />;
      case '客商中心': return <IconUser />;
      case '超级运价': return <IconFile />;
      default: return <IconCode />;
    }
  };

  // 筛选API数据的函数
  const filterApis = (apis: any[], _category: string) => {
    let filteredApis = apis;
    
    // 按分类筛选
    if (activeCategory !== '全部') {
      // 直接按分类名称筛选
      filteredApis = filteredApis.filter(api => api.category === activeCategory);
    }
    
    // 按搜索关键词筛选
    if (searchValue) {
      filteredApis = filteredApis.filter(api => 
        api.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        api.description.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    
    return filteredApis;
  };

  const renderApiSection = (title: string, apis: any[], icon: React.ReactNode) => {
    const filteredApis = filterApis(apis, title);
    
    if (filteredApis.length === 0) {
      return null;
    }
    
    return (
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          {icon}
          <Title heading={5} style={{ margin: '0 0 0 8px' }}>{title}</Title>
          <Text style={{ marginLeft: 8, color: '#86909c' }}>({filteredApis.length})</Text>
        </div>
        <Row gutter={[16, 16]}>
          {filteredApis.map((api, index) => (
            <Col span={8} key={index}>
              <ApiCard {...api} />
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  return (
    <div>
      {/* 顶部横幅 */}
      <div 
        style={{
          position: 'relative',
          padding: '40px 0',
          marginBottom: '24px',
          overflow: 'hidden',
          minHeight: '220px'
        }}
      >
        {/* 主背景图片 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: '100%',
          backgroundImage: `url(${apiBannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 1
        }} />
        
        {/* 左侧模糊延伸 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '200px',
          height: '100%',
          backgroundImage: `url(${apiBannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'left center',
          filter: 'blur(8px)',
          transform: 'scaleX(-1)',
          zIndex: 0
        }} />
        
        {/* 右侧模糊延伸 */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '200px',
          height: '100%',
          backgroundImage: `url(${apiBannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          filter: 'blur(8px)',
          transform: 'scaleX(-1)',
          zIndex: 0
        }} />
        

        <div style={{ 
          textAlign: 'center', 
          marginBottom: 24,
          position: 'relative',
          zIndex: 10,
          padding: '0 24px'
        }}>
          <Title heading={1} style={{ 
            color: 'white', 
            margin: '0 0 8px 0',
            fontSize: '48px',
            fontWeight: 'bold'
          }}>
            API中心
          </Title>
          <Text style={{ 
            color: 'white', 
            fontSize: 18,
            display: 'block',
            marginBottom: '32px',
            fontWeight: '500'
          }}>
            国际物流信息化，本就不该存在孤岛
          </Text>
        </div>
        
        <div style={{ 
          maxWidth: '600px', 
          margin: '0 auto',
          position: 'relative',
          zIndex: 10
        }}>
          <Input
            size="large"
            placeholder="搜索API名称，按Enter搜索"
            prefix={<IconSearch />}
            value={searchValue}
            onChange={setSearchValue}
            style={{
              borderRadius: '0',
              boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              backgroundColor: 'transparent',
              backdropFilter: 'blur(15px)',
              fontSize: '16px',
              padding: '12px 16px',
              color: 'white'
            }}
          />
        </div>
      </div>

      {/* 分类筛选标签 */}
      <div style={{ padding: '0 24px 24px' }}>
        <div style={{ 
          background: '#f7f8fa',
          padding: '16px 20px',
          borderRadius: 6,
          marginBottom: 24
        }}>
          <Space wrap>
            {categories.map(category => (
              <Button
                key={category.key}
                type={activeCategory === category.key ? 'primary' : 'outline'}
                size="small"
                onClick={() => setActiveCategory(category.key)}
                style={{
                  borderRadius: 0,
                  ...(activeCategory === category.key ? {
                    background: '#165dff',
                    borderColor: '#165dff'
                  } : {
                    background: 'white',
                    borderColor: '#d9d9d9',
                    color: '#86909c'
                  })
                }}
              >
                {category.label}
              </Button>
            ))}
          </Space>
        </div>

        {/* API内容区域 */}
        <div>
          {renderApiSection('系统设置', systemApis, getCategoryIcon('系统设置'))}
           {renderApiSection('订单中心', orderApis, getCategoryIcon('订单中心'))}
           {renderApiSection('客商中心', customerApis, getCategoryIcon('客商中心'))}
           {renderApiSection('超级运价', rateApis, getCategoryIcon('超级运价'))}
           
           {/* 无搜索结果提示 */}
           {(searchValue || activeCategory !== '全部') && 
            filterApis([...systemApis, ...orderApis, ...customerApis, ...rateApis], '').length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 0',
              color: '#86909c'
            }}>
              <IconSearch style={{ fontSize: 48, marginBottom: 16 }} />
              <div>未找到相关API接口</div>
              <div style={{ fontSize: 14, marginTop: 8 }}>
                请尝试调整搜索关键词或筛选条件
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiCenter;