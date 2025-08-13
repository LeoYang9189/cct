import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Checkbox,
  Modal,
  Form,
  Input,
  Select,
  Message,
  Popconfirm,
  Typography,
  DatePicker
} from '@arco-design/web-react';
import {
  IconPlus,
  IconEdit,
  IconSearch,
  IconRefresh,
  IconEye
} from '@arco-design/web-react/icon';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// 汇率设置数据接口
interface ExchangeRate {
  id: string;
  currencyCode: string; // 币种代码
  currencyName: string; // 币种名称
  baseCurrencyCode: string; // 本位币代码
  baseCurrencyName: string; // 本位币名称
  rate: number; // 汇率
  validDateStart: string; // 有效期开始
  validDateEnd: string; // 有效期结束
  status: 'enabled' | 'disabled';
  createTime: string;
  updateTime: string;
}

// 搜索筛选参数
interface SearchParams {
  keyword: string;
  currencyCode: string;
  baseCurrencyCode: string;
  status: string;
}

// 币种选项（模拟数据）
const currencyOptions = [
  { code: 'USD', name: '美元' },
  { code: 'CNY', name: '人民币' },
  { code: 'EUR', name: '欧元' },
  { code: 'JPY', name: '日元' },
  { code: 'GBP', name: '英镑' },
  { code: 'HKD', name: '港币' },
  { code: 'SGD', name: '新加坡元' },
  { code: 'AUD', name: '澳元' }
];

