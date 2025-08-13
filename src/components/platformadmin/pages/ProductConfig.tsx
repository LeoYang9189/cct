import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Tabs, 
  Form, 
  Input, 
  Switch, 
  Button, 
  Space, 
  Message,
  Checkbox
} from '@arco-design/web-react';
import { 
  IconArrowLeft, 
  IconSave,
  IconRefresh
} from '@arco-design/web-react/icon';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

interface AIConfig {
  enabled: boolean;
  nameZh: string;
  nameEn: string;
  slogan: string;
  welcomeMessage: string;
  initialQuestions: string[];
  enabledSkills: string[];
}

interface ConfigData {
  operation: AIConfig;  // 运营端
  customer: AIConfig;   // 客户端  
  platform: AIConfig;   // 平台端
}

const ProductConfig: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('operation');
  const [loading, setLoading] = useState(false);

  // 产品名称映射
  const productNames: { [key: string]: string } = {
    'super-freight': '超级运价',
    'control-tower': '控制塔',
    'smart-container': '智慧箱管',
    'ai-assistant': 'AI助手'
  };

  // 可选技能列表
  const availableSkills = [
    { value: 'quote-generation', label: '生成报价' },
    { value: 'order-tracking', label: '订单跟踪' },
    { value: 'schedule-query', label: '船期查询' },
    { value: 'system-config', label: '系统配置' },
    { value: 'rate-query', label: '运价查询' },
    { value: 'rate-import', label: '运价导入' },
    { value: 'chat-bi', label: 'ChatBI' },
    { value: 'internal-inquiry', label: '内部询价' },
    { value: 'data-analysis', label: '数据分析' },
    { value: 'intelligent-qa', label: '智能问答' },
    { value: 'business-consulting', label: '业务咨询' },
    { value: 'automation', label: '自动化处理' }
  ];

  // 默认配置数据
  const [configData, setConfigData] = useState<ConfigData>({
    operation: {
      enabled: true,
      nameZh: '运营助手',
      nameEn: 'Operation Assistant',
      slogan: '您的运营，可以更智能',
      welcomeMessage: '您好！我是运营助手，专为运营团队提供智能化服务。我可以帮您处理运价管理、订单跟踪、数据分析等各类运营工作。',
      initialQuestions: [
        '查看今日订单统计和异常情况',
        '分析本月运价趋势和市场变化', 
        '生成客户询价的最优报价方案',
        '检查系统运行状态和性能指标'
      ],
      enabledSkills: ['quote-generation', 'order-tracking', 'schedule-query', 'system-config', 'rate-query', 'data-analysis']
    },
    customer: {
      enabled: true,
      nameZh: '客服助手',
      nameEn: 'Customer Assistant',
      slogan: '您的问题，我来解答',
      welcomeMessage: '您好！我是客服助手，很高兴为您服务。我可以帮您查询运价、跟踪订单、安排船期等，有任何问题都可以随时咨询我。',
      initialQuestions: [
        '查询上海到洛杉矶的最新运价',
        '我的订单现在运输到哪里了？',
        '下周有哪些船期可以选择？',
        '如何办理货物进出口手续？'
      ],
      enabledSkills: ['rate-query', 'order-tracking', 'schedule-query', 'intelligent-qa', 'business-consulting']
    },
    platform: {
      enabled: true,
      nameZh: '平台助手',
      nameEn: 'Platform Assistant',
      slogan: '平台管理，智能高效',
      welcomeMessage: '您好！我是平台助手，为平台管理员提供智能化管理服务。我可以协助您进行用户管理、数据分析、系统监控等各项管理工作。',
      initialQuestions: [
        '查看今日新增用户数量和企业注册情况',
        '分析本月平台用户活跃度和使用情况',
        '批量更新港口基础数据和承运人信息',
        '监控系统性能和异常告警情况'
      ],
      enabledSkills: ['data-analysis', 'system-config', 'intelligent-qa', 'automation']
    }
  });

  const getCurrentConfig = (): AIConfig => {
    return configData[activeTab as keyof ConfigData];
  };

  const updateCurrentConfig = (updates: Partial<AIConfig>) => {
    setConfigData(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab as keyof ConfigData],
        ...updates
      }
    }));
  };

  const handleSave = () => {
    setLoading(true);
    // 模拟保存操作
    setTimeout(() => {
      Message.success('配置保存成功');
      setLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    Message.info('配置已重置为默认值');
    // 这里可以重置为默认配置
  };

  const handleInitialQuestionChange = (index: number, value: string) => {
    const currentConfig = getCurrentConfig();
    const newQuestions = [...currentConfig.initialQuestions];
    newQuestions[index] = value;
    updateCurrentConfig({ initialQuestions: newQuestions });
  };

  const addInitialQuestion = () => {
    const currentConfig = getCurrentConfig();
    if (currentConfig.initialQuestions.length < 6) {
      updateCurrentConfig({ 
        initialQuestions: [...currentConfig.initialQuestions, ''] 
      });
    }
  };

  const removeInitialQuestion = (index: number) => {
    const currentConfig = getCurrentConfig();
    const newQuestions = currentConfig.initialQuestions.filter((_, i) => i !== index);
    updateCurrentConfig({ initialQuestions: newQuestions });
  };

  const renderConfigForm = () => {
    const currentConfig = getCurrentConfig();
    
    return (
      <Form layout="vertical" style={{ maxWidth: 800 }}>
        {/* 基础设置 */}
        <Card title="基础设置" style={{ marginBottom: 24 }}>
          <Form.Item label="是否启用">
            <Switch
              checked={currentConfig.enabled}
              onChange={(checked) => updateCurrentConfig({ enabled: checked })}
            />
            <Text type="secondary" style={{ marginLeft: 12 }}>
              启用后，该端的AI助手功能将对用户开放
            </Text>
          </Form.Item>

          <Form.Item label="助手名称（中文）" required>
            <Input
              value={currentConfig.nameZh}
              onChange={(value) => updateCurrentConfig({ nameZh: value })}
              placeholder="请输入中文名称"
            />
          </Form.Item>

          <Form.Item label="助手名称（英文）" required>
            <Input
              value={currentConfig.nameEn}
              onChange={(value) => updateCurrentConfig({ nameEn: value })}
              placeholder="请输入英文名称"
            />
          </Form.Item>

          <Form.Item label="默认标语">
            <Input
              value={currentConfig.slogan}
              onChange={(value) => updateCurrentConfig({ slogan: value })}
              placeholder="请输入助手标语"
            />
          </Form.Item>

          <Form.Item label="默认欢迎语">
            <TextArea
              value={currentConfig.welcomeMessage}
              onChange={(value) => updateCurrentConfig({ welcomeMessage: value })}
              placeholder="请输入欢迎语"
              rows={4}
            />
          </Form.Item>
        </Card>

        {/* 初始引导问题 */}
        <Card title="初始引导问题" style={{ marginBottom: 24 }}>
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            设置AI助手首次对话时向用户展示的示例问题，最多6个
          </Text>
          
          {currentConfig.initialQuestions.map((question, index) => (
            <div key={index} style={{ display: 'flex', marginBottom: 8, alignItems: 'center' }}>
              <Input
                value={question}
                onChange={(value) => handleInitialQuestionChange(index, value)}
                placeholder={`示例问题 ${index + 1}`}
                style={{ flex: 1, marginRight: 8 }}
              />
              {currentConfig.initialQuestions.length > 1 && (
                <Button
                  type="text"
                  status="danger"
                  onClick={() => removeInitialQuestion(index)}
                >
                  删除
                </Button>
              )}
            </div>
          ))}
          
          {currentConfig.initialQuestions.length < 6 && (
            <Button type="dashed" onClick={addInitialQuestion} style={{ width: '100%' }}>
              + 添加引导问题
            </Button>
          )}
        </Card>

        {/* 开启技能 */}
        <Card title="开启技能" style={{ marginBottom: 24 }}>
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            选择该端AI助手可以使用的技能功能
          </Text>
          
          <Checkbox.Group
            value={currentConfig.enabledSkills}
            onChange={(values) => updateCurrentConfig({ enabledSkills: values })}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
              {availableSkills.map(skill => (
                <Checkbox key={skill.value} value={skill.value}>
                  {skill.label}
                </Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        </Card>
      </Form>
    );
  };

  return (
    <div style={{ padding: '0' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <Space>
          <Button 
            icon={<IconArrowLeft />} 
            onClick={() => navigate('/platformadmin/product-center')}
          >
            返回
          </Button>
          <Title heading={3} style={{ margin: 0 }}>
            {productNames[productId || ''] || '未知产品'} - 产品配置
          </Title>
        </Space>
        <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
          配置AI助手在不同端的功能和展示设置
        </Text>
      </div>

      {/* 操作栏 */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Text style={{ fontWeight: 'bold' }}>AI助手配置</Text>
          </Space>
          
          <Space>
            <Button icon={<IconRefresh />} onClick={handleReset}>
              重置
            </Button>
            <Button 
              type="primary" 
              icon={<IconSave />}
              loading={loading}
              onClick={handleSave}
            >
              保存配置
            </Button>
          </Space>
        </div>
      </Card>

      {/* 配置页签 */}
      <Card>
        <Tabs 
          activeTab={activeTab} 
          onChange={setActiveTab}
          type="rounded"
        >
          <TabPane key="operation" title="运营端">
            {renderConfigForm()}
          </TabPane>
          <TabPane key="customer" title="客户端">
            {renderConfigForm()}
          </TabPane>
          <TabPane key="platform" title="平台端">
            {renderConfigForm()}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ProductConfig; 