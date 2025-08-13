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
  Tabs
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

// 行政区划级别
type DivisionLevel = 'province' | 'city' | 'district' | 'street' | 'village';

// 行政区划数据接口
interface AdministrativeDivision {
  id: string;
  name: string;
  code: string;
  level: DivisionLevel;
  parentId?: string;
  parentName?: string;
  countryId?: string; // 国家ID
  countryName?: string; // 国家名称
  provinceId?: string; // 省ID
  provinceName?: string; // 省名称
  cityId?: string; // 市ID
  cityName?: string; // 市名称
  districtId?: string; // 区县ID
  districtName?: string; // 区县名称
  streetId?: string; // 街道ID
  streetName?: string; // 街道名称
  status: 'enabled' | 'disabled';
}

// 搜索筛选参数
interface SearchParams {
  keyword: string;
  status: string;
  parentId?: string;
  country?: string;
}

// Tab配置
const tabConfig = [
  { key: 'province', title: '一级区划', level: 'province' as DivisionLevel },
  { key: 'city', title: '二级区划', level: 'city' as DivisionLevel },
  { key: 'district', title: '三级区划', level: 'district' as DivisionLevel },
  { key: 'street', title: '四级区划', level: 'street' as DivisionLevel },
  { key: 'village', title: '五级区划', level: 'village' as DivisionLevel }
];

