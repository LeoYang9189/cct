import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Checkbox,
  Modal,
  Input,
  Select,
  Message,
  Popconfirm,
  Typography
} from '@arco-design/web-react';
import {
  IconPlus,
  IconSearch,
  IconRefresh
} from '@arco-design/web-react/icon';

const { Option } = Select;
const { Title } = Typography;

// 船舶代理数据接口
interface ShipAgent {
  id: string;
  agentName: string;
  ediCode: string;
  agentPort: string;
  shortNameEn: string;
  status: 'enabled' | 'disabled';
}

// 港口选项
const portOptions = [
  { value: '青岛', label: '青岛' },
  { value: '上海', label: '上海' },
  { value: '宁波', label: '宁波' },
  { value: '深圳', label: '深圳' },
  { value: '广州', label: '广州' },
  { value: '天津', label: '天津' },
  { value: '大连', label: '大连' },
  { value: '厦门', label: '厦门' },
  { value: '连云港', label: '连云港' },
  { value: '烟台', label: '烟台' }
];

// 搜索筛选参数
interface SearchParams {
  keyword: string;
  agentPort: string;
  status: string;
}

// 船舶代理数据库
const SHIP_AGENT_DATABASE: ShipAgent[] = [
  // 青岛港代理
  { id: 'agent_1', agentName: '青岛中远海代', ediCode: '', agentPort: '青岛', shortNameEn: 'QDCOSCON', status: 'enabled' },
  { id: 'agent_2', agentName: '青岛中联运通', ediCode: '', agentPort: '青岛', shortNameEn: 'QDUNITRANS', status: 'enabled' },
  { id: 'agent_3', agentName: '青岛中和海德', ediCode: '', agentPort: '青岛', shortNameEn: 'QDZHSD', status: 'enabled' },
  { id: 'agent_4', agentName: '青岛振华货代', ediCode: '', agentPort: '青岛', shortNameEn: 'QDCIMC', status: 'enabled' },
  { id: 'agent_5', agentName: '中创物流', ediCode: '', agentPort: '青岛', shortNameEn: 'QDCML', status: 'enabled' },
  { id: 'agent_6', agentName: '中外运敦代', ediCode: '', agentPort: '青岛', shortNameEn: 'QDSINOAGENT', status: 'enabled' },
  { id: 'agent_7', agentName: '青港货运', ediCode: '', agentPort: '青岛', shortNameEn: 'QDPORT', status: 'enabled' },
  { id: 'agent_8', agentName: '青岛东方海外', ediCode: '', agentPort: '青岛', shortNameEn: 'QDOOCL', status: 'enabled' },
  { id: 'agent_9', agentName: '青岛联合', ediCode: '', agentPort: '青岛', shortNameEn: 'QDUNISCO', status: 'enabled' },
  { id: 'agent_10', agentName: '青岛华港', ediCode: '', agentPort: '青岛', shortNameEn: 'QDCHINAPORT', status: 'enabled' },
  { id: 'agent_11', agentName: '青岛海丰', ediCode: '', agentPort: '青岛', shortNameEn: 'QDSITC', status: 'enabled' },
  { id: 'agent_12', agentName: '青岛外代', ediCode: '', agentPort: '青岛', shortNameEn: 'QDPENOVICO', status: 'enabled' },
  
  // 上海港代理
  { id: 'agent_13', agentName: '上海中远海', ediCode: '', agentPort: '上海', shortNameEn: 'SHCOSCON', status: 'enabled' },
  { id: 'agent_14', agentName: '上海联东', ediCode: '717883154', agentPort: '上海', shortNameEn: 'SHLINDO', status: 'enabled' },
  { id: 'agent_15', agentName: '上海东方海外', ediCode: 'OOCL', agentPort: '上海', shortNameEn: 'SHOOCL', status: 'enabled' },
  { id: 'agent_16', agentName: '上海锦江', ediCode: '', agentPort: '上海', shortNameEn: 'SHJI', status: 'enabled' },
  { id: 'agent_17', agentName: '上海振华', ediCode: '', agentPort: '上海', shortNameEn: 'SHCIMC', status: 'enabled' },
  { id: 'agent_18', agentName: '上海中联', ediCode: 'MA1G5D/T4', agentPort: '上海', shortNameEn: 'SHUNITRANS', status: 'enabled' },
  { id: 'agent_19', agentName: '上海鹏海', ediCode: '717859429', agentPort: '上海', shortNameEn: 'SHPH', status: 'enabled' },
  { id: 'agent_20', agentName: '上海嘉华', ediCode: '71785140-0', agentPort: '上海', shortNameEn: 'SHWALLEM', status: 'enabled' },
  { id: 'agent_21', agentName: '上海民生', ediCode: '132230158', agentPort: '上海', shortNameEn: 'SHMS', status: 'enabled' },
  { id: 'agent_22', agentName: '上海外代', ediCode: 'PENAVICO', agentPort: '上海', shortNameEn: 'SHPENAVICO', status: 'enabled' },
  { id: 'agent_23', agentName: '上海中外运', ediCode: 'SINOTRANS', agentPort: '上海', shortNameEn: 'SHSINOTRANS', status: 'enabled' },
  
  // 宁波港代理
  { id: 'agent_24', agentName: '宁波中远海代', ediCode: '', agentPort: '宁波', shortNameEn: 'NBCOSCON', status: 'enabled' },
  { id: 'agent_25', agentName: '宁波外代', ediCode: '', agentPort: '宁波', shortNameEn: 'NBPENAVICO', status: 'enabled' },
  { id: 'agent_26', agentName: '宁波东方海外', ediCode: '', agentPort: '宁波', shortNameEn: 'NBOOCL', status: 'enabled' },
  { id: 'agent_27', agentName: '宁波中联', ediCode: '', agentPort: '宁波', shortNameEn: 'NBUNITRANS', status: 'enabled' },
  { id: 'agent_28', agentName: '宁波港信通', ediCode: '', agentPort: '宁波', shortNameEn: 'NBPORTNET', status: 'enabled' },
  
  // 深圳港代理
  { id: 'agent_29', agentName: '深圳中远海代', ediCode: '', agentPort: '深圳', shortNameEn: 'SZCOSCON', status: 'enabled' },
  { id: 'agent_30', agentName: '深圳外代', ediCode: '', agentPort: '深圳', shortNameEn: 'SZPENAVICO', status: 'enabled' },
  { id: 'agent_31', agentName: '深圳东方海外', ediCode: '', agentPort: '深圳', shortNameEn: 'SZOOCL', status: 'enabled' },
  { id: 'agent_32', agentName: '深圳安通捷', ediCode: '', agentPort: '深圳', shortNameEn: 'SZATJ', status: 'enabled' },
  { id: 'agent_33', agentName: '深圳海丰', ediCode: '', agentPort: '深圳', shortNameEn: 'SZSITC', status: 'enabled' },
  
  // 广州港代理
  { id: 'agent_34', agentName: '广州中远海代', ediCode: '', agentPort: '广州', shortNameEn: 'GZCOSCON', status: 'enabled' },
  { id: 'agent_35', agentName: '广州外代', ediCode: '', agentPort: '广州', shortNameEn: 'GZPENAVICO', status: 'enabled' },
  { id: 'agent_36', agentName: '广州东方海外', ediCode: '', agentPort: '广州', shortNameEn: 'GZOOCL', status: 'enabled' },
  { id: 'agent_37', agentName: '广州港代', ediCode: '', agentPort: '广州', shortNameEn: 'GZPORT', status: 'enabled' },
  
  // 天津港代理
  { id: 'agent_38', agentName: '天津中远海代', ediCode: '', agentPort: '天津', shortNameEn: 'TJCOSCON', status: 'enabled' },
  { id: 'agent_39', agentName: '天津外代', ediCode: '', agentPort: '天津', shortNameEn: 'TJPENAVICO', status: 'enabled' },
  { id: 'agent_40', agentName: '天津东方海外', ediCode: '', agentPort: '天津', shortNameEn: 'TJOOCL', status: 'enabled' },
  { id: 'agent_41', agentName: '天津港代', ediCode: '', agentPort: '天津', shortNameEn: 'TJPORT', status: 'enabled' },
  
  // 大连港代理
  { id: 'agent_42', agentName: '大连中远海代', ediCode: '', agentPort: '大连', shortNameEn: 'DLCOSCON', status: 'enabled' },
  { id: 'agent_43', agentName: '大连外代', ediCode: '', agentPort: '大连', shortNameEn: 'DLPENAVICO', status: 'enabled' },
  { id: 'agent_44', agentName: '大连港代', ediCode: '', agentPort: '大连', shortNameEn: 'DLPORT', status: 'enabled' },
  
  // 厦门港代理
  { id: 'agent_45', agentName: '厦门中远海代', ediCode: '', agentPort: '厦门', shortNameEn: 'XMCOSCON', status: 'enabled' },
  { id: 'agent_46', agentName: '厦门外代', ediCode: '', agentPort: '厦门', shortNameEn: 'XMPENAVICO', status: 'enabled' },
  { id: 'agent_47', agentName: '厦门海天', ediCode: '', agentPort: '厦门', shortNameEn: 'XMHT', status: 'enabled' }
];

