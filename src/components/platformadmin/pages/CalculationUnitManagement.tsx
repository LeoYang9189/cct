import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Message,
  Popconfirm,
  Typography,
  Radio
} from '@arco-design/web-react';
import {
  IconPlus,
  IconEdit,
  IconSearch,
  IconRefresh,
  IconUpload,
  IconDownload
} from '@arco-design/web-react/icon';

const { Option } = Select;
const { Title } = Typography;

// 计费单位数据接口
interface CalculationUnit {
  id: string;
  unitNameCn: string;
  unitNameEn: string;
  isContainerUnit: boolean;
  containerType?: string;
  status: 'enabled' | 'disabled';
}

// 搜索筛选参数
interface SearchParams {
  keyword: string;
  isContainerUnit: string;
  status: string;
}

// 箱型选项
const containerTypeOptions = [
  { value: '20GP', label: '20GP' },
  { value: '40GP', label: '40GP' },
  { value: '40HC', label: '40HC' },
  { value: '20RF', label: '20RF' },
  { value: '40RF', label: '40RF' },
  { value: '45HC', label: '45HC' },
  { value: '20OT', label: '20OT' },
  { value: '40OT', label: '40OT' }
];

const CalculationUnitManagement: React.FC = () => {
  const [data, setData] = useState<CalculationUnit[]>([]);
  const [filteredData, setFilteredData] = useState<CalculationUnit[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [currentUnit, setCurrentUnit] = useState<CalculationUnit | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    isContainerUnit: '',
    status: ''
  });

  const [editForm] = Form.useForm();

  // 初始化示例数据
  useEffect(() => {
    const mockData: CalculationUnit[] = [
      {
        id: '1',
        unitNameCn: '千克',
        unitNameEn: 'Kilogram',
        isContainerUnit: false,
        status: 'enabled' as const
      },
      {
        id: '2',
        unitNameCn: '吨',
        unitNameEn: 'Ton',
        isContainerUnit: false,
        status: 'enabled' as const
      },
      {
        id: '3',
        unitNameCn: '立方米',
        unitNameEn: 'Cubic Meter',
        isContainerUnit: false,
        status: 'enabled' as const
      },
      {
        id: '4',
        unitNameCn: '20英尺集装箱',
        unitNameEn: '20ft Container',
        isContainerUnit: true,
        containerType: '20GP',
        status: 'enabled' as const
      },
      {
        id: '5',
        unitNameCn: '40英尺集装箱',
        unitNameEn: '40ft Container',
        isContainerUnit: true,
        containerType: '40GP',
        status: 'enabled' as const
      },
      {
        id: '6',
        unitNameCn: '40英尺高箱',
        unitNameEn: '40ft High Cube',
        isContainerUnit: true,
        containerType: '40HC',
        status: 'disabled' as const
      },
      {
        id: '7',
        unitNameCn: '件',
        unitNameEn: 'Piece',
        isContainerUnit: false,
        status: 'enabled' as const
      },
      {
        id: '8',
        unitNameCn: '20英尺冷藏箱',
        unitNameEn: '20ft Reefer',
        isContainerUnit: true,
        containerType: '20RF',
        status: 'enabled' as const
      }
    ];

    setData(mockData);
    filterData(mockData);
  }, []);

  // 筛选数据
  const filterData = (dataToFilter = data) => {
    let filtered = [...dataToFilter];
    
    // 应用搜索条件
    if (searchParams.keyword) {
      filtered = filtered.filter(unit =>
        unit.unitNameCn.includes(searchParams.keyword) ||
        unit.unitNameEn.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        (unit.containerType && unit.containerType.toLowerCase().includes(searchParams.keyword.toLowerCase()))
      );
    }

    if (searchParams.isContainerUnit) {
      const isContainer = searchParams.isContainerUnit === 'true';
      filtered = filtered.filter(unit => unit.isContainerUnit === isContainer);
    }

    if (searchParams.status) {
      filtered = filtered.filter(unit => unit.status === searchParams.status);
    }

    setFilteredData(filtered);
  };

  // 当数据或搜索参数变化时重新筛选
  useEffect(() => {
    filterData();
  }, [data, searchParams]);

  // 搜索筛选功能
  const handleSearch = () => {
    filterData();
  };

  // 重置搜索
  const handleReset = () => {
    const newSearchParams = {
      keyword: '',
      isContainerUnit: '',
      status: ''
    };
    setSearchParams(newSearchParams);
  };

  const columns = [
    {
      title: '计费单位名称（中文）',
      dataIndex: 'unitNameCn',
      width: 180,
      sorter: (a: CalculationUnit, b: CalculationUnit) => a.unitNameCn.localeCompare(b.unitNameCn),
    },
    {
      title: '计费单位名称（英文）',
      dataIndex: 'unitNameEn',
      width: 180,
    },
    {
      title: '是否箱型单位',
      dataIndex: 'isContainerUnit',
      width: 120,
      render: (isContainerUnit: boolean) => (
        <Tag color={isContainerUnit ? 'blue' : 'gray'}>
          {isContainerUnit ? '是' : '否'}
        </Tag>
      ),
    },
    {
      title: '箱型',
      dataIndex: 'containerType',
      width: 100,
      render: (containerType: string, record: CalculationUnit) => {
        if (!record.isContainerUnit) {
          return <span style={{ color: '#999' }}>-</span>;
        }
        return containerType ? (
          <Tag color="orange">{containerType}</Tag>
        ) : (
          <span style={{ color: '#999' }}>未设置</span>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'enabled' ? 'green' : 'red'}>
          {status === 'enabled' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 180,
      fixed: 'right' as const,
      render: (_: unknown, record: CalculationUnit) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<IconEdit />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title={`确定要${record.status === 'enabled' ? '禁用' : '启用'}此计费单位吗？`}
            onOk={() => handleToggleStatus(record.id, record.status)}
          >
            <Button 
              type="text" 
              size="small" 
              status={record.status === 'enabled' ? 'warning' : 'success'}
            >
              {record.status === 'enabled' ? '禁用' : '启用'}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 处理编辑
  const handleEdit = (record: CalculationUnit) => {
    setCurrentUnit(record);
    setIsEditing(true);
    editForm.setFieldsValue({
      unitNameCn: record.unitNameCn,
      unitNameEn: record.unitNameEn,
      isContainerUnit: record.isContainerUnit,
      containerType: record.containerType
    });
    setEditModalVisible(true);
  };

  // 处理新增
  const handleAdd = () => {
    setCurrentUnit(null);
    setIsEditing(false);
    editForm.resetFields();
    setEditModalVisible(true);
  };

  // 处理状态切换
  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    setData(prev => prev.map(unit => 
      unit.id === id ? { ...unit, status: newStatus } : unit
    ));
    setFilteredData(prev => prev.map(unit => 
      unit.id === id ? { ...unit, status: newStatus } : unit
    ));
    Message.success(`计费单位已${newStatus === 'enabled' ? '启用' : '禁用'}`);
  };

  // 批量启用
  const handleBatchEnable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要启用的计费单位');
      return;
    }
    
    setData(prev => prev.map(unit => 
      selectedRowKeys.includes(unit.id) ? { ...unit, status: 'enabled' } : unit
    ));
    setFilteredData(prev => prev.map(unit => 
      selectedRowKeys.includes(unit.id) ? { ...unit, status: 'enabled' } : unit
    ));
    
    setSelectedRowKeys([]);
    Message.success(`已启用 ${selectedRowKeys.length} 个计费单位`);
  };

  // 批量禁用
  const handleBatchDisable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要禁用的计费单位');
      return;
    }
    
    setData(prev => prev.map(unit => 
      selectedRowKeys.includes(unit.id) ? { ...unit, status: 'disabled' } : unit
    ));
    setFilteredData(prev => prev.map(unit => 
      selectedRowKeys.includes(unit.id) ? { ...unit, status: 'disabled' } : unit
    ));
    
    setSelectedRowKeys([]);
    Message.success(`已禁用 ${selectedRowKeys.length} 个计费单位`);
  };

  // 保存计费单位编辑
  const handleSaveUnit = async () => {
    try {
      const values = await editForm.validate();
      
      const unitData = {
        ...values,
        id: isEditing ? currentUnit?.id : Date.now().toString(),
        status: isEditing ? currentUnit?.status : 'enabled' as const,
        // 如果不是箱型单位，清空箱型字段
        containerType: values.isContainerUnit ? values.containerType : undefined
      };

      if (isEditing) {
        // 更新现有计费单位
        setData(prev => prev.map(unit => 
          unit.id === currentUnit?.id ? { ...unit, ...unitData } : unit
        ));
        setFilteredData(prev => prev.map(unit => 
          unit.id === currentUnit?.id ? { ...unit, ...unitData } : unit
        ));
        Message.success('计费单位信息已更新');
      } else {
        // 新增计费单位
        const newUnit = { ...unitData, id: Date.now().toString() };
        setData(prev => [...prev, newUnit]);
        setFilteredData(prev => [...prev, newUnit]);
        Message.success('计费单位已添加');
      }

      setEditModalVisible(false);
      editForm.resetFields();
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  return (
    <Card>
      <div style={{ marginBottom: '20px' }}>
        <Title heading={4} style={{ margin: 0 }}>计费单位管理</Title>
      </div>

      {/* 搜索筛选区域 */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
            <Input
              placeholder="计费单位名称、箱型"
              value={searchParams.keyword}
              onChange={(value) => setSearchParams(prev => ({ ...prev, keyword: value }))}
            />
          </div>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>是否箱型单位</div>
            <Select
              placeholder="选择类型"
              value={searchParams.isContainerUnit}
              onChange={(value) => setSearchParams(prev => ({ ...prev, isContainerUnit: value }))}
              allowClear
            >
              <Option value="true">是</Option>
              <Option value="false">否</Option>
            </Select>
          </div>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>状态</div>
            <Select
              placeholder="选择状态"
              value={searchParams.status}
              onChange={(value) => setSearchParams(prev => ({ ...prev, status: value }))}
              allowClear
            >
              <Option value="enabled">启用</Option>
              <Option value="disabled">禁用</Option>
            </Select>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button type="primary" icon={<IconSearch />} onClick={handleSearch}>
              搜索
            </Button>
            <Button icon={<IconRefresh />} onClick={handleReset}>
              重置
            </Button>
          </div>
        </div>
      </Card>

      {/* 操作按钮区域 */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>
              新增计费单位
            </Button>
            <Button icon={<IconUpload />}>
              批量导入
            </Button>
          </div>
          {selectedRowKeys.length > 0 && (
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              paddingLeft: '12px', 
              borderLeft: '1px solid #e5e6e7',
              marginLeft: '4px'
            }}>
              <Button type="outline" onClick={handleBatchEnable}>
                批量启用 ({selectedRowKeys.length})
              </Button>
              <Button type="outline" status="warning" onClick={handleBatchDisable}>
                批量禁用 ({selectedRowKeys.length})
              </Button>
            </div>
          )}
        </div>
        <Button icon={<IconDownload />}>
          导出数据
        </Button>
      </div>

      <Table
        columns={columns}
        data={filteredData}
        rowKey="id"
        scroll={{ x: 1000 }}
        pagination={{
          pageSize: 10,
          showTotal: true,
          showJumper: true,
          sizeCanChange: true,
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys as string[]),
          type: 'checkbox',
        }}
      />

      {/* 新增/编辑计费单位弹窗 */}
      <Modal
        title={isEditing ? '编辑计费单位' : '新增计费单位'}
        visible={editModalVisible}
        onOk={handleSaveUnit}
        onCancel={() => setEditModalVisible(false)}
        style={{ width: 600 }}
      >
        <Form form={editForm} layout="vertical">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              field="unitNameCn"
              label="计费单位名称（中文）"
              rules={[{ required: true, message: '请输入中文计费单位名称' }]}
            >
              <Input placeholder="请输入中文计费单位名称，如：千克" />
            </Form.Item>
            
            <Form.Item
              field="unitNameEn"
              label="计费单位名称（英文）"
              rules={[{ required: true, message: '请输入英文计费单位名称' }]}
            >
              <Input placeholder="请输入英文计费单位名称，如：Kilogram" />
            </Form.Item>
          </div>
          
          <Form.Item
            field="isContainerUnit"
            label="是否箱型单位"
            rules={[{ required: true, message: '请选择是否为箱型单位' }]}
          >
            <Radio.Group onChange={(value) => {
              if (value === false) {
                editForm.setFieldValue('containerType', undefined);
              }
            }}>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.isContainerUnit !== currentValues.isContainerUnit
            }
          >
            {(formValues) => {
              const isContainerUnit = formValues.isContainerUnit;
              return isContainerUnit ? (
                <Form.Item
                  field="containerType"
                  label="箱型"
                  rules={[{ required: true, message: '请选择箱型' }]}
                >
                  <Select placeholder="请选择箱型">
                    {containerTypeOptions.map(option => (
                      <Option key={option.value} value={option.value}>{option.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : null;
            }}
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default CalculationUnitManagement; 