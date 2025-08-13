import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Card,
  Typography,
  Modal,
  Form,
  Input,
  Message,
  Popconfirm,
  Switch,
  Select,
  Tag,
  Tooltip
} from '@arco-design/web-react';
import {
  IconPlus,
  IconEdit,
  IconDelete,
  IconRefresh,
  IconSearch,
  IconLocation,
  IconPhone,
  IconUser,
  IconHome
} from '@arco-design/web-react/icon';

const { Title } = Typography;
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

// 堆场信息数据类型
interface YardInfo {
  key: string;
  yardName: string;          // 堆场名称
  operatingCompany: string;  // 运营公司
  yardArea: number;          // 堆场面积（平方米）
  contactPerson: string;     // 联系人
  contactPhone: string;      // 联系电话
  status: 'active' | 'disabled'; // 状态
  address: string;           // 地址
  capacity: number;          // 容量（TEU）
  currentOccupancy: number;  // 当前占用量
  yardType: string;          // 堆场类型
  services: string[];        // 提供服务
  createdBy: string;
  createdTime: string;
  updatedBy: string;
  updatedTime: string;
}

// 堆场类型枚举
enum YardType {
  CONTAINER_STORAGE = '集装箱堆存',
  EMPTY_CONTAINER = '空箱堆场',
  HEAVY_CONTAINER = '重箱堆场',
  MIXED_USE = '混合使用',
  BONDED_WAREHOUSE = '保税仓库'
}

// 服务类型
const SERVICE_TYPES = [
  '集装箱存储',
  '装卸服务',
  '清洗消毒',
  '维修服务',
  '拖车服务',
  '报关服务',
  '24小时服务'
];

