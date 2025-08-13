import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Input,
  Select,
  Message,
  Popconfirm,
  Typography,
  Checkbox
} from '@arco-design/web-react';
import {
  IconPlus,
  IconSearch,
  IconRefresh
} from '@arco-design/web-react/icon';

const { Option } = Select;
const { Title } = Typography;

// 计费单位数据接口
interface CalculationUnit {
  id: string;
  unitNameCn: string;
  unitNameEn: string;
  isContainerUnit: boolean;
  containerType?: string;
  status: 'enabled' | 'disabled';
}

// 搜索筛选参数
interface SearchParams {
  keyword: string;
  isContainerUnit: string;
  status: string;
}

// 计费单位数据库
const CALCULATION_UNIT_DATABASE: CalculationUnit[] = [
  // 重量单位
  { id: 'unit_1', unitNameCn: '千克', unitNameEn: 'Kilogram', isContainerUnit: false, status: 'enabled' },
  { id: 'unit_2', unitNameCn: '吨', unitNameEn: 'Ton', isContainerUnit: false, status: 'enabled' },
  { id: 'unit_3', unitNameCn: '磅', unitNameEn: 'Pound', isContainerUnit: false, status: 'enabled' },
  { id: 'unit_4', unitNameCn: '公吨', unitNameEn: 'Metric Ton', isContainerUnit: false, status: 'enabled' },
  
  // 体积单位
  { id: 'unit_5', unitNameCn: '立方米', unitNameEn: 'Cubic Meter', isContainerUnit: false, status: 'enabled' },
  { id: 'unit_6', unitNameCn: '立方英尺', unitNameEn: 'Cubic Feet', isContainerUnit: false, status: 'enabled' },
  { id: 'unit_7', unitNameCn: '升', unitNameEn: 'Liter', isContainerUnit: false, status: 'enabled' },
  { id: 'unit_8', unitNameCn: '加仑', unitNameEn: 'Gallon', isContainerUnit: false, status: 'enabled' },
  
  // 数量单位
  { id: 'unit_9', unitNameCn: '件', unitNameEn: 'Piece', isContainerUnit: false, status: 'enabled' },
  { id: 'unit_10', unitNameCn: '箱', unitNameEn: 'Carton', isContainerUnit: false, status: 'enabled' },
  { id: 'unit_11', unitNameCn: '托盘', unitNameEn: 'Pallet', isContainerUnit: false, status: 'enabled' },
  { id: 'unit_12', unitNameCn: '包', unitNameEn: 'Package', isContainerUnit: false, status: 'enabled' },
  { id: 'unit_13', unitNameCn: '袋', unitNameEn: 'Bag', isContainerUnit: false, status: 'enabled' },
  { id: 'unit_14', unitNameCn: '桶', unitNameEn: 'Drum', isContainerUnit: false, status: 'enabled' },
  { id: 'unit_15', unitNameCn: '捆', unitNameEn: 'Bundle', isContainerUnit: false, status: 'enabled' },
  
  // 特殊单位
  { id: 'unit_16', unitNameCn: '票', unitNameEn: 'Bill', isContainerUnit: false, status: 'enabled' },
  { id: 'unit_17', unitNameCn: '车', unitNameEn: 'Vehicle', isContainerUnit: false, status: 'enabled' },
  { id: 'unit_18', unitNameCn: '批', unitNameEn: 'Batch', isContainerUnit: false, status: 'enabled' },
  
  // 标准集装箱单位
  { id: 'unit_19', unitNameCn: '20英尺标准箱', unitNameEn: '20ft General Purpose', isContainerUnit: true, containerType: '20GP', status: 'enabled' },
  { id: 'unit_20', unitNameCn: '40英尺标准箱', unitNameEn: '40ft General Purpose', isContainerUnit: true, containerType: '40GP', status: 'enabled' },
  { id: 'unit_21', unitNameCn: '40英尺高箱', unitNameEn: '40ft High Cube', isContainerUnit: true, containerType: '40HC', status: 'enabled' },
  { id: 'unit_22', unitNameCn: '45英尺高箱', unitNameEn: '45ft High Cube', isContainerUnit: true, containerType: '45HC', status: 'enabled' },
  
  // 冷藏箱单位
  { id: 'unit_23', unitNameCn: '20英尺冷藏箱', unitNameEn: '20ft Reefer', isContainerUnit: true, containerType: '20RF', status: 'enabled' },
  { id: 'unit_24', unitNameCn: '40英尺冷藏箱', unitNameEn: '40ft Reefer', isContainerUnit: true, containerType: '40RF', status: 'enabled' },
  { id: 'unit_25', unitNameCn: '40英尺冷藏高箱', unitNameEn: '40ft Reefer High Cube', isContainerUnit: true, containerType: '40RH', status: 'enabled' },
  
  // 开顶箱单位
  { id: 'unit_26', unitNameCn: '20英尺开顶箱', unitNameEn: '20ft Open Top', isContainerUnit: true, containerType: '20OT', status: 'enabled' },
  { id: 'unit_27', unitNameCn: '40英尺开顶箱', unitNameEn: '40ft Open Top', isContainerUnit: true, containerType: '40OT', status: 'enabled' },
  
  // 平板箱单位
  { id: 'unit_28', unitNameCn: '20英尺平板箱', unitNameEn: '20ft Flat Rack', isContainerUnit: true, containerType: '20FR', status: 'enabled' },
  { id: 'unit_29', unitNameCn: '40英尺平板箱', unitNameEn: '40ft Flat Rack', isContainerUnit: true, containerType: '40FR', status: 'enabled' },
  
  // 特殊箱型单位
  { id: 'unit_30', unitNameCn: '20英尺罐式箱', unitNameEn: '20ft Tank', isContainerUnit: true, containerType: '20TK', status: 'enabled' },
  { id: 'unit_31', unitNameCn: '40英尺罐式箱', unitNameEn: '40ft Tank', isContainerUnit: true, containerType: '40TK', status: 'enabled' },
  { id: 'unit_32', unitNameCn: '20英尺通风箱', unitNameEn: '20ft Ventilated', isContainerUnit: true, containerType: '20VH', status: 'enabled' },
  { id: 'unit_33', unitNameCn: '40英尺通风箱', unitNameEn: '40ft Ventilated', isContainerUnit: true, containerType: '40VH', status: 'enabled' },
  
  // 组合单位
  { id: 'unit_34', unitNameCn: 'TEU（标准箱）', unitNameEn: 'TEU', isContainerUnit: false, status: 'enabled' },
  { id: 'unit_35', unitNameCn: 'FEU（40英尺标准箱）', unitNameEn: 'FEU', isContainerUnit: false, status: 'enabled' }
];

