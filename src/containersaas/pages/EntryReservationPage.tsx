import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Message,
  Dropdown,
  Typography,
  Popconfirm,
  Tooltip
} from '@arco-design/web-react';
import {
  IconPlus,
  IconSearch,
  IconRefresh,
  IconEye,
  IconCheck,
  IconMore,
  IconClose,
  IconCalendar
} from '@arco-design/web-react/icon';

const { Option } = Select;
const { Title } = Typography;
const { RangePicker } = DatePicker;

// 进场预约数据接口
interface EntryReservation {
  id: string;
  reservationNo: string;
  customerName: string;
  contactPerson: string;
  contactPhone: string;
  entryPurpose: string;
  preloadCargo: string;
  containerNumbers: string[];
  reservationTime: string;
  createTime: string;
  status: 'pending' | 'approved' | 'rejected';
}

// 搜索筛选参数
interface SearchParams {
  keyword: string;
  entryPurpose: string;
  status: string;
  dateRange: string[];
}

// 进场目的选项
const entryPurposeOptions = [
  { value: 'pickup', label: '提箱' },
  { value: 'return', label: '还箱' },
  { value: 'return_empty', label: '还空' },
  { value: 'inspection', label: '验箱' },
  { value: 'repair', label: '修箱' },
  { value: 'cleaning', label: '洗箱' },
  { value: 'storage', label: '存储' },
  { value: 'other', label: '其他' }
];

// 状态选项
const statusOptions = [
  { value: 'pending', label: '待审核' },
  { value: 'approved', label: '已通过' },
  { value: 'rejected', label: '已拒绝' }
];

