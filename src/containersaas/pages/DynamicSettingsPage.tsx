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
  Select
} from '@arco-design/web-react';
import {
  IconPlus,
  IconEdit,
  IconDelete,
  IconRefresh,
  IconSave
} from '@arco-design/web-react/icon';

const { Title } = Typography;
const FormItem = Form.Item;
const { Option } = Select;

// 动态代码数据类型
interface DynamicCodeItem {
  key: string;
  code: string;
  name: string;
  description: string;
  category: string;
  prerequisiteStatus: string; // 前置状态
  isActive: boolean;
  createdBy: string;
  createdTime: string;
  updatedBy: string;
  updatedTime: string;
}

// 动态代码分类
enum DynamicCodeCategory {
  CONTAINER_STATUS = '箱况状态',
  OPERATION_TYPE = '操作类型',
  LOCATION_TYPE = '位置类型',
  BUSINESS_TYPE = '业务类型'
}

const DynamicSettingsPage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<DynamicCodeItem | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [form] = Form.useForm();

  // 模拟数据
  const mockData: DynamicCodeItem[] = [
    {
      key: '1',
      code: 'NBCU',
      name: '新箱启用',
      description: '新购买的集装箱启用操作',
      category: DynamicCodeCategory.OPERATION_TYPE,
      prerequisiteStatus: '', // 新箱启用无前置状态
      isActive: true,
      createdBy: '张三',
      createdTime: '2023-01-15 10:30:00',
      updatedBy: '李四',
      updatedTime: '2023-01-20 14:00:00'
    },
    {
      key: '2', 
      code: 'DCHE',
      name: '空箱卸船',
      description: '空集装箱从船上卸载到港口',
      category: DynamicCodeCategory.OPERATION_TYPE,
      prerequisiteStatus: 'NBCU', // 需要先启用
      isActive: true,
      createdBy: '王五',
      createdTime: '2023-01-16 09:15:00',
      updatedBy: '赵六',
      updatedTime: '2023-01-22 16:30:00'
    },
    {
      key: '3',
      code: 'DCHF',
      name: '重箱卸船', 
      description: '载货集装箱从船上卸载到港口',
      category: DynamicCodeCategory.OPERATION_TYPE,
      prerequisiteStatus: 'DCHE', // 需要先空箱卸船
      isActive: true,
      createdBy: '孙七',
      createdTime: '2023-01-17 11:45:00',
      updatedBy: '周八',
      updatedTime: '2023-01-25 13:20:00'
    },
    {
      key: '4',
      code: 'GATE',
      name: '闸口作业',
      description: '集装箱通过闸口的进出操作',
      category: DynamicCodeCategory.OPERATION_TYPE,
      prerequisiteStatus: 'DCHF', // 需要先卸船
      isActive: false,
      createdBy: '吴九',
      createdTime: '2023-01-18 14:20:00',
      updatedBy: '郑十',
      updatedTime: '2023-01-26 10:10:00'
    }
  ];

  const [dataSource, setDataSource] = useState<DynamicCodeItem[]>(mockData);

  // 获取可选的前置状态（排除当前编辑的项目）
  const getAvailablePrerequisiteOptions = () => {
    const currentCode = editingItem?.code;
    return dataSource
      .filter(item => item.code !== currentCode && item.isActive)
      .map(item => ({
        value: item.code,
        label: `${item.code} - ${item.name}`
      }));
  };

  // 打开新增/编辑弹窗
  const openModal = (item?: DynamicCodeItem) => {
    setEditingItem(item || null);
    setModalVisible(true);
    if (item) {
      form.setFieldsValue(item);
    } else {
      form.resetFields();
    }
  };

  // 关闭弹窗
  const closeModal = () => {
    setModalVisible(false);
    setEditingItem(null);
    form.resetFields();
  };

  // 保存数据
  const handleSave = async () => {
    try {
      const values = await form.validate();
      const currentTime = new Date().toLocaleString();
      
      if (editingItem) {
        // 编辑
        const updatedData = dataSource.map(item => 
          item.key === editingItem.key 
            ? { ...item, ...values, updatedBy: '当前用户', updatedTime: currentTime }
            : item
        );
        setDataSource(updatedData);
        Message.success('动态代码更新成功');
      } else {
        // 新增
        const newItem: DynamicCodeItem = {
          key: Date.now().toString(),
          ...values,
          prerequisiteStatus: values.prerequisiteStatus || '', // 处理空值
          createdBy: '当前用户',
          createdTime: currentTime,
          updatedBy: '当前用户', 
          updatedTime: currentTime
        };
        setDataSource([...dataSource, newItem]);
        Message.success('动态代码添加成功');
      }
      closeModal();
    } catch (error) {
      Message.error('请检查输入信息');
    }
  };

  // 删除动态代码
  const handleDelete = (key: string) => {
    const updatedData = dataSource.filter(item => item.key !== key);
    setDataSource(updatedData);
    Message.success('动态代码删除成功');
  };

  // 批量删除
  const handleBatchDelete = () => {
    const updatedData = dataSource.filter(item => !selectedRowKeys.includes(item.key));
    setDataSource(updatedData);
    setSelectedRowKeys([]);
    Message.success(`成功删除${selectedRowKeys.length}条记录`);
  };

  // 切换状态
  const toggleStatus = (key: string, isActive: boolean) => {
    const updatedData = dataSource.map(item =>
      item.key === key 
        ? { ...item, isActive, updatedBy: '当前用户', updatedTime: new Date().toLocaleString() }
        : item
    );
    setDataSource(updatedData);
    Message.success(`动态代码已${isActive ? '启用' : '禁用'}`);
  };

  // 筛选数据
  const filteredData = dataSource.filter(item =>
    item.code.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    item.name.includes(searchKeyword) ||
    item.description.includes(searchKeyword)
  );

  // 根据代码获取状态名称
  const getStatusNameByCode = (code: string) => {
    const status = dataSource.find(item => item.code === code);
    return status ? `${status.code} - ${status.name}` : code;
  };

  // 表格列配置
  const columns = [
    {
      title: '动态代码',
      dataIndex: 'code',
      sorter: true,
      width: 120,
      render: (code: string) => (
        <span className="font-mono font-semibold text-blue-600">{code}</span>
      )
    },
    {
      title: '代码名称', 
      dataIndex: 'name',
      sorter: true,
      width: 150
    },
    {
      title: '前置状态',
      dataIndex: 'prerequisiteStatus',
      width: 180,
      render: (prerequisiteStatus: string) => {
        if (!prerequisiteStatus) {
          return <span className="text-gray-400">无</span>;
        }
        return (
          <span className="font-mono text-green-600">
            {getStatusNameByCode(prerequisiteStatus)}
          </span>
        );
      }
    },
    {
      title: '描述说明',
      dataIndex: 'description',
      width: 200
    },
    {
      title: '分类',
      dataIndex: 'category',
      sorter: true,
      width: 120
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      width: 100,
      render: (isActive: boolean, record: DynamicCodeItem) => (
        <Switch
          checked={isActive}
          onChange={(checked) => toggleStatus(record.key, checked)}
          checkedText="启用"
          uncheckedText="禁用"
        />
      )
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      width: 100
    },
    {
      title: '更新时间',
      dataIndex: 'updatedTime',
      sorter: true,
      width: 160
    },
    {
      title: '操作',
      dataIndex: 'operations',
      fixed: 'right' as const,
      width: 150,
      render: (_: any, record: DynamicCodeItem) => (
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
            title="确定要删除这个动态代码吗？"
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
      <Card>
        <div className="mb-6">
          <Title heading={5} className="mb-4">
            动态设置管理
          </Title>
          <div className="flex justify-between items-center mb-4">
            <Space>
              <Input.Search
                placeholder="搜索动态代码、名称或描述"
                style={{ width: 300 }}
                value={searchKeyword}
                onChange={(value) => setSearchKeyword(value)}
                allowClear
              />
              <Button icon={<IconRefresh />} onClick={() => window.location.reload()}>
                刷新
              </Button>
            </Space>
            <Space>
              {selectedRowKeys.length > 0 && (
                <Popconfirm
                  title={`确定要删除选中的${selectedRowKeys.length}条记录吗？`}
                  onOk={handleBatchDelete}
                >
                  <Button status="danger" icon={<IconDelete />}>
                    批量删除
                  </Button>
                </Popconfirm>
              )}
              <Button type="primary" icon={<IconPlus />} onClick={() => openModal()}>
                新增动态代码
              </Button>
            </Space>
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredData}
          pagination={{
            showTotal: true,
            pageSize: 20,
            current: 1,
            showJumper: true
          }}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys,
            onChange: setSelectedRowKeys
          }}
          scroll={{ x: 1400 }}
          border={{
            wrapper: true,
            cell: true
          }}
        />

        {/* 新增/编辑弹窗 */}
        <Modal
          title={editingItem ? '编辑动态代码' : '新增动态代码'}
          visible={modalVisible}
          onCancel={closeModal}
          footer={[
            <Button key="cancel" onClick={closeModal}>
              取消
            </Button>,
            <Button key="save" type="primary" onClick={handleSave} icon={<IconSave />}>
              保存
            </Button>
          ]}
          style={{ width: 600 }}
        >
          <Form form={form} layout="vertical">
            <FormItem
              label="动态代码"
              field="code"
              rules={[
                { required: true, message: '请输入动态代码' },
                { match: /^[A-Z0-9]{2,10}$/, message: '代码只能包含大写字母和数字，长度2-10位' }
              ]}
            >
              <Input placeholder="如：NBCU" maxLength={10} />
            </FormItem>
            <FormItem
              label="代码名称"
              field="name"
              rules={[{ required: true, message: '请输入代码名称' }]}
            >
              <Input placeholder="如：新箱启用" maxLength={50} />
            </FormItem>
            <FormItem
              label="前置状态"
              field="prerequisiteStatus"
              help="选择此状态执行前必须完成的前置状态，可留空表示无前置要求"
            >
              <Select 
                placeholder="请选择前置状态（可留空）" 
                allowClear
                showSearch
              >
                {getAvailablePrerequisiteOptions().map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </FormItem>
            <FormItem
              label="描述说明"
              field="description"
              rules={[{ required: true, message: '请输入描述说明' }]}
            >
              <Input.TextArea 
                placeholder="详细描述该动态代码的用途和场景" 
                maxLength={200}
                rows={3}
              />
            </FormItem>
            <FormItem
              label="分类"
              field="category"
              rules={[{ required: true, message: '请选择分类' }]}
            >
              <Select placeholder="请选择分类">
                <Option value={DynamicCodeCategory.CONTAINER_STATUS}>
                  {DynamicCodeCategory.CONTAINER_STATUS}
                </Option>
                <Option value={DynamicCodeCategory.OPERATION_TYPE}>
                  {DynamicCodeCategory.OPERATION_TYPE}
                </Option>
                <Option value={DynamicCodeCategory.LOCATION_TYPE}>
                  {DynamicCodeCategory.LOCATION_TYPE}
                </Option>
                <Option value={DynamicCodeCategory.BUSINESS_TYPE}>
                  {DynamicCodeCategory.BUSINESS_TYPE}
                </Option>
              </Select>
            </FormItem>
            <FormItem
              label="启用状态"
              field="isActive"
              triggerPropName="checked"
              initialValue={true}
            >
              <Switch checkedText="启用" uncheckedText="禁用" />
            </FormItem>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default DynamicSettingsPage; 