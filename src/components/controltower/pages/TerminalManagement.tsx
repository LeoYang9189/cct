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
  Typography
} from '@arco-design/web-react';
import {
  IconPlus,
  IconEdit,
  IconSearch,
  IconRefresh,
  IconLink
} from '@arco-design/web-react/icon';

const { Option } = Select;
const { Title } = Typography;
const { TextArea } = Input;

// 码头数据接口
interface Terminal {
  id: string;
  terminalCode: string;
  terminalNameCn: string;
  terminalNameEn: string;
  port: string;
  terminalLinks: string;
  status: 'enabled' | 'disabled';
}

// 港口选项
const portOptions = [
  { value: 'Koper', label: 'Koper (科佩尔)' },
  { value: 'Constanza', label: 'Constanza (康斯坦察)' },
  { value: 'Shanghai', label: 'Shanghai (上海)' },
  { value: 'Shenzhen', label: 'Shenzhen (深圳)' },
  { value: 'Ningbo', label: 'Ningbo (宁波)' },
  { value: 'Guangzhou', label: 'Guangzhou (广州)' },
  { value: 'Qingdao', label: 'Qingdao (青岛)' },
  { value: 'Tianjin', label: 'Tianjin (天津)' },
  { value: 'Xiamen', label: 'Xiamen (厦门)' },
  { value: 'Dalian', label: 'Dalian (大连)' }
];

// 搜索筛选参数
interface SearchParams {
  keyword: string;
  port: string;
  status: string;
}

