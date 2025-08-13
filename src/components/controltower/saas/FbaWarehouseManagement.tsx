import React, { useState } from 'react';
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
const Row = Grid.Row;
const Col = Grid.Col;
const FormItem = Form.Item;

// 定义数据接口
interface FbaWarehouseItem {
  key: string;
  country: string;      // 国家
  warehouseCode: string; // 仓库代码
  address: string;      // 地址
}

// 筛选项接口
interface FilterItem {
  label: string;
  placeholder: string;
  type?: 'select' | 'input';
  options?: string[];
}

const FbaWarehouseManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('新增FBA仓库');
  const [editingItem, setEditingItem] = useState<FbaWarehouseItem | null>(null);
  const [loading, setLoading] = useState(false);

  const onSelectChange = (selectedRowKeys: (string | number)[]) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  // 处理删除按钮点击
  const handleDelete = (record: FbaWarehouseItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除仓库 "${record.warehouseCode}" 吗？此操作不可撤销。`,
      okButtonProps: {
        status: 'danger'
      },
      onOk: () => {
        console.log('删除仓库:', record);
        // 这里添加删除逻辑
        Message.success('删除成功');
      }
    });
  };

  // 处理编辑按钮点击
  const handleEdit = (record: FbaWarehouseItem) => {
    setEditingItem(record);
    setModalTitle('编辑FBA仓库');
    form.setFieldsValue({
      country: record.country,
      warehouseCode: record.warehouseCode,
      address: record.address
    });
    setModalVisible(true);
  };

  // 打开新增弹窗
  const handleAdd = () => {
    setEditingItem(null);
    setModalTitle('新增FBA仓库');
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
  const columns = [
    {
      title: '国家',
      dataIndex: 'country',
      sorter: true,
      width: 120,
      render: (text: string) => <Tooltip content={text}><span>{text}</span></Tooltip>
    },
    {
      title: '仓库代码',
      dataIndex: 'warehouseCode',
      sorter: true,
      width: 150,
      render: (text: string) => <Tooltip content={text}><span>{text}</span></Tooltip>
    },
    {
      title: '地址',
      dataIndex: 'address',
      sorter: true,
      width: 400,
      render: (text: string) => <Tooltip content={text}><span className="truncate block max-w-md">{text}</span></Tooltip>
    },
    {
      title: '操作',
      dataIndex: 'operations',
      width: 150,
      render: (_: any, record: FbaWarehouseItem) => (
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

  // 筛选项列表
  const filterItems: FilterItem[] = [
    { 
      label: '国家', 
      placeholder: '请选择国家',
      type: 'select',
      options: ['美国', '中国', '德国', '英国', '法国', '日本']
    },
    { 
      label: '仓库代码', 
      placeholder: '请输入仓库代码',
      type: 'input'
    },
    { 
      label: '地址', 
      placeholder: '请输入地址',
      type: 'input'
    }
  ];

  // FBA仓库数据
  const fbaWarehouseData: FbaWarehouseItem[] = [
    {
      key: '1',
      country: '美国',
      warehouseCode: 'AFW1',
      address: '1511 W LOOP 820 N, FORT WORTH, TX, 76108 - 9755'
    },
    {
      key: '2',
      country: '美国',
      warehouseCode: 'AFW2',
      address: '12728 LAKE JUNE RD, DALLAS, TX, 75180'
    },
    {
      key: '3',
      country: '美国',
      warehouseCode: 'AZ1',
      address: '5333 W BUCKEYE RD, PHOENIX, AZ, 85043'
    },
    {
      key: '4',
      country: '美国',
      warehouseCode: 'BFL1',
      address: '4601 EXPRESS DR, BAKERSFIELD, CA, 93308'
    },
    {
      key: '5',
      country: '美国',
      warehouseCode: 'BFI1',
      address: '1125 WINDHAM PKWY, ROMEOVILLE, IL, 60446'
    },
    {
      key: '6',
      country: '中国',
      warehouseCode: 'SHA1',
      address: '上海市青浦区华新镇华腾路1288号'
    }
  ];

  return (
    <ControlTowerSaasLayout 
      menuSelectedKey="fba-warehouse" 
      breadcrumb={
        <Breadcrumb>
          <Breadcrumb.Item>基础数据</Breadcrumb.Item>
          <Breadcrumb.Item>FBA仓库</Breadcrumb.Item>
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
        <div className="flex justify-between mb-4 mt-4">
          <Space>
            <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>新增FBA仓库</Button>
            <Button icon={<IconUpload />}>批量导入</Button>
            <Button icon={<IconDownload />}>导出</Button>
          </Space>
        </div>
        
        <Table 
          rowKey="key"
          columns={columns}
          data={fbaWarehouseData}
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
          }}
          pagination={{
            showTotal: true,
            total: fbaWarehouseData.length,
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
            label="国家"
            field="country"
            rules={[{ required: true, message: '请选择国家' }]}
          >
            <Select placeholder="请选择国家">
              <Option value="美国">美国</Option>
              <Option value="中国">中国</Option>
              <Option value="德国">德国</Option>
              <Option value="英国">英国</Option>
              <Option value="法国">法国</Option>
              <Option value="日本">日本</Option>
            </Select>
          </FormItem>
          <FormItem
            label="仓库代码"
            field="warehouseCode"
            rules={[{ required: true, message: '请输入仓库代码' }]}
          >
            <Input placeholder="请输入仓库代码" />
          </FormItem>
          <FormItem
            label="地址"
            field="address"
            rules={[{ required: false }]}
          >
            <Input placeholder="请输入地址（选填）" />
          </FormItem>
        </Form>
      </Modal>
    </ControlTowerSaasLayout>
  );
};

export default FbaWarehouseManagement; 