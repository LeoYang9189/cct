import React, { useState } from 'react';
import { Card, Button, Table, Input, Select, Space, Tag, Modal, Form, Progress, Statistic, Grid } from '@arco-design/web-react';
import { IconSearch, IconPlus, IconEye, IconEdit, IconDelete, IconSend, IconRobot, IconTag } from '@arco-design/web-react/icon';

/**
 * AI营销页面组件
 * 提供AI驱动的营销活动管理和分析功能
 */
const AiMarketing: React.FC = () => {
  // const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [form] = Form.useForm();

  // 模拟营销活动数据
  const [data, setData] = useState([
    {
      id: 1,
      campaignName: '春节物流促销活动',
      type: 'promotion',
      channel: 'email',
      targetAudience: 'VIP客户',
      status: 'active',
      startDate: '2024-01-20',
      endDate: '2024-02-20',
      budget: 50000,
      spent: 32000,
      impressions: 15000,
      clicks: 1200,
      conversions: 85,
      ctr: 8.0,
      conversionRate: 7.08,
      roi: 240,
      aiScore: 92,
      description: '针对VIP客户的春节特惠活动，提供运费优惠和增值服务',
      createdBy: '营销部',
      createTime: '2024-01-15'
    },
    {
      id: 2,
      campaignName: '新客户获取计划',
      type: 'acquisition',
      channel: 'social',
      targetAudience: '潜在客户',
      status: 'active',
      startDate: '2024-01-25',
      endDate: '2024-03-25',
      budget: 80000,
      spent: 25000,
      impressions: 25000,
      clicks: 1800,
      conversions: 120,
      ctr: 7.2,
      conversionRate: 6.67,
      roi: 180,
      aiScore: 88,
      description: 'AI智能投放，精准定位潜在客户群体',
      createdBy: '销售部',
      createTime: '2024-01-20'
    },
    {
      id: 3,
      campaignName: '客户留存提升活动',
      type: 'retention',
      channel: 'sms',
      targetAudience: '流失客户',
      status: 'completed',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      budget: 30000,
      spent: 28000,
      impressions: 8000,
      clicks: 640,
      conversions: 45,
      ctr: 8.0,
      conversionRate: 7.03,
      roi: 160,
      aiScore: 85,
      description: '通过个性化内容重新激活流失客户',
      createdBy: '客服部',
      createTime: '2023-12-25'
    }
  ]);

  const columns = [
    {
      title: '活动名称',
      dataIndex: 'campaignName',
      key: 'campaignName',
      width: 180,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const typeMap = {
          promotion: { color: 'blue', text: '促销活动' },
          acquisition: { color: 'green', text: '获客活动' },
          retention: { color: 'orange', text: '留存活动' },
          branding: { color: 'purple', text: '品牌推广' },
        };
        const config = typeMap[type as keyof typeof typeMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '渠道',
      dataIndex: 'channel',
      key: 'channel',
      width: 80,
      render: (channel: string) => {
        const channelMap = {
          email: '邮件',
          sms: '短信',
          social: '社交媒体',
          search: '搜索引擎',
          display: '展示广告',
        };
        return channelMap[channel as keyof typeof channelMap] || channel;
      },
    },
    {
      title: '目标受众',
      dataIndex: 'targetAudience',
      key: 'targetAudience',
      width: 100,
    },
    {
      title: '预算/花费',
      key: 'budget',
      width: 120,
      render: (_: any, record: any) => (
        <div>
          <div className="text-sm">¥{record.budget.toLocaleString()}</div>
          <div className="text-xs text-gray-500">¥{record.spent.toLocaleString()}</div>
        </div>
      ),
    },
    {
      title: '点击率',
      dataIndex: 'ctr',
      key: 'ctr',
      width: 80,
      render: (ctr: number) => `${ctr}%`,
    },
    {
      title: '转化率',
      dataIndex: 'conversionRate',
      key: 'conversionRate',
      width: 80,
      render: (rate: number) => `${rate}%`,
    },
    {
      title: 'ROI',
      dataIndex: 'roi',
      key: 'roi',
      width: 80,
      render: (roi: number) => `${roi}%`,
    },
    {
      title: 'AI评分',
      dataIndex: 'aiScore',
      key: 'aiScore',
      width: 80,
      render: (score: number) => (
        <div className="flex items-center">
          <Progress
            percent={score}
            size="mini"
            color={score >= 90 ? '#00B42A' : score >= 80 ? '#FF7D00' : '#F53F3F'}
            style={{ width: 40 }}
          />
          <span className="ml-2 text-sm">{score}</span>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => {
        const statusMap = {
          draft: { color: 'gray', text: '草稿' },
          active: { color: 'green', text: '进行中' },
          paused: { color: 'orange', text: '已暂停' },
          completed: { color: 'blue', text: '已完成' },
          cancelled: { color: 'red', text: '已取消' },
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<IconEye />}
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          <Button
            type="text"
            size="small"
            icon={<IconEdit />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="text"
            size="small"
            status="danger"
            icon={<IconDelete />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  /**
   * 处理查看活动详情
   */
  const handleViewDetail = (record: any) => {
    setSelectedCampaign(record);
    setDetailModalVisible(true);
  };

  /**
   * 处理编辑活动信息
   */
  const handleEdit = (record: any) => {
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  /**
   * 处理删除活动
   */
  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除营销活动"${record.campaignName}"吗？`,
      onOk: () => {
        setData(data.filter(item => item.id !== record.id));
      },
    });
  };

  /**
   * 处理添加新活动
   */
  const handleAdd = () => {
    form.resetFields();
    setModalVisible(true);
  };

  /**
   * 处理AI优化建议
   */
  const handleAiOptimize = () => {
    Modal.info({
      title: 'AI优化建议',
      content: (
        <div className="space-y-3">
          <div className="flex items-start">
            <IconRobot className="mt-1 mr-2 text-blue-500" />
            <div>
              <div className="font-medium">受众优化</div>
              <div className="text-sm text-gray-600">建议将目标受众细分为3个子群体，预计可提升转化率15%</div>
            </div>
          </div>
          <div className="flex items-start">
            <IconTag className="mt-1 mr-2 text-green-500" />
            <div>
              <div className="font-medium">投放时间优化</div>
              <div className="text-sm text-gray-600">建议在工作日上午9-11点投放，点击率可提升20%</div>
            </div>
          </div>
          <div className="flex items-start">
            <IconSend className="mt-1 mr-2 text-orange-500" />
            <div>
              <div className="font-medium">内容优化</div>
              <div className="text-sm text-gray-600">建议使用更具吸引力的标题，预计可提升打开率25%</div>
            </div>
          </div>
        </div>
      ),
    });
  };

  /**
   * 处理表单提交
   */
  const handleSubmit = async () => {
    try {
      await form.validate();
      // 这里应该调用API保存数据
      setModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 过滤数据
  const filteredData = data.filter(item => {
    const matchSearch = !searchText || 
      item.campaignName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.targetAudience.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // 计算统计数据
  const totalBudget = data.reduce((sum, item) => sum + item.budget, 0);
  const totalSpent = data.reduce((sum, item) => sum + item.spent, 0);
  const totalImpressions = data.reduce((sum, item) => sum + item.impressions, 0);
  const avgRoi = data.reduce((sum, item) => sum + item.roi, 0) / data.length;

  return (
    <div className="p-6">
      {/* 统计卡片 */}
      <Grid.Row gutter={16} className="mb-6">
        <Grid.Col span={6}>
          <Card>
            <Statistic
              title="总预算"
              value={totalBudget}
              precision={0}
              prefix="¥"
              countUp
            />
          </Card>
        </Grid.Col>
        <Grid.Col span={6}>
          <Card>
            <Statistic
              title="已花费"
              value={totalSpent}
              precision={0}
              prefix="¥"
              countUp
            />
          </Card>
        </Grid.Col>
        <Grid.Col span={6}>
          <Card>
            <Statistic
              title="总曝光"
              value={totalImpressions}
              precision={0}
              countUp
            />
          </Card>
        </Grid.Col>
        <Grid.Col span={6}>
          <Card>
            <Statistic
              title="平均ROI"
              value={avgRoi}
              precision={1}
              suffix="%"
              countUp
            />
          </Card>
        </Grid.Col>
      </Grid.Row>

      <Card>
        <div className="mb-6">
          {/* 操作栏 */}
          <div className="flex justify-between items-center mb-4">
            <Space>
              <Input
                placeholder="搜索活动名称或受众"
                value={searchText}
                onChange={setSearchText}
                prefix={<IconSearch />}
                style={{ width: 250 }}
              />
              <Select
                placeholder="选择状态"
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 120 }}
              >
                <Select.Option value="all">全部状态</Select.Option>
                <Select.Option value="draft">草稿</Select.Option>
                <Select.Option value="active">进行中</Select.Option>
                <Select.Option value="paused">已暂停</Select.Option>
                <Select.Option value="completed">已完成</Select.Option>
                <Select.Option value="cancelled">已取消</Select.Option>
              </Select>
            </Space>
            
            <Space>
              <Button
                icon={<IconRobot />}
                onClick={handleAiOptimize}
              >
                AI优化建议
              </Button>
              <Button
                type="primary"
                icon={<IconPlus />}
                onClick={handleAdd}
              >
                创建活动
              </Button>
            </Space>
          </div>
        </div>

        {/* 数据表格 */}
        <Table
          columns={columns}
          data={filteredData}
          pagination={{
            pageSize: 10,
            showTotal: true,
            showJumper: true,
          }}
          rowKey="id"
        />

        {/* 添加/编辑活动弹窗 */}
        <Modal
          title="营销活动"
          visible={modalVisible}
          onOk={handleSubmit}
          onCancel={() => setModalVisible(false)}
          autoFocus={false}
          focusLock={true}
          style={{ width: 600 }}
        >
          <Form form={form} layout="vertical">
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="活动名称"
                field="campaignName"
                rules={[{ required: true, message: '请输入活动名称' }]}
              >
                <Input placeholder="请输入活动名称" />
              </Form.Item>
              
              <Form.Item
                label="活动类型"
                field="type"
                rules={[{ required: true, message: '请选择活动类型' }]}
              >
                <Select placeholder="请选择活动类型">
                  <Select.Option value="promotion">促销活动</Select.Option>
                  <Select.Option value="acquisition">获客活动</Select.Option>
                  <Select.Option value="retention">留存活动</Select.Option>
                  <Select.Option value="branding">品牌推广</Select.Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                label="投放渠道"
                field="channel"
                rules={[{ required: true, message: '请选择投放渠道' }]}
              >
                <Select placeholder="请选择投放渠道">
                  <Select.Option value="email">邮件</Select.Option>
                  <Select.Option value="sms">短信</Select.Option>
                  <Select.Option value="social">社交媒体</Select.Option>
                  <Select.Option value="search">搜索引擎</Select.Option>
                  <Select.Option value="display">展示广告</Select.Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                label="目标受众"
                field="targetAudience"
                rules={[{ required: true, message: '请输入目标受众' }]}
              >
                <Input placeholder="请输入目标受众" />
              </Form.Item>
              
              <Form.Item
                label="预算"
                field="budget"
                rules={[{ required: true, message: '请输入预算' }]}
              >
                <Input placeholder="请输入预算" />
              </Form.Item>
              
              <Form.Item
                label="状态"
                field="status"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Select.Option value="draft">草稿</Select.Option>
                  <Select.Option value="active">进行中</Select.Option>
                  <Select.Option value="paused">已暂停</Select.Option>
                  <Select.Option value="completed">已完成</Select.Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                label="开始日期"
                field="startDate"
                rules={[{ required: true, message: '请输入开始日期' }]}
              >
                <Input placeholder="请输入开始日期 (YYYY-MM-DD)" />
              </Form.Item>
              
              <Form.Item
                label="结束日期"
                field="endDate"
                rules={[{ required: true, message: '请输入结束日期' }]}
              >
                <Input placeholder="请输入结束日期 (YYYY-MM-DD)" />
              </Form.Item>
            </div>
            
            <Form.Item
              label="活动描述"
              field="description"
            >
              <Input.TextArea placeholder="请输入活动描述" rows={3} />
            </Form.Item>
          </Form>
        </Modal>

        {/* 活动详情弹窗 */}
        <Modal
          title="活动详情"
          visible={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={null}
          style={{ width: 800 }}
        >
          {selectedCampaign && (
            <div>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <Card size="small">
                  <Statistic
                    title="曝光量"
                    value={selectedCampaign.impressions}
                    precision={0}
                  />
                </Card>
                <Card size="small">
                  <Statistic
                    title="点击量"
                    value={selectedCampaign.clicks}
                    precision={0}
                  />
                </Card>
                <Card size="small">
                  <Statistic
                    title="转化量"
                    value={selectedCampaign.conversions}
                    precision={0}
                  />
                </Card>
                <Card size="small">
                  <Statistic
                    title="AI评分"
                    value={selectedCampaign.aiScore}
                    precision={0}
                  />
                </Card>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">基本信息</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>活动名称: {selectedCampaign.campaignName}</div>
                    <div>活动类型: {selectedCampaign.type}</div>
                    <div>投放渠道: {selectedCampaign.channel}</div>
                    <div>目标受众: {selectedCampaign.targetAudience}</div>
                    <div>开始日期: {selectedCampaign.startDate}</div>
                    <div>结束日期: {selectedCampaign.endDate}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">效果数据</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>点击率: {selectedCampaign.ctr}%</div>
                    <div>转化率: {selectedCampaign.conversionRate}%</div>
                    <div>ROI: {selectedCampaign.roi}%</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">预算使用</h4>
                  <Progress
                    percent={(selectedCampaign.spent / selectedCampaign.budget) * 100}
                    formatText={() => `¥${selectedCampaign.spent.toLocaleString()} / ¥${selectedCampaign.budget.toLocaleString()}`}
                  />
                </div>
                
                {selectedCampaign.description && (
                  <div>
                    <h4 className="font-medium mb-2">活动描述</h4>
                    <p className="text-gray-600">{selectedCampaign.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default AiMarketing;