const YardManagementPage: React.FC = () => {
  const [yardList, setYardList] = useState<YardInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingYard, setEditingYard] = useState<YardInfo | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [form] = Form.useForm();

  // 模拟堆场数据
  const mockYardData: YardInfo[] = [
    {
      key: '1',
      yardName: '长胜2堆场',
      operatingCompany: '长胜集装箱仓储有限公司',
      yardArea: 2000,
      contactPerson: '张经理',
      contactPhone: '021-12345678',
      status: 'active',
      address: '上海市浦东新区外高桥保税区长胜路188号',
      capacity: 1500,
      currentOccupancy: 1200,
      yardType: YardType.CONTAINER_STORAGE,
      services: ['集装箱存储', '装卸服务', '24小时服务'],
      createdBy: '系统管理员',
      createdTime: '2024-01-15 10:30:00',
      updatedBy: '张经理',
      updatedTime: '2024-01-20 14:20:00'
    },
    {
      key: '2',
      yardName: '东海物流园',
      operatingCompany: '东海国际物流有限公司',
      yardArea: 3500,
      contactPerson: '李主管',
      contactPhone: '021-87654321',
      status: 'active',
      address: '上海市浦东新区东海路299号',
      capacity: 2800,
      currentOccupancy: 2100,
      yardType: YardType.MIXED_USE,
      services: ['集装箱存储', '装卸服务', '清洗消毒', '维修服务', '拖车服务'],
      createdBy: '系统管理员',
      createdTime: '2024-01-10 09:15:00',
      updatedBy: '李主管',
      updatedTime: '2024-01-25 16:45:00'
    },
    {
      key: '3',
      yardName: '临港空箱中心',
      operatingCompany: '临港集装箱服务有限公司',
      yardArea: 1200,
      contactPerson: '王总监',
      contactPhone: '021-55667788',
      status: 'disabled',
      address: '上海市临港新区海天路100号',
      capacity: 800,
      currentOccupancy: 0,
      yardType: YardType.EMPTY_CONTAINER,
      services: ['集装箱存储', '清洗消毒'],
      createdBy: '系统管理员',
      createdTime: '2024-01-08 11:20:00',
      updatedBy: '系统管理员',
      updatedTime: '2024-01-30 10:10:00'
    },
    {
      key: '4',
      yardName: '宝山重箱堆场',
      operatingCompany: '宝山港口集团有限公司',
      yardArea: 4200,
      contactPerson: '赵部长',
      contactPhone: '021-33445566',
      status: 'active',
      address: '上海市宝山区宝杨路888号',
      capacity: 3200,
      currentOccupancy: 2800,
      yardType: YardType.HEAVY_CONTAINER,
      services: ['集装箱存储', '装卸服务', '拖车服务', '报关服务', '24小时服务'],
      createdBy: '系统管理员',
      createdTime: '2024-01-05 08:30:00',
      updatedBy: '赵部长',
      updatedTime: '2024-01-28 13:15:00'
    }
  ];

  React.useEffect(() => {
    loadYardData();
  }, []);

  // 加载堆场数据
  const loadYardData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setYardList(mockYardData);
      setLoading(false);
    }, 500);
  };

  // 筛选数据
  const getFilteredData = () => {
    return yardList.filter(yard => {
      const matchKeyword = !searchKeyword ||
        yard.yardName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        yard.operatingCompany.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        yard.address.toLowerCase().includes(searchKeyword.toLowerCase());
     
      const matchStatus = !statusFilter || yard.status === statusFilter;
     
      return matchKeyword && matchStatus;
    });
  };

  // 打开新增/编辑弹窗
  const openModal = (yard?: YardInfo) => {
    if (yard) {
      setEditingYard(yard);
      form.setFieldsValue({
        ...yard,
        services: yard.services || []
      });
    } else {
      setEditingYard(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  // 保存堆场信息
  const handleSave = async () => {
    try {
      const values = await form.validate();
     
      const yardData: YardInfo = {
        key: editingYard?.key || Date.now().toString(),
        ...values,
        createdBy: editingYard ? editingYard.createdBy : '当前用户',
        createdTime: editingYard ? editingYard.createdTime : new Date().toLocaleString(),
        updatedBy: '当前用户',
        updatedTime: new Date().toLocaleString()
      };

      if (editingYard) {
        // 编辑
        setYardList(prev => prev.map(item =>
          item.key === editingYard.key ? yardData : item
        ));
        Message.success('堆场信息更新成功！');
      } else {
        // 新增
        setYardList(prev => [yardData, ...prev]);
        Message.success('堆场信息添加成功！');
      }
     
      setModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 删除堆场
  const handleDelete = (key: string) => {
    setYardList(prev => prev.filter(item => item.key !== key));
    Message.success('堆场删除成功！');
  };

  // 切换状态
  const toggleStatus = (key: string, newStatus: 'active' | 'disabled') => {
    setYardList(prev => prev.map(item =>
      item.key === key
        ? { ...item, status: newStatus, updatedBy: '当前用户', updatedTime: new Date().toLocaleString() }
        : item
    ));
    Message.success(`堆场状态已${newStatus === 'active' ? '启用' : '禁用'}`);  
  };

  // 计算占用率
  const getOccupancyRate = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100);
  };

  // 获取占用率颜色
  const getOccupancyColor = (rate: number) => {
    if (rate >= 90) return 'red';
    if (rate >= 75) return 'orange';
    if (rate >= 50) return 'blue';
    return 'green';
  };

  // 表格列配置
  const columns = [
    {
      title: '堆场名称',
      dataIndex: 'yardName',
      width: 150,
      render: (name: string) => (
        <div className="font-semibold">{name}</div>
      )
    },
    {
      title: '运营公司',
      dataIndex: 'operatingCompany',
      width: 200,
      ellipsis: true
    },
    {
      title: '堆场面积',
      dataIndex: 'yardArea',
      width: 100,
      render: (area: number) => `${area}㎡`
    },
    {
      title: '容量/占用',
      dataIndex: 'capacity',
      width: 120,
      render: (_: any, record: YardInfo) => {
        const rate = getOccupancyRate(record.currentOccupancy, record.capacity);
        return (
          <div>
            <div className="text-sm">
              {record.currentOccupancy}/{record.capacity} TEU
            </div>
            <Tag color={getOccupancyColor(rate)} size="small">
              {rate}%
            </Tag>
          </div>
        );
      }
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      width: 100,
      render: (person: string, record: YardInfo) => (
        <div>
          <div className="flex items-center mb-1">
            <IconUser className="mr-1 text-gray-400 w-3 h-3" />
            <span className="text-sm">{person}</span>
          </div>
          <div className="flex items-center">
            <IconPhone className="mr-1 text-gray-400 w-3 h-3" />
            <span className="text-xs text-gray-500">{record.contactPhone}</span>
          </div>
        </div>
      )
    },
    {
      title: '地址',
      dataIndex: 'address',
      width: 200,
      ellipsis: true,
      render: (address: string) => (
        <Tooltip content={address}>
          <div className="flex items-center">
            <IconLocation className="mr-1 text-gray-400 w-3 h-3" />
            <span className="text-sm">{address}</span>
          </div>
        </Tooltip>
      )
    },
    {
      title: '提供服务',
      dataIndex: 'services',
      width: 150,
      render: (services: string[]) => (
        <div>
          {services.slice(0, 2).map(service => (
            <Tag key={service} size="small" className="mb-1 mr-1">
              {service}
            </Tag>
          ))}
          {services.length > 2 && (
            <Tooltip content={services.slice(2).join('、')}>
              <Tag size="small" color="blue">+{services.length - 2}</Tag>
            </Tooltip>
          )}
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: 'active' | 'disabled', record: YardInfo) => (
        <Switch
          checked={status === 'active'}
          checkedText="正常"
          uncheckedText="禁用"
          onChange={(checked) => toggleStatus(record.key, checked ? 'active' : 'disabled')}
        />
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (_: any, record: YardInfo) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<IconEdit />}
            onClick={() => openModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个堆场吗？"
            onOk={() => handleDelete(record.key)}
          >
            <Button
              type="text"
              size="small"
              status="danger"
              icon={<IconDelete />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      {/* 页面标题和操作区域 */}
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Title heading={5}>
            <IconHome className="mr-2" />
            堆场管理
          </Title>
          <Button
            type="primary"
            icon={<IconPlus />}
            onClick={() => openModal()}
          >
            新增堆场
          </Button>
        </div>
       
        {/* 搜索和筛选区域 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              placeholder="搜索堆场名称、运营公司或地址"
              value={searchKeyword}
              onChange={(value) => setSearchKeyword(value)}
              prefix={<IconSearch />}
              allowClear
            />
          </div>
         
          <div>
            <Select
              placeholder="筛选状态"
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="active">正常</Option>
              <Option value="disabled">禁用</Option>
            </Select>
          </div>
         
          <div>
            <Button icon={<IconRefresh />} onClick={loadYardData}>
              刷新
            </Button>
          </div>
        </div>
      </Card>

      {/* 堆场列表 */}
      <Card>
        <Table
          columns={columns}
          data={getFilteredData()}
          loading={loading}
          pagination={{
            showTotal: true,
            pageSize: 10,
            showJumper: true
          }}
          scroll={{ x: 1200 }}
          border={{
            wrapper: true,
            cell: true
          }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingYard ? '编辑堆场信息' : '新增堆场'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
        style={{ width: 800 }}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'active',
            yardType: YardType.CONTAINER_STORAGE,
            services: []
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormItem
              label="堆场名称"
              field="yardName"
              rules={[{ required: true, message: '请输入堆场名称' }]}
            >
              <Input placeholder="请输入堆场名称" />
            </FormItem>
           
            <FormItem
              label="运营公司"
              field="operatingCompany"
              rules={[{ required: true, message: '请输入运营公司' }]}
            >
              <Input placeholder="请输入运营公司" />
            </FormItem>
           
            <FormItem
              label="堆场面积（平方米）"
              field="yardArea"
              rules={[{ required: true, message: '请输入堆场面积' }]}
            >
              <Input placeholder="请输入堆场面积" type="number" />
            </FormItem>
           
            <FormItem
              label="容量（TEU）"
              field="capacity"
              rules={[{ required: true, message: '请输入堆场容量' }]}
            >
              <Input placeholder="请输入堆场容量" type="number" />
            </FormItem>
           
            <FormItem
              label="联系人"
              field="contactPerson"
              rules={[{ required: true, message: '请输入联系人' }]}
            >
              <Input placeholder="请输入联系人" />
            </FormItem>
           
            <FormItem
              label="联系电话"
              field="contactPhone"
              rules={[
                { required: true, message: '请输入联系电话' },
                { match: /^1[3-9]\\d{9}$|^0\\d{2,3}-?\\d{7,8}$/, message: '请输入正确的电话号码' }
              ]}
            >
              <Input placeholder="请输入联系电话" />
            </FormItem>
           
            <FormItem
              label="堆场类型"
              field="yardType"
              rules={[{ required: true, message: '请选择堆场类型' }]}
            >
              <Select placeholder="请选择堆场类型">
                {Object.values(YardType).map(type => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </FormItem>
           
            <FormItem
              label="状态"
              field="status"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select placeholder="请选择状态">
                <Option value="active">正常</Option>
                <Option value="disabled">禁用</Option>
              </Select>
            </FormItem>
          </div>
         
          <FormItem
            label="地址"
            field="address"
            rules={[{ required: true, message: '请输入详细地址' }]}
          >
            <TextArea placeholder="请输入详细地址" rows={2} />
          </FormItem>
         
          <FormItem
            label="提供服务"
            field="services"
            help="可选择多项服务"
          >
            <Select
              mode="multiple"
              placeholder="请选择提供的服务"
              maxTagCount={3}
            >
              {SERVICE_TYPES.map(service => (
                <Option key={service} value={service}>{service}</Option>
              ))}
            </Select>
          </FormItem>
         
          <FormItem
            label="当前占用量（TEU）"
            field="currentOccupancy"
            help="当前实际存放的集装箱数量"
          >
            <Input placeholder="请输入当前占用量" type="number" />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
};

export default YardManagementPage;
