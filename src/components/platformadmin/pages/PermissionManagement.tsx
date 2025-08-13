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
  Typography,
  Dropdown,
  Menu,
  Drawer
} from '@arco-design/web-react';
import { useNavigate } from 'react-router-dom';
import {
  IconPlus,
  IconSearch,
  IconRefresh,
  IconMore
} from '@arco-design/web-react/icon';

const { Option } = Select;
const { Title } = Typography;

// 权限数据接口
interface Permission {
  id: string;
  nameZh: string; // 权限名（中文）
  nameEn: string; // 权限名（英文）
  permissionClass: string; // 权限类
  permissionType: string; // 权限型
  permissionCode: string; // 权限点
  description?: string; // 权限描述
  parentId?: string; // 父级ID
  children?: Permission[]; // 子权限
  status: 'enabled' | 'disabled';
}

// 权限类选项
const permissionClassOptions = [
  { value: 'module', label: 'module' },
  { value: 'write', label: 'write' },
  { value: 'read', label: 'read' },
  { value: 'delete', label: 'delete' }
];

// 权限型选项
const permissionTypeOptions = [
  { value: 'subsystem', label: 'subsystem' },
  { value: 'basicinfo', label: 'basicinfo' },
  { value: 'business', label: 'business' },
  { value: 'report', label: 'report' },
  { value: 'system', label: 'system' }
];

// 搜索筛选参数
interface SearchParams {
  keyword: string;
  permissionClass: string[];
  permissionType: string[];
}

