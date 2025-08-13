import React, { useState } from 'react';
import { Card, Button, Table, Input, Select, Space, Tag, Modal, Form, Progress, Descriptions, Tabs } from '@arco-design/web-react';
import { IconSearch, IconPlus, IconEye, IconEdit, IconDelete, IconDownload, IconUpload } from '@arco-design/web-react/icon';

/**
 * 合同管理页面组件
 * 提供合同的全生命周期管理功能
 */
const ContractManagement: React.FC = () => {
  // const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [form] = Form.useForm();

  // 模拟合同数据
  const [data, setData] = useState([
    {
      id: 1,
      contractNo: 'CT2024001',
      contractName: '深圳科技公司货运服务合同',
      customer: '深圳市科技有限公司',
      contractType: 'service',
      amount: 500000,
      currency: 'CNY',
      signDate: '2024-01-15',
      startDate: '2024-02-01',
      endDate: '2024-12-31',
      status: 'active',
      progress: 65,
      paymentTerms: '30天',
      salesRep: '李销售',
      createTime: '2024-01-10',
      lastModified: '2024-01-20',
      attachments: ['合同正本.pdf', '补充协议.pdf'],
      description: '提供全年货运物流服务，包括海运、空运等多种运输方式',
      terms: [
        '服务期限：2024年2月1日至2024年12月31日',
        '付款方式：月结30天',
        '服务范围：全球货运代理服务',
        '违约责任：按合同金额的5%承担违约金'
      ]
    },
    {
      id: 2,
      contractNo: 'CT2024002',
      contractName: '上海贸易集团年度合作协议',
      customer: '上海贸易集团',
      contractType: 'cooperation',
      amount: 2000000,
      currency: 'CNY',
      signDate: '2024-01-20',
      startDate: '2024-02-01',
      endDate: '2025-01-31',
      status: 'active',
      progress: 30,
      paymentTerms: '15天',
      salesRep: '王销售',
      createTime: '2024-01-15',
      lastModified: '2024-01-22',
      attachments: ['合作协议.pdf', '价格清单.xlsx'],
      description: '年度战略合作协议，涵盖多条航线的货运服务',
      terms: [
        '合作期限：一年',
        '最低货量承诺：每月100TEU',
        '价格优惠：基础价格9折',
        '结算周期：半月结'
      ]
    },
    {
      id: 3,
      contractNo: 'CT2024003',
      contractName: '广州物流专项服务合同',
      customer: '广州物流公司',
      contractType: 'project',
      amount: 300000,
      currency: 'CNY',
      signDate: '2024-01-25',
      startDate: '2024-02-15',
      endDate: '2024-06-15',
      status: 'pending',
      progress: 0,
      paymentTerms: '45天',
      salesRep: '赵销售',
      createTime: '2024-01-20',
      lastModified: '2024-01-25',
      attachments: ['项目合同.pdf'],
      description: '特殊货物运输项目，包括危险品和超大件货物',
      terms: [
        '项目周期：4个月',
        '特殊要求：危险品运输资质',
        '保险要求：全程货物保险',
        '验收标准：按项目计划执行'
      ]
    }
  ]);

  const columns = [
    {
      title: '合同编号',
      dataIndex: 'contractNo',
      key: 'contractNo',
      width: 120,
    },
    {
      title: '合同名称',
      dataIndex: 'contractName',
      key: 'contractName',
      width: 200,
    },
    {
      title: '客户',
      dataIndex: 'customer',
      key: 'customer',
      width: 150,
    },
    {
      title: '合同类型',
      dataIndex: 'contractType',
      key: 'contractType',
      width: 100,
      render: (type: string) => {
        const typeMap = {
          service: { color: 'blue', text: '服务合同' },
          cooperation: { color: 'green', text: '合作协议' },
          project: { color: 'orange', text: '项目合同' },
          purchase: { color: 'purple', text: '采购合同' },
        };
        const config = typeMap[type as keyof typeof typeMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '合同金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number, record: any) => 
        `${record.currency === 'CNY' ? '¥' : '$'}${amount.toLocaleString()}`,
    },
    {
      title: '执行进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 120,
      render: (progress: number) => (
        <Progress percent={progress} size="small" />
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
          pending: { color: 'orange', text: '待生效' },
          active: { color: 'green', text: '执行中' },
          completed: { color: 'blue', text: '已完成' },
          terminated: { color: 'red', text: '已终止' },
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '销售代表',
      dataIndex: 'salesRep',
      key: 'salesRep',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
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
            icon={<IconDownload />}
            onClick={() => handleDownload(record)}
          >
            下载
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
   * 处理查看合同详情
   */
  const handleViewDetail = (record: any) => {
    setSelectedContract(record);
    setDetailModalVisible(true);
  };

  /**
   * 处理编辑合同信息
   */
  const handleEdit = (record: any) => {
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  /**
   * 处理下载合同
   */
  const handleDownload = (record: any) => {
    // 这里应该调用下载API
    console.log('下载合同:', record.contractNo);
  };

  /**
   * 处理删除合同
   */
  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除合同"${record.contractName}"吗？`,
      onOk: () => {
        setData(data.filter(item => item.id !== record.id));
      },
    });
  };

  /**
   * 处理添加新合同
   */
  const handleAdd = () => {
    form.resetFields();
    setModalVisible(true);
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
      item.contractNo.toLowerCase().includes(searchText.toLowerCase()) ||
      item.contractName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6">
      <Card>
        <div className="mb-6">
          {/* 操作栏 */}
          <div className="flex justify-between items-center mb-4">
            <Space>
              <Input
                placeholder="搜索合同编号、名称或客户"
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
                <Select.Option value="pending">待生效</Select.Option>
                <Select.Option value="active">执行中</Select.Option>
                <Select.Option value="completed">已完成</Select.Option>
                <Select.Option value="terminated">已终止</Select.Option>
              </Select>
            </Space>
            
            <Space>
              <Button
                icon={<IconUpload />}
              >
                导入合同
              </Button>
              <Button
                type="primary"
                icon={<IconPlus />}
                onClick={handleAdd}
              >
                新建合同
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

        {/* 添加/编辑合同弹窗 */}
        <Modal
          title="合同信息"
          visible={modalVisible}
          onOk={handleSubmit}
          onCancel={() => setModalVisible(false)}
          autoFocus={false}
          focusLock={true}
          style={{ width: 700 }}
        >
          <Form form={form} layout="vertical">
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="合同编号"
                field="contractNo"
                rules={[{ required: true, message: '请输入合同编号' }]}
              >
                <Input placeholder="请输入合同编号" />
              </Form.Item>
              
              <Form.Item
                label="合同名称"
                field="contractName"
                rules={[{ required: true, message: '请输入合同名称' }]}
              >
                <Input placeholder="请输入合同名称" />
              </Form.Item>
              
              <Form.Item
                label="客户"
                field="customer"
                rules={[{ required: true, message: '请输入客户' }]}
              >
                <Input placeholder="请输入客户" />
              </Form.Item>
              
              <Form.Item
                label="合同类型"
                field="contractType"
                rules={[{ required: true, message: '请选择合同类型' }]}
              >
                <Select placeholder="请选择合同类型">
                  <Select.Option value="service">服务合同</Select.Option>
                  <Select.Option value="cooperation">合作协议</Select.Option>
                  <Select.Option value="project">项目合同</Select.Option>
                  <Select.Option value="purchase">采购合同</Select.Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                label="合同金额"
                field="amount"
                rules={[{ required: true, message: '请输入合同金额' }]}
              >
                <Input placeholder="请输入合同金额" />
              </Form.Item>
              
              <Form.Item
                label="币种"
                field="currency"
                rules={[{ required: true, message: '请选择币种' }]}
              >
                <Select placeholder="请选择币种">
                  <Select.Option value="CNY">人民币</Select.Option>
                  <Select.Option value="USD">美元</Select.Option>
                  <Select.Option value="EUR">欧元</Select.Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                label="签署日期"
                field="signDate"
                rules={[{ required: true, message: '请输入签署日期' }]}
              >
                <Input placeholder="请输入签署日期 (YYYY-MM-DD)" />
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
              
              <Form.Item
                label="付款条件"
                field="paymentTerms"
                rules={[{ required: true, message: '请输入付款条件' }]}
              >
                <Input placeholder="请输入付款条件" />
              </Form.Item>
              
              <Form.Item
                label="销售代表"
                field="salesRep"
                rules={[{ required: true, message: '请输入销售代表' }]}
              >
                <Input placeholder="请输入销售代表" />
              </Form.Item>
              
              <Form.Item
                label="执行进度"
                field="progress"
              >
                <Input placeholder="请输入执行进度 (0-100)" />
              </Form.Item>
            </div>
            
            <Form.Item
              label="合同描述"
              field="description"
            >
              <Input.TextArea placeholder="请输入合同描述" rows={3} />
            </Form.Item>
          </Form>
        </Modal>

        {/* 合同详情弹窗 */}
        <Modal
          title="合同详情"
          visible={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={null}
          style={{ width: 800 }}
        >
          {selectedContract && (
            <Tabs defaultActiveTab="basic">
              <Tabs.TabPane key="basic" title="基本信息">
                <Descriptions
                  column={2}
                  data={[
                    { label: '合同编号', value: selectedContract.contractNo },
                    { label: '合同名称', value: selectedContract.contractName },
                    { label: '客户', value: selectedContract.customer },
                    { label: '合同类型', value: selectedContract.contractType },
                    { label: '合同金额', value: `${selectedContract.currency === 'CNY' ? '¥' : '$'}${selectedContract.amount.toLocaleString()}` },
                    { label: '签署日期', value: selectedContract.signDate },
                    { label: '开始日期', value: selectedContract.startDate },
                    { label: '结束日期', value: selectedContract.endDate },
                    { label: '付款条件', value: selectedContract.paymentTerms },
                    { label: '销售代表', value: selectedContract.salesRep },
                    { label: '创建时间', value: selectedContract.createTime },
                    { label: '最后修改', value: selectedContract.lastModified },
                  ]}
                />
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">执行进度</h4>
                  <Progress percent={selectedContract.progress} />
                </div>
                
                {selectedContract.description && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">合同描述</h4>
                    <p className="text-gray-600">{selectedContract.description}</p>
                  </div>
                )}
              </Tabs.TabPane>
              
              <Tabs.TabPane key="terms" title="合同条款">
                <div>
                  <h4 className="font-medium mb-3">主要条款</h4>
                  <ul className="space-y-2">
                    {selectedContract.terms.map((term: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{term}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Tabs.TabPane>
              
              <Tabs.TabPane key="attachments" title="附件">
                <div>
                  <h4 className="font-medium mb-3">合同附件</h4>
                  <div className="space-y-2">
                    {selectedContract.attachments.map((file: string, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <span className="text-gray-700">{file}</span>
                        <Button size="small" icon={<IconDownload />}>
                          下载
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </Tabs.TabPane>
            </Tabs>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default ContractManagement;