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
  Tabs,
  Cascader
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
const { TabPane } = Tabs;

// 邮编数据接口
interface Zipcode {
  id: string;
  zipcode: string;
  country: 'china' | 'usa';
  // 中国字段
  province?: string; // 省
  city?: string; // 市
  district?: string; // 区/县
  street?: string; // 街道/乡镇
  // 美国字段
  state?: string; // 州
  usaCity?: string; // 美国城市
  areaName: string; // 具体区域名称
  status: 'enabled' | 'disabled';
}

// 中国行政区划级联数据
const chinaCascaderOptions = [
  {
    value: '广东省',
    label: '广东省',
    children: [
      {
        value: '深圳市',
        label: '深圳市',
        children: [
          {
            value: '罗湖区',
            label: '罗湖区',
            children: [
              { value: '东门街道', label: '东门街道' },
              { value: '南湖街道', label: '南湖街道' },
              { value: '桂园街道', label: '桂园街道' }
            ]
          },
          {
            value: '南山区',
            label: '南山区',
            children: [
              { value: '南头街道', label: '南头街道' },
              { value: '桃源街道', label: '桃源街道' },
              { value: '蛇口街道', label: '蛇口街道' }
            ]
          },
          {
            value: '福田区',
            label: '福田区',
            children: [
              { value: '华富街道', label: '华富街道' },
              { value: '莲花街道', label: '莲花街道' },
              { value: '福田街道', label: '福田街道' }
            ]
          }
        ]
      },
      {
        value: '广州市',
        label: '广州市',
        children: [
          {
            value: '天河区',
            label: '天河区',
            children: [
              { value: '天河南街道', label: '天河南街道' },
              { value: '石牌街道', label: '石牌街道' }
            ]
          }
        ]
      }
    ]
  },
  {
    value: '北京市',
    label: '北京市',
    children: [
      {
        value: '北京市',
        label: '北京市',
        children: [
          {
            value: '东城区',
            label: '东城区',
            children: [
              { value: '东华门街道', label: '东华门街道' },
              { value: '景山街道', label: '景山街道' }
            ]
          },
          {
            value: '西城区',
            label: '西城区',
            children: [
              { value: '西长安街街道', label: '西长安街街道' },
              { value: '新街口街道', label: '新街口街道' }
            ]
          }
        ]
      }
    ]
  },
  {
    value: '上海市',
    label: '上海市',
    children: [
      {
        value: '上海市',
        label: '上海市',
        children: [
          {
            value: '黄浦区',
            label: '黄浦区',
            children: [
              { value: '南京东路街道', label: '南京东路街道' },
              { value: '外滩街道', label: '外滩街道' }
            ]
          },
          {
            value: '浦东新区',
            label: '浦东新区',
            children: [
              { value: '陆家嘴街道', label: '陆家嘴街道' },
              { value: '塘桥街道', label: '塘桥街道' }
            ]
          }
        ]
      }
    ]
  }
];

// 美国州选项
const usaStateOptions = [
  { value: 'California', label: 'California (CA)' },
  { value: 'New York', label: 'New York (NY)' },
  { value: 'Texas', label: 'Texas (TX)' },
  { value: 'Florida', label: 'Florida (FL)' },
  { value: 'Illinois', label: 'Illinois (IL)' },
  { value: 'Pennsylvania', label: 'Pennsylvania (PA)' }
];

// 搜索筛选参数
interface SearchParams {
  keyword: string;
  province: string;
  status: string;
}

// Tab配置
const tabConfig = [
  { key: 'china', title: '中国', country: 'china' as const },
  { key: 'usa', title: '美国', country: 'usa' as const }
];

const ZipcodeManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('china');
  const [zipcodeData, setZipcodeData] = useState<Zipcode[]>([]);
  const [filteredData, setFilteredData] = useState<Zipcode[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentZipcode, setCurrentZipcode] = useState<Zipcode | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    province: '',
    status: ''
  });
  const [editForm] = Form.useForm();

  // 初始化示例数据
  useEffect(() => {
    const mockData: Zipcode[] = [
      // 中国邮编
      {
        id: '1',
        zipcode: '518000',
        country: 'china',
        province: '广东省',
        city: '深圳市',
        district: '罗湖区',
        street: '东门街道',
        areaName: '罗湖中心区',
        status: 'enabled'
      },
      {
        id: '2',
        zipcode: '518001',
        country: 'china',
        province: '广东省',
        city: '深圳市',
        district: '罗湖区',
        street: '南湖街道',
        areaName: '东门商业区',
        status: 'enabled'
      },
      {
        id: '3',
        zipcode: '518100',
        country: 'china',
        province: '广东省',
        city: '深圳市',
        district: '南山区',
        street: '南头街道',
        areaName: '南头古城',
        status: 'enabled'
      },
      {
        id: '4',
        zipcode: '100000',
        country: 'china',
        province: '北京市',
        city: '北京市',
        district: '东城区',
        street: '东华门街道',
        areaName: '天安门地区',
        status: 'enabled'
      },
      {
        id: '5',
        zipcode: '200000',
        country: 'china',
        province: '上海市',
        city: '上海市',
        district: '黄浦区',
        street: '外滩街道',
        areaName: '外滩金融区',
        status: 'disabled'
      },
      
      // 美国邮编
      {
        id: '6',
        zipcode: '90210',
        country: 'usa',
        state: 'California',
        usaCity: 'Beverly Hills',
        areaName: 'Beverly Hills Central',
        status: 'enabled'
      },
      {
        id: '7',
        zipcode: '10001',
        country: 'usa',
        state: 'New York',
        usaCity: 'New York',
        areaName: 'Manhattan Midtown',
        status: 'enabled'
      },
      {
        id: '8',
        zipcode: '10002',
        country: 'usa',
        state: 'New York',
        usaCity: 'New York',
        areaName: 'Lower East Side',
        status: 'enabled'
      },
      {
        id: '9',
        zipcode: '77001',
        country: 'usa',
        state: 'Texas',
        usaCity: 'Houston',
        areaName: 'Downtown Houston',
        status: 'enabled'
      },
      {
        id: '10',
        zipcode: '33101',
        country: 'usa',
        state: 'Florida',
        usaCity: 'Miami',
        areaName: 'Downtown Miami',
        status: 'disabled'
      }
    ];

    setZipcodeData(mockData);
    filterDataByCountry('china', mockData);
  }, []);

  // 根据国家筛选数据
  const filterDataByCountry = (country: string, data = zipcodeData) => {
    let filtered = data.filter(item => item.country === country);
    
    // 应用搜索条件
    if (searchParams.keyword) {
      filtered = filtered.filter(item => 
        item.zipcode.includes(searchParams.keyword) ||
        (item.city && item.city.includes(searchParams.keyword)) ||
        (item.usaCity && item.usaCity.includes(searchParams.keyword)) ||
        item.areaName.includes(searchParams.keyword) ||
        (item.district && item.district.includes(searchParams.keyword)) ||
        (item.street && item.street.includes(searchParams.keyword))
      );
    }
    
    if (searchParams.province) {
      filtered = filtered.filter(item => 
        item.province === searchParams.province || item.state === searchParams.province
      );
    }

    if (searchParams.status) {
      filtered = filtered.filter(item => item.status === searchParams.status);
    }

    setFilteredData(filtered);
  };

  // Tab切换
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setSelectedRowKeys([]);
    // 重置搜索条件
    setSearchParams({
      keyword: '',
      province: '',
      status: ''
    });
    filterDataByCountry(key);
  };

  // 搜索筛选功能
  const handleSearch = () => {
    filterDataByCountry(activeTab);
  };

  // 重置搜索
  const handleReset = () => {
    const newSearchParams = {
      keyword: '',
      province: '',
      status: ''
    };
    setSearchParams(newSearchParams);
    
    // 重置后重新筛选数据
    const filtered = zipcodeData.filter(item => item.country === activeTab);
    setFilteredData(filtered);
  };

  // 获取省份/州选项
  const getProvinceOptions = () => {
    if (activeTab === 'china') {
      return chinaCascaderOptions.map(item => ({ value: item.value, label: item.label }));
    }
    return usaStateOptions;
  };

  // 处理编辑
  const handleEdit = (record: Zipcode) => {
    setCurrentZipcode(record);
    setIsEditing(true);
    
    if (activeTab === 'china') {
      // 中国邮编设置级联值
      const cascaderValue = [record.province, record.city, record.district, record.street].filter(Boolean);
      editForm.setFieldsValue({
        zipcode: record.zipcode,
        administrative: cascaderValue,
        areaName: record.areaName
      });
    } else {
      // 美国邮编
      editForm.setFieldsValue({
        zipcode: record.zipcode,
        state: record.state,
        usaCity: record.usaCity,
        areaName: record.areaName
      });
    }
    
    setEditModalVisible(true);
  };

  // 处理新增
  const handleAdd = () => {
    setCurrentZipcode(null);
    setIsEditing(false);
    editForm.resetFields();
    setEditModalVisible(true);
  };

  // 处理状态切换
  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    setZipcodeData(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
    filterDataByCountry(activeTab);
    Message.success(`邮编已${newStatus === 'enabled' ? '启用' : '禁用'}`);
  };

  // 批量启用
  const handleBatchEnable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要启用的邮编');
      return;
    }
    
    setZipcodeData(prev => prev.map(item => 
      selectedRowKeys.includes(item.id) ? { ...item, status: 'enabled' } : item
    ));
    
    setSelectedRowKeys([]);
    filterDataByCountry(activeTab);
    Message.success(`已启用 ${selectedRowKeys.length} 个邮编`);
  };

  // 批量禁用
  const handleBatchDisable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要禁用的邮编');
      return;
    }
    
    setZipcodeData(prev => prev.map(item => 
      selectedRowKeys.includes(item.id) ? { ...item, status: 'disabled' } : item
    ));
    
    setSelectedRowKeys([]);
    filterDataByCountry(activeTab);
    Message.success(`已禁用 ${selectedRowKeys.length} 个邮编`);
  };

  // 保存邮编编辑
  const handleSaveZipcode = async () => {
    try {
      const values = await editForm.validate();
      const currentCountry = activeTab as 'china' | 'usa';
      
      let zipcodeItem: Partial<Zipcode>;
      
      if (currentCountry === 'china') {
        // 中国邮编处理级联值
        const [province, city, district, street] = values.administrative || [];
        zipcodeItem = {
          zipcode: values.zipcode,
          country: currentCountry,
          province,
          city,
          district,
          street,
          areaName: values.areaName,
          status: isEditing ? currentZipcode?.status : 'enabled' as const
        };
      } else {
        // 美国邮编
        zipcodeItem = {
          zipcode: values.zipcode,
          country: currentCountry,
          state: values.state,
          usaCity: values.usaCity,
          areaName: values.areaName,
          status: isEditing ? currentZipcode?.status : 'enabled' as const
        };
      }

      if (isEditing) {
        // 更新现有邮编
        setZipcodeData(prev => prev.map(item => 
          item.id === currentZipcode?.id ? { ...item, ...zipcodeItem } : item
        ));
        Message.success('邮编信息已更新');
      } else {
        // 新增邮编
        const newZipcode = { ...zipcodeItem, id: Date.now().toString() } as Zipcode;
        setZipcodeData(prev => [...prev, newZipcode]);
        Message.success('邮编已添加');
      }

      setEditModalVisible(false);
      editForm.resetFields();
      filterDataByCountry(activeTab);
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  // 获取当前tab配置
  const getCurrentTabConfig = () => {
    return tabConfig.find(tab => tab.key === activeTab);
  };

  const currentTab = getCurrentTabConfig();

  // 表格列配置
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
      render: (_: unknown, record: Zipcode) => (
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
      title: '邮编',
      dataIndex: 'zipcode',
      width: 120,
    },
    {
      title: activeTab === 'china' ? '省' : '州',
      dataIndex: activeTab === 'china' ? 'province' : 'state',
      width: 150,
    },
    {
      title: '市',
      dataIndex: activeTab === 'china' ? 'city' : 'usaCity',
      width: 150,
    },
    ...(activeTab === 'china' ? [
      {
        title: '区/县',
        dataIndex: 'district',
        width: 120,
      },
      {
        title: '街道/乡镇',
        dataIndex: 'street',
        width: 150,
      }
    ] : []),
    {
      title: '区域名称',
      dataIndex: 'areaName',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (_: unknown, record: Zipcode) => (
        <Tag color={record.status === 'enabled' ? 'green' : 'red'}>
          {record.status === 'enabled' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 180,
      fixed: 'right' as const,
      render: (_: unknown, record: Zipcode) => (
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
            title={`确定要${record.status === 'enabled' ? '禁用' : '启用'}此邮编吗？`}
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
    }
  ];

  return (
    <Card>
      <div style={{ marginBottom: '20px' }}>
        <Title heading={4} style={{ margin: 0 }}>邮编管理</Title>
      </div>

      {/* Tab切换 */}
      <Tabs activeTab={activeTab} onChange={handleTabChange} type="line" size="large">
        {tabConfig.map(tab => (
          <TabPane key={tab.key} title={tab.title} />
        ))}
      </Tabs>

      {/* 搜索筛选区域 */}
      <Card style={{ marginBottom: '16px', marginTop: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
            <Input
              placeholder={activeTab === 'china' ? "邮编、市、区域名称" : "邮编、城市、区域名称"}
              value={searchParams.keyword}
              onChange={(value) => setSearchParams(prev => ({ ...prev, keyword: value }))}
            />
          </div>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>
              {activeTab === 'china' ? '省' : '州'}
            </div>
            <Select
              placeholder={`选择${activeTab === 'china' ? '省' : '州'}`}
              value={searchParams.province}
              onChange={(value) => setSearchParams(prev => ({ ...prev, province: value }))}
              allowClear
            >
              {getProvinceOptions().map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
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
              新增{currentTab?.title}邮编
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
        scroll={{ x: activeTab === 'china' ? 1200 : 900 }}
        pagination={{
          pageSize: 10,
          showTotal: true,
          showJumper: true,
          sizeCanChange: true,
        }}
      />

      {/* 新增/编辑邮编弹窗 */}
      <Modal
        title={isEditing ? `编辑${currentTab?.title}邮编` : `新增${currentTab?.title}邮编`}
        visible={editModalVisible}
        onOk={handleSaveZipcode}
        onCancel={() => setEditModalVisible(false)}
        style={{ width: 600 }}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            field="zipcode"
            label="邮编"
            rules={[{ required: true, message: '请输入邮编' }]}
          >
            <Input placeholder="请输入邮编" />
          </Form.Item>
          
          {activeTab === 'china' ? (
            // 中国邮编使用级联选择器
            <Form.Item
              field="administrative"
              label="行政区划"
              rules={[{ required: true, message: '请选择行政区划' }]}
            >
              <Cascader
                placeholder="请选择省/市/区县/街道"
                options={chinaCascaderOptions}
                showSearch
                style={{ width: '100%' }}
              />
            </Form.Item>
          ) : (
            // 美国邮编使用普通选择器
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Form.Item
                field="state"
                label="州"
                rules={[{ required: true, message: '请选择州' }]}
              >
                <Select placeholder="请选择州">
                  {usaStateOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                field="usaCity"
                label="城市"
                rules={[{ required: true, message: '请输入城市' }]}
              >
                <Input placeholder="请输入城市" />
              </Form.Item>
            </div>
          )}
          
          <Form.Item
            field="areaName"
            label="区域名称"
          >
            <Input placeholder="请输入具体区域名称（选填）" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ZipcodeManagement; 