const PermissionManagement: React.FC = () => {
  const [permissionData, setPermissionData] = useState<Permission[]>([]);
  const [filteredData, setFilteredData] = useState<Permission[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [currentPermission, setCurrentPermission] = useState<Permission | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    permissionClass: [],
    permissionType: []
  });
  const navigate = useNavigate();

  // 初始化示例数据
  useEffect(() => {
    const mockData: Permission[] = [
      {
        id: '1',
        nameZh: '基础资料',
        nameEn: 'Basic Information',
        permissionClass: 'module',
        permissionType: 'subsystem',
        permissionCode: 'basicinfo',
        description: '基础资料管理模块',
        status: 'enabled',
        children: [
          {
            id: '1-1',
            nameZh: '海港',
            nameEn: 'Sea Port',
            permissionClass: 'module',
            permissionType: 'basicinfo',
            permissionCode: 'SMSeaPort',
            description: '海港信息管理',
            parentId: '1',
            status: 'enabled',
            children: [
              {
                id: '1-1-1',
                nameZh: '海港修改',
                nameEn: 'Modify Sea Port',
                permissionClass: 'write',
                permissionType: 'basicinfo',
                permissionCode: 'SMSeaPort',
                description: '修改海港信息',
                parentId: '1-1',
                status: 'enabled'
              }
            ]
          },
          {
            id: '1-2',
            nameZh: '空港',
            nameEn: 'Air Port',
            permissionClass: 'module',
            permissionType: 'basicinfo',
            permissionCode: 'SMAirPort',
            description: '空港信息管理',
            parentId: '1',
            status: 'enabled'
          }
        ]
      },
      {
        id: '2',
        nameZh: '合作伙伴',
        nameEn: 'Business Partners',
        permissionClass: 'module',
        permissionType: 'basicinfo',
        permissionCode: 'SMPartner',
        description: '合作伙伴管理模块',
        status: 'enabled'
      },
      {
        id: '3',
        nameZh: '汇率管理',
        nameEn: 'Exchange Rate Management',
        permissionClass: 'module',
        permissionType: 'basicinfo',
        permissionCode: 'SMRate',
        description: '汇率信息管理',
        status: 'enabled'
      },
      {
        id: '4',
        nameZh: '收费项目',
        nameEn: 'Charge Item',
        permissionClass: 'module',
        permissionType: 'basicinfo',
        permissionCode: 'SMChargeItem',
        description: '收费项目管理',
        status: 'enabled'
      },
      {
        id: '5',
        nameZh: '费用方案',
        nameEn: 'Charge Scheme',
        permissionClass: 'module',
        permissionType: 'basicinfo',
        permissionCode: 'FMChargeScheme',
        description: '费用方案管理',
        status: 'enabled',
        children: [
          {
            id: '5-1',
            nameZh: '参数设置',
            nameEn: 'Parameter Settings',
            permissionClass: 'module',
            permissionType: 'basicinfo',
            permissionCode: 'SMCustomization',
            description: '参数配置管理',
            parentId: '5',
            status: 'enabled'
          },
          {
            id: '5-2',
            nameZh: '收发通地址',
            nameEn: 'Billing Address',
            permissionClass: 'module',
            permissionType: 'basicinfo',
            permissionCode: 'SMBillAddress',
            description: '收发通地址管理',
            parentId: '5',
            status: 'enabled'
          }
        ]
      },
      {
        id: '6',
        nameZh: '国家',
        nameEn: 'Country',
        permissionClass: 'module',
        permissionType: 'basicinfo',
        permissionCode: 'SMCountry',
        description: '国家信息管理',
        status: 'enabled',
        children: [
          {
            id: '6-1',
            nameZh: '财务月管理',
            nameEn: 'Accounting Month Management',
            permissionClass: 'module',
            permissionType: 'basicinfo',
            permissionCode: 'AccountingMonth',
            description: '财务月份管理',
            parentId: '6',
            status: 'enabled'
          }
        ]
      }
    ];

    setPermissionData(mockData);
    setFilteredData(mockData);
    // 默认展开第一层
    setExpandedKeys(mockData.map(item => item.id));
  }, []);

  // 搜索筛选功能
  const handleSearch = () => {
    const filterTreeData = (data: Permission[], searchParams: SearchParams): Permission[] => {
      return data.reduce((acc: Permission[], item) => {
        // 检查当前项是否匹配
        let matches = true;

        // 关键词搜索
        if (searchParams.keyword) {
          const keyword = searchParams.keyword.toLowerCase();
          matches = matches && (
            item.nameZh.toLowerCase().includes(keyword) ||
            item.nameEn.toLowerCase().includes(keyword)
          );
        }

        // 权限类筛选
        if (searchParams.permissionClass.length > 0) {
          matches = matches && searchParams.permissionClass.includes(item.permissionClass);
        }

        // 权限型筛选
        if (searchParams.permissionType.length > 0) {
          matches = matches && searchParams.permissionType.includes(item.permissionType);
        }

        // 递归处理子项
        const filteredChildren = item.children ? filterTreeData(item.children, searchParams) : [];

        // 如果当前项匹配或有匹配的子项，则包含当前项
        if (matches || filteredChildren.length > 0) {
          acc.push({
            ...item,
            children: filteredChildren.length > 0 ? filteredChildren : item.children
          });
        }

        return acc;
      }, []);
    };

    const filtered = filterTreeData(permissionData, searchParams);
    setFilteredData(filtered);
  };

  // 重置搜索
  const handleReset = () => {
    setSearchParams({
      keyword: '',
      permissionClass: [],
      permissionType: []
    });
    setFilteredData(permissionData);
  };



  // 展开全部
  const expandAll = () => {
    const getAllKeys = (data: Permission[]): string[] => {
      return data.reduce((keys: string[], item) => {
        keys.push(item.id);
        if (item.children) {
          keys.push(...getAllKeys(item.children));
        }
        return keys;
      }, []);
    };
    setExpandedKeys(getAllKeys(filteredData));
  };

  // 收起全部
  const collapseAll = () => {
    setExpandedKeys([]);
  };

  // 处理编辑
  const handleEdit = (record: Permission) => {
    navigate('/platformadmin/permission-management/edit/' + record.id, {
      state: {
        permission: record,
        isEditing: true
      }
    });
  };

  // 处理新增
  const handleAdd = (parentId?: string) => {
    if (parentId) {
      // 新增子权限
      const parentPermission = findPermissionById(permissionData, parentId);
      navigate('/platformadmin/permission-management/add', {
        state: {
          parentPermission,
          isEditing: false
        }
      });
    } else {
      // 新增根级权限
      navigate('/platformadmin/permission-management/add', {
        state: {
          isEditing: false
        }
      });
    }
  };

  // 根据ID查找权限
  const findPermissionById = (data: Permission[], id: string): Permission | null => {
    for (const item of data) {
      if (item.id === id) {
        return item;
      }
      if (item.children) {
        const found = findPermissionById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // 处理详情
  const handleDetail = (record: Permission) => {
    setCurrentPermission(record);
    setDetailDrawerVisible(true);
  };

  // 获取父级权限信息
  const getParentInfo = (data: Permission[], targetId: string): Permission | null => {
    for (const item of data) {
      if (item.children) {
        for (const child of item.children) {
          if (child.id === targetId) {
            return item;
          }
        }
        const found = getParentInfo(item.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  // 处理复制
  const handleCopy = (record: Permission) => {
    const newPermission: Permission = {
      ...record,
      id: Date.now().toString(),
      nameZh: `${record.nameZh}（副本）`,
      nameEn: `${record.nameEn} (Copy)`,
      children: undefined,
      parentId: record.parentId
    };

    if (record.parentId) {
      // 添加到父级
      const addToParent = (data: Permission[]): Permission[] => {
        return data.map(item => {
          if (item.id === record.parentId) {
            return {
              ...item,
              children: [...(item.children || []), newPermission]
            };
          }
          if (item.children) {
            item.children = addToParent(item.children);
          }
          return item;
        });
      };

      setPermissionData(addToParent(permissionData));
      setFilteredData(addToParent(filteredData));
    } else {
      // 添加到根级
      setPermissionData([...permissionData, newPermission]);
      setFilteredData([...filteredData, newPermission]);
    }
    
    Message.success('权限已复制');
  };

  // 处理删除
  const handleDelete = (id: string) => {
    const deleteFromTree = (data: Permission[]): Permission[] => {
      return data.filter(item => {
        if (item.id === id) {
          return false;
        }
        if (item.children) {
          item.children = deleteFromTree(item.children);
        }
        return true;
      });
    };

    setPermissionData(deleteFromTree(permissionData));
    setFilteredData(deleteFromTree(filteredData));
    Message.success('权限已删除');
  };



  // 表格列配置
  const columns = [
    {
      title: '权限名（中文）',
      dataIndex: 'nameZh',
      width: 200,
      render: (value: string, record: Permission) => {
        const hasChildren = record.children && record.children.length > 0;
        const isExpanded = expandedKeys.includes(record.id);
        
  return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {hasChildren && (
              <div
                onClick={() => {
                  if (isExpanded) {
                    setExpandedKeys(expandedKeys.filter(key => key !== record.id));
                  } else {
                    setExpandedKeys([...expandedKeys, record.id]);
                  }
                }}
          style={{ 
                  cursor: 'pointer',
                  marginRight: '8px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '3px',
                  backgroundColor: isExpanded ? '#165dff' : '#f2f3f5',
                  color: isExpanded ? '#ffffff' : '#86909c',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease',
                  border: '1px solid',
                  borderColor: isExpanded ? '#165dff' : '#e5e6eb'
                }}
                onMouseEnter={(e) => {
                  if (!isExpanded) {
                    e.currentTarget.style.backgroundColor = '#e8f3ff';
                    e.currentTarget.style.borderColor = '#bedaff';
                    e.currentTarget.style.color = '#165dff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isExpanded) {
                    e.currentTarget.style.backgroundColor = '#f2f3f5';
                    e.currentTarget.style.borderColor = '#e5e6eb';
                    e.currentTarget.style.color = '#86909c';
                  }
                }}
              >
                {isExpanded ? '−' : '+'}
              </div>
            )}
            {!hasChildren && <span style={{ width: '26px', display: 'inline-block' }} />}
            <span>{value}</span>
      </div>
        );
      }
    },
    {
      title: '权限名（英文）',
      dataIndex: 'nameEn',
      width: 200
    },
    {
      title: '权限类',
      dataIndex: 'permissionClass',
      width: 120,
      render: (value: string) => {
        const classConfig = permissionClassOptions.find(opt => opt.value === value);
        return <Tag>{classConfig?.label || value}</Tag>;
      }
    },
    {
      title: '权限型',
      dataIndex: 'permissionType',
      width: 120,
      render: (value: string) => {
        const typeConfig = permissionTypeOptions.find(opt => opt.value === value);
        return <Tag color="blue">{typeConfig?.label || value}</Tag>;
      }
    },
    {
      title: '权限点',
      dataIndex: 'permissionCode',
      width: 150
    },
    {
      title: '权限描述',
      dataIndex: 'description',
      width: 200
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: unknown, record: Permission) => (
        <Space>
          <Button
            type="text"
            size="small"
            onClick={() => handleDetail(record)}
          >
            详情
          </Button>
          <Button
            type="text"
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Dropdown
            droplist={
              <Menu>
                <Menu.Item key="addChild" onClick={() => handleAdd(record.id)}>
                  添加子权限
                </Menu.Item>
                <Menu.Item key="copy" onClick={() => handleCopy(record)}>
                  复制
                </Menu.Item>
                <Menu.Item 
                  key="delete" 
                  onClick={() => {
                    Modal.confirm({
                      title: '确认删除',
                      content: '确定要删除此权限吗？删除后子权限也会被删除。',
                      onOk: () => handleDelete(record.id)
                    });
                  }}
                  style={{ color: '#f53f3f' }}
                >
                  删除
                </Menu.Item>
              </Menu>
            }
            position="bl"
          >
            <Button
              type="text"
              size="small"
              icon={<IconMore />}
            >
              更多
            </Button>
          </Dropdown>
        </Space>
      )
    }
  ];

  // 将树形数据转换为平铺数据用于表格展示
  const flattenData = (data: Permission[], parentId?: string): Permission[] => {
    const result: Permission[] = [];
    
    data.forEach(item => {
      if (!parentId || expandedKeys.includes(parentId)) {
        result.push(item);
        if (item.children && expandedKeys.includes(item.id)) {
          result.push(...flattenData(item.children, item.id));
        }
      }
    });
    
    return result;
  };

  const tableData = flattenData(filteredData);

  return (
    <Card>
      <div style={{ marginBottom: '20px' }}>
        <Title heading={4} style={{ margin: 0 }}>权限管理</Title>
      </div>
      
      {/* 搜索筛选区域 */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
            <Input
              placeholder="权限名（中文/英文）"
              value={searchParams.keyword}
              onChange={(value) => setSearchParams(prev => ({ ...prev, keyword: value }))}
            />
          </div>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>权限类</div>
            <Select
              mode="multiple"
              placeholder="选择权限类"
              value={searchParams.permissionClass}
              onChange={(value) => setSearchParams(prev => ({ ...prev, permissionClass: value }))}
              maxTagCount={2}
            >
              {permissionClassOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </div>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>权限型</div>
            <Select
              mode="multiple"
              placeholder="选择权限型"
              value={searchParams.permissionType}
              onChange={(value) => setSearchParams(prev => ({ ...prev, permissionType: value }))}
              maxTagCount={2}
            >
              {permissionTypeOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
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
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button type="primary" icon={<IconPlus />} onClick={() => handleAdd()}>
            新增权限
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button onClick={expandAll}>展开全部</Button>
          <Button onClick={collapseAll}>收起全部</Button>
        </div>
      </div>

      {/* 表格 */}
      <Table
        columns={columns}
        data={tableData}
        rowKey="id"
        scroll={{ x: 1200 }}
        pagination={{
          pageSize: 20,
          showTotal: true,
          showJumper: true,
          sizeCanChange: true
        }}
        rowClassName={(record) => {
          const level = record.id.split('-').length - 1;
          return `permission-row-level-${level}`;
        }}
        expandedRowKeys={[]}
        expandProps={{
          icon: () => null,
          width: 0
        }}
      />



      {/* 权限详情抽屉 */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px', fontWeight: 600 }}>权限详情</span>
            {currentPermission && (
              <Tag color={currentPermission.status === 'enabled' ? 'green' : 'red'}>
                {currentPermission.status === 'enabled' ? '启用' : '禁用'}
              </Tag>
            )}
          </div>
        }
        visible={detailDrawerVisible}
        onCancel={() => setDetailDrawerVisible(false)}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={() => setDetailDrawerVisible(false)}>
              关闭
            </Button>
          </div>
        }
        width={600}
        placement="right"
      >
        {currentPermission && (
          <div style={{ padding: '20px 0' }}>
            {/* 基本信息 */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ 
                margin: '0 0 16px 0', 
                fontSize: '14px', 
                fontWeight: 600, 
                color: '#1d2129',
                borderBottom: '1px solid #e5e6eb',
                paddingBottom: '8px'
              }}>
                基本信息
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#f7f8fa', 
                  borderRadius: '6px',
                  border: '1px solid #e5e6eb'
                }}>
                  <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>权限名（中文）</div>
                  <div style={{ fontSize: '14px', color: '#1d2129', fontWeight: 500 }}>{currentPermission.nameZh}</div>
                </div>
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#f7f8fa', 
                  borderRadius: '6px',
                  border: '1px solid #e5e6eb'
                }}>
                  <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>权限名（英文）</div>
                  <div style={{ fontSize: '14px', color: '#1d2129', fontWeight: 500 }}>{currentPermission.nameEn}</div>
                </div>
              </div>
      </div>

            {/* 权限分类 */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ 
                margin: '0 0 16px 0', 
                fontSize: '14px', 
                fontWeight: 600, 
                color: '#1d2129',
                borderBottom: '1px solid #e5e6eb',
                paddingBottom: '8px'
              }}>
                权限分类
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#f7f8fa', 
                  borderRadius: '6px',
                  border: '1px solid #e5e6eb'
                }}>
                  <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>权限类</div>
                  <Tag color="blue" style={{ margin: 0 }}>
                    {permissionClassOptions.find(opt => opt.value === currentPermission.permissionClass)?.label || currentPermission.permissionClass}
                  </Tag>
                </div>
      <div style={{
                  padding: '12px', 
                  backgroundColor: '#f7f8fa', 
                  borderRadius: '6px',
                  border: '1px solid #e5e6eb'
                }}>
                  <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>权限型</div>
                  <Tag color="green" style={{ margin: 0 }}>
                    {permissionTypeOptions.find(opt => opt.value === currentPermission.permissionType)?.label || currentPermission.permissionType}
                  </Tag>
                </div>
              </div>
      </div>
      
            {/* 权限标识 */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ 
                margin: '0 0 16px 0', 
                fontSize: '14px', 
                fontWeight: 600, 
                color: '#1d2129',
                borderBottom: '1px solid #e5e6eb',
                paddingBottom: '8px'
              }}>
                权限标识
              </h4>
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#f7f8fa', 
                borderRadius: '6px',
                border: '1px solid #e5e6eb'
              }}>
                <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>权限点</div>
      <div style={{
                  fontSize: '14px', 
                  color: '#1d2129', 
                  fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                  backgroundColor: '#ffffff',
                  padding: '6px 8px',
                  borderRadius: '4px',
                  border: '1px solid #e5e6eb'
      }}>
                  {currentPermission.permissionCode}
                </div>
              </div>
      </div>
      
            {/* 层级关系 */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ 
                margin: '0 0 16px 0', 
                fontSize: '14px', 
                fontWeight: 600, 
                color: '#1d2129',
                borderBottom: '1px solid #e5e6eb',
                paddingBottom: '8px'
              }}>
                层级关系
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#f7f8fa', 
                  borderRadius: '6px',
                  border: '1px solid #e5e6eb'
                }}>
                  <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>父级权限</div>
                  <div style={{ fontSize: '14px', color: '#1d2129' }}>
                    {(() => {
                      const parentPermission = currentPermission.parentId ? getParentInfo(permissionData, currentPermission.id) : null;
                      return parentPermission ? (
                        <Tag color="orange">{parentPermission.nameZh}</Tag>
                      ) : (
                        <span style={{ color: '#86909c' }}>根级权限</span>
                      );
                    })()}
                  </div>
                </div>
      <div style={{
                  padding: '12px', 
                  backgroundColor: '#f7f8fa', 
                  borderRadius: '6px',
                  border: '1px solid #e5e6eb'
                }}>
                  <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>子权限数量</div>
                  <div style={{ fontSize: '14px', color: '#1d2129', fontWeight: 500 }}>
                    {currentPermission.children && currentPermission.children.length > 0 ? (
                      <Tag color="purple">{currentPermission.children.length} 个</Tag>
                    ) : (
                      <span style={{ color: '#86909c' }}>无子权限</span>
                    )}
                  </div>
                </div>
              </div>
      </div>

            {/* 权限描述 */}
            {currentPermission.description && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ 
                  margin: '0 0 16px 0', 
                  fontSize: '14px', 
                  fontWeight: 600, 
                  color: '#1d2129',
                  borderBottom: '1px solid #e5e6eb',
                  paddingBottom: '8px'
                }}>
                  权限描述
                </h4>
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#f7f8fa', 
                  borderRadius: '6px',
                  border: '1px solid #e5e6eb',
                  lineHeight: '1.6'
                }}>
                  <div style={{ fontSize: '14px', color: '#4e5969' }}>
                    {currentPermission.description}
                  </div>
                </div>
              </div>
            )}

            {/* 子权限列表 */}
            {currentPermission.children && currentPermission.children.length > 0 && (
              <div>
                <h4 style={{ 
                  margin: '0 0 16px 0', 
                  fontSize: '14px', 
                  fontWeight: 600, 
                  color: '#1d2129',
                  borderBottom: '1px solid #e5e6eb',
                  paddingBottom: '8px'
                }}>
                  子权限列表
                </h4>
                <div style={{ 
                  maxHeight: '200px', 
                  overflowY: 'auto',
                  border: '1px solid #e5e6eb',
                  borderRadius: '6px'
                }}>
                  {currentPermission.children.map((child, index) => (
                    <div 
                      key={child.id} 
                      style={{ 
                        padding: '8px 12px',
                        borderBottom: index < currentPermission.children!.length - 1 ? '1px solid #f2f3f5' : 'none',
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafbfc'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: '#1d2129' }}>{child.nameZh}</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <Tag size="small" color="blue">{child.permissionClass}</Tag>
                          <Tag size="small" color="green">{child.permissionType}</Tag>
                        </div>
                      </div>
                      <div style={{ fontSize: '11px', color: '#86909c', marginTop: '2px' }}>
                        {child.permissionCode}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* 添加样式 */}
      <style>{`
        .permission-row-level-0 {
          background-color: #ffffff;
        }
        .permission-row-level-1 {
          background-color: #fafafa;
            }
        .permission-row-level-1 td:first-child {
          padding-left: 32px !important;
        }
        .permission-row-level-2 {
          background-color: #f5f5f5;
        }
        .permission-row-level-2 td:first-child {
          padding-left: 64px !important;
        }
        
        /* 隐藏表格自带的展开图标 */
        .arco-table-expand-icon-cell {
          display: none !important;
            }
        .arco-table-expand-icon {
          display: none !important;
        }
        .arco-table-cell-expand-icon {
          display: none !important;
        }
      `}</style>
    </Card>
  );
};

export default PermissionManagement; 