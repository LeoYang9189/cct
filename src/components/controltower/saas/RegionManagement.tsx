import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Select, 
  Card, 
  Breadcrumb,
  Typography,
  Modal,
  Grid,
  Tooltip,
  Tabs,
  Form,
  Input,
  Message
} from '@arco-design/web-react';
import { 
  IconSearch, 
  IconPlus, 
  IconUpload, 
  IconDownload, 
  IconEdit, 
  IconDelete, 
  IconRefresh, 
  IconFilter,
  IconEye
} from '@arco-design/web-react/icon';
import ControlTowerSaasLayout from "./ControlTowerSaasLayout";

const Title = Typography.Title;
const Option = Select.Option;
const Row = Grid.Row;
const Col = Grid.Col;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

// 定义数据接口
interface RegionItem {
  key: string;
  level: string;         // 行政级别
  name: string;          // 名称
  parentName: string;    // 上级区划
  creator: string;       // 创建人
  createTime: string;    // 创建时间
  updater: string;       // 更新人
  updateTime: string;    // 更新时间
  province?: string;     // 省份ID，用于级联
  city?: string;         // 城市ID，用于级联
  district?: string;     // 区县ID，用于级联
}

// 筛选项接口定义
interface FilterItem {
  label: string;
  placeholder?: string;
  type?: string;
  options?: string[];
}

const RegionManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [currentTab, setCurrentTab] = useState<string>('province');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('新增区划');
  const [editingItem, setEditingItem] = useState<RegionItem | null>(null);
  const [loading, setLoading] = useState(false);
  
  // 级联选择相关状态
  const [provinces, setProvinces] = useState<{label: string; value: string}[]>([]);
  const [cities, setCities] = useState<{label: string; value: string; province: string}[]>([]);
  const [districts, setDistricts] = useState<{label: string; value: string; city: string}[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string | undefined>();
  const [selectedCity, setSelectedCity] = useState<string | undefined>();

  // 初始化数据
  useEffect(() => {
    // 模拟加载省份数据
    setProvinces([
      { label: '浙江省', value: '330000' },
      { label: '江苏省', value: '320000' }
    ]);
    
    // 模拟加载城市数据
    setCities([
      { label: '杭州市', value: '330100', province: '330000' },
      { label: '宁波市', value: '330200', province: '330000' },
      { label: '南京市', value: '320100', province: '320000' }
    ]);
    
    // 模拟加载区县数据
    setDistricts([
      { label: '西湖区', value: '330106', city: '330100' },
      { label: '上城区', value: '330102', city: '330100' },
      { label: '鼓楼区', value: '320106', city: '320100' }
    ]);
  }, []);

  const onSelectChange = (selectedRowKeys: (string | number)[]) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  // 处理删除按钮点击
  const handleDelete = (record: RegionItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除区划 "${record.name}" 吗？此操作不可撤销。`,
      okButtonProps: {
        status: 'danger'
      },
      onOk: () => {
        console.log('删除区划:', record);
        // 这里添加删除逻辑
        Message.success('删除成功');
      }
    });
  };

  // 处理编辑按钮点击
  const handleEdit = (record: RegionItem) => {
    setEditingItem(record);
    setModalTitle('编辑区划');
    
    // 根据当前编辑的行政区划级别，设置初始值
    if (currentTab === 'city' && record.province) {
      setSelectedProvince(record.province);
    } else if (currentTab === 'district') {
      setSelectedProvince(record.province);
      setSelectedCity(record.city);
    } else if (currentTab === 'street') {
      setSelectedProvince(record.province);
      setSelectedCity(record.city);
      form.setFieldValue('districtId', record.district);
    }
    
    form.setFieldsValue({
      name: record.name,
      parentId: record.parentName,
    });
    setModalVisible(true);
  };

  // 打开新增弹窗
  const handleAdd = () => {
    setEditingItem(null);
    setModalTitle('新增区划');
    setSelectedProvince(undefined);
    setSelectedCity(undefined);
    form.resetFields();
    setModalVisible(true);
  };

  // 处理Modal确认
  const handleModalOk = async () => {
    try {
      await form.validate();
      const values = form.getFieldsValue();
      setLoading(true);
      
      console.log('提交的数据:', {
        ...values,
        level: currentTab,
        editingItem: editingItem ? editingItem.key : null
      });
      
      // 这里添加保存逻辑
      setTimeout(() => {
        setLoading(false);
        setModalVisible(false);
        Message.success(editingItem ? '编辑成功' : '新增成功');
      }, 1000);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 处理Modal取消
  const handleModalCancel = () => {
    setModalVisible(false);
  };

  // 处理Tab切换
  const handleTabChange = (key: string) => {
    setCurrentTab(key);
  };

  // 处理省份选择变化
  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setSelectedCity(undefined);
    form.setFieldValue('cityId', undefined);
    form.setFieldValue('districtId', undefined);
  };

  // 处理城市选择变化
  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    form.setFieldValue('districtId', undefined);
  };

  // 根据当前Tab筛选数据
  const getFilteredData = (level: string) => {
    return data.filter(item => item.level === getLevelLabel(level));
  };

  // 获取级别标签
  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'province': return '省级';
      case 'city': return '市级';
      case 'district': return '区县级';
      case 'street': return '街道/镇乡级';
      default: return '';
    }
  };

  // 生成表格列配置
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 150,
      sorter: true,
      render: (value: string) => <Tooltip content={value}><span>{value}</span></Tooltip>
    },
    {
      title: '行政级别',
      dataIndex: 'level',
      width: 120,
      render: (value: string) => <Tooltip content={value}><span>{value}</span></Tooltip>
    },
    ...(currentTab !== 'province' ? [{
      title: '上级区划',
      dataIndex: 'parentName',
      width: 150,
      render: (value: string) => <Tooltip content={value}><span>{value}</span></Tooltip>
    }] : []),
    {
      title: '创建人',
      dataIndex: 'creator',
      width: 100,
      render: (value: string) => <Tooltip content={value}><span>{value}</span></Tooltip>
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 150,
      sorter: true,
      render: (value: string) => <Tooltip content={value}><span>{value}</span></Tooltip>
    },
    {
      title: '更新人',
      dataIndex: 'updater',
      width: 100,
      render: (value: string) => <Tooltip content={value}><span>{value}</span></Tooltip>
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 150,
      sorter: true,
      render: (value: string) => <Tooltip content={value}><span>{value}</span></Tooltip>
    },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right' as const,
      width: 180,
      render: (_: any, record: RegionItem) => (
        <Space>
          <Button type="text" size="mini" icon={<IconEye />}>查看</Button>
          <Button type="text" size="mini" icon={<IconEdit />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="text" size="mini" status="danger" icon={<IconDelete />} onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      ),
    }
  ];

  // 筛选项列表
  const filterItems: FilterItem[] = [
    { 
      label: '名称', 
      placeholder: '请输入名称'
    },
    ...(currentTab !== 'province' ? [{ 
      label: '上级区划', 
      placeholder: '请选择上级区划',
      type: 'select'
    }] : [])
  ];

  // 模拟数据
  const data: RegionItem[] = [
    {
      key: '1',
      name: '浙江省',
      level: '省级',
      parentName: '-',
      creator: '张三',
      createTime: '2024-05-01 10:30:45',
      updater: '张三',
      updateTime: '2024-05-01 10:30:45'
    },
    {
      key: '2',
      name: '江苏省',
      level: '省级',
      parentName: '-',
      creator: '李四',
      createTime: '2024-05-02 09:20:15',
      updater: '李四',
      updateTime: '2024-05-02 09:20:15'
    },
    {
      key: '3',
      name: '杭州市',
      level: '市级',
      parentName: '浙江省',
      province: '330000',
      creator: '李四',
      createTime: '2024-05-02 14:20:33',
      updater: '王五',
      updateTime: '2024-05-03 09:15:10'
    },
    {
      key: '4',
      name: '宁波市',
      level: '市级',
      parentName: '浙江省',
      province: '330000',
      creator: '王五',
      createTime: '2024-05-02 16:30:45',
      updater: '王五',
      updateTime: '2024-05-02 16:30:45'
    },
    {
      key: '5',
      name: '南京市',
      level: '市级',
      parentName: '江苏省',
      province: '320000',
      creator: '赵六',
      createTime: '2024-05-03 10:25:18',
      updater: '赵六',
      updateTime: '2024-05-03 10:25:18'
    },
    {
      key: '6',
      name: '西湖区',
      level: '区县级',
      parentName: '杭州市',
      province: '330000',
      city: '330100',
      creator: '赵六',
      createTime: '2024-04-28 16:45:22',
      updater: '赵六',
      updateTime: '2024-04-28 16:45:22'
    },
    {
      key: '7',
      name: '上城区',
      level: '区县级',
      parentName: '杭州市',
      province: '330000',
      city: '330100',
      creator: '张三',
      createTime: '2024-04-29 11:35:42',
      updater: '张三',
      updateTime: '2024-04-29 11:35:42'
    },
    {
      key: '8',
      name: '鼓楼区',
      level: '区县级',
      parentName: '南京市',
      province: '320000',
      city: '320100',
      creator: '李四',
      createTime: '2024-04-30 09:15:38',
      updater: '李四',
      updateTime: '2024-04-30 09:15:38'
    },
    {
      key: '9',
      name: '五常街道',
      level: '街道/镇乡级',
      parentName: '西湖区',
      province: '330000',
      city: '330100',
      district: '330106',
      creator: '王五',
      createTime: '2024-05-01 14:22:36',
      updater: '王五',
      updateTime: '2024-05-01 14:22:36'
    },
    {
      key: '10',
      name: '蒋村街道',
      level: '街道/镇乡级',
      parentName: '西湖区',
      province: '330000',
      city: '330100',
      district: '330106',
      creator: '赵六',
      createTime: '2024-05-01 16:38:54',
      updater: '赵六',
      updateTime: '2024-05-01 16:38:54'
    }
  ];

  return (
    <ControlTowerSaasLayout 
      menuSelectedKey="region" 
      breadcrumb={
        <Breadcrumb>
          <Breadcrumb.Item>基础数据</Breadcrumb.Item>
          <Breadcrumb.Item>行政区划</Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      {/* 筛选条件卡片 */}
      <Card className="mb-4">
        <Title heading={6} className="mb-4">筛选条件</Title>
        <Row gutter={[16, 16]}>
          {filterItems.map((item, index) => (
            <Col span={6} key={index}>
              <div className="mb-2 text-gray-600 text-sm">{item.label}</div>
              {item.type === 'select' ? (
                <Select placeholder={item.placeholder} allowClear style={{ width: '100%' }}>
                  {item.options?.map(option => (
                    <Option key={option} value={option}>{option}</Option>
                  ))}
                </Select>
              ) : (
                <Select placeholder={item.placeholder} allowClear style={{ width: '100%' }} />
              )}
            </Col>
          ))}
        </Row>
        <div className="flex justify-end mt-4">
          <Space>
            <Button type="primary" icon={<IconSearch />}>查询</Button>
            <Button icon={<IconRefresh />}>重置</Button>
            <Button icon={<IconFilter />}>收起</Button>
          </Space>
        </div>
      </Card>

      {/* 表格卡片 */}
      <Card>
        <Tabs activeTab={currentTab} onChange={handleTabChange}>
          <TabPane key="province" title="省级"></TabPane>
          <TabPane key="city" title="市级"></TabPane>
          <TabPane key="district" title="区县级"></TabPane>
          <TabPane key="street" title="街道/镇乡级"></TabPane>
        </Tabs>
        
        <div className="flex justify-between mb-4 mt-4">
          <Space>
            <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>新增{getLevelLabel(currentTab)}</Button>
            <Button icon={<IconUpload />}>批量导入</Button>
            <Button icon={<IconDownload />}>导出</Button>
          </Space>
        </div>
        
        <Table 
          rowKey="key"
          columns={columns}
          data={getFilteredData(currentTab)}
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
          }}
          pagination={{
            showTotal: true,
            total: getFilteredData(currentTab).length,
            showJumper: true,
            sizeCanChange: true,
            pageSize: 10,
          }}
          scroll={{ x: 1200 }}
          border={false}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={modalTitle}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={loading}
        maskClosable={false}
      >
        <Form
          form={form}
          autoComplete="off"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          {currentTab === 'city' && (
            <FormItem
              label="所属省份"
              field="provinceId"
              rules={[{ required: true, message: '请选择所属省份' }]}
            >
              <Select
                placeholder="请选择所属省份"
                onChange={handleProvinceChange}
                allowClear
              >
                {provinces.map(province => (
                  <Option key={province.value} value={province.value}>
                    {province.label}
                  </Option>
                ))}
              </Select>
            </FormItem>
          )}

          {currentTab === 'district' && (
            <>
              <FormItem
                label="所属省份"
                field="provinceId"
                rules={[{ required: true, message: '请选择所属省份' }]}
              >
                <Select
                  placeholder="请选择所属省份"
                  onChange={handleProvinceChange}
                  allowClear
                >
                  {provinces.map(province => (
                    <Option key={province.value} value={province.value}>
                      {province.label}
                    </Option>
                  ))}
                </Select>
              </FormItem>
              
              <FormItem
                label="所属城市"
                field="cityId"
                rules={[{ required: true, message: '请选择所属城市' }]}
              >
                <Select
                  placeholder="请选择所属城市"
                  onChange={handleCityChange}
                  allowClear
                  disabled={!selectedProvince}
                >
                  {cities
                    .filter(city => city.province === selectedProvince)
                    .map(city => (
                      <Option key={city.value} value={city.value}>
                        {city.label}
                      </Option>
                    ))}
                </Select>
              </FormItem>
            </>
          )}

          {currentTab === 'street' && (
            <>
              <FormItem
                label="所属省份"
                field="provinceId"
                rules={[{ required: true, message: '请选择所属省份' }]}
              >
                <Select
                  placeholder="请选择所属省份"
                  onChange={handleProvinceChange}
                  allowClear
                >
                  {provinces.map(province => (
                    <Option key={province.value} value={province.value}>
                      {province.label}
                    </Option>
                  ))}
                </Select>
              </FormItem>
              
              <FormItem
                label="所属城市"
                field="cityId"
                rules={[{ required: true, message: '请选择所属城市' }]}
              >
                <Select
                  placeholder="请选择所属城市"
                  onChange={handleCityChange}
                  allowClear
                  disabled={!selectedProvince}
                >
                  {cities
                    .filter(city => city.province === selectedProvince)
                    .map(city => (
                      <Option key={city.value} value={city.value}>
                        {city.label}
                      </Option>
                    ))}
                </Select>
              </FormItem>
              
              <FormItem
                label="所属区县"
                field="districtId"
                rules={[{ required: true, message: '请选择所属区县' }]}
              >
                <Select
                  placeholder="请选择所属区县"
                  allowClear
                  disabled={!selectedCity}
                >
                  {districts
                    .filter(district => district.city === selectedCity)
                    .map(district => (
                      <Option key={district.value} value={district.value}>
                        {district.label}
                      </Option>
                    ))}
                </Select>
              </FormItem>
            </>
          )}

          <FormItem
            label="名称"
            field="name"
            rules={[
              { required: true, message: '请输入名称' },
              { 
                minLength: 2, 
                message: '名称长度不能小于2个字符' 
              }
            ]}
          >
            <Input placeholder="请输入名称" />
          </FormItem>
        </Form>
      </Modal>
    </ControlTowerSaasLayout>
  );
};

export default RegionManagement; 