// 添加全局样式，强制表头不换行
const tableHeaderStyle = `
  .arco-table-th {
    white-space: nowrap !important;
  }
`;

const CalculationUnitManagement: React.FC = () => {
  const [data, setData] = useState<CalculationUnit[]>([]);
  const [filteredData, setFilteredData] = useState<CalculationUnit[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [selectableUnits, setSelectableUnits] = useState<CalculationUnit[]>([]);
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    isContainerUnit: '',
    status: ''
  });
  const [selectSearchParams, setSelectSearchParams] = useState<SearchParams>({
    keyword: '',
    isContainerUnit: '',
    status: ''
  });

  // 初始化示例数据
  useEffect(() => {
    const mockData: CalculationUnit[] = [
      {
        id: '1',
        unitNameCn: '千克',
        unitNameEn: 'Kilogram',
        isContainerUnit: false,
        status: 'enabled' as const
      },
      {
        id: '2',
        unitNameCn: '吨',
        unitNameEn: 'Ton',
        isContainerUnit: false,
        status: 'enabled' as const
      },
      {
        id: '3',
        unitNameCn: '立方米',
        unitNameEn: 'Cubic Meter',
        isContainerUnit: false,
        status: 'enabled' as const
      },
      {
        id: '4',
        unitNameCn: '20英尺集装箱',
        unitNameEn: '20ft Container',
        isContainerUnit: true,
        containerType: '20GP',
        status: 'enabled' as const
      },
      {
        id: '5',
        unitNameCn: '40英尺集装箱',
        unitNameEn: '40ft Container',
        isContainerUnit: true,
        containerType: '40GP',
        status: 'enabled' as const
      },
      {
        id: '6',
        unitNameCn: '40英尺高箱',
        unitNameEn: '40ft High Cube',
        isContainerUnit: true,
        containerType: '40HC',
        status: 'disabled' as const
      },
      {
        id: '7',
        unitNameCn: '件',
        unitNameEn: 'Piece',
        isContainerUnit: false,
        status: 'enabled' as const
      },
      {
        id: '8',
        unitNameCn: '20英尺冷藏箱',
        unitNameEn: '20ft Reefer',
        isContainerUnit: true,
        containerType: '20RF',
        status: 'enabled' as const
      }
    ];

    setData(mockData);
    filterData(mockData);
  }, []);

  // 筛选数据
  const filterData = (dataToFilter = data) => {
    let filtered = [...dataToFilter];
    
    // 应用搜索条件
    if (searchParams.keyword) {
      filtered = filtered.filter(unit =>
        unit.unitNameCn.includes(searchParams.keyword) ||
        unit.unitNameEn.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        (unit.containerType && unit.containerType.toLowerCase().includes(searchParams.keyword.toLowerCase()))
      );
    }

    if (searchParams.isContainerUnit) {
      const isContainer = searchParams.isContainerUnit === 'true';
      filtered = filtered.filter(unit => unit.isContainerUnit === isContainer);
    }

    if (searchParams.status) {
      filtered = filtered.filter(unit => unit.status === searchParams.status);
    }

    setFilteredData(filtered);
  };

  // 当数据或搜索参数变化时重新筛选
  useEffect(() => {
    filterData();
  }, [data, searchParams]);

  // 搜索筛选功能
  const handleSearch = () => {
    filterData();
  };

  // 重置搜索
  const handleReset = () => {
    const newSearchParams = {
      keyword: '',
      isContainerUnit: '',
      status: ''
    };
    setSearchParams(newSearchParams);
  };

  // 处理新增（改为选择模式）
  const handleAdd = () => {
    // 获取已存在的单位名称列表（中文名或英文名）
    const existingUnitNames = data.map(item => [item.unitNameCn, item.unitNameEn]).flat();
    
    // 过滤出未添加的计费单位
    const available = CALCULATION_UNIT_DATABASE.filter(unit => 
      !existingUnitNames.includes(unit.unitNameCn) && !existingUnitNames.includes(unit.unitNameEn)
    );
    
    setSelectableUnits(available);
    setSelectedUnits([]);
    setSelectSearchParams({ keyword: '', isContainerUnit: '', status: '' });
    setSelectModalVisible(true);
  };

  // 处理选择计费单位
  const handleSelectUnits = () => {
    if (selectedUnits.length === 0) {
      Message.warning('请选择至少一个计费单位');
      return;
    }

    const newUnits = CALCULATION_UNIT_DATABASE
      .filter(unit => selectedUnits.includes(unit.id))
      .map(unit => ({
        ...unit,
        id: Date.now().toString() + '_' + unit.id,
        status: 'enabled' as const
      }));

    setData(prev => [...prev, ...newUnits]);
    filterData([...data, ...newUnits]);
    
    setSelectModalVisible(false);
    Message.success(`已添加 ${newUnits.length} 个计费单位`);
  };

  // 筛选可选择的计费单位
  const filterSelectableUnits = () => {
    let filtered = [...selectableUnits];
    
    if (selectSearchParams.keyword) {
      filtered = filtered.filter(item => 
        item.unitNameCn.includes(selectSearchParams.keyword) ||
        item.unitNameEn.toLowerCase().includes(selectSearchParams.keyword.toLowerCase()) ||
        (item.containerType && item.containerType.toLowerCase().includes(selectSearchParams.keyword.toLowerCase()))
      );
    }

    if (selectSearchParams.isContainerUnit) {
      const isContainer = selectSearchParams.isContainerUnit === 'true';
      filtered = filtered.filter(item => item.isContainerUnit === isContainer);
    }

    return filtered;
  };

  // 处理状态切换
  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    setData(prev => prev.map(unit => 
      unit.id === id ? { ...unit, status: newStatus } : unit
    ));
    setFilteredData(prev => prev.map(unit => 
      unit.id === id ? { ...unit, status: newStatus } : unit
    ));
    Message.success(`计费单位已${newStatus === 'enabled' ? '启用' : '禁用'}`);
  };

  // 批量启用
  const handleBatchEnable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要启用的计费单位');
      return;
    }
    
    setData(prev => prev.map(unit => 
      selectedRowKeys.includes(unit.id) ? { ...unit, status: 'enabled' } : unit
    ));
    setFilteredData(prev => prev.map(unit => 
      selectedRowKeys.includes(unit.id) ? { ...unit, status: 'enabled' } : unit
    ));
    
    setSelectedRowKeys([]);
    Message.success(`已启用 ${selectedRowKeys.length} 个计费单位`);
  };

  // 批量禁用
  const handleBatchDisable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要禁用的计费单位');
      return;
    }
    
    setData(prev => prev.map(unit => 
      selectedRowKeys.includes(unit.id) ? { ...unit, status: 'disabled' } : unit
    ));
    setFilteredData(prev => prev.map(unit => 
      selectedRowKeys.includes(unit.id) ? { ...unit, status: 'disabled' } : unit
    ));
    
    setSelectedRowKeys([]);
    Message.success(`已禁用 ${selectedRowKeys.length} 个计费单位`);
  };

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
      render: (_: unknown, record: CalculationUnit) => (
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
      title: '计费单位名称（中文）',
      dataIndex: 'unitNameCn',
      width: 180,
      sorter: (a: CalculationUnit, b: CalculationUnit) => a.unitNameCn.localeCompare(b.unitNameCn, 'zh-CN'),
      headerStyle: { whiteSpace: 'nowrap' }
    },
    {
      title: '计费单位名称（英文）',
      dataIndex: 'unitNameEn',
      width: 200,
      sorter: (a: CalculationUnit, b: CalculationUnit) => a.unitNameEn.localeCompare(b.unitNameEn),
      headerStyle: { whiteSpace: 'nowrap' }
    },
    {
      title: '是否箱型单位',
      dataIndex: 'isContainerUnit',
      width: 120,
      sorter: (a: CalculationUnit, b: CalculationUnit) => Number(a.isContainerUnit) - Number(b.isContainerUnit),
      headerStyle: { whiteSpace: 'nowrap' },
      render: (isContainerUnit: boolean) => (
        <Tag color={isContainerUnit ? 'blue' : 'gray'}>
          {isContainerUnit ? '是' : '否'}
        </Tag>
      ),
    },
    {
      title: '箱型',
      dataIndex: 'containerType',
      width: 100,
      sorter: (a: CalculationUnit, b: CalculationUnit) => (a.containerType || '').localeCompare(b.containerType || ''),
      headerStyle: { whiteSpace: 'nowrap' },
      render: (containerType: string, record: CalculationUnit) => {
        if (!record.isContainerUnit) {
          return <span style={{ color: '#999' }}>-</span>;
        }
        return containerType ? (
          <Tag color="orange">{containerType}</Tag>
        ) : (
          <span style={{ color: '#999' }}>未设置</span>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      sorter: (a: CalculationUnit, b: CalculationUnit) => a.status.localeCompare(b.status),
      headerStyle: { whiteSpace: 'nowrap' },
      render: (status: string) => (
        <Tag color={status === 'enabled' ? 'green' : 'red'}>
          {status === 'enabled' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 120,
      fixed: 'right' as const,
      headerStyle: { whiteSpace: 'nowrap' },
      render: (_: unknown, record: CalculationUnit) => (
        <Space>
          <Popconfirm
            title={`确定要${record.status === 'enabled' ? '禁用' : '启用'}此计费单位吗？`}
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
    },
  ];

  // 选择弹窗的表格列配置
  const selectColumns = [
    {
      title: (
        <Checkbox
          indeterminate={selectedUnits.length > 0 && selectedUnits.length < filterSelectableUnits().length}
          checked={selectedUnits.length === filterSelectableUnits().length && filterSelectableUnits().length > 0}
          onChange={(checked) => {
            if (checked) {
              setSelectedUnits(filterSelectableUnits().map(item => item.id));
            } else {
              setSelectedUnits([]);
            }
          }}
        />
      ),
      dataIndex: 'checkbox',
      width: 60,
      render: (_: unknown, record: CalculationUnit) => (
        <Checkbox
          checked={selectedUnits.includes(record.id)}
          onChange={(checked) => {
            if (checked) {
              setSelectedUnits([...selectedUnits, record.id]);
            } else {
              setSelectedUnits(selectedUnits.filter(id => id !== record.id));
            }
          }}
        />
      ),
    },
    {
      title: '计费单位名称（中文）',
      dataIndex: 'unitNameCn',
      width: 180,
      sorter: (a: CalculationUnit, b: CalculationUnit) => a.unitNameCn.localeCompare(b.unitNameCn, 'zh-CN'),
      headerStyle: { whiteSpace: 'nowrap' }
    },
    {
      title: '计费单位名称（英文）',
      dataIndex: 'unitNameEn',
      width: 200,
      sorter: (a: CalculationUnit, b: CalculationUnit) => a.unitNameEn.localeCompare(b.unitNameEn),
      headerStyle: { whiteSpace: 'nowrap' }
    },
    {
      title: '是否箱型单位',
      dataIndex: 'isContainerUnit',
      width: 120,
      sorter: (a: CalculationUnit, b: CalculationUnit) => Number(a.isContainerUnit) - Number(b.isContainerUnit),
      headerStyle: { whiteSpace: 'nowrap' },
      render: (isContainerUnit: boolean) => (
        <Tag color={isContainerUnit ? 'blue' : 'gray'}>
          {isContainerUnit ? '是' : '否'}
        </Tag>
      ),
    },
    {
      title: '箱型',
      dataIndex: 'containerType',
      width: 100,
      sorter: (a: CalculationUnit, b: CalculationUnit) => (a.containerType || '').localeCompare(b.containerType || ''),
      headerStyle: { whiteSpace: 'nowrap' },
      render: (containerType: string, record: CalculationUnit) => {
        if (!record.isContainerUnit) {
          return <span style={{ color: '#999' }}>-</span>;
        }
        return containerType || <span style={{ color: '#999' }}>未设置</span>;
      },
    }
  ];

  return (
    <>
      <style>{tableHeaderStyle}</style>
      <Card>
        <div style={{ marginBottom: '20px' }}>
          <Title heading={4} style={{ margin: 0 }}>计费单位管理</Title>
        </div>

        {/* 搜索筛选区域 */}
        <Card style={{ marginBottom: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
            <div>
              <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
              <Input
                placeholder="计费单位名称、箱型"
                value={searchParams.keyword}
                onChange={(value) => setSearchParams(prev => ({ ...prev, keyword: value }))}
              />
            </div>
            <div>
              <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>是否箱型单位</div>
              <Select
                placeholder="选择类型"
                value={searchParams.isContainerUnit}
                onChange={(value) => setSearchParams(prev => ({ ...prev, isContainerUnit: value }))}
                allowClear
              >
                <Option value="true">是</Option>
                <Option value="false">否</Option>
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
                新增计费单位
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
          scroll={{ x: 880 }}
          pagination={{
            pageSize: 10,
            showTotal: true,
            showJumper: true,
            sizeCanChange: true,
          }}
        />

        {/* 选择计费单位弹窗 */}
        <Modal
          title="选择计费单位"
          visible={selectModalVisible}
          onOk={handleSelectUnits}
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
                  placeholder="计费单位名称、箱型"
                  value={selectSearchParams.keyword}
                  onChange={(value) => setSelectSearchParams(prev => ({ ...prev, keyword: value }))}
                />
              </div>
              <div style={{ width: '200px' }}>
                <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>是否箱型单位</div>
                <Select
                  placeholder="选择类型"
                  value={selectSearchParams.isContainerUnit}
                  onChange={(value) => setSelectSearchParams(prev => ({ ...prev, isContainerUnit: value }))}
                  allowClear
                >
                  <Option value="true">是</Option>
                  <Option value="false">否</Option>
                </Select>
              </div>
            </div>
          </Card>

          <Table
            columns={selectColumns}
            data={filterSelectableUnits()}
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

export default CalculationUnitManagement; 