const EntryReservationPage: React.FC = () => {
  const [data, setData] = useState<EntryReservation[]>([]);
  const [filteredData, setFilteredData] = useState<EntryReservation[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<EntryReservation | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    entryPurpose: '',
    status: '',
    dateRange: []
  });
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');
  const [form] = Form.useForm();

  // 初始化示例数据
  useEffect(() => {
    const mockData: EntryReservation[] = [
      {
        id: '1',
        reservationNo: 'ER202312010001',
        customerName: '上海物流有限公司',
        contactPerson: '张三',
        contactPhone: '13800138001',
        entryPurpose: 'return_empty',
        preloadCargo: 'Sodium Hydroxide',
        containerNumbers: ['CSLU3456789', 'TEMU9876543', 'GESU1234567'],
        reservationTime: '2023-12-05 09:00:00',
        createTime: '2023-12-01 14:30:00',
        status: 'pending'
      },
      {
        id: '2',
        reservationNo: 'ER202312010002',
        customerName: '深圳贸易集团',
        contactPerson: '李四',
        contactPhone: '13800138002',
        entryPurpose: 'return_empty',
        preloadCargo: 'Sulfuric Acid',
        containerNumbers: ['MSKU7654321'],
        reservationTime: '2023-12-05 10:30:00',
        createTime: '2023-12-01 15:45:00',
        status: 'approved'
      },
      {
        id: '3',
        reservationNo: 'ER202312010003',
        customerName: '广州运输公司',
        contactPerson: '王五',
        contactPhone: '13800138003',
        entryPurpose: 'return_empty',
        preloadCargo: 'Hydrochloric Acid',
        containerNumbers: ['HLBU2468135', 'TCLU9753186'],
        reservationTime: '2023-12-05 14:00:00',
        createTime: '2023-12-01 16:20:00',
        status: 'rejected'
      },
      {
        id: '4',
        reservationNo: 'ER202312010004',
        customerName: '北京国际货运',
        contactPerson: '赵六',
        contactPhone: '13800138004',
        entryPurpose: 'return_empty',
        preloadCargo: 'Methanol',
        containerNumbers: ['OOLU8642097', 'CMAU5731864', 'FCIU3698521', 'MSCU1472583', 'GESU9517426'],
        reservationTime: '2023-12-06 08:30:00',
        createTime: '2023-12-01 17:10:00',
        status: 'pending'
      },
      {
        id: '5',
        reservationNo: 'ER202312010005',
        customerName: '天津港务集团',
        contactPerson: '孙七',
        contactPhone: '13800138005',
        entryPurpose: 'return_empty',
        preloadCargo: 'Ethylene Glycol',
        containerNumbers: ['YMLU4826139'],
        reservationTime: '2023-12-06 11:00:00',
        createTime: '2023-12-01 18:30:00',
        status: 'approved'
      }
    ];
    setData(mockData);
    setFilteredData(mockData);
  }, []);

  // 搜索处理
  const handleSearch = () => {
    let filtered = [...data];

    if (searchParams.keyword) {
      filtered = filtered.filter(item =>
        item.reservationNo.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        item.contactPerson.toLowerCase().includes(searchParams.keyword.toLowerCase())
      );
    }

    if (searchParams.entryPurpose) {
      filtered = filtered.filter(item => item.entryPurpose === searchParams.entryPurpose);
    }

    if (searchParams.status) {
      filtered = filtered.filter(item => item.status === searchParams.status);
    }

    if (searchParams.dateRange && searchParams.dateRange.length === 2) {
      const [startDate, endDate] = searchParams.dateRange;
      filtered = filtered.filter(item => {
        const createTime = new Date(item.createTime);
        return createTime >= new Date(startDate) && createTime <= new Date(endDate);
      });
    }

    // 应用状态筛选
    if (activeStatusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === activeStatusFilter);
    }

    setFilteredData(filtered);
  };

  // 重置搜索
  const handleReset = () => {
    setSearchParams({
      keyword: '',
      entryPurpose: '',
      status: '',
      dateRange: []
    });
    setActiveStatusFilter('all');
    setFilteredData(data);
  };

  // 状态筛选处理
  const handleStatusFilter = (status: string) => {
    setActiveStatusFilter(status);
    // 立即应用筛选
    let filtered = [...data];

    if (searchParams.keyword) {
      filtered = filtered.filter(item =>
        item.reservationNo.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        item.contactPerson.toLowerCase().includes(searchParams.keyword.toLowerCase())
      );
    }

    if (searchParams.entryPurpose) {
      filtered = filtered.filter(item => item.entryPurpose === searchParams.entryPurpose);
    }

    if (searchParams.status) {
      filtered = filtered.filter(item => item.status === searchParams.status);
    }

    if (searchParams.dateRange && searchParams.dateRange.length === 2) {
      const [startDate, endDate] = searchParams.dateRange;
      filtered = filtered.filter(item => {
        const createTime = new Date(item.createTime);
        return createTime >= new Date(startDate) && createTime <= new Date(endDate);
      });
    }

    // 应用状态筛选
    if (status !== 'all') {
      filtered = filtered.filter(item => item.status === status);
    }

    setFilteredData(filtered);
  };

  // 获取状态统计
  const getStatusStats = () => {
    const stats = {
      all: data.length,
      pending: data.filter(item => item.status === 'pending').length,
      approved: data.filter(item => item.status === 'approved').length,
      rejected: data.filter(item => item.status === 'rejected').length
    };
    return stats;
  };

  // 查看详情
  const handleViewDetail = (record: EntryReservation) => {
    setCurrentRecord(record);
    setDetailModalVisible(true);
  };

  // 监听数据变化，自动更新筛选结果
  useEffect(() => {
    let filtered = [...data];

    if (searchParams.keyword) {
      filtered = filtered.filter(item =>
        item.reservationNo.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        item.contactPerson.toLowerCase().includes(searchParams.keyword.toLowerCase())
      );
    }

    if (searchParams.entryPurpose) {
      filtered = filtered.filter(item => item.entryPurpose === searchParams.entryPurpose);
    }

    if (searchParams.status) {
      filtered = filtered.filter(item => item.status === searchParams.status);
    }

    if (searchParams.dateRange && searchParams.dateRange.length === 2) {
      const [startDate, endDate] = searchParams.dateRange;
      filtered = filtered.filter(item => {
        const createTime = new Date(item.createTime);
        return createTime >= new Date(startDate) && createTime <= new Date(endDate);
      });
    }

    // 应用状态筛选
    if (activeStatusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === activeStatusFilter);
    }

    setFilteredData(filtered);
  }, [data, searchParams, activeStatusFilter]);

  // 通过预约
  const handleApprove = (record: EntryReservation) => {
    const updatedData = data.map(item =>
      item.id === record.id ? { ...item, status: 'approved' as const } : item
    );
    setData(updatedData);
    Message.success('预约已通过');
  };

  // 拒绝预约
  const handleReject = (record: EntryReservation) => {
    const updatedData = data.map(item =>
      item.id === record.id ? { ...item, status: 'rejected' as const } : item
    );
    setData(updatedData);
    Message.success('预约已拒绝');
  };

  // 改预约时间
  const handleReschedule = (record: EntryReservation) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      reservationTime: record.reservationTime
    });
    setRescheduleModalVisible(true);
  };

  // 保存改期
  const handleSaveReschedule = async () => {
    try {
      const values = await form.validate();
      const updatedData = data.map(item =>
        item.id === currentRecord?.id 
          ? { ...item, reservationTime: values.reservationTime }
          : item
      );
      setData(updatedData);
      setRescheduleModalVisible(false);
      Message.success('预约时间已更新');
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const statusMap = {
      pending: { color: 'orange', text: '待审核' },
      approved: { color: 'green', text: '已通过' },
      rejected: { color: 'red', text: '已拒绝' }
    };
    const config = statusMap[status as keyof typeof statusMap];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 获取进场目的标签
  const getEntryPurposeText = (purpose: string) => {
    const purposeMap = {
      pickup: '提箱',
      return: '还箱',
      return_empty: '还空',
      inspection: '验箱',
      repair: '修箱',
      cleaning: '洗箱',
      storage: '存储',
      other: '其他'
    };
    return purposeMap[purpose as keyof typeof purposeMap] || purpose;
  };

  // 箱号显示组件
  const ContainerNumbersDisplay: React.FC<{ containerNumbers: string[] }> = ({ containerNumbers }) => {
    if (containerNumbers.length === 0) {
      return <span style={{ color: '#999' }}>-</span>;
    }

    if (containerNumbers.length === 1) {
      return (
        <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>
          {containerNumbers[0]}
        </span>
      );
    }

    const firstContainer = containerNumbers[0];
    const remainingCount = containerNumbers.length - 1;

    const tooltipContent = (
      <div style={{ maxWidth: '300px' }}>
        <div style={{ 
          marginBottom: '8px', 
          fontWeight: 'bold',
          color: '#1D2129',
          fontSize: '13px'
        }}>
          全部箱号 ({containerNumbers.length}个)：
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
          {containerNumbers.map((container, index) => (
            <div 
              key={index} 
              style={{ 
                fontFamily: 'monospace', 
                fontSize: '12px',
                padding: '4px 8px',
                backgroundColor: '#165DFF',
                color: 'white',
                borderRadius: '4px',
                textAlign: 'center',
                fontWeight: '500'
              }}
            >
              {container}
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <Tooltip 
        content={tooltipContent} 
        position="top"
        color="white"
        style={{
          backgroundColor: 'white',
          color: '#1D2129',
          border: '1px solid #E5E6EB',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
      >
        <span style={{ 
          fontFamily: 'monospace', 
          fontSize: '13px',
          cursor: 'pointer',
          borderBottom: '1px dashed #165DFF'
        }}>
          {firstContainer}
          <Tag 
            color="blue" 
            size="small" 
            style={{ 
              marginLeft: '6px', 
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            +{remainingCount}
          </Tag>
        </span>
      </Tooltip>
    );
  };

  // 更多操作菜单
  const getMoreDropdown = (record: EntryReservation) => (
    <Dropdown
      droplist={
        <div style={{ 
          padding: '4px 0',
          backgroundColor: 'white',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: '1px solid #e5e6eb',
          minWidth: '120px'
        }}>
          <div 
            style={{ 
              padding: '8px 12px', 
              cursor: 'pointer',
              borderRadius: '4px',
              margin: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f2f3f5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => handleReject(record)}
          >
            <IconClose style={{ marginRight: '8px', color: '#f53f3f' }} />
            拒绝
          </div>
          <div 
            style={{ 
              padding: '8px 12px', 
              cursor: 'pointer',
              borderRadius: '4px',
              margin: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f2f3f5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => handleReschedule(record)}
          >
            <IconCalendar style={{ marginRight: '8px', color: '#165DFF' }} />
            改预约时间
          </div>
        </div>
      }
      position="bottom"
      trigger="click"
    >
      <Button type="text" icon={<IconMore />} size="small">
        更多
      </Button>
    </Dropdown>
  );

  // 表格列定义
  const columns = [
    {
      title: '预约流水号',
      dataIndex: 'reservationNo',
      key: 'reservationNo',
      width: 160,
      render: (text: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>{text}</span>
      )
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 180
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      width: 100
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      width: 130,
      render: (text: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>{text}</span>
      )
    },
    {
      title: '进场目的',
      dataIndex: 'entryPurpose',
      key: 'entryPurpose',
      width: 100,
      render: (text: string) => (
        <Tag color="blue">{getEntryPurposeText(text)}</Tag>
      )
    },
    {
      title: '前装货',
      dataIndex: 'preloadCargo',
      key: 'preloadCargo',
      width: 120
    },
    {
      title: '箱号',
      dataIndex: 'containerNumbers',
      key: 'containerNumbers',
      width: 160,
      render: (containerNumbers: string[]) => (
        <ContainerNumbersDisplay containerNumbers={containerNumbers} />
      )
    },
    {
      title: '预约进场时间',
      dataIndex: 'reservationTime',
      key: 'reservationTime',
      width: 160,
      render: (text: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>{text}</span>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
      render: (text: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>{text}</span>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: EntryReservation) => (
        <Space size="small">
          <Button 
            type="text" 
            size="small" 
            icon={<IconEye />}
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          {record.status === 'pending' && (
            <Popconfirm
              title="确认通过此预约吗？"
              onOk={() => handleApprove(record)}
              okText="确认"
              cancelText="取消"
            >
              <Button 
                type="text" 
                size="small" 
                icon={<IconCheck />}
                style={{ color: '#00b42a' }}
              >
                通过
              </Button>
            </Popconfirm>
          )}
          {getMoreDropdown(record)}
        </Space>
      )
    }
  ];

  return (
    <Card>
      <div style={{ marginBottom: '20px' }}>
        <Title heading={4} style={{ margin: 0 }}>进场预约管理</Title>
      </div>

      {/* 搜索筛选区域 */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
            <Input
              placeholder="预约流水号、客户名称、联系人"
              value={searchParams.keyword}
              onChange={(value) => setSearchParams(prev => ({ ...prev, keyword: value }))}
            />
          </div>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>进场目的</div>
            <Select
              placeholder="选择进场目的"
              value={searchParams.entryPurpose}
              onChange={(value) => setSearchParams(prev => ({ ...prev, entryPurpose: value }))}
              allowClear
            >
              {entryPurposeOptions.map(option => (
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
              {statusOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </div>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>创建时间</div>
            <RangePicker
              value={searchParams.dateRange}
              onChange={(value) => setSearchParams(prev => ({ ...prev, dateRange: value || [] }))}
              style={{ width: '100%' }}
            />
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

      {/* 状态统计筛选卡片 */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {(() => {
            const stats = getStatusStats();
            const statusCards = [
              { 
                key: 'all', 
                title: '全部', 
                count: stats.all, 
                color: '#165DFF',
                bgColor: '#E8F3FF',
                borderColor: '#BEDFFF'
              },
              { 
                key: 'pending', 
                title: '待审核', 
                count: stats.pending, 
                color: '#FF7D00',
                bgColor: '#FFF7E8',
                borderColor: '#FFE4BA'
              },
              { 
                key: 'approved', 
                title: '已通过', 
                count: stats.approved, 
                color: '#00B42A',
                bgColor: '#E8F5E8',
                borderColor: '#AED5AE'
              },
              { 
                key: 'rejected', 
                title: '已拒绝', 
                count: stats.rejected, 
                color: '#F53F3F',
                bgColor: '#FFECE8',
                borderColor: '#FFCCC7'
              }
            ];

            return statusCards.map(card => (
              <Card
                key={card.key}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: activeStatusFilter === card.key ? card.bgColor : 'white',
                  border: `2px solid ${activeStatusFilter === card.key ? card.borderColor : '#E5E6EB'}`,
                  transform: activeStatusFilter === card.key ? 'translateY(-2px)' : 'none',
                  boxShadow: activeStatusFilter === card.key 
                    ? '0 4px 12px rgba(0, 0, 0, 0.1)' 
                    : '0 1px 3px rgba(0, 0, 0, 0.05)'
                }}
                onClick={() => handleStatusFilter(card.key)}
                onMouseEnter={(e) => {
                  if (activeStatusFilter !== card.key) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeStatusFilter !== card.key) {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                  }
                }}
              >
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <div style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: card.color,
                    marginBottom: '8px',
                    lineHeight: '1'
                  }}>
                    {card.count}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#666',
                    fontWeight: activeStatusFilter === card.key ? '600' : 'normal'
                  }}>
                    {card.title}
                  </div>
                </div>
              </Card>
            ));
          })()}
        </div>
      </div>

      {/* 操作按钮区域 */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button type="primary" icon={<IconPlus />}>
              新增预约
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
              <Button type="outline">
                批量通过 ({selectedRowKeys.length})
              </Button>
              <Button type="outline" status="warning">
                批量拒绝 ({selectedRowKeys.length})
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 数据表格 */}
      <Table
        columns={columns}
        data={filteredData}
        rowKey="id"
        scroll={{ x: 1560 }}
        pagination={{
          pageSize: 10,
          showTotal: true,
          showJumper: true,
          sizeCanChange: true,
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedRowKeys: (string | number)[]) => {
            setSelectedRowKeys(selectedRowKeys.map(key => String(key)));
          },
        }}
      />

      {/* 详情弹窗 */}
      <Modal
        title="预约详情"
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        style={{ width: '600px' }}
      >
        {currentRecord && (
          <div style={{ padding: '16px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ marginBottom: '8px', color: '#666', fontSize: '14px' }}>预约流水号</div>
                <div style={{ marginBottom: '16px', fontFamily: 'monospace' }}>{currentRecord.reservationNo}</div>
              </div>
              <div>
                <div style={{ marginBottom: '8px', color: '#666', fontSize: '14px' }}>状态</div>
                <div style={{ marginBottom: '16px' }}>{getStatusTag(currentRecord.status)}</div>
              </div>
              <div>
                <div style={{ marginBottom: '8px', color: '#666', fontSize: '14px' }}>客户名称</div>
                <div style={{ marginBottom: '16px' }}>{currentRecord.customerName}</div>
              </div>
              <div>
                <div style={{ marginBottom: '8px', color: '#666', fontSize: '14px' }}>联系人</div>
                <div style={{ marginBottom: '16px' }}>{currentRecord.contactPerson}</div>
              </div>
              <div>
                <div style={{ marginBottom: '8px', color: '#666', fontSize: '14px' }}>联系电话</div>
                <div style={{ marginBottom: '16px', fontFamily: 'monospace' }}>{currentRecord.contactPhone}</div>
              </div>
              <div>
                <div style={{ marginBottom: '8px', color: '#666', fontSize: '14px' }}>进场目的</div>
                <div style={{ marginBottom: '16px' }}>
                  <Tag color="blue">{getEntryPurposeText(currentRecord.entryPurpose)}</Tag>
                </div>
              </div>
              <div>
                <div style={{ marginBottom: '8px', color: '#666', fontSize: '14px' }}>前装货</div>
                <div style={{ marginBottom: '16px' }}>{currentRecord.preloadCargo}</div>
              </div>
              <div>
                <div style={{ marginBottom: '8px', color: '#666', fontSize: '14px' }}>预约进场时间</div>
                <div style={{ marginBottom: '16px', fontFamily: 'monospace' }}>{currentRecord.reservationTime}</div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ marginBottom: '8px', color: '#666', fontSize: '14px' }}>
                  箱号 ({currentRecord.containerNumbers.length}个)
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
                    gap: '8px',
                    maxHeight: '120px',
                    overflowY: 'auto',
                    padding: '8px',
                    backgroundColor: '#f7f8fa',
                    borderRadius: '6px',
                    border: '1px solid #e5e6eb'
                  }}>
                    {currentRecord.containerNumbers.map((container, index) => (
                      <div 
                        key={index}
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '13px',
                          padding: '6px 10px',
                          backgroundColor: 'white',
                          borderRadius: '4px',
                          border: '1px solid #e5e6eb',
                          textAlign: 'center',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                      >
                        {container}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ marginBottom: '8px', color: '#666', fontSize: '14px' }}>创建时间</div>
                <div style={{ fontFamily: 'monospace' }}>{currentRecord.createTime}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 改期弹窗 */}
      <Modal
        title="修改预约时间"
        visible={rescheduleModalVisible}
        onOk={handleSaveReschedule}
        onCancel={() => setRescheduleModalVisible(false)}
        okText="确认修改"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="新的预约时间"
            field="reservationTime"
            rules={[{ required: true, message: '请选择预约时间' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default EntryReservationPage; 