const TerminalManagement: React.FC = () => {
  const [terminalData, setTerminalData] = useState<Terminal[]>([]);
  const [filteredData, setFilteredData] = useState<Terminal[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentTerminal, setCurrentTerminal] = useState<Terminal | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    port: '',
    status: ''
  });
  const [editForm] = Form.useForm();

  // 新增选择模式相关状态
  const [addTerminalModalVisible, setAddTerminalModalVisible] = useState(false);
  const [selectedTerminalIds, setSelectedTerminalIds] = useState<string[]>([]);
  const [addSearchParams, setAddSearchParams] = useState<{ keyword: string; port: string }>({
    keyword: '',
    port: ''
  });
  const [filteredTerminalLibrary, setFilteredTerminalLibrary] = useState<Terminal[]>([]);

  // 码头库数据 - 可选择的码头
  const terminalLibraryData: Terminal[] = [
    {
      id: 'lib-1',
      terminalCode: 'LUKA',
      terminalNameCn: '科佩尔港码头',
      terminalNameEn: 'Luka Koper Terminal',
      port: 'Koper',
      terminalLinks: 'NULL',
      status: 'enabled'
    },
    {
      id: 'lib-2',
      terminalCode: 'TIS',
      terminalNameCn: '无日内瓦TIS集装箱码头',
      terminalNameEn: 'TIS Container Terminal',
      port: 'Constanza',
      terminalLinks: 'http://www.port-yuzhny.com.ua/; http://www.tis.ua/main_en.html',
      status: 'enabled'
    },
    {
      id: 'lib-3',
      terminalCode: 'DPWORLD',
      terminalNameCn: '康斯坦察迪拜港码头(DP World)',
      terminalNameEn: '(DPA) Constanta South Terminal',
      port: 'Constanza',
      terminalLinks: 'http://www.dpworld.com/',
      status: 'enabled'
    },
    {
      id: 'lib-4',
      terminalCode: 'SIPG',
      terminalNameCn: '上海国际港务集团',
      terminalNameEn: 'Shanghai International Port Group',
      port: 'Shanghai',
      terminalLinks: 'http://www.portshanghai.com.cn/',
      status: 'enabled'
    },
    {
      id: 'lib-5',
      terminalCode: 'YICT',
      terminalNameCn: '盐田国际集装箱码头',
      terminalNameEn: 'Yantian International Container Terminals',
      port: 'Shenzhen',
      terminalLinks: 'http://www.yict.com.cn/',
      status: 'enabled'
    },
    {
      id: 'lib-6',
      terminalCode: 'SCT',
      terminalNameCn: '蛇口集装箱码头',
      terminalNameEn: 'Shekou Container Terminals',
      port: 'Shenzhen',
      terminalLinks: 'http://www.sct.com.cn/',
      status: 'enabled'
    },
    {
      id: 'lib-7',
      terminalCode: 'NCT',
      terminalNameCn: '宁波集装箱码头',
      terminalNameEn: 'Ningbo Container Terminal',
      port: 'Ningbo',
      terminalLinks: 'http://www.nbport.com.cn/',
      status: 'enabled'
    },
    {
      id: 'lib-8',
      terminalCode: 'GCT',
      terminalNameCn: '广州集装箱码头',
      terminalNameEn: 'Guangzhou Container Terminal',
      port: 'Guangzhou',
      terminalLinks: 'http://www.gzport.com/',
      status: 'enabled'
    },
    {
      id: 'lib-9',
      terminalCode: 'QCT',
      terminalNameCn: '青岛集装箱码头',
      terminalNameEn: 'Qingdao Container Terminal',
      port: 'Qingdao',
      terminalLinks: 'http://www.qdport.com/',
      status: 'enabled'
    },
    {
      id: 'lib-10',
      terminalCode: 'TCT',
      terminalNameCn: '天津集装箱码头',
      terminalNameEn: 'Tianjin Container Terminal',
      port: 'Tianjin',
      terminalLinks: 'http://www.ptacn.com/',
      status: 'enabled'
    }
  ];

  // 初始化示例数据
  useEffect(() => {
    const mockData: Terminal[] = [
      {
        id: '1',
        terminalCode: 'LUKA',
        terminalNameCn: '科佩尔港码头',
        terminalNameEn: 'Luka Koper Terminal',
        port: 'Koper',
        terminalLinks: 'NULL',
        status: 'enabled'
      },
      {
        id: '2',
        terminalCode: 'TIS',
        terminalNameCn: '无日内瓦TIS集装箱码头',
        terminalNameEn: 'TIS Container Terminal',
        port: 'Constanza',
        terminalLinks: 'http://www.port-yuzhny.com.ua/; http://www.tis.ua/main_en.html',
        status: 'enabled'
      },
      {
        id: '3',
        terminalCode: 'DPWORLD',
        terminalNameCn: '康斯坦察迪拜港码头(DP World)',
        terminalNameEn: '(DPA) Constanta South Terminal',
        port: 'Constanza',
        terminalLinks: 'https://www.dpworldconstanta.com/',
        status: 'enabled'
      },
      {
        id: '4',
        terminalCode: 'SIPG',
        terminalNameCn: '上海国际港务集团',
        terminalNameEn: 'Shanghai International Port Group',
        port: 'Shanghai',
        terminalLinks: 'https://www.portshanghai.com.cn/',
        status: 'enabled'
      },
      {
        id: '5',
        terminalCode: 'YICT',
        terminalNameCn: '盐田国际集装箱码头',
        terminalNameEn: 'Yantian International Container Terminals',
        port: 'Shenzhen',
        terminalLinks: 'https://www.yict.com.cn/',
        status: 'enabled'
      },
      {
        id: '6',
        terminalCode: 'NBCT',
        terminalNameCn: '宁波集装箱码头',
        terminalNameEn: 'Ningbo Container Terminal',
        port: 'Ningbo',
        terminalLinks: 'https://www.nbport.com.cn/',
        status: 'disabled'
      },
      {
        id: '7',
        terminalCode: 'GZPT',
        terminalNameCn: '广州港集团',
        terminalNameEn: 'Guangzhou Port Group',
        port: 'Guangzhou',
        terminalLinks: 'https://www.gzport.com/',
        status: 'enabled'
      },
      {
        id: '8',
        terminalCode: 'QQCT',
        terminalNameCn: '青岛前湾集装箱码头',
        terminalNameEn: 'Qingdao Qianwan Container Terminal',
        port: 'Qingdao',
        terminalLinks: 'https://www.qqct.com.cn/',
        status: 'enabled'
      }
    ];

    setTerminalData(mockData);
    filterData(mockData);
  }, []);

  // 筛选数据
  const filterData = (data = terminalData) => {
    let filtered = [...data];
    
    // 应用搜索条件
    if (searchParams.keyword) {
      filtered = filtered.filter(item => 
        item.terminalCode.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        item.terminalNameCn.includes(searchParams.keyword) ||
        item.terminalNameEn.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        item.port.toLowerCase().includes(searchParams.keyword.toLowerCase())
      );
    }
    
    if (searchParams.port) {
      filtered = filtered.filter(item => item.port === searchParams.port);
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
      port: '',
      status: ''
    };
    setSearchParams(newSearchParams);
    
    // 重置后重新筛选数据
    setFilteredData(terminalData);
  };

  // 处理编辑
  const handleEdit = (record: Terminal) => {
    setCurrentTerminal(record);
    setIsEditing(true);
    editForm.setFieldsValue({
      terminalCode: record.terminalCode,
      terminalNameCn: record.terminalNameCn,
      terminalNameEn: record.terminalNameEn,
      port: record.port,
      terminalLinks: record.terminalLinks
    });
    setEditModalVisible(true);
  };

  // 处理新增 - 改为选择模式
  const handleAdd = () => {
    setSelectedTerminalIds([]);
    setAddSearchParams({ keyword: '', port: '' });
    // 过滤掉已经存在的码头
    const availableTerminals = terminalLibraryData.filter(terminal =>
      !terminalData.some(existingTerminal => existingTerminal.terminalCode === terminal.terminalCode)
    );
    setFilteredTerminalLibrary(availableTerminals);
    setAddTerminalModalVisible(true);
  };

  // 选择弹窗搜索功能
  const handleAddSearch = () => {
    let filtered = terminalLibraryData.filter(terminal =>
      !terminalData.some(existingTerminal => existingTerminal.terminalCode === terminal.terminalCode)
    );

    // 关键词搜索
    if (addSearchParams.keyword) {
      filtered = filtered.filter(terminal =>
        terminal.terminalCode.toLowerCase().includes(addSearchParams.keyword.toLowerCase()) ||
        terminal.terminalNameCn.includes(addSearchParams.keyword) ||
        terminal.terminalNameEn.toLowerCase().includes(addSearchParams.keyword.toLowerCase())
      );
    }

    // 港口筛选
    if (addSearchParams.port) {
      filtered = filtered.filter(terminal => terminal.port === addSearchParams.port);
    }

    setFilteredTerminalLibrary(filtered);
  };

  // 重置选择弹窗搜索
  const handleAddReset = () => {
    setAddSearchParams({ keyword: '', port: '' });
    const availableTerminals = terminalLibraryData.filter(terminal =>
      !terminalData.some(existingTerminal => existingTerminal.terminalCode === terminal.terminalCode)
    );
    setFilteredTerminalLibrary(availableTerminals);
  };

  // 确认添加选中的码头
  const handleConfirmAddTerminals = () => {
    const selectedTerminals = filteredTerminalLibrary.filter(terminal =>
      selectedTerminalIds.includes(terminal.id)
    );

    if (selectedTerminals.length === 0) {
      Message.warning('请选择要添加的码头');
      return;
    }

    // 添加到码头数据中
    const newTerminals = selectedTerminals.map(terminal => ({
      ...terminal,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }));

    setTerminalData(prev => [...prev, ...newTerminals]);
    setAddTerminalModalVisible(false);
    setSelectedTerminalIds([]);
    filterData();
    Message.success(`已添加 ${selectedTerminals.length} 个码头`);
  };

  // 处理状态切换
  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    setTerminalData(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
    filterData();
    Message.success(`码头已${newStatus === 'enabled' ? '启用' : '禁用'}`);
  };

  // 批量启用
  const handleBatchEnable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要启用的码头');
      return;
    }
    
    setTerminalData(prev => prev.map(item => 
      selectedRowKeys.includes(item.id) ? { ...item, status: 'enabled' } : item
    ));
    
    setSelectedRowKeys([]);
    filterData();
    Message.success(`已启用 ${selectedRowKeys.length} 个码头`);
  };

  // 批量禁用
  const handleBatchDisable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要禁用的码头');
      return;
    }
    
    setTerminalData(prev => prev.map(item => 
      selectedRowKeys.includes(item.id) ? { ...item, status: 'disabled' } : item
    ));
    
    setSelectedRowKeys([]);
    filterData();
    Message.success(`已禁用 ${selectedRowKeys.length} 个码头`);
  };

  // 保存码头编辑
  const handleSaveTerminal = async () => {
    try {
      const values = await editForm.validate();
      
      const terminalItem = {
        ...values,
        id: isEditing ? currentTerminal?.id : Date.now().toString(),
        status: isEditing ? currentTerminal?.status : 'enabled' as const
      };

      if (isEditing) {
        // 更新现有码头
        setTerminalData(prev => prev.map(item => 
          item.id === currentTerminal?.id ? { ...item, ...terminalItem } : item
        ));
        Message.success('码头信息已更新');
      } else {
        // 新增码头
        const newTerminal = { ...terminalItem, id: Date.now().toString() } as Terminal;
        setTerminalData(prev => [...prev, newTerminal]);
        Message.success('码头已添加');
      }

      setEditModalVisible(false);
      editForm.resetFields();
      filterData();
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  // 渲染链接
  const renderLinks = (links: string) => {
    if (!links || links === 'NULL') {
      return <span style={{ color: '#999' }}>-</span>;
    }
    
    const linkArray = links.split(';').map(link => link.trim()).filter(link => link);
    
    return (
      <div style={{ maxWidth: '300px' }}>
        {linkArray.map((link, index) => (
          <div key={index} style={{ marginBottom: '4px' }}>
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                fontSize: '12px',
                wordBreak: 'break-all',
                color: '#1890ff'
              }}
            >
              <IconLink style={{ marginRight: '4px' }} />
              {link}
            </a>
          </div>
        ))}
      </div>
    );
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
      render: (_: unknown, record: Terminal) => (
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
      title: '码头代码',
      dataIndex: 'terminalCode',
      width: 120,
      render: (text: string) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{text}</span>
      )
    },
    {
      title: '码头名称（中文）',
      dataIndex: 'terminalNameCn',
      width: 200,
    },
    {
      title: '码头名称（英文）',
      dataIndex: 'terminalNameEn',
      width: 250,
      render: (text: string) => (
        <span style={{ fontStyle: 'italic' }}>{text}</span>
      )
    },
    {
      title: '港口',
      dataIndex: 'port',
      width: 120,
      render: (text: string) => (
        <Tag color="blue">{text}</Tag>
      )
    },
    {
      title: '码头链接',
      dataIndex: 'terminalLinks',
      width: 300,
      render: (_: unknown, record: Terminal) => renderLinks(record.terminalLinks)
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (_: unknown, record: Terminal) => (
        <Tag color={record.status === 'enabled' ? 'green' : 'red'}>
          {record.status === 'enabled' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 180,
      fixed: 'right' as const,
      render: (_: unknown, record: Terminal) => (
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
            title={`确定要${record.status === 'enabled' ? '禁用' : '启用'}此码头吗？`}
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

  return (
    <Card>
      <div style={{ marginBottom: '20px' }}>
        <Title heading={4} style={{ margin: 0 }}>码头管理</Title>
      </div>

      {/* 搜索筛选区域 */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
            <Input
              placeholder="码头代码、中文名、英文名、港口"
              value={searchParams.keyword}
              onChange={(value) => setSearchParams(prev => ({ ...prev, keyword: value }))}
            />
          </div>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>港口</div>
            <Select
              placeholder="选择港口"
              value={searchParams.port}
              onChange={(value) => setSearchParams(prev => ({ ...prev, port: value }))}
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
              新增码头
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
        scroll={{ x: 1400 }}
        pagination={{
          pageSize: 10,
          showTotal: true,
          showJumper: true,
          sizeCanChange: true,
        }}
      />

      {/* 新增/编辑码头弹窗 */}
      <Modal
        title={isEditing ? '编辑码头' : '新增码头'}
        visible={editModalVisible}
        onOk={handleSaveTerminal}
        onCancel={() => setEditModalVisible(false)}
        style={{ width: 700 }}
      >
        <Form form={editForm} layout="vertical">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              field="terminalCode"
              label="码头代码"
              rules={[{ required: true, message: '请输入码头代码' }]}
            >
              <Input placeholder="例如：LUKA" />
            </Form.Item>
            
            <Form.Item
              field="port"
              label="港口"
              rules={[{ required: true, message: '请选择港口' }]}
            >
              <Select placeholder="请选择港口">
                {portOptions.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          
          <Form.Item
            field="terminalNameCn"
            label="码头名称（中文）"
            rules={[{ required: true, message: '请输入中文码头名称' }]}
          >
            <Input placeholder="例如：科佩尔港码头" />
          </Form.Item>
          
          <Form.Item
            field="terminalNameEn"
            label="码头名称（英文）"
            rules={[{ required: true, message: '请输入英文码头名称' }]}
          >
            <Input placeholder="例如：Luka Koper Terminal" />
          </Form.Item>
          
          <Form.Item
            field="terminalLinks"
            label="码头链接"
          >
            <TextArea 
              placeholder="多个链接请用分号(;)分隔，例如：https://www.example1.com/; https://www.example2.com/"
              rows={3}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 选择码头弹窗 */}
      <Modal
        title="选择码头"
        visible={addTerminalModalVisible}
        onOk={handleConfirmAddTerminals}
        onCancel={() => setAddTerminalModalVisible(false)}
        style={{ width: 1200 }}
        okText={`确认添加 (${selectedTerminalIds.length})`}
        cancelText="取消"
      >
        {/* 搜索筛选区域 */}
        <Card style={{ marginBottom: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
            <div>
              <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
              <Input
                placeholder="码头代码、中文名、英文名"
                value={addSearchParams.keyword}
                onChange={(value) => setAddSearchParams(prev => ({ ...prev, keyword: value }))}
              />
            </div>
            <div>
              <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>港口</div>
              <Select
                placeholder="请选择港口"
                value={addSearchParams.port}
                onChange={(value) => setAddSearchParams(prev => ({ ...prev, port: value }))}
                allowClear
              >
                {portOptions.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button type="primary" icon={<IconSearch />} onClick={handleAddSearch}>
                搜索
              </Button>
              <Button icon={<IconRefresh />} onClick={handleAddReset}>
                重置
              </Button>
            </div>
          </div>
        </Card>

        {/* 码头选择表格 */}
        <Table
          columns={[
            {
              title: '码头代码',
              dataIndex: 'terminalCode',
              width: 120,
              render: (text: string) => (
                <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{text}</span>
              )
            },
            {
              title: '中文名称',
              dataIndex: 'terminalNameCn',
              width: 200
            },
            {
              title: '英文名称',
              dataIndex: 'terminalNameEn',
              width: 250,
              render: (text: string) => (
                <span style={{ fontStyle: 'italic' }}>{text}</span>
              )
            },
            {
              title: '港口',
              dataIndex: 'port',
              width: 120,
              render: (port: string) => {
                const option = portOptions.find(opt => opt.value === port);
                return option ? <Tag color="blue">{option.label}</Tag> : port;
              }
            },
            {
              title: '码头链接',
              dataIndex: 'terminalLinks',
              width: 300,
              render: renderLinks
            }
          ]}
          data={filteredTerminalLibrary}
          rowKey="id"
          scroll={{ x: 1000, y: 400 }}
          pagination={{
            pageSize: 10,
            showTotal: true,
            showJumper: true,
          }}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedTerminalIds,
            onChange: (selectedRowKeys) => {
              setSelectedTerminalIds(selectedRowKeys as string[]);
            },
            checkAll: true,
          }}
        />
      </Modal>
    </Card>
  );
};

export default TerminalManagement;