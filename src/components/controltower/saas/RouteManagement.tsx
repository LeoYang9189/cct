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
  // Menu
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
  IconEye
} from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';
import ControlTowerSaasLayout from "./ControlTowerSaasLayout";
import './InquiryManagement.css';

const Title = Typography.Title;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const Row = Grid.Row;
const Col = Grid.Col;

// 定义数据接口
interface DataItem {
  key: string;
  routeCode: string; // 航线代码
  nameZh: string; // 中文名
  nameEn: string; // 英文名
  creator: string; // 创建人
  createTime: string; // 创建时间
  updater: string; // 更新人
  updateTime: string; // 更新时间
}

// 筛选项接口定义
interface FilterItem {
  label: string;
  placeholder?: string;
  type?: string;
  options?: string[];
}

const RouteManagement: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [customTableModalVisible, setCustomTableModalVisible] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({
    routeCode: true,
    nameZh: true,
    nameEn: true,
    creator: true,
    createTime: true,
    updater: true,
    updateTime: true
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
      routeCode: true,
      nameZh: true,
      nameEn: true,
      creator: true,
      createTime: true,
      updater: true,
      updateTime: true
    });
  };

  const onSelectChange = (selectedRowKeys: (string | number)[]) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  // 处理删除按钮点击
  const handleDelete = (record: DataItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除航线 "${record.nameZh}" 吗？此操作不可撤销。`,
      okButtonProps: {
        status: 'danger'
      },
      onOk: () => {
        console.log('删除航线:', record);
        // 这里添加删除逻辑
      }
    });
  };

  // 生成表格列配置
  const columns = [
    {
      title: '航线代码',
      dataIndex: 'routeCode',
      width: 120,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>
    },
    {
      title: '中文名',
      dataIndex: 'nameZh',
      width: 150,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>
    },
    {
      title: '英文名',
      dataIndex: 'nameEn',
      width: 180,
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
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right' as const,
      width: 180,
      render: (_: any, record: DataItem) => (
        <Space>
          <Button type="text" size="mini" icon={<IconEye />}>查看</Button>
          <Button type="text" size="mini" icon={<IconEdit />}>编辑</Button>
          <Button type="text" size="mini" status="danger" icon={<IconDelete />} onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      ),
    }
  ];

  // 模拟数据
  const data: DataItem[] = [
    {
      key: '1',
      routeCode: 'TPEB',
      nameZh: '跨太平洋东行',
      nameEn: 'Trans-Pacific Eastbound',
      creator: '张三',
      createTime: '2024-05-01 10:30:45',
      updater: '张三',
      updateTime: '2024-05-01 10:30:45'
    },
    {
      key: '2',
      routeCode: 'TPWB',
      nameZh: '跨太平洋西行',
      nameEn: 'Trans-Pacific Westbound',
      creator: '李四',
      createTime: '2024-05-02 14:20:33',
      updater: '王五',
      updateTime: '2024-05-03 09:15:10'
    },
    {
      key: '3',
      routeCode: 'FEWB',
      nameZh: '远东西行',
      nameEn: 'Far East Westbound',
      creator: '赵六',
      createTime: '2024-04-28 16:45:22',
      updater: '赵六',
      updateTime: '2024-04-28 16:45:22'
    },
    {
      key: '4',
      routeCode: 'FEEB',
      nameZh: '远东东行',
      nameEn: 'Far East Eastbound',
      creator: '孙七',
      createTime: '2024-03-20 11:30:05',
      updater: '李四',
      updateTime: '2024-04-10 15:22:18'
    },
    {
      key: '5',
      routeCode: 'EUMED',
      nameZh: '欧地线',
      nameEn: 'Europe Mediterranean',
      creator: '王五',
      createTime: '2024-04-29 09:10:56',
      updater: '王五',
      updateTime: '2024-04-29 09:10:56'
    },
    {
      key: '6',
      routeCode: 'USEC',
      nameZh: '美东线',
      nameEn: 'US East Coast',
      creator: '张三',
      createTime: '2024-03-10 13:50:42',
      updater: '张三',
      updateTime: '2024-04-25 10:05:38'
    }
  ];

  // 筛选项列表
  const filterItems: FilterItem[] = [
    { 
      label: '航线代码', 
      placeholder: '请输入航线代码'
    },
    { 
      label: '中文名', 
      placeholder: '请输入中文名'
    },
    { 
      label: '英文名', 
      placeholder: '请输入英文名'
    },
    { 
      label: '创建时间', 
      type: 'dateRange' 
    }
  ];

  // 列配置项
  const columnConfigList = [
    { label: '航线代码', key: 'routeCode' },
    { label: '中文名', key: 'nameZh' },
    { label: '英文名', key: 'nameEn' },
    { label: '创建人', key: 'creator' },
    { label: '创建时间', key: 'createTime' },
    { label: '更新人', key: 'updater' },
    { label: '更新时间', key: 'updateTime' }
  ];

  // 新增航线
  const handleCreateRoute = () => {
    navigate('/controltower/saas/create-route');
  };

  return (
    <ControlTowerSaasLayout 
      menuSelectedKey="18" 
      breadcrumb={
        <Breadcrumb>
          <Breadcrumb.Item>基础数据</Breadcrumb.Item>
          <Breadcrumb.Item>航线管理</Breadcrumb.Item>
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
            <Button type="primary" icon={<IconPlus />} onClick={handleCreateRoute}>新增航线</Button>
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
          scroll={{ x: 1200 }}
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

export default RouteManagement; 