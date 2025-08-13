import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Select, 
  DatePicker, 
  Card, 
  Breadcrumb,
  Typography,
  Modal,
  Switch,
  Grid,
  Tooltip,
  Dropdown,
  Menu
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
  IconList,
  IconDragDotVertical,
  IconMore,
  IconCopy,
  IconEye,
  IconToTop
} from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';
import ControlTowerSaasLayout from "./ControlTowerSaasLayout";
import './InquiryManagement.css';

const Title = Typography.Title;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const Row = Grid.Row;
const Col = Grid.Col;

// 映射状态颜色到CSS类名
const StatusColorClasses: Record<string, string> = {
  '正常': 'bg-green-500',
  '过期': 'bg-gray-500',
  '下架': 'bg-red-500'
};

// 定义数据接口
interface DataItem {
  key: string;
  code: string; // 尾程运价编号
  origin: string; // 目的港
  addressType: '第三方地址' | '亚马逊仓库' | '易仓'; // 配送地址类型
  zipCode: string; // 邮编
  address: string; // 地址
  warehouseCode: string | null; // 仓库代码
  agentName: string; // 代理名称
  validDateRange: string; // 有效期区间
  remark: string; // 备注
  creator: string; // 创建人
  createTime: string; // 创建时间
  updater: string; // 更新人
  updateTime: string; // 更新时间
  status: '正常' | '过期' | '下架'; // 状态
  '20gp': number; // 20GP价格
  '40gp': number; // 40GP价格
  '40hc': number; // 40HC价格
  '45hc': number; // 45HC价格
  '40nor': number; // 40NOR价格
}

