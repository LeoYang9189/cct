import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Select, 
  Card, 
  Breadcrumb,
  Typography,
  Tabs,
  Modal,
  Grid,
  Tooltip,
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
  IconFilter
} from '@arco-design/web-react/icon';
import ControlTowerSaasLayout from './ControlTowerSaasLayout';

const Title = Typography.Title;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const Row = Grid.Row;
const Col = Grid.Col;
const FormItem = Form.Item;

// 定义数据接口
interface ZipcodeItem {
  key: string;
  zipcode: string;      // 邮编
  city: string;         // 城市
  state: string;        // 州/省
  latitude: number;     // 纬度
  longitude: number;    // 经度
  country: string;      // 国家
}

// 筛选项接口
interface FilterItem {
  label: string;
  placeholder: string;
  type?: 'select' | 'input';
  options?: string[];
}

const ZipcodeManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [currentTab, setCurrentTab] = useState<string>('usa');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('新增邮编');
  const [editingItem, setEditingItem] = useState<ZipcodeItem | null>(null);
  const [loading, setLoading] = useState(false);

  const onSelectChange = (selectedRowKeys: (string | number)[]) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  // 处理Tab切换
  const handleTabChange = (key: string) => {
    setCurrentTab(key);
    setSelectedRowKeys([]);
  };

  // 处理删除按钮点击
  const handleDelete = (record: ZipcodeItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除邮编 "${record.zipcode}" 吗？此操作不可撤销。`,
      okButtonProps: {
        status: 'danger'
      },
      onOk: () => {
        console.log('删除邮编:', record);
        // 这里添加删除逻辑
        Message.success('删除成功');
      }
    });
  };

  // 处理编辑按钮点击
  const handleEdit = (record: ZipcodeItem) => {
    setEditingItem(record);
    setModalTitle('编辑邮编');
    form.setFieldsValue({
      zipcode: record.zipcode,
      city: record.city,
      state: record.state,
      latitude: record.latitude,
      longitude: record.longitude
    });
    setModalVisible(true);
  };

  // 打开新增弹窗
  const handleAdd = () => {
    setEditingItem(null);
    setModalTitle(`新增${currentTab === 'usa' ? '美国' : '中国'}邮编`);
    form.resetFields();
    setModalVisible(true);
  };

  // 提交表单
  const handleSubmit = () => {
    form.validate().then((values) => {
      setLoading(true);
      console.log('提交数据:', values);
      
      // 模拟API调用
      setTimeout(() => {
        setLoading(false);
        setModalVisible(false);
        Message.success(`${editingItem ? '编辑' : '新增'}成功`);
      }, 500);
    });
  };

  // 获取表格列配置
  const getColumns = () => {
    return [
      {
        title: '邮编',
        dataIndex: 'zipcode',
        sorter: true,
        width: 120,
        render: (text: string) => <Tooltip content={text}><span>{text}</span></Tooltip>
      },
      {
        title: '城市',
        dataIndex: 'city',
        sorter: true,
        width: 180,
        render: (text: string) => <Tooltip content={text}><span>{text}</span></Tooltip>
      },
      {
        title: currentTab === 'usa' ? '州' : '省份',
        dataIndex: 'state',
        sorter: true,
        width: 120,
        render: (text: string) => <Tooltip content={text}><span>{text}</span></Tooltip>
      },
      {
        title: '纬度',
        dataIndex: 'latitude',
        sorter: true,
        width: 120,
        render: (value: number) => <Tooltip content={value}><span>{value}</span></Tooltip>
      },
      {
        title: '经度',
        dataIndex: 'longitude',
        sorter: true,
        width: 120,
        render: (value: number) => <Tooltip content={value}><span>{value}</span></Tooltip>
      },
      {
        title: '操作',
        dataIndex: 'operations',
        width: 150,
        render: (_: any, record: ZipcodeItem) => (
          <Space>
            <Button 
              type="text" 
              size="mini" 
              icon={<IconEdit />} 
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
            <Button 
              type="text" 
              size="mini" 
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
  };

  // 筛选项列表
  const filterItems: FilterItem[] = [
    { 
      label: '邮编', 
      placeholder: '请输入邮编',
      type: 'input'
    },
    { 
      label: '城市', 
      placeholder: '请输入城市',
      type: 'input'
    },
    { 
      label: currentTab === 'usa' ? '州' : '省份', 
      placeholder: `请选择${currentTab === 'usa' ? '州' : '省份'}`,
      type: 'select',
      options: currentTab === 'usa' 
        ? ['NY', 'CA', 'TX', 'FL'] 
        : ['北京市', '上海市', '广东省', '浙江省']
    }
  ];

  // 美国邮编数据
  const usaZipcodeData: ZipcodeItem[] = [
    {
      key: '1',
      zipcode: '00501',
      city: 'HOLTSVILLE',
      state: 'NY',
      latitude: 40.7877,
      longitude: -73.0393,
      country: 'USA'
    },
    {
      key: '2',
      zipcode: '00544',
      city: 'HOLTSVILLE',
      state: 'NY',
      latitude: 40.7888,
      longitude: -73.0394,
      country: 'USA'
    },
    {
      key: '3',
      zipcode: '00601',
      city: 'ADJUNTAS',
      state: 'PR',
      latitude: 18.1967,
      longitude: -66.7367,
      country: 'USA'
    },
    {
      key: '4',
      zipcode: '00602',
      city: 'AGUADA',
      state: 'PR',
      latitude: 18.3529,
      longitude: -67.1775,
      country: 'USA'
    },
    {
      key: '5',
      zipcode: '00603',
      city: 'AGUADILLA',
      state: 'PR',
      latitude: 18.4586,
      longitude: -67.1299,
      country: 'USA'
    },
    {
      key: '6',
      zipcode: '00604',
      city: 'AGUADILLA',
      state: 'PR',
      latitude: 18.4888,
      longitude: -67.1477,
      country: 'USA'
    },
    {
      key: '7',
      zipcode: '00605',
      city: 'AGUADILLA',
      state: 'PR',
      latitude: 18.4289,
      longitude: -67.1538,
      country: 'USA'
    }
  ];

  // 中国邮编数据
  const chinaZipcodeData: ZipcodeItem[] = [
    {
      key: '1',
      zipcode: '100000',
      city: '北京',
      state: '北京市',
      latitude: 39.9042,
      longitude: 116.4074,
      country: 'China'
    },
    {
      key: '2',
      zipcode: '200000',
      city: '上海',
      state: '上海市',
      latitude: 31.2304,
      longitude: 121.4737,
      country: 'China'
    },
    {
      key: '3',
      zipcode: '510000',
      city: '广州',
      state: '广东省',
      latitude: 23.1291,
      longitude: 113.2644,
      country: 'China'
    },
    {
      key: '4',
      zipcode: '310000',
      city: '杭州',
      state: '浙江省',
      latitude: 30.2741,
      longitude: 120.1551,
      country: 'China'
    },
    {
      key: '5',
      zipcode: '300000',
      city: '天津',
      state: '天津市',
      latitude: 39.3434,
      longitude: 117.3616,
      country: 'China'
    }
  ];

  // 根据当前选项卡获取数据
  const getFilteredData = () => {
    return currentTab === 'usa' ? usaZipcodeData : chinaZipcodeData;
  };

  return (
    <ControlTowerSaasLayout 
      menuSelectedKey="zipcode" 
      breadcrumb={
        <Breadcrumb>
          <Breadcrumb.Item>基础数据</Breadcrumb.Item>
          <Breadcrumb.Item>邮编管理</Breadcrumb.Item>
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
          <TabPane key="usa" title="美国邮编"></TabPane>
          <TabPane key="china" title="中国邮编"></TabPane>
        </Tabs>
        
        <div className="flex justify-between mb-4 mt-4">
          <Space>
            <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>新增{currentTab === 'usa' ? '美国' : '中国'}邮编</Button>
            <Button icon={<IconUpload />}>批量导入</Button>
            <Button icon={<IconDownload />}>导出</Button>
          </Space>
        </div>
        
        <Table 
          rowKey="key"
          columns={getColumns()}
          data={getFilteredData()}
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
          }}
          pagination={{
            showTotal: true,
            total: getFilteredData().length,
            showJumper: true,
            sizeCanChange: true,
            pageSize: 10,
          }}
          scroll={{ x: 800 }}
          border={false}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={modalTitle}
        visible={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        confirmLoading={loading}
        style={{ width: 600 }}
        autoFocus={false}
      >
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          layout="horizontal"
          labelAlign="right"
        >
          <FormItem
            label="邮编"
            field="zipcode"
            rules={[{ required: true, message: '请输入邮编' }]}
          >
            <Input placeholder="请输入邮编" />
          </FormItem>
          <FormItem
            label="城市"
            field="city"
            rules={[{ required: true, message: '请输入城市' }]}
          >
            <Input placeholder="请输入城市" />
          </FormItem>
          <FormItem
            label={currentTab === 'usa' ? '州' : '省份'}
            field="state"
            rules={[{ required: true, message: `请输入${currentTab === 'usa' ? '州' : '省份'}` }]}
          >
            <Input placeholder={`请输入${currentTab === 'usa' ? '州' : '省份'}`} />
          </FormItem>
          <FormItem
            label="纬度"
            field="latitude"
            rules={[{ required: false }]}
          >
            <Input placeholder="请输入纬度（选填）" />
          </FormItem>
          <FormItem
            label="经度"
            field="longitude"
            rules={[{ required: false }]}
          >
            <Input placeholder="请输入经度（选填）" />
          </FormItem>
        </Form>
      </Modal>
    </ControlTowerSaasLayout>
  );
};

export default ZipcodeManagement; 