const ChinaAdministrativeDivision: React.FC = () => {
  const [activeTab, setActiveTab] = useState('province');
  const [divisionData, setDivisionData] = useState<AdministrativeDivision[]>([]);
  const [filteredData, setFilteredData] = useState<AdministrativeDivision[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentDivision, setCurrentDivision] = useState<AdministrativeDivision | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    status: '',
    parentId: '',
    country: ''
  });
  const [editForm] = Form.useForm();

  // 多级联动选择状态
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedStreet, setSelectedStreet] = useState<string>('');

  // 初始化示例数据
  useEffect(() => {
    const mockData: AdministrativeDivision[] = [
      // 省份
      { 
        id: '1', 
        name: '广东省', 
        code: '440000', 
        level: 'province',
        countryId: 'CN',
        countryName: '中国',
        status: 'enabled' 
      },
      { 
        id: '2', 
        name: '北京市', 
        code: '110000', 
        level: 'province',
        countryId: 'CN',
        countryName: '中国',
        status: 'enabled' 
      },
      { 
        id: '3', 
        name: '上海市', 
        code: '310000', 
        level: 'province',
        countryId: 'CN',
        countryName: '中国',
        status: 'enabled' 
      },
      { 
        id: '4', 
        name: '浙江省', 
        code: '330000', 
        level: 'province',
        countryId: 'CN',
        countryName: '中国',
        status: 'enabled' 
      },
      
      // 城市
      { 
        id: '5', 
        name: '深圳市', 
        code: '440300', 
        level: 'city', 
        parentId: '1', 
        parentName: '广东省',
        provinceId: '1',
        provinceName: '广东省',
        status: 'enabled' 
      },
      { 
        id: '6', 
        name: '广州市', 
        code: '440100', 
        level: 'city', 
        parentId: '1', 
        parentName: '广东省',
        provinceId: '1',
        provinceName: '广东省',
        status: 'enabled' 
      },
      { 
        id: '7', 
        name: '杭州市', 
        code: '330100', 
        level: 'city', 
        parentId: '4', 
        parentName: '浙江省',
        provinceId: '4',
        provinceName: '浙江省',
        status: 'enabled' 
      },
      { 
        id: '8', 
        name: '宁波市', 
        code: '330200', 
        level: 'city', 
        parentId: '4', 
        parentName: '浙江省',
        provinceId: '4',
        provinceName: '浙江省',
        status: 'enabled' 
      },
      
      // 区县
      { 
        id: '9', 
        name: '南山区', 
        code: '440305', 
        level: 'district', 
        parentId: '5', 
        parentName: '深圳市',
        provinceId: '1',
        provinceName: '广东省',
        cityId: '5',
        cityName: '深圳市',
        status: 'enabled' 
      },
      { 
        id: '10', 
        name: '福田区', 
        code: '440304', 
        level: 'district', 
        parentId: '5', 
        parentName: '深圳市',
        provinceId: '1',
        provinceName: '广东省',
        cityId: '5',
        cityName: '深圳市',
        status: 'enabled' 
      },
      { 
        id: '11', 
        name: '天河区', 
        code: '440106', 
        level: 'district', 
        parentId: '6', 
        parentName: '广州市',
        provinceId: '1',
        provinceName: '广东省',
        cityId: '6',
        cityName: '广州市',
        status: 'enabled' 
      },
      { 
        id: '12', 
        name: '西湖区', 
        code: '330106', 
        level: 'district', 
        parentId: '7', 
        parentName: '杭州市',
        provinceId: '4',
        provinceName: '浙江省',
        cityId: '7',
        cityName: '杭州市',
        status: 'enabled' 
      },
      
      // 街道
      { 
        id: '13', 
        name: '粤海街道', 
        code: '440305001', 
        level: 'street', 
        parentId: '9', 
        parentName: '南山区',
        provinceId: '1',
        provinceName: '广东省',
        cityId: '5',
        cityName: '深圳市',
        districtId: '9',
        districtName: '南山区',
        status: 'enabled' 
      },
      { 
        id: '14', 
        name: '南头街道', 
        code: '440305002', 
        level: 'street', 
        parentId: '9', 
        parentName: '南山区',
        provinceId: '1',
        provinceName: '广东省',
        cityId: '5',
        cityName: '深圳市',
        districtId: '9',
        districtName: '南山区',
        status: 'enabled' 
      },
      { 
        id: '15', 
        name: '园岭街道', 
        code: '440304001', 
        level: 'street', 
        parentId: '10', 
        parentName: '福田区',
        provinceId: '1',
        provinceName: '广东省',
        cityId: '5',
        cityName: '深圳市',
        districtId: '10',
        districtName: '福田区',
        status: 'enabled' 
      },
      { 
        id: '16', 
        name: '沙头街道', 
        code: '440304002', 
        level: 'street', 
        parentId: '10', 
        parentName: '福田区',
        provinceId: '1',
        provinceName: '广东省',
        cityId: '5',
        cityName: '深圳市',
        districtId: '10',
        districtName: '福田区',
        status: 'enabled' 
      },
      
      // 村/居委会
      { 
        id: '17', 
        name: '深圳湾社区', 
        code: '440305001001', 
        level: 'village', 
        parentId: '13', 
        parentName: '粤海街道',
        provinceId: '1',
        provinceName: '广东省',
        cityId: '5',
        cityName: '深圳市',
        districtId: '9',
        districtName: '南山区',
        streetId: '13',
        streetName: '粤海街道',
        status: 'enabled' 
      },
      { 
        id: '18', 
        name: '科技园社区', 
        code: '440305001002', 
        level: 'village', 
        parentId: '13', 
        parentName: '粤海街道',
        provinceId: '1',
        provinceName: '广东省',
        cityId: '5',
        cityName: '深圳市',
        districtId: '9',
        districtName: '南山区',
        streetId: '13',
        streetName: '粤海街道',
        status: 'enabled' 
      },
      { 
        id: '19', 
        name: '南光社区', 
        code: '440305002001', 
        level: 'village', 
        parentId: '14', 
        parentName: '南头街道',
        provinceId: '1',
        provinceName: '广东省',
        cityId: '5',
        cityName: '深圳市',
        districtId: '9',
        districtName: '南山区',
        streetId: '14',
        streetName: '南头街道',
        status: 'enabled' 
      },
      { 
        id: '20', 
        name: '园东社区', 
        code: '440304001001', 
        level: 'village', 
        parentId: '15', 
        parentName: '园岭街道',
        provinceId: '1',
        provinceName: '广东省',
        cityId: '5',
        cityName: '深圳市',
        districtId: '10',
        districtName: '福田区',
        streetId: '15',
        streetName: '园岭街道',
        status: 'enabled' 
      }
    ];

    setDivisionData(mockData);
    filterDataByLevel('province', mockData);
  }, []);

  // 根据级别筛选数据
  const filterDataByLevel = (level: string, data = divisionData) => {
    let filtered = data.filter(item => item.level === level);
    
    // 应用搜索条件
    if (searchParams.keyword) {
      filtered = filtered.filter(item => 
        item.name.includes(searchParams.keyword) ||
        item.code.includes(searchParams.keyword)
      );
    }
    
    if (searchParams.status) {
      filtered = filtered.filter(item => item.status === searchParams.status);
    }

    if (searchParams.parentId && level !== 'province') {
      filtered = filtered.filter(item => item.parentId === searchParams.parentId);
    }

    setFilteredData(filtered);
  };

  // Tab切换
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setSelectedRowKeys([]);
    filterDataByLevel(key);
  };

  // 搜索筛选功能
  const handleSearch = () => {
    filterDataByLevel(activeTab);
  };

  // 重置搜索
  const handleReset = () => {
    const newSearchParams = {
      keyword: '',
      status: '',
      parentId: ''
    };
    setSearchParams(newSearchParams);
    
    // 重置后重新筛选数据
    const filtered = divisionData.filter(item => item.level === activeTab);
    setFilteredData(filtered);
  };

  // 获取上级行政区划选项
  const getParentOptions = (level: DivisionLevel) => {
    const levelMap = {
      'city': 'province',
      'district': 'city', 
      'street': 'district',
      'village': 'street'
    };
    
    const parentLevel = levelMap[level as keyof typeof levelMap];
    if (!parentLevel) return [];
    
    return divisionData
      .filter(item => item.level === parentLevel && item.status === 'enabled')
      .map(item => ({ value: item.id, label: item.name }));
  };

  // 获取省份选项
  const getProvinceOptions = () => {
    return divisionData
      .filter(item => item.level === 'province' && item.status === 'enabled')
      .map(item => ({ value: item.id, label: item.name }));
  };

  // 获取城市选项
  const getCityOptions = (provinceId: string) => {
    return divisionData
      .filter(item => 
        item.level === 'city' && 
        item.status === 'enabled' && 
        item.provinceId === provinceId
      )
      .map(item => ({ value: item.id, label: item.name }));
  };

  // 获取区县选项
  const getDistrictOptions = (cityId: string) => {
    return divisionData
      .filter(item => 
        item.level === 'district' && 
        item.status === 'enabled' && 
        item.cityId === cityId
      )
      .map(item => ({ value: item.id, label: item.name }));
  };

  // 获取街道选项
  const getStreetOptions = (districtId: string) => {
    return divisionData
      .filter(item => 
        item.level === 'street' && 
        item.status === 'enabled' && 
        item.districtId === districtId
      )
      .map(item => ({ value: item.id, label: item.name }));
  };

  // 表格列定义
  const getColumns = (level: DivisionLevel) => [
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
      render: (_: unknown, record: AdministrativeDivision) => (
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
      title: '名称',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '编码',
      dataIndex: 'code',
      width: 150,
    },
    ...(level === 'province' ? [{
      title: '国家',
      dataIndex: 'countryName',
      width: 120,
    }] : []),
    ...(level !== 'province' ? [{
      title: '上级行政区划',
      dataIndex: 'parentName',
      width: 200,
    }] : []),
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
      render: (_: unknown, record: AdministrativeDivision) => (
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
            title={`确定要${record.status === 'enabled' ? '禁用' : '启用'}此行政区划吗？`}
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
  const handleEdit = (record: AdministrativeDivision) => {
    setCurrentDivision(record);
    setIsEditing(true);
    
    // 设置编辑表单的值
    const formValues: any = {
      name: record.name,
      code: record.code
    };

    // 根据级别设置相应的上级选择值
    if (record.level === 'city') {
      formValues.provinceId = record.provinceId;
      setSelectedProvince(record.provinceId || '');
    } else if (record.level === 'district') {
      formValues.provinceId = record.provinceId;
      formValues.cityId = record.cityId;
      setSelectedProvince(record.provinceId || '');
      setSelectedCity(record.cityId || '');
    } else if (record.level === 'street') {
      formValues.provinceId = record.provinceId;
      formValues.cityId = record.cityId;
      formValues.districtId = record.districtId;
      setSelectedProvince(record.provinceId || '');
      setSelectedCity(record.cityId || '');
      setSelectedDistrict(record.districtId || '');
    } else if (record.level === 'village') {
      formValues.provinceId = record.provinceId;
      formValues.cityId = record.cityId;
      formValues.districtId = record.districtId;
      formValues.streetId = record.streetId;
      setSelectedProvince(record.provinceId || '');
      setSelectedCity(record.cityId || '');
      setSelectedDistrict(record.districtId || '');
      setSelectedStreet(record.streetId || '');
    }

    editForm.setFieldsValue(formValues);
    setEditModalVisible(true);
  };

  // 处理新增
  const handleAdd = () => {
    setCurrentDivision(null);
    setIsEditing(false);
    editForm.resetFields();
    setSelectedProvince('');
    setSelectedCity('');
    setSelectedDistrict('');
    setSelectedStreet('');
    setEditModalVisible(true);
  };

  // 处理状态切换
  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    setDivisionData(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
    filterDataByLevel(activeTab);
    Message.success(`行政区划已${newStatus === 'enabled' ? '启用' : '禁用'}`);
  };

  // 批量启用
  const handleBatchEnable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要启用的行政区划');
      return;
    }
    
    setDivisionData(prev => prev.map(item => 
      selectedRowKeys.includes(item.id) ? { ...item, status: 'enabled' } : item
    ));
    
    setSelectedRowKeys([]);
    filterDataByLevel(activeTab);
    Message.success(`已启用 ${selectedRowKeys.length} 个行政区划`);
  };

  // 批量禁用
  const handleBatchDisable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要禁用的行政区划');
      return;
    }
    
    setDivisionData(prev => prev.map(item => 
      selectedRowKeys.includes(item.id) ? { ...item, status: 'disabled' } : item
    ));
    
    setSelectedRowKeys([]);
    filterDataByLevel(activeTab);
    Message.success(`已禁用 ${selectedRowKeys.length} 个行政区划`);
  };

  // 保存行政区划编辑
  const handleSaveDivision = async () => {
    try {
      const values = await editForm.validate();
      const currentLevel = activeTab as DivisionLevel;
      
      // 构建完整的行政区划信息
      let divisionItem: Partial<AdministrativeDivision> = {
        ...values,
        id: isEditing ? currentDivision?.id : Date.now().toString(),
        level: currentLevel,
        status: isEditing ? currentDivision?.status : 'enabled' as const
      };

      // 根据级别设置父级信息和完整层级信息
      if (currentLevel === 'city') {
        const province = divisionData.find(item => item.id === values.provinceId);
        divisionItem = {
          ...divisionItem,
          parentId: values.provinceId,
          parentName: province?.name,
          provinceId: values.provinceId,
          provinceName: province?.name
        };
      } else if (currentLevel === 'district') {
        const province = divisionData.find(item => item.id === values.provinceId);
        const city = divisionData.find(item => item.id === values.cityId);
        divisionItem = {
          ...divisionItem,
          parentId: values.cityId,
          parentName: city?.name,
          provinceId: values.provinceId,
          provinceName: province?.name,
          cityId: values.cityId,
          cityName: city?.name
        };
      } else if (currentLevel === 'street') {
        const province = divisionData.find(item => item.id === values.provinceId);
        const city = divisionData.find(item => item.id === values.cityId);
        const district = divisionData.find(item => item.id === values.districtId);
        divisionItem = {
          ...divisionItem,
          parentId: values.districtId,
          parentName: district?.name,
          provinceId: values.provinceId,
          provinceName: province?.name,
          cityId: values.cityId,
          cityName: city?.name,
          districtId: values.districtId,
          districtName: district?.name
        };
      } else if (currentLevel === 'village') {
        const province = divisionData.find(item => item.id === values.provinceId);
        const city = divisionData.find(item => item.id === values.cityId);
        const district = divisionData.find(item => item.id === values.districtId);
        const street = divisionData.find(item => item.id === values.streetId);
        divisionItem = {
          ...divisionItem,
          parentId: values.streetId,
          parentName: street?.name,
          provinceId: values.provinceId,
          provinceName: province?.name,
          cityId: values.cityId,
          cityName: city?.name,
          districtId: values.districtId,
          districtName: district?.name,
          streetId: values.streetId,
          streetName: street?.name
        };
      }

      if (isEditing) {
        // 更新现有行政区划
        setDivisionData(prev => prev.map(item => 
          item.id === currentDivision?.id ? { ...item, ...divisionItem } : item
        ));
        Message.success('行政区划信息已更新');
      } else {
        // 新增行政区划
        const newDivision = { ...divisionItem, id: Date.now().toString() } as AdministrativeDivision;
        setDivisionData(prev => [...prev, newDivision]);
        Message.success('行政区划已添加');
      }

      setEditModalVisible(false);
      editForm.resetFields();
      setSelectedProvince('');
      setSelectedCity('');
      setSelectedDistrict('');
      setSelectedStreet('');
      filterDataByLevel(activeTab);
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  // 获取当前tab配置
  const getCurrentTabConfig = () => {
    return tabConfig.find(tab => tab.key === activeTab);
  };

  const currentTab = getCurrentTabConfig();

  return (
    <Card>
      <div style={{ marginBottom: '20px' }}>
        <Title heading={4} style={{ margin: 0 }}>行政区划</Title>
      </div>

      {/* Tab切换 */}
      <Tabs activeTab={activeTab} onChange={handleTabChange} type="line" size="large">
        {tabConfig.map(tab => (
          <TabPane key={tab.key} title={tab.title} />
        ))}
      </Tabs>

      {/* 搜索筛选区域 */}
      <Card style={{ marginBottom: '16px', marginTop: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'province' ? '1fr 1fr 1fr 1fr auto' : '1fr 1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
            <Input
              placeholder="名称、编码"
              value={searchParams.keyword}
              onChange={(value) => setSearchParams(prev => ({ ...prev, keyword: value }))}
            />
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
          {activeTab === 'province' && (
            <div>
              <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>国家</div>
              <Select
                placeholder="选择国家"
                value={searchParams.country}
                onChange={(value) => setSearchParams(prev => ({ ...prev, country: value }))}
                allowClear
              >
                <Option value="CN">中国</Option>
                <Option value="US">美国</Option>
                <Option value="JP">日本</Option>
                <Option value="KR">韩国</Option>
                <Option value="GB">英国</Option>
                <Option value="DE">德国</Option>
                <Option value="FR">法国</Option>
              </Select>
            </div>
          )}
          {activeTab !== 'province' && (
            <div>
              <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>上级行政区划</div>
              <Select
                placeholder="选择上级区划"
                value={searchParams.parentId}
                onChange={(value) => setSearchParams(prev => ({ ...prev, parentId: value }))}
                allowClear
              >
                {getParentOptions(currentTab?.level || 'province').map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </div>
          )}
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
              新增{currentTab?.title}
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
        columns={getColumns(currentTab?.level || 'province')}
        data={filteredData}
        rowKey="id"
        scroll={{ x: 1000 }}
        pagination={{
          pageSize: 10,
          showTotal: true,
          showJumper: true,
          sizeCanChange: true,
        }}
      />

      {/* 新增/编辑行政区划弹窗 */}
      <Modal
        title={isEditing ? `编辑${currentTab?.title}` : `新增${currentTab?.title}`}
        visible={editModalVisible}
        onOk={handleSaveDivision}
        onCancel={() => setEditModalVisible(false)}
        style={{ width: 600 }}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            field="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder={`请输入${currentTab?.title}名称`} />
          </Form.Item>
          
          <Form.Item
            field="code"
            label="编码"
          >
            <Input placeholder="请输入行政区划编码" />
          </Form.Item>
          
          <Form.Item
            field="countryId"
            label="国家"
            rules={[{ required: true, message: '请选择国家' }]}
          >
            <Select placeholder="请选择国家">
              <Option value="CN">中国</Option>
              <Option value="US">美国</Option>
              <Option value="JP">日本</Option>
              <Option value="KR">韩国</Option>
              <Option value="GB">英国</Option>
              <Option value="DE">德国</Option>
              <Option value="FR">法国</Option>
            </Select>
          </Form.Item>
          
          {/* 城市需要选择省 */}
          {activeTab === 'city' && (
            <Form.Item
              field="provinceId"
              label="所属一级区划"
              rules={[{ required: true, message: '请选择所属一级区划' }]}
            >
              <Select 
                placeholder="请选择所属一级区划"
                value={selectedProvince}
                onChange={(value) => {
                  setSelectedProvince(value);
                  editForm.setFieldValue('provinceId', value);
                }}
              >
                {getProvinceOptions().map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {/* 区县需要选择省市 */}
          {activeTab === 'district' && (
            <>
              <Form.Item
                field="provinceId"
                label="所属一级区划"
                rules={[{ required: true, message: '请选择所属一级区划' }]}
              >
                <Select 
                  placeholder="请选择所属一级区划"
                  value={selectedProvince}
                  onChange={(value) => {
                    setSelectedProvince(value);
                    setSelectedCity('');
                    editForm.setFieldValue('provinceId', value);
                    editForm.setFieldValue('cityId', '');
                  }}
                >
                  {getProvinceOptions().map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                field="cityId"
                label="所属二级区划"
                rules={[{ required: true, message: '请选择所属二级区划' }]}
              >
                <Select 
                  placeholder="请选择所属二级区划"
                  value={selectedCity}
                  onChange={(value) => {
                    setSelectedCity(value);
                    editForm.setFieldValue('cityId', value);
                  }}
                  disabled={!selectedProvince}
                >
                  {getCityOptions(selectedProvince).map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}

          {/* 街道需要选择省市区 */}
          {activeTab === 'street' && (
            <>
              <Form.Item
                field="provinceId"
                label="所属一级区划"
                rules={[{ required: true, message: '请选择所属一级区划' }]}
              >
                <Select 
                  placeholder="请选择所属一级区划"
                  value={selectedProvince}
                  onChange={(value) => {
                    setSelectedProvince(value);
                    setSelectedCity('');
                    setSelectedDistrict('');
                    editForm.setFieldValue('provinceId', value);
                    editForm.setFieldValue('cityId', '');
                    editForm.setFieldValue('districtId', '');
                  }}
                >
                  {getProvinceOptions().map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                field="cityId"
                label="所属二级区划"
                rules={[{ required: true, message: '请选择所属二级区划' }]}
              >
                <Select 
                  placeholder="请选择所属二级区划"
                  value={selectedCity}
                  onChange={(value) => {
                    setSelectedCity(value);
                    setSelectedDistrict('');
                    editForm.setFieldValue('cityId', value);
                    editForm.setFieldValue('districtId', '');
                  }}
                  disabled={!selectedProvince}
                >
                  {getCityOptions(selectedProvince).map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                field="districtId"
                label="所属三级区划"
                rules={[{ required: true, message: '请选择所属三级区划' }]}
              >
                <Select 
                  placeholder="请选择所属三级区划"
                  value={selectedDistrict}
                  onChange={(value) => {
                    setSelectedDistrict(value);
                    editForm.setFieldValue('districtId', value);
                  }}
                  disabled={!selectedCity}
                >
                  {getDistrictOptions(selectedCity).map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}

          {/* 村/居委会需要选择省市区街道 */}
          {activeTab === 'village' && (
            <>
              <Form.Item
                field="provinceId"
                label="所属一级区划"
                rules={[{ required: true, message: '请选择所属一级区划' }]}
              >
                <Select 
                  placeholder="请选择所属一级区划"
                  value={selectedProvince}
                  onChange={(value) => {
                    setSelectedProvince(value);
                    setSelectedCity('');
                    setSelectedDistrict('');
                    setSelectedStreet('');
                    editForm.setFieldValue('provinceId', value);
                    editForm.setFieldValue('cityId', '');
                    editForm.setFieldValue('districtId', '');
                    editForm.setFieldValue('streetId', '');
                  }}
                >
                  {getProvinceOptions().map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                field="cityId"
                label="所属二级区划"
                rules={[{ required: true, message: '请选择所属二级区划' }]}
              >
                <Select 
                  placeholder="请选择所属二级区划"
                  value={selectedCity}
                  onChange={(value) => {
                    setSelectedCity(value);
                    setSelectedDistrict('');
                    setSelectedStreet('');
                    editForm.setFieldValue('cityId', value);
                    editForm.setFieldValue('districtId', '');
                    editForm.setFieldValue('streetId', '');
                  }}
                  disabled={!selectedProvince}
                >
                  {getCityOptions(selectedProvince).map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                field="districtId"
                label="所属三级区划"
                rules={[{ required: true, message: '请选择所属三级区划' }]}
              >
                <Select 
                  placeholder="请选择所属三级区划"
                  value={selectedDistrict}
                  onChange={(value) => {
                    setSelectedDistrict(value);
                    setSelectedStreet('');
                    editForm.setFieldValue('districtId', value);
                    editForm.setFieldValue('streetId', '');
                  }}
                  disabled={!selectedCity}
                >
                  {getDistrictOptions(selectedCity).map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                field="streetId"
                label="所属四级区划"
                rules={[{ required: true, message: '请选择所属四级区划' }]}
              >
                <Select 
                  placeholder="请选择所属四级区划"
                  value={selectedStreet}
                  onChange={(value) => {
                    setSelectedStreet(value);
                    editForm.setFieldValue('streetId', value);
                  }}
                  disabled={!selectedDistrict}
                >
                  {getStreetOptions(selectedDistrict).map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </Card>
  );
};

export default ChinaAdministrativeDivision;