const ExchangeRateManagement: React.FC = () => {
  const [exchangeRateData, setExchangeRateData] = useState<ExchangeRate[]>([]);
  const [filteredData, setFilteredData] = useState<ExchangeRate[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentExchangeRate, setCurrentExchangeRate] = useState<ExchangeRate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    currencyCode: '',
    baseCurrencyCode: '',
    status: ''
  });
  const [editForm] = Form.useForm();

  // 检查汇率是否已过期并自动禁用
  const checkAndUpdateExpiredRates = (data: ExchangeRate[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 设置为当天开始时间
    
    return data.map(item => {
      const endDate = new Date(item.validDateEnd);
      endDate.setHours(23, 59, 59, 999); // 设置为当天结束时间
      
      // 如果有效期结束日已过且状态为启用，自动禁用
      if (endDate < today && item.status === 'enabled') {
        return { ...item, status: 'disabled' as const };
      }
      return item;
    });
  };

  // 初始化示例数据
  useEffect(() => {
    const mockData: ExchangeRate[] = [
      {
        id: '1',
        currencyCode: 'USD',
        currencyName: '美元',
        baseCurrencyCode: 'CNY',
        baseCurrencyName: '人民币',
        rate: 7.2500,
        validDateStart: '2024-01-01',
        validDateEnd: '2024-12-31',
        status: 'enabled',
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00'
      },
      {
        id: '2',
        currencyCode: 'EUR',
        currencyName: '欧元',
        baseCurrencyCode: 'CNY',
        baseCurrencyName: '人民币',
        rate: 7.8900,
        validDateStart: '2024-01-01',
        validDateEnd: '2024-12-31',
        status: 'enabled',
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00'
      },
      {
        id: '3',
        currencyCode: 'JPY',
        currencyName: '日元',
        baseCurrencyCode: 'CNY',
        baseCurrencyName: '人民币',
        rate: 0.0483,
        validDateStart: '2024-01-01',
        validDateEnd: '2024-12-31',
        status: 'enabled',
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00'
      },
      {
        id: '4',
        currencyCode: 'CNY',
        currencyName: '人民币',
        baseCurrencyCode: 'USD',
        baseCurrencyName: '美元',
        rate: 0.1379,
        validDateStart: '2024-06-01',
        validDateEnd: '2024-12-31',
        status: 'enabled',
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00'
      },
      {
        id: '5',
        currencyCode: 'GBP',
        currencyName: '英镑',
        baseCurrencyCode: 'USD',
        baseCurrencyName: '美元',
        rate: 1.2650,
        validDateStart: '2024-01-01',
        validDateEnd: '2023-12-31', // 已过期的数据
        status: 'enabled',
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00'
      }
    ];

    // 检查并更新过期汇率
    const updatedData = checkAndUpdateExpiredRates(mockData);
    setExchangeRateData(updatedData);
    setFilteredData(updatedData);
  }, []);

  // 搜索筛选功能
  const handleSearch = () => {
    let filtered = exchangeRateData;

    // 关键词搜索
    if (searchParams.keyword) {
      filtered = filtered.filter(item => 
        item.currencyCode.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        item.currencyName.includes(searchParams.keyword) ||
        item.baseCurrencyCode.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        item.baseCurrencyName.includes(searchParams.keyword)
      );
    }

    // 币种筛选
    if (searchParams.currencyCode) {
      filtered = filtered.filter(item => item.currencyCode === searchParams.currencyCode);
    }

    // 本位币筛选
    if (searchParams.baseCurrencyCode) {
      filtered = filtered.filter(item => item.baseCurrencyCode === searchParams.baseCurrencyCode);
    }

    // 状态筛选
    if (searchParams.status) {
      filtered = filtered.filter(item => item.status === searchParams.status);
    }

    setFilteredData(filtered);
  };

  // 重置搜索
  const handleReset = () => {
    setSearchParams({
      keyword: '',
      currencyCode: '',
      baseCurrencyCode: '',
      status: ''
    });
    setFilteredData(exchangeRateData);
  };

  // 检查汇率是否已过期
  const isExpired = (validDateEnd: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(validDateEnd);
    endDate.setHours(23, 59, 59, 999);
    return endDate < today;
  };

  // 检查日期范围是否有交叉
  const checkDateOverlap = (
    newStart: string, 
    newEnd: string, 
    currencyCode: string, 
    baseCurrencyCode: string, 
    excludeId?: string
  ): boolean => {
    const newStartDate = new Date(newStart);
    const newEndDate = new Date(newEnd);

    return exchangeRateData.some(item => {
      if (excludeId && item.id === excludeId) return false;
      if (item.currencyCode !== currencyCode || item.baseCurrencyCode !== baseCurrencyCode) return false;
      if (item.status === 'disabled') return false;

      const existingStart = new Date(item.validDateStart);
      const existingEnd = new Date(item.validDateEnd);

      // 检查日期范围是否有交叉
      return !(newEndDate < existingStart || newStartDate > existingEnd);
    });
  };

  // 表格列定义
  const columns = [
    {
      title: (
        <Checkbox
          indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < filteredData.length}
          checked={selectedRowKeys.length === filteredData.length && filteredData.length > 0}
          onChange={(checked) => {
            if (checked) {
              setSelectedRowKeys(filteredData.map(item => item.id));
            } else {
              setSelectedRowKeys([]);
            }
          }}
        />
      ),
      dataIndex: 'checkbox',
      width: 60,
      render: (_: unknown, record: ExchangeRate) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.id)}
          onChange={(checked) => {
            if (checked) {
              setSelectedRowKeys([...selectedRowKeys, record.id]);
            } else {
              setSelectedRowKeys(selectedRowKeys.filter(key => key !== record.id));
            }
          }}
        />
      ),
    },
    {
      title: '币种',
      dataIndex: 'currencyCode',
      width: 120,
      render: (code: string, record: ExchangeRate) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{code}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.currencyName}</div>
        </div>
      ),
    },
    {
      title: '本位币',
      dataIndex: 'baseCurrencyCode',
      width: 120,
      render: (code: string, record: ExchangeRate) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{code}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.baseCurrencyName}</div>
        </div>
      ),
    },
    {
      title: '汇率',
      dataIndex: 'rate',
      width: 120,
      render: (rate: number | string) => (
        <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
          {typeof rate === 'number' ? rate.toFixed(4) : parseFloat(rate).toFixed(4)}
        </span>
      ),
    },
    {
      title: '有效期',
      dataIndex: 'validDate',
      width: 200,
      render: (_: unknown, record: ExchangeRate) => (
        <div>
          <div>{record.validDateStart}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>至 {record.validDateEnd}</div>
        </div>
      ),
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
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 150,
      render: (time: string) => (
        <div style={{ fontSize: '12px' }}>{time}</div>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 180,
      fixed: 'right' as const,
      render: (_: unknown, record: ExchangeRate) => {
        const expired = isExpired(record.validDateEnd);
        
        return (
          <Space>
            <Button
              type="text"
              size="small"
              icon={<IconEye />}
              onClick={() => handleDetail(record)}
            >
              详情
            </Button>
            {!expired && (
              <Button
                type="text"
                size="small"
                icon={<IconEdit />}
                onClick={() => handleEdit(record)}
              >
                编辑
              </Button>
            )}
            {!expired && (
              <Popconfirm
                title={`确定要${record.status === 'enabled' ? '禁用' : '启用'}此汇率设置吗？`}
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
            )}

          </Space>
        );
      },
    },
  ];

  // 处理详情
  const handleDetail = (record: ExchangeRate) => {
    setCurrentExchangeRate(record);
    setDetailModalVisible(true);
  };

  // 处理编辑
  const handleEdit = (record: ExchangeRate) => {
    setCurrentExchangeRate(record);
    setIsEditing(true);
    editForm.setFieldsValue({
      currencyCode: record.currencyCode,
      baseCurrencyCode: record.baseCurrencyCode,
      rate: record.rate,
      validDateRange: [record.validDateStart, record.validDateEnd]
    });
    setEditModalVisible(true);
  };

  // 处理新增
  const handleAdd = () => {
    setCurrentExchangeRate(null);
    setIsEditing(false);
    editForm.resetFields();
    setEditModalVisible(true);
  };

  // 处理状态切换
  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    const now = new Date().toLocaleString();
    
    setExchangeRateData(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus, updateTime: now } : item
    ));
    setFilteredData(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus, updateTime: now } : item
    ));
    Message.success(`汇率设置已${newStatus === 'enabled' ? '启用' : '禁用'}`);
  };



  // 批量启用
  const handleBatchEnable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要启用的汇率设置');
      return;
    }
    
    const now = new Date().toLocaleString();
    setExchangeRateData(prev => prev.map(item => 
      selectedRowKeys.includes(item.id) ? { ...item, status: 'enabled', updateTime: now } : item
    ));
    setFilteredData(prev => prev.map(item => 
      selectedRowKeys.includes(item.id) ? { ...item, status: 'enabled', updateTime: now } : item
    ));
    
    setSelectedRowKeys([]);
    Message.success(`已启用 ${selectedRowKeys.length} 个汇率设置`);
  };

  // 批量禁用
  const handleBatchDisable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要禁用的汇率设置');
      return;
    }
    
    const now = new Date().toLocaleString();
    setExchangeRateData(prev => prev.map(item => 
      selectedRowKeys.includes(item.id) ? { ...item, status: 'disabled', updateTime: now } : item
    ));
    setFilteredData(prev => prev.map(item => 
      selectedRowKeys.includes(item.id) ? { ...item, status: 'disabled', updateTime: now } : item
    ));
    
    setSelectedRowKeys([]);
    Message.success(`已禁用 ${selectedRowKeys.length} 个汇率设置`);
  };



  // 保存汇率设置编辑
  const handleSaveExchangeRate = async () => {
    console.log('开始保存汇率设置...');
    
    try {
      // 先获取表单值进行检查
      const formValues = editForm.getFieldsValue();
      console.log('当前表单值:', formValues);
      
      // 检查必填字段
      if (!formValues.currencyCode) {
        Message.error('请选择币种');
        return;
      }
      if (!formValues.baseCurrencyCode) {
        Message.error('请选择本位币');
        return;
      }
      if (!formValues.rate) {
        Message.error('请输入汇率');
        return;
      }
      if (!formValues.validDateRange || formValues.validDateRange.length !== 2) {
        Message.error('请选择有效期');
        return;
      }
      
      // 验证表单
      const values = await editForm.validate();
      console.log('表单验证通过，验证后的值:', values);
      
      const [validDateStart, validDateEnd] = values.validDateRange;
      
      // 1. 检查币种和本位币不能相同
      if (values.currencyCode === values.baseCurrencyCode) {
        Message.error({
          content: '币种和本位币不能相同！',
          duration: 5000,
          showIcon: true
        });
        return;
      }
      
      // 2. 检查日期范围是否有交叉（同币种对同本位币）
      const hasOverlap = checkDateOverlap(
        validDateStart,
        validDateEnd,
        values.currencyCode,
        values.baseCurrencyCode,
        isEditing ? currentExchangeRate?.id : undefined
      );

      if (hasOverlap) {
        Message.error({
          content: '该币种对本位币在此时间段内已存在汇率设置，有效期不能有交叉或重叠！',
          duration: 5000,
          showIcon: true
        });
        return;
      }

      const currency = currencyOptions.find(c => c.code === values.currencyCode);
      const baseCurrency = currencyOptions.find(c => c.code === values.baseCurrencyCode);
      const now = new Date().toLocaleString();
      
      const exchangeRateItem = {
        ...values,
        id: isEditing ? currentExchangeRate?.id : Date.now().toString(),
        currencyName: currency?.name || '',
        baseCurrencyName: baseCurrency?.name || '',
        rate: parseFloat(values.rate), // 确保汇率是数字类型
        validDateStart,
        validDateEnd,
        status: isEditing ? currentExchangeRate?.status : 'enabled' as const,
        createTime: isEditing ? currentExchangeRate?.createTime : now,
        updateTime: now
      };

      console.log('准备保存的数据:', exchangeRateItem);

      if (isEditing) {
        // 更新现有汇率设置
        setExchangeRateData(prev => prev.map(item => 
          item.id === currentExchangeRate?.id ? { ...item, ...exchangeRateItem } : item
        ));
        setFilteredData(prev => prev.map(item => 
          item.id === currentExchangeRate?.id ? { ...item, ...exchangeRateItem } : item
        ));
        console.log('汇率设置已更新');
      } else {
        // 新增汇率设置
        const newExchangeRate = { ...exchangeRateItem, id: Date.now().toString() };
        setExchangeRateData(prev => [...prev, newExchangeRate]);
        setFilteredData(prev => [...prev, newExchangeRate]);
        console.log('汇率设置已添加');
      }

      setEditModalVisible(false);
      editForm.resetFields();
      
      // 延迟显示成功消息，避免 React 19 兼容性问题
      setTimeout(() => {
        try {
          if (isEditing) {
            Message.success('汇率设置已更新');
          } else {
            Message.success('汇率设置已添加');
          }
        } catch (error) {
          console.log('成功消息显示失败，但操作已完成:', error);
        }
      }, 100);
    } catch (error) {
      // 表单验证失败时，显示具体的错误信息
      console.error('表单验证失败:', error);
      
      // 显示验证错误提示
      Message.error({
        content: '请检查表单输入，确保所有必填字段都已正确填写',
        duration: 5000,
        showIcon: true
      });
    }
  };

  return (
    <Card>
      <div style={{ marginBottom: '20px' }}>
        <Title heading={4} style={{ margin: 0 }}>汇率设置</Title>
      </div>

      {/* 搜索筛选区域 */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
            <Input
              placeholder="币种代码、名称"
              value={searchParams.keyword}
              onChange={(value) => setSearchParams(prev => ({ ...prev, keyword: value }))}
            />
          </div>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>币种</div>
            <Select
              placeholder="选择币种"
              value={searchParams.currencyCode}
              onChange={(value) => setSearchParams(prev => ({ ...prev, currencyCode: value }))}
              allowClear
            >
              {currencyOptions.map(option => (
                <Option key={option.code} value={option.code}>{option.code} - {option.name}</Option>
              ))}
            </Select>
          </div>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>本位币</div>
            <Select
              placeholder="选择本位币"
              value={searchParams.baseCurrencyCode}
              onChange={(value) => setSearchParams(prev => ({ ...prev, baseCurrencyCode: value }))}
              allowClear
            >
              {currencyOptions.map(option => (
                <Option key={option.code} value={option.code}>{option.code} - {option.name}</Option>
              ))}
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
              新增汇率设置
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
      </div>

      <Table
        columns={columns}
        data={filteredData}
        rowKey="id"
        scroll={{ x: 1400 }}
        pagination={{
          pageSize: 10,
          showTotal: true,
          showJumper: true,
          sizeCanChange: true,
        }}
      />

      {/* 详情弹窗 */}
      <Modal
        title="汇率设置详情"
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={
          <Button onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        }
        style={{ width: 600 }}
      >
        {currentExchangeRate && (
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px 16px', alignItems: 'center' }}>
            <span style={{ fontWeight: 500 }}>币种：</span>
            <span>{currentExchangeRate.currencyCode} - {currentExchangeRate.currencyName}</span>
            
            <span style={{ fontWeight: 500 }}>本位币：</span>
            <span>{currentExchangeRate.baseCurrencyCode} - {currentExchangeRate.baseCurrencyName}</span>
            
            <span style={{ fontWeight: 500 }}>汇率：</span>
            <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
              {typeof currentExchangeRate.rate === 'number' 
                ? currentExchangeRate.rate.toFixed(4) 
                : parseFloat(currentExchangeRate.rate).toFixed(4)}
            </span>
            
            <span style={{ fontWeight: 500 }}>有效期：</span>
            <span>{currentExchangeRate.validDateStart} 至 {currentExchangeRate.validDateEnd}</span>
            
            <span style={{ fontWeight: 500 }}>状态：</span>
            <Tag color={currentExchangeRate.status === 'enabled' ? 'green' : 'red'}>
              {currentExchangeRate.status === 'enabled' ? '启用' : '禁用'}
            </Tag>
            
            <span style={{ fontWeight: 500 }}>创建时间：</span>
            <span>{currentExchangeRate.createTime}</span>
            
            <span style={{ fontWeight: 500 }}>更新时间：</span>
            <span>{currentExchangeRate.updateTime}</span>
          </div>
        )}
      </Modal>

      {/* 新增/编辑汇率设置弹窗 */}
      <Modal
        title={isEditing ? '编辑汇率设置' : '新增汇率设置'}
        visible={editModalVisible}
        onOk={handleSaveExchangeRate}
        onCancel={() => setEditModalVisible(false)}
        style={{ width: 600 }}
      >
        <Form form={editForm} layout="vertical">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              field="currencyCode"
              label="币种"
              rules={[{ required: true, message: '请选择币种' }]}
            >
              <Select placeholder="请选择币种">
                {currencyOptions.map(option => (
                  <Option key={option.code} value={option.code}>{option.code} - {option.name}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              field="baseCurrencyCode"
              label="本位币"
              rules={[{ required: true, message: '请选择本位币' }]}
            >
              <Select placeholder="请选择本位币">
                {currencyOptions.map(option => (
                  <Option key={option.code} value={option.code}>{option.code} - {option.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          
          <Form.Item
            field="rate"
            label="汇率"
            rules={[
              { required: true, message: '请输入汇率' },
              { 
                validator: (value, callback) => {
                  if (value && (isNaN(value) || value <= 0)) {
                    callback('汇率必须为正数');
                  } else {
                    callback();
                  }
                }
              }
            ]}
          >
            <Input placeholder="请输入汇率，如：7.2500" type="number" step="0.0001" />
          </Form.Item>
          
          <Form.Item
            field="validDateRange"
            label="有效期"
            rules={[{ required: true, message: '请选择有效期' }]}
          >
            <RangePicker placeholder={['开始日期', '结束日期']} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ExchangeRateManagement; 