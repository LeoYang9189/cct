import React, { useState } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Modal,
  Form,
  Message,
  Grid,
  Pagination,
  Dropdown,
  Menu
} from '@arco-design/web-react';
import {
  IconPlus
} from '@arco-design/web-react/icon';

const { Row, Col } = Grid;

/**
 * 模板设置页面组件
 * 提供模板的增删改查功能
 */
const TemplateSettings: React.FC = () => {
  // 模板归类枚举值
  const templateCategories = [
    '海运进口-利润分析-整箱利润分析表',
    '海运进口-费用确认以及开票文件-代垫税费',
    '海运出口-快递信息汇总-DHL打单格式',
    '空运进口-清关文件-介绍信',
    '海运出口-报关文件-报关底单和放行条COPY',
    '海运出口-报关文件-出口许可证'
  ];

  // 模拟数据
  const [printTemplateData, setPrintTemplateData] = useState([
    {
      id: 1,
      templateId: 'TPL001',
      templateName: '提单模板',
      cloudStorageId: 'CS001',
      templateCategory: '海运进口-费用确认以及开票文件-代垫税费',
      templateEngine: 'V3',
      templateUsage: Math.random() > 0.5 ? '打印' : '邮件',
      remark: '标准海运提单模板'
    },
    {
      id: 2,
      templateId: 'TPL002',
      templateName: '发票模板',
      cloudStorageId: 'CS002',
      templateCategory: '空运进口-清关文件-介绍信',
      templateEngine: 'V3',
      templateUsage: Math.random() > 0.5 ? '打印' : '邮件',
      remark: '通用商业发票模板'
    },
    {
      id: 3,
      templateId: 'TPL003',
      templateName: '装箱单模板',
      cloudStorageId: 'CS003',
      templateCategory: '海运出口-报关文件-报关底单和放行条COPY',
      templateEngine: 'V3',
      templateUsage: Math.random() > 0.5 ? '打印' : '邮件',
      remark: '标准装箱单模板'
    },
    {
      id: 4,
      templateId: 'TPL004',
      templateName: '报关单模板',
      cloudStorageId: 'CS004',
      templateCategory: '海运进口-利润分析-整箱利润分析表',
      templateEngine: 'V3',
      templateUsage: Math.random() > 0.5 ? '打印' : '邮件',
      remark: '海关报关单模板'
    },
    {
      id: 5,
      templateId: 'TPL005',
      templateName: '运费确认书模板',
      cloudStorageId: 'CS005',
      templateCategory: '海运出口-快递信息汇总-DHL打单格式',
      templateEngine: 'V3',
      templateUsage: Math.random() > 0.5 ? '打印' : '邮件',
      remark: '运费确认书模板'
    }
  ]);

  // 筛选条件状态
  const [filters, setFilters] = useState({
    templateName: '',
    templateId: '',
    cloudStorageId: '',
    templateCategory: ''
  });

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // 弹窗状态
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [form] = Form.useForm();
  
  // 删除确认弹窗状态
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState<any>(null);

  /**
   * 处理筛选条件变化
   */
  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * 重置筛选条件
   */
  const handleReset = () => {
    setFilters({
      templateName: '',
      templateId: '',
      cloudStorageId: '',
      templateCategory: ''
    });
  };

  /**
   * 新增模板
   */
  const handleAddTemplate = () => {
    setModalType('add');
    setEditingRecord(null);
    form.resetFields();
    // 设置默认值
    form.setFieldsValue({
      templateEngine: 'V3'
    });
    setModalVisible(true);
  };

  /**
   * 编辑模板
   */
  const handleEditTemplate = (record: any) => {
    setModalType('edit');
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  /**
   * 复制模板
   */
  const handleCopyTemplate = (record: any) => {
    const newRecord = {
      ...record,
      id: Date.now(),
      templateId: `${record.templateId}_COPY`,
      templateName: `${record.templateName}_副本`
    };
    setPrintTemplateData(prev => [...prev, newRecord]);
    Message.success('模板复制成功');
  };

  /**
   * 删除模板 - 显示确认弹窗
   */
  const handleDeleteTemplate = (record: any) => {
    setDeleteRecord(record);
    setDeleteModalVisible(true);
  };

  /**
   * 确认删除模板
   */
  const confirmDeleteTemplate = () => {
    if (deleteRecord) {
      setPrintTemplateData(prev => prev.filter(item => item.id !== deleteRecord.id));
      Message.success('模板删除成功');
      setDeleteModalVisible(false);
      setDeleteRecord(null);
    }
  };

  /**
   * 取消删除
   */
  const cancelDeleteTemplate = () => {
    setDeleteModalVisible(false);
    setDeleteRecord(null);
  };



  /**
   * 生成新的模板ID
   */
  const generateTemplateId = () => {
    const maxId = Math.max(...printTemplateData.map(item => parseInt(item.templateId.replace('TPL', ''))));
    return `TPL${String(maxId + 1).padStart(3, '0')}`;
  };

  /**
   * 生成新的云存储ID
   */
  const generateCloudStorageId = () => {
    const maxId = Math.max(...printTemplateData.map(item => parseInt(item.cloudStorageId.replace('CS', ''))));
    return `CS${String(maxId + 1).padStart(3, '0')}`;
  };

  /**
   * 提交表单
   */
  const handleSubmit = async () => {
    try {
      const values = await form.validate();
      
      if (modalType === 'add') {
        // 新增逻辑，自动生成ID
        const newRecord = {
          ...values,
          id: Date.now(),
          templateId: generateTemplateId(),
          cloudStorageId: generateCloudStorageId(),
          templateEngine: 'V3' // 固定为V3
        };
        setPrintTemplateData(prev => [...prev, newRecord]);
        Message.success('模板新增成功');
      } else {
        // 编辑逻辑
        setPrintTemplateData(prev => 
          prev.map(item => 
            item.id === editingRecord.id 
              ? { ...item, ...values, templateEngine: 'V3' }
              : item
          )
        );
        Message.success('模板编辑成功');
      }
      
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  /**
   * 取消弹窗
   */
  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  /**
   * 根据筛选条件过滤数据
   */
  const getFilteredData = () => {
    return printTemplateData.filter(item => {
      return (
        (!filters.templateName || item.templateName.toLowerCase().includes(filters.templateName.toLowerCase())) &&
        (!filters.templateId || item.templateId.toLowerCase().includes(filters.templateId.toLowerCase())) &&
        (!filters.cloudStorageId || item.cloudStorageId.toLowerCase().includes(filters.cloudStorageId.toLowerCase())) &&
        (!filters.templateCategory || item.templateCategory === filters.templateCategory)
      );
    });
  };

  const filteredData = getFilteredData();
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);

  // 表格列配置
  const columns: any[] = [
    {
      title: '模板ID',
      dataIndex: 'templateId',
      key: 'templateId',
      width: 120,
      ellipsis: {
        showTooltip: true,
      },
    },
    {
      title: '模板名称',
      dataIndex: 'templateName',
      key: 'templateName',
      width: 150,
      ellipsis: {
        showTooltip: true,
      },
    },
    {
      title: '云存储ID',
      dataIndex: 'cloudStorageId',
      key: 'cloudStorageId',
      width: 120,
      ellipsis: {
        showTooltip: true,
      },
    },

    {
      title: '模板归类',
      dataIndex: 'templateCategory',
      key: 'templateCategory',
      width: 200,
      ellipsis: {
        showTooltip: true,
      },
    },
    {
      title: '模板引擎',
      dataIndex: 'templateEngine',
      key: 'templateEngine',
      width: 100,
      ellipsis: {
        showTooltip: true,
      },
    },
    {
      title: '模板用途',
      dataIndex: 'templateUsage',
      key: 'templateUsage',
      width: 100,
      ellipsis: {
        showTooltip: true,
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 150,
      ellipsis: {
        showTooltip: true,
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space>
          <Button 
            type="text" 
            size="small"
            onClick={() => handleEditTemplate(record)}
          >
            编辑
          </Button>
          <Button 
            type="text" 
            size="small"
            onClick={() => handleCopyTemplate(record)}
          >
            复制
          </Button>
          <Dropdown
            droplist={
              <Menu>
                <Menu.Item key="delete" onClick={() => handleDeleteTemplate(record.id)}>
                  删除
                </Menu.Item>
                <Menu.Item key="config" onClick={() => window.open('https://reportv3.cargoware.com/report/designer', '_blank')}>
                  配置
                </Menu.Item>
              </Menu>
            }
            position="bottom"
          >
            <Button type="text" size="small">
              更多
            </Button>
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-[15px]">
      {/* 筛选区域 */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <Row gutter={16}>
          <Col span={6}>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">模板名称</label>
              <Input
                placeholder="请输入模板名称"
                value={filters.templateName}
                onChange={(value) => handleFilterChange('templateName', value)}
                allowClear
              />
            </div>
          </Col>
          <Col span={6}>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">模板ID</label>
              <Input
                placeholder="请输入模板ID"
                value={filters.templateId}
                onChange={(value) => handleFilterChange('templateId', value)}
                allowClear
              />
            </div>
          </Col>
          <Col span={6}>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">云存储ID</label>
              <Input
                placeholder="请输入云存储ID"
                value={filters.cloudStorageId}
                onChange={(value) => handleFilterChange('cloudStorageId', value)}
                allowClear
              />
            </div>
          </Col>

        </Row>
        <Row gutter={16} className="mt-2">
          <Col span={6}>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">模板归类</label>
              <Select
                placeholder="请选择模板归类"
                value={filters.templateCategory}
                onChange={(value) => handleFilterChange('templateCategory', value)}
                allowClear
                style={{ width: '100%' }}
              >
                {templateCategories.map(category => (
                  <Select.Option key={category} value={category}>{category}</Select.Option>
                ))}
              </Select>
            </div>
          </Col>
        </Row>
        <Row gutter={16} className="mt-4">
          <Col span={24}>
            <Space>
              <Button type="primary">
                搜索
              </Button>
              <Button onClick={handleReset}>
                重置
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* 功能按钮区域 */}
      <div className="mb-4">
        <Button type="primary" icon={<IconPlus />} onClick={handleAddTemplate}>
          新增模板
        </Button>
      </div>

      {/* 表格 */}
      <div className="bg-white rounded-lg shadow-sm">
        <Table
          columns={columns}
          data={currentData}
          pagination={false}
          scroll={{ x: 1180 }}
          rowKey="id"
        />
        
        {/* 分页 */}
        <div className="p-4 flex justify-end">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredData.length}
            onChange={setCurrentPage}
            showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
            showJumper
          />
        </div>
      </div>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={modalType === 'add' ? '新增模板' : '编辑模板'}
        visible={modalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        autoFocus={false}
        focusLock={true}
        style={{ width: 600 }}
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          {/* 第一行：模板名称 + 模板引擎 */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              label="模板名称"
              field="templateName"
              rules={[
                { required: true, message: '请输入模板名称' },
                { minLength: 2, message: '模板名称至少2个字符' }
              ]}
              style={{ flex: 1 }}
            >
              <Input placeholder="请输入模板名称" />
            </Form.Item>

            <Form.Item
              label="模板引擎"
              field="templateEngine"
              rules={[
                { required: true, message: '请选择模板引擎' }
              ]}
              style={{ flex: 1 }}
            >
              <Select placeholder="请选择模板引擎" defaultValue="V3">
                <Select.Option value="V3">V3</Select.Option>
              </Select>
            </Form.Item>
          </div>

          {modalType === 'edit' && (
            <>
              {/* 第二行：模板ID + 云存储ID（仅编辑时显示） */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <Form.Item
                  label="模板ID"
                  field="templateId"
                  rules={[
                    { required: true, message: '请输入模板ID' },
                    { minLength: 3, message: '模板ID至少3个字符' }
                  ]}
                  style={{ flex: 1 }}
                >
                  <Input placeholder="请输入模板ID" disabled />
                </Form.Item>

                <Form.Item
                  label="云存储ID"
                  field="cloudStorageId"
                  rules={[
                    { required: true, message: '请输入云存储ID' }
                  ]}
                  style={{ flex: 1 }}
                >
                  <Input placeholder="请输入云存储ID" disabled />
                </Form.Item>
              </div>
            </>
          )}

          {/* 第三行：模板用途 */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              label="模板用途"
              field="templateUsage"
              rules={[
                { required: true, message: '请选择模板用途' }
              ]}
              style={{ flex: 1 }}
            >
              <Select placeholder="请选择模板用途">
                <Select.Option value="打印">打印</Select.Option>
                <Select.Option value="邮件">邮件</Select.Option>
              </Select>
            </Form.Item>
          </div>

          {/* 第四行：模板归类（单独一行，因为新增时只有一个字段） */}
          <Form.Item
            label="模板归类"
            field="templateCategory"
            rules={[
              { required: true, message: '请选择模板归类' }
            ]}
            style={{ width: modalType === 'add' ? '50%' : '100%' }}
          >
            <Select placeholder="请选择模板归类">
              {templateCategories.map(category => (
                <Select.Option key={category} value={category}>{category}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* 备注单独一行 */}
          <Form.Item
            label="备注"
            field="remark"
          >
            <Input.TextArea 
              placeholder="请输入备注信息" 
              rows={3}
              maxLength={200}
              showWordLimit
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 删除确认弹窗 */}
      <Modal
        title="确认删除"
        visible={deleteModalVisible}
        onOk={confirmDeleteTemplate}
        onCancel={cancelDeleteTemplate}
        autoFocus={false}
        focusLock={true}
        okText="确认删除"
        cancelText="取消"
        okButtonProps={{ status: 'danger' }}
        style={{ width: 480 }}
      >
        <div style={{ padding: '20px 0' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{ 
              color: '#ff4d4f', 
              fontSize: '20px',
              lineHeight: '1',
              marginTop: '2px'
            }}>
              ⚠️
            </div>
            <div>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: 500, 
                color: '#262626',
                marginBottom: '8px'
              }}>
                确定要删除模板"{deleteRecord?.templateName}"吗？
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: '#8c8c8c',
                lineHeight: '1.5'
              }}>
                删除后不可恢复，请谨慎操作。
              </div>
            </div>
          </div>
          
          {deleteRecord && (
            <div style={{ 
              background: '#fafafa', 
              padding: '12px', 
              borderRadius: '6px',
              border: '1px solid #f0f0f0'
            }}>
              <div style={{ fontSize: '14px', color: '#595959', marginBottom: '4px' }}>
                <strong>模板信息：</strong>
              </div>
              <div style={{ fontSize: '13px', color: '#8c8c8c' }}>
                模板ID：{deleteRecord.templateId}
              </div>
              <div style={{ fontSize: '13px', color: '#8c8c8c' }}>
                模板归类：{deleteRecord.templateCategory}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default TemplateSettings;