// 添加全局样式，强制表头不换行
const tableHeaderStyle = `
  .arco-table-th {
    white-space: nowrap !important;
  }
`;

const ShipAgentManagement: React.FC = () => {
  const [shipAgents, setShipAgents] = useState<ShipAgent[]>([]);
  const [filteredData, setFilteredData] = useState<ShipAgent[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [selectableAgents, setSelectableAgents] = useState<ShipAgent[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    agentPort: '',
    status: ''
  });
  const [selectSearchParams, setSelectSearchParams] = useState<SearchParams>({
    keyword: '',
    agentPort: '',
    status: ''
  });

  // 初始化示例数据
  useEffect(() => {
    const mockData: ShipAgent[] = [
      {
        id: '1',
        agentName: '青岛中远海代',
        ediCode: '',
        agentPort: '青岛',
        shortNameEn: 'QDCOSCON',
        status: 'enabled'
      },
      {
        id: '2',
        agentName: '青岛中联运通',
        ediCode: '',
        agentPort: '青岛',
        shortNameEn: 'QDUNITRANS',
        status: 'enabled'
      },
      {
        id: '3',
        agentName: '青岛中和海德',
        ediCode: '',
        agentPort: '青岛',
        shortNameEn: 'QDZHSD',
        status: 'enabled'
      },
      {
        id: '4',
        agentName: '青岛振华货代',
        ediCode: '',
        agentPort: '青岛',
        shortNameEn: 'QDCIMC',
        status: 'enabled'
      },
      {
        id: '5',
        agentName: '中创物流',
        ediCode: '',
        agentPort: '青岛',
        shortNameEn: 'QDCML',
        status: 'enabled'
      },
      {
        id: '6',
        agentName: '中外运敦代',
        ediCode: '',
        agentPort: '青岛',
        shortNameEn: 'QDSINOAGENT',
        status: 'enabled'
      },
      {
        id: '7',
        agentName: '青港货运',
        ediCode: '',
        agentPort: '青岛',
        shortNameEn: 'QDPORT',
        status: 'enabled'
      },
      {
        id: '8',
        agentName: '青岛东方海外',
        ediCode: '',
        agentPort: '青岛',
        shortNameEn: 'QDOOCL',
        status: 'enabled'
      },
      {
        id: '9',
        agentName: '青岛联合',
        ediCode: '',
        agentPort: '青岛',
        shortNameEn: 'QDUNISCO',
        status: 'enabled'
      },
      {
        id: '10',
        agentName: '青岛华港',
        ediCode: '',
        agentPort: '青岛',
        shortNameEn: 'QDCHINAPORT',
        status: 'enabled'
      },
      {
        id: '11',
        agentName: '青岛海丰',
        ediCode: '',
        agentPort: '青岛',
        shortNameEn: 'QDSITC',
        status: 'enabled'
      },
      {
        id: '12',
        agentName: '青岛外代',
        ediCode: '',
        agentPort: '青岛',
        shortNameEn: 'QDPENOVICO',
        status: 'enabled'
      },
      {
        id: '13',
        agentName: '上海中远海',
        ediCode: '',
        agentPort: '上海',
        shortNameEn: 'SHCOSCON',
        status: 'enabled'
      },
      {
        id: '14',
        agentName: '上海联东',
        ediCode: '717883154',
        agentPort: '上海',
        shortNameEn: 'SHLINDO',
        status: 'enabled'
      },
      {
        id: '15',
        agentName: '上海东方海外',
        ediCode: 'OOCL',
        agentPort: '上海',
        shortNameEn: 'SHOOCL',
        status: 'enabled'
      },
      {
        id: '16',
        agentName: '上海锦江',
        ediCode: '',
        agentPort: '上海',
        shortNameEn: 'SHJI',
        status: 'enabled'
      },
      {
        id: '17',
        agentName: '上海振华',
        ediCode: '',
        agentPort: '上海',
        shortNameEn: 'SHCIMC',
        status: 'enabled'
      },
      {
        id: '18',
        agentName: '上海中联',
        ediCode: 'MA1G5D/T4',
        agentPort: '上海',
        shortNameEn: 'SHUNITRANS',
        status: 'enabled'
      },
      {
        id: '19',
        agentName: '上海鹏海',
        ediCode: '717859429',
        agentPort: '上海',
        shortNameEn: 'SHPH',
        status: 'enabled'
      },
      {
        id: '20',
        agentName: '上海嘉华',
        ediCode: '71785140-0',
        agentPort: '上海',
        shortNameEn: 'SHWALLEM',
        status: 'enabled'
      },
      {
        id: '21',
        agentName: '上海民生',
        ediCode: '132230158',
        agentPort: '上海',
        shortNameEn: 'SHMS',
        status: 'enabled'
      }
    ];

    setShipAgents(mockData);
    filterData(mockData);
  }, []);

  // 筛选数据
  const filterData = (data = shipAgents) => {
    let filtered = [...data];
    
    // 应用搜索条件
    if (searchParams.keyword) {
      filtered = filtered.filter(item => 
        item.agentName.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        item.ediCode.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        item.shortNameEn.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        item.agentPort.toLowerCase().includes(searchParams.keyword.toLowerCase())
      );
    }
    
    if (searchParams.agentPort) {
      filtered = filtered.filter(item => item.agentPort === searchParams.agentPort);
    }

    if (searchParams.status) {
      filtered = filtered.filter(item => item.status === searchParams.status);
    }

    setFilteredData(filtered);
  };

  // 搜索筛选功能
  const handleSearch = () => {
    filterData();
  };

  // 重置搜索
  const handleReset = () => {
    const newSearchParams = {
      keyword: '',
      agentPort: '',
      status: ''
    };
    setSearchParams(newSearchParams);
    
    // 重置后重新筛选数据
    setFilteredData(shipAgents);
  };

  // 处理新增（改为选择模式）
  const handleAdd = () => {
    // 获取已存在的代理名称列表
    const existingAgentNames = shipAgents.map(item => item.agentName);
    
    // 过滤出未添加的船舶代理
    const available = SHIP_AGENT_DATABASE.filter(agent => 
      !existingAgentNames.includes(agent.agentName)
    );
    
    setSelectableAgents(available);
    setSelectedAgents([]);
    setSelectSearchParams({ keyword: '', agentPort: '', status: '' });
    setSelectModalVisible(true);
  };

  // 处理选择船舶代理
  const handleSelectAgents = () => {
    if (selectedAgents.length === 0) {
      Message.warning('请选择至少一个船舶代理');
      return;
    }

    const newAgents = SHIP_AGENT_DATABASE
      .filter(agent => selectedAgents.includes(agent.id))
      .map(agent => ({
        ...agent,
        id: Date.now().toString() + '_' + agent.id,
        status: 'enabled' as const
      }));

    setShipAgents(prev => [...prev, ...newAgents]);
    filterData([...shipAgents, ...newAgents]);
    
    setSelectModalVisible(false);
    Message.success(`已添加 ${newAgents.length} 个船舶代理`);
  };

  // 筛选可选择的船舶代理
  const filterSelectableAgents = () => {
    let filtered = [...selectableAgents];
    
    if (selectSearchParams.keyword) {
      filtered = filtered.filter(item => 
        item.agentName.toLowerCase().includes(selectSearchParams.keyword.toLowerCase()) ||
        item.ediCode.toLowerCase().includes(selectSearchParams.keyword.toLowerCase()) ||
        item.shortNameEn.toLowerCase().includes(selectSearchParams.keyword.toLowerCase()) ||
        item.agentPort.toLowerCase().includes(selectSearchParams.keyword.toLowerCase())
      );
    }

    if (selectSearchParams.agentPort) {
      filtered = filtered.filter(item => item.agentPort === selectSearchParams.agentPort);
    }

    return filtered;
  };

  // 处理状态切换
  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    setShipAgents(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
    filterData();
    Message.success(`船舶代理已${newStatus === 'enabled' ? '启用' : '禁用'}`);
  };

  // 批量启用
  const handleBatchEnable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要启用的船舶代理');
      return;
    }
    
    setShipAgents(prev => prev.map(item => 
      selectedRowKeys.includes(item.id) ? { ...item, status: 'enabled' } : item
    ));
    
    setSelectedRowKeys([]);
    filterData();
    Message.success(`已启用 ${selectedRowKeys.length} 个船舶代理`);
  };

  // 批量禁用
  const handleBatchDisable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要禁用的船舶代理');
      return;
    }
    
    setShipAgents(prev => prev.map(item => 
      selectedRowKeys.includes(item.id) ? { ...item, status: 'disabled' } : item
    ));
    
    setSelectedRowKeys([]);
    filterData();
    Message.success(`已禁用 ${selectedRowKeys.length} 个船舶代理`);
  };

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
      render: (_: unknown, record: ShipAgent) => (
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
      title: '船舶代理名称',
      dataIndex: 'agentName',
      width: 200,
      sorter: (a: ShipAgent, b: ShipAgent) => a.agentName.localeCompare(b.agentName, 'zh-CN'),
      headerStyle: { whiteSpace: 'nowrap' }
    },
    {
      title: 'EDI代码',
      dataIndex: 'ediCode',
      width: 150,
      sorter: (a: ShipAgent, b: ShipAgent) => a.ediCode.localeCompare(b.ediCode),
      headerStyle: { whiteSpace: 'nowrap' }
    },
    {
      title: '船舶代理港口',
      dataIndex: 'agentPort',
      width: 150,
      sorter: (a: ShipAgent, b: ShipAgent) => a.agentPort.localeCompare(b.agentPort, 'zh-CN'),
      headerStyle: { whiteSpace: 'nowrap' }
    },
    {
      title: '简称(英文)',
      dataIndex: 'shortNameEn',
      width: 200,
      sorter: (a: ShipAgent, b: ShipAgent) => a.shortNameEn.localeCompare(b.shortNameEn),
      headerStyle: { whiteSpace: 'nowrap' }
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      sorter: (a: ShipAgent, b: ShipAgent) => a.status.localeCompare(b.status),
      headerStyle: { whiteSpace: 'nowrap' },
      render: (_: unknown, record: ShipAgent) => (
        <Tag color={record.status === 'enabled' ? 'green' : 'red'}>
          {record.status === 'enabled' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 120,
      fixed: 'right' as const,
      headerStyle: { whiteSpace: 'nowrap' },
      render: (_: unknown, record: ShipAgent) => (
        <Space>
          <Popconfirm
            title={`确定要${record.status === 'enabled' ? '禁用' : '启用'}此船舶代理吗？`}
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

  // 选择弹窗的表格列配置
  const selectColumns = [
    {
      title: (
        <Checkbox
          indeterminate={selectedAgents.length > 0 && selectedAgents.length < filterSelectableAgents().length}
          checked={selectedAgents.length === filterSelectableAgents().length && filterSelectableAgents().length > 0}
          onChange={(checked) => {
            if (checked) {
              setSelectedAgents(filterSelectableAgents().map(item => item.id));
            } else {
              setSelectedAgents([]);
            }
          }}
        />
      ),
      dataIndex: 'checkbox',
      width: 60,
      render: (_: unknown, record: ShipAgent) => (
        <Checkbox
          checked={selectedAgents.includes(record.id)}
          onChange={(checked) => {
            if (checked) {
              setSelectedAgents([...selectedAgents, record.id]);
            } else {
              setSelectedAgents(selectedAgents.filter(id => id !== record.id));
            }
          }}
        />
      ),
    },
    {
      title: '船舶代理名称',
      dataIndex: 'agentName',
      width: 200,
      sorter: (a: ShipAgent, b: ShipAgent) => a.agentName.localeCompare(b.agentName, 'zh-CN'),
      headerStyle: { whiteSpace: 'nowrap' }
    },
    {
      title: 'EDI代码',
      dataIndex: 'ediCode',
      width: 150,
      sorter: (a: ShipAgent, b: ShipAgent) => a.ediCode.localeCompare(b.ediCode),
      headerStyle: { whiteSpace: 'nowrap' }
    },
    {
      title: '港口',
      dataIndex: 'agentPort',
      width: 100,
      sorter: (a: ShipAgent, b: ShipAgent) => a.agentPort.localeCompare(b.agentPort, 'zh-CN'),
      headerStyle: { whiteSpace: 'nowrap' }
    },
    {
      title: '简称(英文)',
      dataIndex: 'shortNameEn',
      width: 150,
      sorter: (a: ShipAgent, b: ShipAgent) => a.shortNameEn.localeCompare(b.shortNameEn),
      headerStyle: { whiteSpace: 'nowrap' }
    }
  ];

  return (
    <>
      <style>{tableHeaderStyle}</style>
      <Card>
        <div style={{ marginBottom: '20px' }}>
          <Title heading={4} style={{ margin: 0 }}>船舶代理</Title>
        </div>

        {/* 搜索筛选区域 */}
        <Card style={{ marginBottom: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
            <div>
              <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
              <Input
                placeholder="代理名称、EDI代码、港口、简称"
                value={searchParams.keyword}
                onChange={(value) => setSearchParams(prev => ({ ...prev, keyword: value }))}
              />
            </div>
            <div>
              <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>港口</div>
              <Select
                placeholder="选择港口"
                value={searchParams.agentPort}
                onChange={(value) => setSearchParams(prev => ({ ...prev, agentPort: value }))}
                allowClear
              >
                {portOptions.map(option => (
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
                新增船舶代理
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
        </div>

        <Table
          columns={columns}
          data={filteredData}
          rowKey="id"
          scroll={{ x: 980 }}
          pagination={{
            pageSize: 10,
            showTotal: true,
            showJumper: true,
            sizeCanChange: true,
          }}
        />

        {/* 选择船舶代理弹窗 */}
        <Modal
          title="选择船舶代理"
          visible={selectModalVisible}
          onOk={handleSelectAgents}
          onCancel={() => setSelectModalVisible(false)}
          style={{ width: 800 }}
          okText="确定"
          cancelText="取消"
        >
          {/* 搜索筛选区域 */}
          <Card style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
                <Input
                  placeholder="代理名称、EDI代码、港口、简称"
                  value={selectSearchParams.keyword}
                  onChange={(value) => setSelectSearchParams(prev => ({ ...prev, keyword: value }))}
                />
              </div>
              <div style={{ width: '150px' }}>
                <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>港口</div>
                <Select
                  placeholder="选择港口"
                  value={selectSearchParams.agentPort}
                  onChange={(value) => setSelectSearchParams(prev => ({ ...prev, agentPort: value }))}
                  allowClear
                >
                  {portOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </div>
            </div>
          </Card>

          <Table
            columns={selectColumns}
            data={filterSelectableAgents()}
            rowKey="id"
            scroll={{ x: 760 }}
            pagination={{
              pageSize: 10,
              showTotal: true,
            }}
            style={{ marginTop: '16px' }}
          />
        </Modal>
      </Card>
    </>
  );
};

export default ShipAgentManagement; 