import React, { useState } from 'react';
import { Card, Typography, Tag, Button, Tabs, Input, Select } from '@arco-design/web-react';
import { IconLeft, IconCode, IconCopy } from '@arco-design/web-react/icon';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

/**
 * API文档详情页面组件
 */
const ApiDocDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const { apiId } = useParams();
  const [activeTab, setActiveTab] = useState('interface-intro');
  
  // 从路由state中获取API信息，如果没有则使用默认值
  const apiInfo = location.state || {
    title: 'AMS发送接口',
    description: '用于发送AMS海外舱单，一个货代单号可消耗一次次数。',
    status: 'active',
    category: '订单中心',
    endpoint: 'POST /api/v1/ams-send'
  };

  /**
   * 返回API中心
   */
  const handleBack = () => {
    navigate('/controltower/api-center');
  };

  /**
   * 获取状态颜色
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'development': return 'orange';
      default: return 'gray';
    }
  };

  /**
   * 获取状态文本
   */
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '可用';
      case 'inactive': return '不可用';
      case 'development': return '开发中';
      default: return '未知';
    }
  };

  /**
   * 复制代码到剪贴板
   */
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // 这里可以添加提示消息
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f2f3f5', minHeight: '100vh' }}>
      {/* 顶部导航 */}
      <div style={{ marginBottom: '24px' }}>
        <Button 
          type="text" 
          icon={<IconLeft />} 
          onClick={handleBack}
          style={{ marginBottom: '16px' }}
        >
          返回API中心
        </Button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Title heading={2} style={{ margin: 0 }}>{apiInfo.title}</Title>
          <Tag color={getStatusColor(apiInfo.status)}>{getStatusText(apiInfo.status)}</Tag>
        </div>
        
        <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
          {apiInfo.category} • {apiInfo.endpoint}
        </Text>
      </div>

      {/* 主要内容区域 */}
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 左侧内容 */}
        <div style={{ flex: 1 }}>
          <Card>
            <Tabs activeTab={activeTab} onChange={setActiveTab}>
              {/* 接口说明 */}
              <TabPane key="interface-intro" title="接口说明">
                <div style={{ padding: '16px 0' }}>
                  <Title heading={4} style={{ marginBottom: '16px' }}>接口介绍</Title>
                  <Paragraph>
                    接口地址：<code style={{ backgroundColor: '#f7f8fa', padding: '2px 6px', borderRadius: '4px' }}>https://api-ingress.hgi.com/api/v1/AbZi6SirHEbktVbwBE39GNQ15</code>
                  </Paragraph>
                  <Paragraph>支持格式：Json</Paragraph>
                  <Paragraph>请求方式：Post</Paragraph>
                  <Paragraph>是否收费：是</Paragraph>
                  <Paragraph>接口备注：可调用该接口发送AMS海外舱单，一个货代单号可消耗一次次数。</Paragraph>
                  
                  <div style={{ marginTop: '24px' }}>
                    <Button type="primary" style={{ marginRight: '12px' }}>
                      调试API
                    </Button>
                  </div>
                </div>
              </TabPane>
              
              {/* 接口示例 */}
              <TabPane key="interface-example" title="接口示例">
                <div style={{ padding: '16px 0' }}>
                  <Title heading={4} style={{ marginBottom: '16px' }}>请求参数示例：</Title>
                  
                  <div style={{ 
                    backgroundColor: '#1e1e1e', 
                    color: '#d4d4d4', 
                    padding: '16px', 
                    borderRadius: '6px',
                    fontFamily: 'Monaco, Consolas, monospace',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    position: 'relative',
                    marginBottom: '24px'
                  }}>
                    <Button 
                      type="text" 
                      icon={<IconCopy />} 
                      size="small"
                      style={{ 
                        position: 'absolute', 
                        top: '8px', 
                        right: '8px',
                        color: '#d4d4d4'
                      }}
                      onClick={() => handleCopyCode(`POST: https://api-ingress.hgi.com/api/v1/AbZi6SirHEbktVbwBE39GNQ15
Content-Type: application/json
appKey: opedtfc7422a81
iv: 123456789123456
apId: 1202
timestamp: 164016867145
{
  "body": {
    "houseScacCode": "TXSL",
    "shipCompanyCode": "CMA",
    "billPartMasterNo": "CNBW983800",
    "billScacMasterNo": "CMDUCNBW983800",
    "shipEnName": "APL VANCOUVER",
    "shipFlagCountryCode": "SG",
    "shipVoyNo": "0GX2J",
    "deliveryType": "FROB",
    "placeOfReceiptUSCustomsCode": "57035",
    "placeOfReceipt": "SHANGHAI",
    "placeOfReceiptCountryCode": "CN",
    "portOfLoadingUSCustomsCode": "57035",
    "portOfLoading": "SHANGHAI",
    "portOfLoadingCountryCode": "CN",
    "portOfTranshipLastUSCustomsCode": "09671",
    "portOfTranshipLast": "WHITBY, ONT"
  }
}`)}
                    />
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
{`POST: https://api-ingress.hgi.com/api/v1/AbZi6SirHEbktVbwBE39GNQ15
Content-Type: application/json
appKey: opedtfc7422a81
iv: 123456789123456
apId: 1202
timestamp: 164016867145
{
  "body": {
    "houseScacCode": "TXSL",
    "shipCompanyCode": "CMA",
    "billPartMasterNo": "CNBW983800",
    "billScacMasterNo": "CMDUCNBW983800",
    "shipEnName": "APL VANCOUVER",
    "shipFlagCountryCode": "SG",
    "shipVoyNo": "0GX2J",
    "deliveryType": "FROB",
    "placeOfReceiptUSCustomsCode": "57035",
    "placeOfReceipt": "SHANGHAI",
    "placeOfReceiptCountryCode": "CN",
    "portOfLoadingUSCustomsCode": "57035",
    "portOfLoading": "SHANGHAI",
    "portOfLoadingCountryCode": "CN",
    "portOfTranshipLastUSCustomsCode": "09671",
    "portOfTranshipLast": "WHITBY, ONT"
  }
}`}
                    </pre>
                  </div>
                </div>
              </TabPane>
              
              {/* 参数说明 */}
              <TabPane key="params-desc" title="参数说明">
                <div style={{ padding: '16px 0' }}>
                  <Title heading={4} style={{ marginBottom: '16px' }}>请求参数说明</Title>
                  
                  <div style={{ marginBottom: '24px' }}>
                    <Text style={{ fontWeight: 'bold' }}>Header参数：</Text>
                    <div style={{ marginTop: '8px', fontSize: '13px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '120px 100px 1fr', gap: '8px', padding: '8px 0', borderBottom: '1px solid #e5e6eb' }}>
                        <Text style={{ fontWeight: 'bold' }}>参数名</Text>
                        <Text style={{ fontWeight: 'bold' }}>类型</Text>
                        <Text style={{ fontWeight: 'bold' }}>说明</Text>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '120px 100px 1fr', gap: '8px', padding: '8px 0', borderBottom: '1px solid #f2f3f5' }}>
                        <Text>Content-Type</Text>
                        <Text>string</Text>
                        <Text>application/json</Text>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '120px 100px 1fr', gap: '8px', padding: '8px 0', borderBottom: '1px solid #f2f3f5' }}>
                        <Text>appKey</Text>
                        <Text>string</Text>
                        <Text>应用密钥</Text>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '120px 100px 1fr', gap: '8px', padding: '8px 0', borderBottom: '1px solid #f2f3f5' }}>
                        <Text>iv</Text>
                        <Text>string</Text>
                        <Text>初始化向量</Text>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '120px 100px 1fr', gap: '8px', padding: '8px 0', borderBottom: '1px solid #f2f3f5' }}>
                        <Text>apId</Text>
                        <Text>string</Text>
                        <Text>应用ID</Text>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '120px 100px 1fr', gap: '8px', padding: '8px 0' }}>
                        <Text>timestamp</Text>
                        <Text>string</Text>
                        <Text>时间戳</Text>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Text style={{ fontWeight: 'bold' }}>Body参数：</Text>
                    <div style={{ marginTop: '8px', fontSize: '13px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '180px 100px 80px 1fr', gap: '8px', padding: '8px 0', borderBottom: '1px solid #e5e6eb' }}>
                        <Text style={{ fontWeight: 'bold' }}>参数名</Text>
                        <Text style={{ fontWeight: 'bold' }}>类型</Text>
                        <Text style={{ fontWeight: 'bold' }}>必填</Text>
                        <Text style={{ fontWeight: 'bold' }}>说明</Text>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '180px 100px 80px 1fr', gap: '8px', padding: '8px 0', borderBottom: '1px solid #f2f3f5' }}>
                        <Text>houseScacCode</Text>
                        <Text>string</Text>
                        <Text>是</Text>
                        <Text>货代SCAC代码</Text>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '180px 100px 80px 1fr', gap: '8px', padding: '8px 0', borderBottom: '1px solid #f2f3f5' }}>
                        <Text>shipCompanyCode</Text>
                        <Text>string</Text>
                        <Text>是</Text>
                        <Text>船公司代码</Text>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '180px 100px 80px 1fr', gap: '8px', padding: '8px 0', borderBottom: '1px solid #f2f3f5' }}>
                        <Text>billPartMasterNo</Text>
                        <Text>string</Text>
                        <Text>是</Text>
                        <Text>分提单号</Text>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '180px 100px 80px 1fr', gap: '8px', padding: '8px 0', borderBottom: '1px solid #f2f3f5' }}>
                        <Text>billScacMasterNo</Text>
                        <Text>string</Text>
                        <Text>是</Text>
                        <Text>主提单号</Text>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '180px 100px 80px 1fr', gap: '8px', padding: '8px 0', borderBottom: '1px solid #f2f3f5' }}>
                        <Text>shipEnName</Text>
                        <Text>string</Text>
                        <Text>是</Text>
                        <Text>船舶英文名称</Text>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '180px 100px 80px 1fr', gap: '8px', padding: '8px 0', borderBottom: '1px solid #f2f3f5' }}>
                        <Text>shipFlagCountryCode</Text>
                        <Text>string</Text>
                        <Text>是</Text>
                        <Text>船旗国代码</Text>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '180px 100px 80px 1fr', gap: '8px', padding: '8px 0', borderBottom: '1px solid #f2f3f5' }}>
                        <Text>shipVoyNo</Text>
                        <Text>string</Text>
                        <Text>是</Text>
                        <Text>航次号</Text>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '180px 100px 80px 1fr', gap: '8px', padding: '8px 0', borderBottom: '1px solid #f2f3f5' }}>
                        <Text>deliveryType</Text>
                        <Text>string</Text>
                        <Text>是</Text>
                        <Text>交货类型</Text>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '180px 100px 80px 1fr', gap: '8px', padding: '8px 0', borderBottom: '1px solid #f2f3f5' }}>
                        <Text>placeOfReceiptUSCustomsCode</Text>
                        <Text>string</Text>
                        <Text>是</Text>
                        <Text>收货地美国海关代码</Text>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '180px 100px 80px 1fr', gap: '8px', padding: '8px 0', borderBottom: '1px solid #f2f3f5' }}>
                        <Text>placeOfReceipt</Text>
                        <Text>string</Text>
                        <Text>是</Text>
                        <Text>收货地</Text>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '180px 100px 80px 1fr', gap: '8px', padding: '8px 0', borderBottom: '1px solid #f2f3f5' }}>
                        <Text>placeOfReceiptCountryCode</Text>
                        <Text>string</Text>
                        <Text>是</Text>
                        <Text>收货地国家代码</Text>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '180px 100px 80px 1fr', gap: '8px', padding: '8px 0', borderBottom: '1px solid #f2f3f5' }}>
                        <Text>portOfLoadingUSCustomsCode</Text>
                        <Text>string</Text>
                        <Text>是</Text>
                        <Text>装货港美国海关代码</Text>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '180px 100px 80px 1fr', gap: '8px', padding: '8px 0', borderBottom: '1px solid #f2f3f5' }}>
                        <Text>portOfLoading</Text>
                        <Text>string</Text>
                        <Text>是</Text>
                        <Text>装货港</Text>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '180px 100px 80px 1fr', gap: '8px', padding: '8px 0', borderBottom: '1px solid #f2f3f5' }}>
                        <Text>portOfLoadingCountryCode</Text>
                        <Text>string</Text>
                        <Text>是</Text>
                        <Text>装货港国家代码</Text>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '180px 100px 80px 1fr', gap: '8px', padding: '8px 0', borderBottom: '1px solid #f2f3f5' }}>
                        <Text>portOfTranshipLastUSCustomsCode</Text>
                        <Text>string</Text>
                        <Text>是</Text>
                        <Text>最后转运港美国海关代码</Text>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '180px 100px 80px 1fr', gap: '8px', padding: '8px 0' }}>
                        <Text>portOfTranshipLast</Text>
                        <Text>string</Text>
                        <Text>是</Text>
                        <Text>最后转运港</Text>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPane>
              
              {/* 注意事项 */}
              <TabPane key="notes" title="注意事项">
                <div style={{ padding: '16px 0' }}>
                  <Title heading={4} style={{ marginBottom: '16px' }}>使用注意事项</Title>
                  <div style={{ lineHeight: '1.8' }}>
                    <Paragraph>1. 请确保所有必填参数都已正确填写</Paragraph>
                    <Paragraph>2. 时间戳格式为Unix时间戳（毫秒）</Paragraph>
                    <Paragraph>3. 接口调用频率限制：每分钟最多100次</Paragraph>
                    <Paragraph>4. 请妥善保管您的appKey，避免泄露</Paragraph>
                    <Paragraph>5. 建议在生产环境使用HTTPS协议</Paragraph>
                    <Paragraph>6. 如遇到问题，请联系技术支持</Paragraph>
                  </div>
                </div>
              </TabPane>
              
              {/* 相关文档 */}
              <TabPane key="related-docs" title="相关文档">
                <div style={{ padding: '16px 0' }}>
                  <Title heading={4} style={{ marginBottom: '16px' }}>相关文档链接</Title>
                  <div style={{ lineHeight: '2' }}>
                    <div><a href="#" style={{ color: '#165dff' }}>AMS申报系统用户手册</a></div>
                    <div><a href="#" style={{ color: '#165dff' }}>API认证与授权说明</a></div>
                    <div><a href="#" style={{ color: '#165dff' }}>错误码对照表</a></div>
                    <div><a href="#" style={{ color: '#165dff' }}>SDK下载与使用指南</a></div>
                    <div><a href="#" style={{ color: '#165dff' }}>常见问题FAQ</a></div>
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </div>
        
        {/* 右侧侧边栏 */}
        <div style={{ width: '300px' }}>
          {/* API测试工具 */}
          <Card title="在线测试" style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '16px' }}>
              <Text style={{ display: 'block', marginBottom: '8px' }}>请求方式</Text>
              <Select defaultValue="POST" style={{ width: '100%' }}>
                <Option value="GET">GET</Option>
                <Option value="POST">POST</Option>
                <Option value="PUT">PUT</Option>
                <Option value="DELETE">DELETE</Option>
              </Select>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <Text style={{ display: 'block', marginBottom: '8px' }}>请求参数</Text>
              <TextArea 
                placeholder="请输入JSON格式的请求参数"
                rows={6}
                style={{ fontFamily: 'Monaco, Consolas, monospace', fontSize: '12px' }}
              />
            </div>
            
            <Button type="primary" long icon={<IconCode />}>
              发送请求
            </Button>
          </Card>
          

        </div>
      </div>
    </div>
  );
};

export default ApiDocDetail;