const LastMileRates: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [customTableModalVisible, setCustomTableModalVisible] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({
    code: true,
    origin: true,
    addressType: true,
    zipCode: true,
    address: true,
    warehouseCode: true,
    agentName: true,
    validDateRange: true,
    remark: true,
    creator: true,
    createTime: true,
    updater: true,
    updateTime: true,
    status: true,
    '20gp': true,
    '40gp': true,
    '40hc': true,
    '45hc': true,
    '40nor': true
  });
  const navigate = useNavigate();

  // 打开自定义表格弹窗
  const openCustomTableModal = () => {
    setCustomTableModalVisible(true);
  };

  // 关闭自定义表格弹窗
  const closeCustomTableModal = () => {
    setCustomTableModalVisible(false);
  };

  // 处理列可见性变化
  const handleColumnVisibilityChange = (column: string, visible: boolean) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: visible
    }));
  };

  // 重置列可见性
  const resetColumnVisibility = () => {
    setColumnVisibility({
      code: true,
      origin: true,
      addressType: true,
      zipCode: true,
      address: true,
      warehouseCode: true,
      agentName: true,
      validDateRange: true,
      remark: true,
      creator: true,
      createTime: true,
      updater: true,
      updateTime: true,
      status: true,
      '20gp': true,
      '40gp': true,
      '40hc': true,
      '45hc': true,
      '40nor': true
    });
  };

  const onSelectChange = (selectedRowKeys: (string | number)[]) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  // 获取运价状态标签
  const getRateStatusTag = (status: string) => {
    // 使用 StatusColorClasses 对象来获取颜色类名
    const colorClass = StatusColorClasses[status] || 'bg-blue-500';
    
    return (
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full ${colorClass} mr-2`}></div>
        <span>{status}</span>
      </div>
    );
  };

  // 渲染更多操作下拉菜单
  const renderMoreActions = () => {
    return (
      <Menu>
        <Menu.Item key="copy">
          <IconCopy className="mr-2" />复制
        </Menu.Item>
        <Menu.Item key="takeDown">
          <IconDelete className="mr-2" />下架
        </Menu.Item>
      </Menu>
    );
  };

  // 生成表格列配置
  const columns = [
    {
      title: '尾程运价编号',
      dataIndex: 'code',
      width: 120,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>
    },
    {
      title: '目的港',
      dataIndex: 'origin',
      width: 150,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>
    },
    {
      title: '配送地址类型',
      dataIndex: 'addressType',
      width: 120,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>
    },
    {
      title: '邮编',
      dataIndex: 'zipCode',
      width: 100,
      sorter: true,
      resizable: true,
      render: (value: string, record: DataItem) => {
        if (record.addressType === '亚马逊仓库' || record.addressType === '易仓') {
          return '-';
        }
        return <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>;
      }
    },
    {
      title: '地址',
      dataIndex: 'address',
      width: 180,
      sorter: true,
      resizable: true,
      render: (value: string, record: DataItem) => {
        if (record.addressType === '亚马逊仓库' || record.addressType === '易仓') {
          return '-';
        }
        return <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>;
      }
    },
    {
      title: '仓库代码',
      dataIndex: 'warehouseCode',
      width: 120,
      sorter: true,
      resizable: true,
      render: (value: string | null) => value ? <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip> : '-'
    },
    {
      title: '代理名称',
      dataIndex: 'agentName',
      width: 150,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>
    },
    {
      title: '20GP',
      dataIndex: '20gp',
      width: 100,
      sorter: true,
      resizable: true,
      render: (value: number) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>
    },
    {
      title: '40GP',
      dataIndex: '40gp',
      width: 100,
      sorter: true,
      resizable: true,
      render: (value: number) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>
    },
    {
      title: '40HC',
      dataIndex: '40hc',
      width: 100,
      sorter: true,
      resizable: true,
      render: (value: number) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>
    },
    {
      title: '40NOR',
      dataIndex: '40nor',
      width: 100,
      sorter: true,
      resizable: true,
      render: (value: number) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>
    },
    {
      title: '45HC',
      dataIndex: '45hc',
      width: 100,
      sorter: true,
      resizable: true,
      render: (value: number) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>
    },
    {
      title: '有效期',
      dataIndex: 'validDateRange',
      width: 180,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 150,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      width: 100,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 150,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>
    },
    {
      title: '更新人',
      dataIndex: 'updater',
      width: 100,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 150,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini>{getRateStatusTag(value)}</Tooltip>
    },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right' as const,
      width: 180,
      render: (_: any, _record: DataItem) => (
        <div style={{display:'flex', flexWrap:'wrap', gap:4}}>
          <div style={{display:'flex', gap:4, width:'100%'}}>
            <Button type="text" size="mini" icon={<IconEye />}>查看</Button>
            <Button type="text" size="mini" icon={<IconEdit />}>编辑</Button>
          </div>
          <div style={{display:'flex', gap:4, width:'100%'}}>
            <Button type="text" size="mini" icon={<IconToTop />}>上架</Button>
            <Dropdown droplist={renderMoreActions()} position="br">
              <Button type="text" size="mini" icon={<IconMore />}>更多</Button>
            </Dropdown>
          </div>
        </div>
      ),
    }
  ];

  // 模拟数据
  const data: DataItem[] = [
    {
      key: '1',
      code: 'LMR2024050001',
      origin: 'USLAX | LOS ANGELES',
      addressType: '第三方地址',
      zipCode: '92101',
      address: 'San Diego, CA',
      warehouseCode: null,
      agentName: 'XPO TRUCK LLC',
      validDateRange: '2024-05-01 至 2024-12-31',
      remark: '',
      creator: '张三',
      createTime: '2024-05-01 10:30:45',
      updater: '张三',
      updateTime: '2024-05-01 10:30:45',
      status: '正常',
      '20gp': 1200,
      '40gp': 1800,
      '40hc': 1900,
      '45hc': 2200,
      '40nor': 2000
    },
    {
      key: '2',
      code: 'LMR2024050002',
      origin: 'USNYC | NEW YORK',
      addressType: '亚马逊仓库',
      zipCode: '',
      address: '',
      warehouseCode: 'ONT8',
      agentName: 'DRAYEASY INC',
      validDateRange: '2024-05-15 至 2024-11-30',
      remark: '',
      creator: '李四',
      createTime: '2024-05-02 14:20:33',
      updater: '王五',
      updateTime: '2024-05-03 09:15:10',
      status: '正常',
      '20gp': 980,
      '40gp': 1650,
      '40hc': 1750,
      '45hc': 2050,
      '40nor': 1800
    },
    {
      key: '3',
      code: 'LMR2024050003',
      origin: 'DEHAM | HAMBURG',
      addressType: '易仓',
      zipCode: '',
      address: '',
      warehouseCode: 'LAX203',
      agentName: 'AMERICAN FREIGHT SOLUTIONS',
      validDateRange: '2024-04-01 至 2024-12-15',
      remark: '需提前24小时预约',
      creator: '赵六',
      createTime: '2024-04-28 16:45:22',
      updater: '赵六',
      updateTime: '2024-04-28 16:45:22',
      status: '正常',
      '20gp': 1300,
      '40gp': 1950,
      '40hc': 2050,
      '45hc': 2400,
      '40nor': 2100
    },
    {
      key: '4',
      code: 'LMR2024040001',
      origin: 'NLRTM | ROTTERDAM',
      addressType: '第三方地址',
      zipCode: '96001',
      address: 'Redding, CA',
      warehouseCode: null,
      agentName: 'WEST COAST CARRIERS LLC',
      validDateRange: '2024-03-01 至 2024-05-31',
      remark: '',
      creator: '孙七',
      createTime: '2024-03-20 11:30:05',
      updater: '李四',
      updateTime: '2024-04-10 15:22:18',
      status: '过期',
      '20gp': 1100,
      '40gp': 1700,
      '40hc': 1800,
      '45hc': 2150,
      '40nor': 1950
    },
    {
      key: '5',
      code: 'LMR2024050004',
      origin: 'SGSIN | SINGAPORE',
      addressType: '亚马逊仓库',
      zipCode: '',
      address: '',
      warehouseCode: 'BFI4',
      agentName: 'EAGLE EXPRESS LOGISTICS',
      validDateRange: '2024-05-01 至 2024-10-31',
      remark: '周一、周四发车',
      creator: '王五',
      createTime: '2024-04-29 09:10:56',
      updater: '王五',
      updateTime: '2024-04-29 09:10:56',
      status: '正常',
      '20gp': 1050,
      '40gp': 1550,
      '40hc': 1650,
      '45hc': 1900,
      '40nor': 1700
    },
    {
      key: '6',
      code: 'LMR2024030001',
      origin: 'USLAX | LOS ANGELES',
      addressType: '易仓',
      zipCode: '',
      address: '',
      warehouseCode: 'ATL205',
      agentName: 'INTERMODAL TRANSPORT CO',
      validDateRange: '2024-03-15 至 2024-04-30',
      remark: '已停运',
      creator: '张三',
      createTime: '2024-03-10 13:50:42',
      updater: '张三',
      updateTime: '2024-04-25 10:05:38',
      status: '下架',
      '20gp': 1150,
      '40gp': 1750,
      '40hc': 1850,
      '45hc': 2200,
      '40nor': 2000
    }
  ];

  // 筛选项列表
  const filterItems = [
    { 
      label: '配送地址类型', 
      placeholder: '请选择配送地址类型', 
      options: ['第三方地址', '亚马逊仓库', '易仓'] 
    },
    { 
      label: '目的港', 
      placeholder: '请选择目的港',
      options: ['USLAX | LOS ANGELES', 'USNYC | NEW YORK', 'DEHAM | HAMBURG', 'NLRTM | ROTTERDAM', 'SGSIN | SINGAPORE']
    },
    { 
      label: '邮编', 
      placeholder: '请输入邮编' 
    },
    { 
      label: '地址', 
      placeholder: '请输入地址' 
    },
    { 
      label: '仓库代码', 
      placeholder: '请输入仓库代码'
    },
    { 
      label: '有效期', 
      type: 'dateRange' 
    },
    { 
      label: '状态', 
      placeholder: '请选择状态',
      options: ['正常', '过期', '下架']
    }
  ];

  // 列配置项
  const columnConfigList = [
    { label: '尾程运价编号', key: 'code' },
    { label: '目的港', key: 'origin' },
    { label: '配送地址类型', key: 'addressType' },
    { label: '邮编', key: 'zipCode' },
    { label: '地址', key: 'address' },
    { label: '仓库代码', key: 'warehouseCode' },
    { label: '代理名称', key: 'agentName' },
    { label: '20GP', key: '20gp' },
    { label: '40GP', key: '40gp' },
    { label: '40HC', key: '40hc' },
    { label: '40NOR', key: '40nor' },
    { label: '45HC', key: '45hc' },
    { label: '有效期', key: 'validDateRange' },
    { label: '备注', key: 'remark' },
    { label: '创建人', key: 'creator' },
    { label: '创建时间', key: 'createTime' },
    { label: '更新人', key: 'updater' },
    { label: '更新时间', key: 'updateTime' },
    { label: '状态', key: 'status' }
  ];

  // 新增尾程运价
  const handleCreateLastMileRate = () => {
    navigate('/controltower/saas/create-lastmile-rate');
  };

  return (
    <ControlTowerSaasLayout 
      menuSelectedKey="23" 
      breadcrumb={
        <Breadcrumb>
          <Breadcrumb.Item>门点服务管理</Breadcrumb.Item>
          <Breadcrumb.Item>尾程运价</Breadcrumb.Item>
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
              {item.type === 'dateRange' ? (
                <RangePicker style={{ width: '100%' }} />
              ) : (
                <Select placeholder={item.placeholder} allowClear style={{ width: '100%' }}>
                  {item.options?.map(option => (
                    <Option key={option} value={option}>{option}</Option>
                  ))}
                </Select>
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
        <div className="flex justify-between mb-4">
          <Space>
            <Button type="primary" icon={<IconPlus />} onClick={handleCreateLastMileRate}>新增尾程运价</Button>
            <Button icon={<IconUpload />}>批量导入</Button>
            <Button icon={<IconDownload />}>导出</Button>
          </Space>
          <div 
            className="flex items-center text-blue-500 cursor-pointer hover:text-blue-700"
            onClick={openCustomTableModal}
          >
            <IconList className="mr-1" />
            <span>自定义表格</span>
          </div>
        </div>
        <Table 
          rowKey="key"
          columns={columns.filter(col => {
            const dataIndex = col.dataIndex as string;
            return dataIndex === 'operation' || (columnVisibility[dataIndex as keyof typeof columnVisibility] !== false);
          })}
          data={data}
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
          }}
          pagination={{
            showTotal: true,
            total: data.length,
            showJumper: true,
            sizeCanChange: true,
            pageSize: 10,
          }}
          scroll={{ x: 1800 }}
          border={false}
          className="mt-4 inquiry-table-nowrap"
        />
      </Card>

      {/* 自定义表格弹窗 */}
      <Modal
        title="表头设置"
        visible={customTableModalVisible}
        onCancel={closeCustomTableModal}
        footer={[
          <Button key="reset" onClick={resetColumnVisibility} style={{ float: 'left' }}>重置</Button>,
          <Button key="cancel" onClick={closeCustomTableModal}>取消</Button>,
          <Button key="apply" type="primary" onClick={closeCustomTableModal}>确认</Button>,
        ]}
        style={{ width: 800 }}
      >
        <div className="p-4">
          <Row gutter={[16, 16]}>
            {columnConfigList.map((column) => (
              <Col span={8} key={column.key}>
                <div className="custom-column-item border border-gray-200 rounded p-4 mt-3">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <IconDragDotVertical className="text-gray-400 mr-2" />
                      <span>{column.label}</span>
                    </div>
                    <Switch 
                      checked={columnVisibility[column.key as keyof typeof columnVisibility]} 
                      onChange={checked => handleColumnVisibilityChange(column.key, checked)}
                    />
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Modal>
    </ControlTowerSaasLayout>
  );
};

export default LastMileRates; 