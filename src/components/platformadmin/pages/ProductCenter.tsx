import React, { useState } from 'react';
import { Card, Typography, Switch, Tag, Space, Button, Grid, Modal, Message } from '@arco-design/web-react';
import { IconSettings, IconThunderbolt, IconRobot, IconExclamationCircle, IconMessage } from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';

const { Row, Col } = Grid;

const { Title, Text } = Typography;

interface ProductItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  features: string[];
  status: 'active' | 'inactive';
}

const ProductCenter: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductItem[]>([
    {
      id: 'super-freight',
      name: '超级运价',
      description: '智能化运价管理系统，提供实时运价查询、比价分析和运价优化建议',
      icon: <IconThunderbolt style={{ fontSize: 24, color: '#165DFF' }} />,
      enabled: true,
      features: ['实时运价查询', '智能比价', '运价趋势分析', 'API集成'],
      status: 'active'
    },
    {
      id: 'control-tower',
      name: '控制塔',
      description: '全方位物流监控和管理平台，提供可视化运输跟踪和异常预警',
      icon: <IconSettings style={{ fontSize: 24, color: '#00B42A' }} />,
      enabled: true,
      features: ['运输监控', '异常预警', '数据分析', '报表生成'],
      status: 'active'
    },
    {
      id: 'smart-container',
      name: '智慧箱管',
      description: '智能集装箱管理系统，实现箱源调配、状态跟踪和成本控制',
      icon: <IconRobot style={{ fontSize: 24, color: '#FF7D00' }} />,
      enabled: true,
      features: ['箱源管理', '状态跟踪', '智能调配', '成本分析'],
      status: 'active'
    },
    {
      id: 'ai-assistant',
      name: 'AI助手',
      description: '智能AI助理系统，提供24小时在线咨询、智能问答和业务辅助服务',
      icon: <IconMessage style={{ fontSize: 24, color: '#722ED1' }} />,
      enabled: true,
      features: ['智能问答', '业务咨询', '数据分析', '自动化处理'],
      status: 'active'
    }
  ]);

  // 确认弹窗相关状态
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    productId: string;
    productName: string;
    action: boolean; // true表示启用，false表示禁用
  } | null>(null);

  const handleSwitchChange = (productId: string, checked: boolean) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // 设置待处理的操作
    setPendingAction({
      productId,
      productName: product.name,
      action: checked
    });
    setConfirmModalVisible(true);
  };

  // 确认操作
  const handleConfirmAction = () => {
    if (!pendingAction) return;

    const { productId, action } = pendingAction;
    
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, enabled: action, status: action ? 'active' : 'inactive' }
        : product
    ));

    const actionText = action ? '启用' : '禁用';
    Message.success(`产品已${actionText}`);
    
    // 清理状态
    setConfirmModalVisible(false);
    setPendingAction(null);
  };

  // 取消操作
  const handleCancelAction = () => {
    setConfirmModalVisible(false);
    setPendingAction(null);
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'active':
        return <Tag color="green">已启用</Tag>;
      case 'inactive':
        return <Tag color="gray">未启用</Tag>;
      default:
        return <Tag color="gray">未知</Tag>;
    }
  };

  const handleAuthorizeCompanies = (productId: string) => {
    navigate(`/platformadmin/product-authorization/${productId}`);
  };

  const handleProductConfig = (productId: string) => {
    navigate(`/platformadmin/product-config/${productId}`);
  };

  return (
    <div style={{ padding: '0' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title heading={3} style={{ marginBottom: '8px' }}>产品中心</Title>
        <Text type="secondary">管理和配置各产品模块的授权状态</Text>
      </div>
      
      <Row gutter={[16, 16]}>
        {products.map(product => (
          <Col key={product.id} xs={24} sm={12} lg={8}>
            <Card
              style={{ 
                height: '100%',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              hoverable
              className={`product-card ${product.enabled ? 'enabled' : 'disabled'}`}
            >
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* 卡片头部 */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {product.icon}
                    <div>
                      <Title heading={5} style={{ margin: 0, marginBottom: '4px' }}>
                        {product.name}
                      </Title>
                      {getStatusTag(product.status)}
                    </div>
                  </div>
                  <Switch
                    checked={product.enabled}
                    onChange={(checked) => handleSwitchChange(product.id, checked)}
                    size="default"
                  />
                </div>

                {/* 产品描述 */}
                <Text 
                  type="secondary" 
                  style={{ 
                    marginBottom: '16px', 
                    lineHeight: '1.5',
                    flex: 1
                  }}
                >
                  {product.description}
                </Text>

                {/* 功能特性 */}
                <div style={{ marginBottom: '16px' }}>
                  <Text style={{ fontSize: '12px', color: '#86909c', marginBottom: '8px', display: 'block' }}>
                    核心功能
                  </Text>
                  <Space wrap>
                    {product.features.map(feature => (
                      <Tag key={feature} size="small" style={{ fontSize: '11px' }}>
                        {feature}
                      </Tag>
                    ))}
                  </Space>
                </div>

                {/* 操作按钮 */}
                <div style={{ marginTop: 'auto' }}>
                  <Space>
                    <Button 
                      type="primary" 
                      size="small"
                      disabled={!product.enabled}
                      onClick={() => handleAuthorizeCompanies(product.id)}
                    >
                      授权企业
                    </Button>
                    <Button 
                      type="outline" 
                      size="small"
                      disabled={!product.enabled}
                      onClick={() => handleProductConfig(product.id)}
                    >
                      产品配置
                    </Button>
                  </Space>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 底部说明 */}
      <Card style={{ marginTop: '24px', backgroundColor: '#f7f8fa' }}>
        <Space>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            💡 提示：启用产品授权后，相关功能将对用户开放。如需调整产品配置，请联系技术支持团队。
          </Text>
        </Space>
      </Card>

      {/* 确认操作弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconExclamationCircle style={{ color: '#FF7D00', fontSize: '18px' }} />
            <span>操作确认</span>
          </div>
        }
        visible={confirmModalVisible}
        onCancel={handleCancelAction}
        onOk={handleConfirmAction}
        okText="确定"
        cancelText="取消"
        okButtonProps={{ 
          status: pendingAction?.action ? 'default' : 'warning'
        }}
        style={{ borderRadius: '12px' }}
      >
        {pendingAction && (
          <div style={{ padding: '16px 0' }}>
            <div style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#1D2129' }}>
                {pendingAction.action ? '启用' : '禁用'}产品：{pendingAction.productName}
              </Text>
            </div>
            
            {pendingAction.action ? (
              // 启用产品的提示
              <div>
                <Text style={{ fontSize: '14px', lineHeight: '1.6', color: '#4E5969' }}>
                  启用后，该产品功能将对平台开放，您可以：
                </Text>
                <ul style={{ margin: '12px 0', paddingLeft: '20px', color: '#4E5969' }}>
                  <li>为企业用户分配该产品的使用权限</li>
                  <li>配置产品相关的功能参数</li>
                  <li>企业用户可以正常使用该产品功能</li>
                </ul>
                <div style={{ 
                  marginTop: '16px', 
                  padding: '12px', 
                  backgroundColor: '#E6F7FF', 
                  border: '1px solid #91D5FF',
                  borderRadius: '6px'
                }}>
                  <Text style={{ fontSize: '13px', color: '#1890FF' }}>
                    ℹ️ 启用产品后，建议及时配置相关参数并为企业分配使用权限。
                  </Text>
                </div>
              </div>
            ) : (
              // 禁用产品的提示
              <div>
                <Text style={{ fontSize: '14px', lineHeight: '1.6', color: '#4E5969' }}>
                  禁用后，将产生以下影响：
                </Text>
                <ul style={{ margin: '12px 0', paddingLeft: '20px', color: '#4E5969' }}>
                  <li>已授权的企业将无法访问该产品功能</li>
                  <li>相关的配置和授权设置将被保留</li>
                  <li>企业用户界面中该产品入口将被隐藏</li>
                </ul>
                <div style={{ 
                  marginTop: '16px', 
                  padding: '12px', 
                  backgroundColor: '#FFF2E6', 
                  border: '1px solid: #FFD591',
                  borderRadius: '6px'
                }}>
                  <Text style={{ fontSize: '13px', color: '#D25F00' }}>
                    ⚠️ 请确认是否要禁用该产品，此操作将影响已授权企业的功能使用。
                  </Text>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductCenter; 