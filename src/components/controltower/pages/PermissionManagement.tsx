import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Button, 
  Space, 
  Modal,
  Form,
  Input,
  Grid,
  Tag
} from '@arco-design/web-react';
import { 
  IconSearch, 
  IconEdit,
  IconDown,
  IconRight,
  IconArrowLeft,
  IconArrowRight,
  IconSettings,
  IconUser,
  IconHome,
  IconFolder,
  IconBranch,
  IconInfo
} from '@arco-design/web-react/icon';

const { Title, Text } = Typography;
const { Row, Col } = Grid;

interface OrganizationNode {
  id: string;
  type: 'group' | 'company' | 'department' | 'role';
  name: string;
  chineseName: string;
  englishName: string;
  code?: string;
  parentId?: string;
  children?: OrganizationNode[];
}

interface PermissionItem {
  id: string;
  title: string;
  permissionClass: string;
  permissionType: string;
  permissionPoint: string;
  parentId?: string;
  children?: PermissionItem[];
  isGroup?: boolean;
  depth?: number;
}

const PermissionManagement: React.FC = () => {
  // 组织架构数据
  const [organizationData] = useState<OrganizationNode[]>([
    {
      id: 'hq',
      type: 'group',
      name: '集团总公司HQ',
      chineseName: '集团总公司',
      englishName: 'Headquarters',
      code: 'HQ001',
      children: [
        {
          id: 'shanghai',
          type: 'company',
          name: '上海分公司',
          chineseName: '上海分公司',
          englishName: 'Shanghai Branch',
          code: 'SH001',
          parentId: 'hq',
          children: [
            {
              id: 'sh-logistics',
              type: 'department',
              name: '上海物流部',
              chineseName: '上海物流部',
              englishName: 'Shanghai Logistics Department',
              parentId: 'shanghai',
              children: [
                {
                  id: 'sh-sea-logistics',
                  type: 'department',
                  name: '海运物流部',
                  chineseName: '海运物流部',
                  englishName: 'Sea Logistics Department',
                  parentId: 'sh-logistics',
                  children: [
                    {
                      id: 'sh-sea-manager',
                      type: 'role',
                      name: '海运经理',
                      chineseName: '海运经理',
                      englishName: 'Sea Logistics Manager',
                      parentId: 'sh-sea-logistics'
                    },
                    {
                      id: 'sh-sea-specialist',
                      type: 'role',
                      name: '海运专员',
                      chineseName: '海运专员',
                      englishName: 'Sea Logistics Specialist',
                      parentId: 'sh-sea-logistics'
                    }
                  ]
                },
                {
                  id: 'sh-air-logistics',
                  type: 'department',
                  name: '空运物流部',
                  chineseName: '空运物流部',
                  englishName: 'Air Logistics Department',
                  parentId: 'sh-logistics',
                  children: [
                    {
                      id: 'sh-air-manager',
                      type: 'role',
                      name: '空运经理',
                      chineseName: '空运经理',
                      englishName: 'Air Logistics Manager',
                      parentId: 'sh-air-logistics'
                    }
                  ]
                }
              ]
            },
            {
              id: 'sh-sales',
              type: 'department',
              name: '上海销售部',
              chineseName: '上海销售部',
              englishName: 'Shanghai Sales Department',
              parentId: 'shanghai',
              children: [
                {
                  id: 'sh-sales-manager',
                  type: 'role',
                  name: '销售经理',
                  chineseName: '销售经理',
                  englishName: 'Sales Manager',
                  parentId: 'sh-sales'
                },
                {
                  id: 'sh-sales-rep',
                  type: 'role',
                  name: '销售代表',
                  chineseName: '销售代表',
                  englishName: 'Sales Representative',
                  parentId: 'sh-sales'
                }
              ]
            },
            {
              id: 'sh-subsidiary',
              type: 'company',
              name: '上海子公司',
              chineseName: '上海子公司',
              englishName: 'Shanghai Subsidiary',
              code: 'SHS001',
              parentId: 'shanghai',
              children: [
                {
                  id: 'shs-operations',
                  type: 'department',
                  name: '运营部',
                  chineseName: '运营部',
                  englishName: 'Operations Department',
                  parentId: 'sh-subsidiary',
                  children: [
                    {
                      id: 'shs-ops-manager',
                      type: 'role',
                      name: '运营经理',
                      chineseName: '运营经理',
                      englishName: 'Operations Manager',
                      parentId: 'shs-operations'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'beijing',
          type: 'company',
          name: '北京分公司',
          chineseName: '北京分公司',
          englishName: 'Beijing Branch',
          code: 'BJ001',
          parentId: 'hq',
          children: [
            {
              id: 'bj-operations',
              type: 'department',
              name: '北京运营部',
              chineseName: '北京运营部',
              englishName: 'Beijing Operations Department',
              parentId: 'beijing',
              children: [
                {
                  id: 'bj-ops-director',
                  type: 'role',
                  name: '运营总监',
                  chineseName: '运营总监',
                  englishName: 'Operations Director',
                  parentId: 'bj-operations'
                },
                {
                  id: 'bj-ops-manager',
                  type: 'role',
                  name: '运营经理',
                  chineseName: '运营经理',
                  englishName: 'Operations Manager',
                  parentId: 'bj-operations'
                }
              ]
            },
            {
              id: 'bj-customer-service',
              type: 'department',
              name: '客户服务部',
              chineseName: '客户服务部',
              englishName: 'Customer Service Department',
              parentId: 'beijing',
              children: [
                {
                  id: 'bj-cs-supervisor',
                  type: 'role',
                  name: '客服主管',
                  chineseName: '客服主管',
                  englishName: 'Customer Service Supervisor',
                  parentId: 'bj-customer-service'
                }
              ]
            }
          ]
        },
        {
          id: 'guangzhou',
          type: 'company',
          name: '广州分公司',
          chineseName: '广州分公司',
          englishName: 'Guangzhou Branch',
          code: 'GZ001',
          parentId: 'hq',
          children: [
            {
              id: 'gz-finance',
              type: 'department',
              name: '财务部',
              chineseName: '财务部',
              englishName: 'Finance Department',
              parentId: 'guangzhou',
              children: [
                {
                  id: 'gz-finance-manager',
                  type: 'role',
                  name: '财务经理',
                  chineseName: '财务经理',
                  englishName: 'Finance Manager',
                  parentId: 'gz-finance'
                },
                {
                  id: 'gz-accountant',
                  type: 'role',
                  name: '会计',
                  chineseName: '会计',
                  englishName: 'Accountant',
                  parentId: 'gz-finance'
                }
              ]
            }
          ]
        },
        {
          id: 'hq-hr',
          type: 'department',
          name: '集团人力资源部',
          chineseName: '集团人力资源部',
          englishName: 'Group HR Department',
          parentId: 'hq',
          children: [
            {
              id: 'hq-hr-director',
              type: 'role',
              name: '人力资源总监',
              chineseName: '人力资源总监',
              englishName: 'HR Director',
              parentId: 'hq-hr'
            },
            {
              id: 'hq-hr-manager',
              type: 'role',
              name: '人力资源经理',
              chineseName: '人力资源经理',
              englishName: 'HR Manager',
              parentId: 'hq-hr'
            }
          ]
        },
        {
          id: 'hq-it',
          type: 'department',
          name: '集团IT部',
          chineseName: '集团IT部',
          englishName: 'Group IT Department',
          parentId: 'hq',
          children: [
            {
              id: 'hq-it-manager',
              type: 'role',
              name: 'IT经理',
              chineseName: 'IT经理',
              englishName: 'IT Manager',
              parentId: 'hq-it'
            }
          ]
        }
      ]
    }
  ]);

  // 权限数据 - 细化到查看、编辑、删除级别，增加分组
  const [permissionData] = useState<PermissionItem[]>([
    // 客户管理模块
    {
      id: 'customer-group',
      title: '客户管理',
      permissionClass: 'module',
      permissionType: 'CustomerManagement',
      permissionPoint: 'group',
      isGroup: true,
      children: [
        { id: 'customer:view', title: '查看客户列表', permissionClass: 'module', permissionType: 'CustomerManagement', permissionPoint: 'view', parentId: 'customer-group' },
        { id: 'customer:create', title: '新增客户', permissionClass: 'button', permissionType: 'CustomerManagement', permissionPoint: 'create', parentId: 'customer-group' },
        { id: 'customer:edit', title: '编辑客户', permissionClass: 'button', permissionType: 'CustomerManagement', permissionPoint: 'edit', parentId: 'customer-group' },
        { id: 'customer:delete', title: '删除客户', permissionClass: 'button', permissionType: 'CustomerManagement', permissionPoint: 'delete', parentId: 'customer-group' },
        { id: 'customer:export', title: '导出客户数据', permissionClass: 'button', permissionType: 'CustomerManagement', permissionPoint: 'export', parentId: 'customer-group' },
      ]
    },
    
    // 订单管理模块
    {
      id: 'order-group',
      title: '订单管理',
      permissionClass: 'module',
      permissionType: 'OrderManagement',
      permissionPoint: 'group',
      isGroup: true,
      children: [
        { id: 'order:view', title: '查看订单', permissionClass: 'module', permissionType: 'OrderManagement', permissionPoint: 'view', parentId: 'order-group' },
        { id: 'order:create', title: '创建订单', permissionClass: 'button', permissionType: 'OrderManagement', permissionPoint: 'create', parentId: 'order-group' },
        { id: 'order:edit', title: '编辑订单', permissionClass: 'button', permissionType: 'OrderManagement', permissionPoint: 'edit', parentId: 'order-group' },
        { id: 'order:delete', title: '删除订单', permissionClass: 'button', permissionType: 'OrderManagement', permissionPoint: 'delete', parentId: 'order-group' },
        { id: 'order:export', title: '导出订单', permissionClass: 'button', permissionType: 'OrderManagement', permissionPoint: 'export', parentId: 'order-group' },
        { id: 'order:audit', title: '审核订单', permissionClass: 'button', permissionType: 'OrderManagement', permissionPoint: 'audit', parentId: 'order-group' },
      ]
    },
    
    // 运价管理模块
    {
      id: 'freight-group',
      title: '运价管理',
      permissionClass: 'module',
      permissionType: 'FreightManagement',
      permissionPoint: 'group',
      isGroup: true,
      children: [
        { id: 'freight:view', title: '查看运价', permissionClass: 'module', permissionType: 'FreightManagement', permissionPoint: 'view', parentId: 'freight-group' },
        { id: 'freight:create', title: '创建运价', permissionClass: 'button', permissionType: 'FreightManagement', permissionPoint: 'create', parentId: 'freight-group' },
        { id: 'freight:edit', title: '编辑运价', permissionClass: 'button', permissionType: 'FreightManagement', permissionPoint: 'edit', parentId: 'freight-group' },
        { id: 'freight:delete', title: '删除运价', permissionClass: 'button', permissionType: 'FreightManagement', permissionPoint: 'delete', parentId: 'freight-group' },
        { id: 'freight:query', title: '运价查询', permissionClass: 'tab', permissionType: 'FreightQuery', permissionPoint: 'query', parentId: 'freight-group' },
      ]
    },
    
    // 用户管理模块
    {
      id: 'user-group',
      title: '用户管理',
      permissionClass: 'module',
      permissionType: 'UserManagement',
      permissionPoint: 'group',
      isGroup: true,
      children: [
        { id: 'user:view', title: '查看用户', permissionClass: 'module', permissionType: 'UserManagement', permissionPoint: 'view', parentId: 'user-group' },
        { id: 'user:create', title: '创建用户', permissionClass: 'button', permissionType: 'UserManagement', permissionPoint: 'create', parentId: 'user-group' },
        { id: 'user:edit', title: '编辑用户', permissionClass: 'button', permissionType: 'UserManagement', permissionPoint: 'edit', parentId: 'user-group' },
        { id: 'user:delete', title: '删除用户', permissionClass: 'button', permissionType: 'UserManagement', permissionPoint: 'delete', parentId: 'user-group' },
      ]
    },
    
    // 企业管理模块
    {
      id: 'company-group',
      title: '企业管理',
      permissionClass: 'module',
      permissionType: 'CompanyManagement',
      permissionPoint: 'group',
      isGroup: true,
      children: [
        { id: 'company:view', title: '查看企业', permissionClass: 'module', permissionType: 'CompanyManagement', permissionPoint: 'view', parentId: 'company-group' },
        { id: 'company:create', title: '创建企业', permissionClass: 'button', permissionType: 'CompanyManagement', permissionPoint: 'create', parentId: 'company-group' },
        { id: 'company:edit', title: '编辑企业', permissionClass: 'button', permissionType: 'CompanyManagement', permissionPoint: 'edit', parentId: 'company-group' },
        { id: 'company:delete', title: '删除企业', permissionClass: 'button', permissionType: 'CompanyManagement', permissionPoint: 'delete', parentId: 'company-group' },
      ]
    },
    
    // 基础资料管理模块
    {
      id: 'basicdata-group',
      title: '基础资料管理',
      permissionClass: 'module',
      permissionType: 'BasicDataManagement',
      permissionPoint: 'group',
      isGroup: true,
      children: [
        {
          id: 'port-subgroup',
          title: '港口管理',
          permissionClass: 'submodule',
          permissionType: 'PortManagement',
          permissionPoint: 'subgroup',
          isGroup: true,
          parentId: 'basicdata-group',
          children: [
            { id: 'port:view', title: '查看港口', permissionClass: 'module', permissionType: 'PortManagement', permissionPoint: 'view', parentId: 'port-subgroup' },
            { id: 'port:create', title: '创建港口', permissionClass: 'button', permissionType: 'PortManagement', permissionPoint: 'create', parentId: 'port-subgroup' },
            { id: 'port:edit', title: '编辑港口', permissionClass: 'button', permissionType: 'PortManagement', permissionPoint: 'edit', parentId: 'port-subgroup' },
            { id: 'port:delete', title: '删除港口', permissionClass: 'button', permissionType: 'PortManagement', permissionPoint: 'delete', parentId: 'port-subgroup' },
          ]
        },
        {
          id: 'carrier-subgroup',
          title: '承运人管理',
          permissionClass: 'submodule',
          permissionType: 'CarrierManagement',
          permissionPoint: 'subgroup',
          isGroup: true,
          parentId: 'basicdata-group',
          children: [
            { id: 'carrier:view', title: '查看承运人', permissionClass: 'module', permissionType: 'CarrierManagement', permissionPoint: 'view', parentId: 'carrier-subgroup' },
            { id: 'carrier:create', title: '创建承运人', permissionClass: 'button', permissionType: 'CarrierManagement', permissionPoint: 'create', parentId: 'carrier-subgroup' },
            { id: 'carrier:edit', title: '编辑承运人', permissionClass: 'button', permissionType: 'CarrierManagement', permissionPoint: 'edit', parentId: 'carrier-subgroup' },
            { id: 'carrier:delete', title: '删除承运人', permissionClass: 'button', permissionType: 'CarrierManagement', permissionPoint: 'delete', parentId: 'carrier-subgroup' },
          ]
        }
      ]
    }
  ]);

  // 状态管理
  const [selectedNode, setSelectedNode] = useState<OrganizationNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['hq']));
  const [allExpanded, setAllExpanded] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isPermissionConfigMode, setIsPermissionConfigMode] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createType, setCreateType] = useState<'company' | 'department' | 'role'>('company');
  const [form] = Form.useForm();

  // 角色权限数据 - 初始化一些角色已拥有的权限
  const [rolePermissions] = useState<Record<string, string[]>>({
    '总经理': [
      'customer-group', 'customer:view', 'customer:create', 'customer:edit', 'customer:delete', 'customer:export',
      'order-group', 'order:view', 'order:create', 'order:edit', 'order:delete', 'order:export', 'order:audit',
      'freight-group', 'freight:view', 'freight:create', 'freight:edit', 'freight:delete', 'freight:query',
      'user-group', 'user:view', 'user:create', 'user:edit', 'user:delete',
      'company-group', 'company:view', 'company:create', 'company:edit', 'company:delete',
      'basicdata-group', 'port-subgroup', 'port:view', 'port:create', 'port:edit', 'port:delete',
      'carrier-subgroup', 'carrier:view', 'carrier:create', 'carrier:edit', 'carrier:delete'
    ],
    '客户经理': [
      'customer-group', 'customer:view', 'customer:create', 'customer:edit', 'customer:export',
      'order-group', 'order:view', 'order:create', 'order:edit',
      'freight-group', 'freight:view', 'freight:query'
    ],
    '业务员': [
      'customer-group', 'customer:view', 
      'order-group', 'order:view', 'order:create',
      'freight-group', 'freight:view', 'freight:query'
    ],
    '财务': [
      'order-group', 'order:view', 'order:audit',
      'freight-group', 'freight:view'
    ]
  });

  // 权限展开收起状态
  const [expandedPermissions, setExpandedPermissions] = useState<Record<string, boolean>>({
    'customer-group': true,
    'order-group': true,
    'freight-group': false,
    'user-group': false,
    'company-group': false,
    'basicdata-group': false,
    'port-subgroup': false,
    'carrier-subgroup': false
  });

  // 权限搜索状态
  const [leftSearchValue, setLeftSearchValue] = useState<string>('');
  const [rightSearchValue, setRightSearchValue] = useState<string>('');

  // 权限配置状态
  const [authorizedPermissions, setAuthorizedPermissions] = useState<PermissionItem[]>([]);
  const [unauthorizedPermissions, setUnauthorizedPermissions] = useState<PermissionItem[]>([]);
  const [selectedAuthorizedPermissions, setSelectedAuthorizedPermissions] = useState<(string | number)[]>([]);
  const [selectedUnauthorizedPermissions, setSelectedUnauthorizedPermissions] = useState<(string | number)[]>([]);

  // 切换权限组展开状态
  const togglePermissionExpand = (permissionId: string) => {
    setExpandedPermissions(prev => ({
      ...prev,
      [permissionId]: !prev[permissionId]
    }));
  };

  // 节点切换
  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  // 全部展开/收起
  const toggleAllExpanded = () => {
    if (allExpanded) {
      setExpandedNodes(new Set(['hq']));
    } else {
      const allNodeIds = new Set<string>();
      const addNodeIds = (nodes: OrganizationNode[]) => {
        nodes.forEach(node => {
          allNodeIds.add(node.id);
          if (node.children) {
            addNodeIds(node.children);
          }
        });
      };
      addNodeIds(organizationData);
      setExpandedNodes(allNodeIds);
    }
    setAllExpanded(!allExpanded);
  };

  // 选择节点
  const handleNodeSelect = (node: OrganizationNode) => {
    setSelectedNode(node);

    // 如果是角色，初始化权限列表
    if (node.type === 'role') {
      const currentPermissions = rolePermissions[node.name] || [];
      const allFlatPermissions = flattenAllPermissions(permissionData);

      const authorized = allFlatPermissions.filter(p => currentPermissions.includes(p.id));
      const unauthorized = allFlatPermissions.filter(p => !currentPermissions.includes(p.id));
      setAuthorizedPermissions(authorized);
      setUnauthorizedPermissions(unauthorized);
    }
  };

  // 节点是否有子节点
  const hasChildren = (node: OrganizationNode) => {
    return node.children && node.children.length > 0;
  };

  // 获取节点图标
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'group':
        return <IconHome style={{ color: '#1890ff', marginRight: '6px' }} />;
      case 'company':
        return <IconBranch style={{ color: '#52c41a', marginRight: '6px' }} />;
      case 'department':
        return <IconFolder style={{ color: '#fa8c16', marginRight: '6px' }} />;
      case 'role':
        return <IconUser style={{ color: '#722ed1', marginRight: '6px' }} />;
      default:
        return null;
    }
  };

  // 渲染树节点
  const renderTreeNode = (node: OrganizationNode, level: number = 0): React.ReactNode => {
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNode?.id === node.id;
    const paddingLeft = level * 20 + 12;

    return (
      <div key={node.id}>
        <div
          style={{
            padding: '8px 12px',
            paddingLeft: paddingLeft,
            cursor: 'pointer',
            backgroundColor: isSelected ? '#e6f7ff' : 'transparent',
            minHeight: '36px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '6px',
            margin: '2px 8px',
            border: isSelected ? '2px solid #1890ff' : '2px solid transparent',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (!isSelected) {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
          onClick={() => handleNodeSelect(node)}
        >
          {hasChildren(node) && (
            <span
              style={{ marginRight: '8px', cursor: 'pointer', color: '#666' }}
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(node.id);
              }}
            >
              {isExpanded ? <IconDown /> : <IconRight />}
            </span>
          )}
          {!hasChildren(node) && <span style={{ width: '24px' }} />}
          
          {getNodeIcon(node.type)}
          
          <span style={{
            fontWeight: node.type === 'group' ? 'bold' : 'normal',
            fontSize: node.type === 'group' ? '14px' : '13px',
            color: isSelected ? '#1890ff' : '#333'
          }}>
            {node.name}
            {(node.type === 'group' || node.type === 'company') && node.code && (
              <Text type="secondary" style={{ marginLeft: '8px', fontSize: '12px' }}>
                ({node.code})
              </Text>
            )}
          </span>
        </div>
        
        {hasChildren(node) && isExpanded && (
          <div>
            {node.children!.map(child => 
              renderTreeNode(child, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  // 配置权限弹窗
  const handleConfigPermission = () => {
    if (selectedNode && selectedNode.type === 'role') {
      setIsPermissionConfigMode(true);
      // 初始化权限列表
      const currentPermissions = rolePermissions[selectedNode.name] || [];
      const allFlatPermissions = flattenAllPermissions(permissionData);

      const authorized = allFlatPermissions.filter(p => currentPermissions.includes(p.id));
      const unauthorized = allFlatPermissions.filter(p => !currentPermissions.includes(p.id));
      setAuthorizedPermissions(authorized);
      setUnauthorizedPermissions(unauthorized);
    }
  };

  // 返回组织架构页面
  const backToOrgStructure = () => {
    setIsPermissionConfigMode(false);
    setSelectedAuthorizedPermissions([]);
    setSelectedUnauthorizedPermissions([]);
  };

  // 编辑信息
  const handleEdit = () => {
    if (selectedNode) {
      form.setFieldsValue({
        chineseName: selectedNode.chineseName,
        englishName: selectedNode.englishName,
        code: selectedNode.code || ''
      });
      setEditModalVisible(true);
    }
  };

  // 创建子项
  const handleCreate = (type: 'company' | 'department' | 'role') => {
    setCreateType(type);
    form.resetFields();
    setCreateModalVisible(true);
  };

  // 保存编辑
  const handleSaveEdit = () => {
    try {
      const values = form.getFieldsValue();
      console.log('编辑保存:', values);
      // 这里可以添加实际的保存逻辑
      setEditModalVisible(false);
    } catch (error) {
      console.log('保存失败:', error);
    }
  };

  // 保存创建
  const handleSaveCreate = () => {
    try {
      const values = form.getFieldsValue();
      console.log('创建保存:', { type: createType, ...values });
      // 这里可以添加实际的创建逻辑
      setCreateModalVisible(false);
    } catch (error) {
      console.log('创建失败:', error);
    }
  };

  // 辅助函数：查找权限的所有父权限ID
  const findParentPermissionIds = (permissionId: string, allPermissions: PermissionItem[]): string[] => {
    const parentIds: string[] = [];

    const findParent = (permissions: PermissionItem[]): void => {
      for (const permission of permissions) {
        if (permission.children) {
          // 检查当前权限的直接子权限
          const hasDirectChild = permission.children.some(child => child.id === permissionId);
          if (hasDirectChild) {
            parentIds.push(permission.id);
            // 递归查找更上级的父权限
            parentIds.push(...findParentPermissionIds(permission.id, allPermissions));
            return;
          }
          // 递归检查子权限
          findParent(permission.children);
        }
      }
    };

    findParent(allPermissions);
    return [...new Set(parentIds)]; // 去重
  };

  // 辅助函数：根据选中的权限ID获取包含依赖关系的完整权限列表
  const getPermissionsWithDependencies = (selectedIds: (string | number)[], allPermissions: PermissionItem[]): PermissionItem[] => {
    const allFlatPermissions = flattenAllPermissions(allPermissions);
    const finalPermissionIds = new Set<string>();

    // 处理每个选中的权限
    selectedIds.forEach(id => {
      const stringId = String(id);
      const permission = allFlatPermissions.find(p => p.id === stringId);

      if (permission) {
        // 添加当前权限
        finalPermissionIds.add(stringId);

        // 如果是子权限，添加所有父权限
        if (!permission.isGroup) {
          const parentIds = findParentPermissionIds(stringId, allPermissions);
          parentIds.forEach(parentId => finalPermissionIds.add(parentId));
        }
      }
    });

    // 返回对应的权限对象
    return allFlatPermissions.filter(p => finalPermissionIds.has(p.id));
  };

  // 权限移动函数 - 改进版本，支持依赖关系和防重复
  const moveToAuthorized = () => {
    if (selectedUnauthorizedPermissions.length === 0) return;

    // 获取包含依赖关系的完整权限列表
    const permissionsToMove = getPermissionsWithDependencies(selectedUnauthorizedPermissions, permissionData);
    const permissionIdsToMove = permissionsToMove.map(p => p.id);

    // 过滤掉已经在已授权列表中的权限（防重复）
    const newPermissions = permissionsToMove.filter(p =>
      !authorizedPermissions.some(existing => existing.id === p.id)
    );

    // 更新权限列表
    const newAuthorized = [...authorizedPermissions, ...newPermissions];
    const newUnauthorized = unauthorizedPermissions.filter(p =>
      !permissionIdsToMove.includes(p.id)
    );

    setAuthorizedPermissions(newAuthorized);
    setUnauthorizedPermissions(newUnauthorized);
    setSelectedUnauthorizedPermissions([]);
  };

  const moveToUnauthorized = () => {
    if (selectedAuthorizedPermissions.length === 0) return;

    const allFlatPermissions = flattenAllPermissions(permissionData);
    // 简单移除选中的权限，不处理子权限依赖
    const movedPermissions = allFlatPermissions.filter(p =>
      selectedAuthorizedPermissions.includes(p.id)
    );

    // 过滤掉已经在未授权列表中的权限（防重复）
    const newPermissions = movedPermissions.filter(p =>
      !unauthorizedPermissions.some(existing => existing.id === p.id)
    );

    // 更新权限列表
    const newUnauthorized = [...unauthorizedPermissions, ...newPermissions];
    const newAuthorized = authorizedPermissions.filter(p =>
      !selectedAuthorizedPermissions.includes(p.id)
    );

    setUnauthorizedPermissions(newUnauthorized);
    setAuthorizedPermissions(newAuthorized);
    setSelectedAuthorizedPermissions([]);
  };



  // 处理权限选择（包括父权限）
  const handlePermissionSelect = (permissionId: string, isAuthorized: boolean) => {
    if (isAuthorized) {
      if (selectedAuthorizedPermissions.includes(permissionId)) {
        setSelectedAuthorizedPermissions(prev => prev.filter(id => id !== permissionId));
      } else {
        setSelectedAuthorizedPermissions(prev => [...prev, permissionId]);
      }
    } else {
      if (selectedUnauthorizedPermissions.includes(permissionId)) {
        setSelectedUnauthorizedPermissions(prev => prev.filter(id => id !== permissionId));
      } else {
        setSelectedUnauthorizedPermissions(prev => [...prev, permissionId]);
      }
    }
  };

  // 渲染权限表格行
  const renderPermissionRow = (permission: PermissionItem, _index: number, isAuthorized: boolean) => {
    const depth = permission.depth || 0;
    const paddingLeft = depth * 20 + 8;
    const isExpanded = expandedPermissions[permission.id];
    const isSelected = isAuthorized ?
      selectedAuthorizedPermissions.includes(permission.id) :
      selectedUnauthorizedPermissions.includes(permission.id);

    const handleCheckboxClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      handlePermissionSelect(permission.id, isAuthorized);
    };

    const handleRowClick = () => {
      // 对于分组权限，点击行时展开/收起
      if (permission.isGroup) {
        togglePermissionExpand(permission.id);
      }
    };

    return (
      <tr
        key={permission.id}
        style={{
          backgroundColor: permission.isGroup ? '#f8f8f8' : (isSelected ? '#e6f7ff' : 'transparent'),
          borderLeft: permission.isGroup ? '4px solid #1890ff' : depth > 0 ? '2px solid #d9d9d9' : 'none',
          cursor: permission.isGroup ? 'pointer' : 'default'
        }}
        onClick={handleRowClick}
        title={permission.isGroup ? '点击展开/收起分组' : ''}
      >
        <td style={{
          padding: '8px',
          paddingLeft: paddingLeft,
          borderBottom: '1px solid #f0f0f0',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* 所有权限都显示Checkbox，包括父权限 */}
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => {}} // 由点击事件处理
              onClick={handleCheckboxClick}
              style={{
                marginRight: '8px',
                cursor: 'pointer',
                transform: permission.isGroup ? 'scale(1.1)' : 'scale(1)'
              }}
            />

            {/* 展开/收起按钮（仅分组权限显示） */}
            {permission.isGroup && (
              <Button
                type="text"
                size="small"
                icon={isExpanded ? <IconDown /> : <IconRight />}
                onClick={(e) => {
                  e.stopPropagation();
                  togglePermissionExpand(permission.id);
                }}
                style={{
                  marginRight: '8px',
                  minWidth: '24px',
                  color: '#1890ff'
                }}
              />
            )}

            {/* 子权限的缩进线条 */}
            {!permission.isGroup && depth > 0 && (
              <div style={{
                width: '32px',
                marginRight: '8px',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  left: '16px',
                  top: '-8px',
                  bottom: '8px',
                  width: '1px',
                  backgroundColor: '#d9d9d9'
                }} />
                <div style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  width: '16px',
                  height: '1px',
                  backgroundColor: '#d9d9d9'
                }} />
              </div>
            )}

            {/* 权限名称 */}
            {permission.isGroup ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <IconFolder style={{ color: '#1890ff', marginRight: '6px' }} />
                <Text style={{
                  color: '#1890ff',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  {permission.title}
                </Text>
              </div>
            ) : (
              <Text style={{
                color: depth > 0 ? '#666' : '#333',
                fontSize: depth > 0 ? '13px' : '14px'
              }}>
                {permission.title}
              </Text>
            )}
          </div>
        </td>
        <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>
          <Tag color={permission.permissionClass === 'module' ? 'blue' :
                     permission.permissionClass === 'submodule' ? 'cyan' :
                     permission.permissionClass === 'button' ? 'green' :
                     permission.permissionClass === 'tab' ? 'orange' : 'purple'}>
            {permission.permissionClass}
          </Tag>
        </td>
        <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>
          <Text style={{
            color: depth > 0 ? '#666' : '#333',
            fontSize: depth > 0 ? '12px' : '13px'
          }}>
            {permission.permissionType}
          </Text>
        </td>
        <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>
          <Tag color={permission.permissionPoint === 'view' ? 'blue' :
                     permission.permissionPoint === 'create' ? 'green' :
                     permission.permissionPoint === 'edit' ? 'orange' :
                     permission.permissionPoint === 'delete' ? 'red' :
                     permission.permissionPoint === 'group' || permission.permissionPoint === 'subgroup' ? 'purple' : 'default'}>
            {permission.permissionPoint}
          </Tag>
        </td>
      </tr>
    );
  };

  // 渲染权限表格
  const renderPermissionTable = (permissions: PermissionItem[], isAuthorized: boolean, searchValue: string) => {
    const filteredPermissions = filterPermissions(permissions, searchValue);
    const displayPermissions = flattenPermissions(filteredPermissions);
    
    return (
             <div style={{ 
         border: `1px solid ${isAuthorized ? '#d9d9d9' : '#d9d9d9'}`,
         borderRadius: '6px',
         backgroundColor: '#fff',
         height: 'calc(100vh - 320px)',
         display: 'flex',
         flexDirection: 'column',
         overflow: 'hidden'
       }}>
        {/* 表格头部 */}
        <div style={{ 
          padding: '12px',
          borderBottom: '1px solid #f0f0f0',
          backgroundColor: '#fafafa'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
                         <Text style={{ 
               color: '#262626',
               fontSize: '16px',
               fontWeight: 'bold'
             }}>
               {isAuthorized ? '已授权权限' : '未授权权限'} ({displayPermissions.length})
             </Text>
          </div>
          
          {/* 搜索框 */}
          <Input
            placeholder={`搜索${isAuthorized ? '已授权' : '未授权'}权限...`}
            prefix={<IconSearch />}
            value={isAuthorized ? leftSearchValue : rightSearchValue}
            onChange={(value) => {
              if (isAuthorized) {
                setLeftSearchValue(value);
              } else {
                setRightSearchValue(value);
              }
            }}
            allowClear
          />
          
                     {/* 操作提示 */}
           <div style={{
             marginTop: '8px',
             fontSize: '12px',
             color: '#666',
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'flex-start'
           }}>
             <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
               <IconInfo style={{ marginRight: '4px' }} />
               权限添加规则：
             </div>
             <div style={{ marginLeft: '20px', lineHeight: '1.4' }}>
               • 点击📁展开分组，勾选权限后使用底部按钮移动<br/>
               • 选择子权限时会自动包含父权限<br/>
               • 权限不会重复添加，添加后从对侧消失
             </div>
           </div>
        </div>
        
        {/* 表格内容 */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#fafafa' }}>
                <th style={{ 
                  padding: '12px 8px',
                  textAlign: 'left',
                  borderBottom: '2px solid #e0e0e0',
                  fontWeight: 'bold'
                }}>
                  权限名
                </th>
                <th style={{ 
                  padding: '12px 8px',
                  textAlign: 'left',
                  borderBottom: '2px solid #e0e0e0',
                  fontWeight: 'bold',
                  width: '120px'
                }}>
                  权限类
                </th>
                <th style={{ 
                  padding: '12px 8px',
                  textAlign: 'left',
                  borderBottom: '2px solid #e0e0e0',
                  fontWeight: 'bold',
                  width: '150px'
                }}>
                  权限型
                </th>
                <th style={{ 
                  padding: '12px 8px',
                  textAlign: 'left',
                  borderBottom: '2px solid #e0e0e0',
                  fontWeight: 'bold',
                  width: '120px'
                }}>
                  权限点
                </th>
              </tr>
            </thead>
            <tbody>
              {displayPermissions.map((permission, index) => 
                renderPermissionRow(permission, index, isAuthorized)
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // 扁平化权限数据（包含子权限）- 用于显示
  const flattenPermissions = (permissions: PermissionItem[], depth = 0): PermissionItem[] => {
    const result: PermissionItem[] = [];

    permissions.forEach(permission => {
      // 添加当前权限项（附加深度信息）
      result.push({ ...permission, depth });

      // 如果有子权限且当前组已展开，递归添加子权限
      if (permission.children && expandedPermissions[permission.id]) {
        result.push(...flattenPermissions(permission.children, depth + 1));
      }
    });

    return result;
  };

  // 扁平化所有权限数据（不考虑展开状态）- 用于权限配置
  const flattenAllPermissions = (permissions: PermissionItem[], depth = 0): PermissionItem[] => {
    const result: PermissionItem[] = [];

    permissions.forEach(permission => {
      // 添加当前权限项（附加深度信息）
      result.push({ ...permission, depth });

      // 如果有子权限，递归添加所有子权限
      if (permission.children) {
        result.push(...flattenAllPermissions(permission.children, depth + 1));
      }
    });

    return result;
  };

  // 搜索权限
  const filterPermissions = (permissions: PermissionItem[], searchValue: string): PermissionItem[] => {
    if (!searchValue.trim()) return permissions;
    
    return permissions.filter(permission => {
      const matchesSearch = permission.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                           permission.permissionType.toLowerCase().includes(searchValue.toLowerCase()) ||
                           permission.permissionPoint.toLowerCase().includes(searchValue.toLowerCase());
      
      // 如果是分组，检查子权限是否匹配
      if (permission.isGroup && permission.children) {
        const hasMatchingChildren = permission.children.some(child =>
          child.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          child.permissionType.toLowerCase().includes(searchValue.toLowerCase()) ||
          child.permissionPoint.toLowerCase().includes(searchValue.toLowerCase())
        );
        return matchesSearch || hasMatchingChildren;
      }
      
      return matchesSearch;
    });
  };

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>


      {!isPermissionConfigMode ? (
        // 组织架构管理页面
        <Row gutter={16} style={{ height: 'calc(100vh - 140px)' }}>
          {/* 左侧组织架构树 */}
          <Col span={8}>
            <Card 
              title={
                <span style={{ color: '#1890ff' }}>
                  <IconBranch style={{ marginRight: '8px' }} />
                  组织架构
                </span>
              }
              style={{ 
                height: '100%',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderRadius: '8px'
              }}
              extra={
                <Space>
                  <Button size="small" onClick={toggleAllExpanded} type="outline">
                    {allExpanded ? '全部收起' : '全部展开'}
                  </Button>
                  <Input
                    placeholder="搜索组织"
                    prefix={<IconSearch />}
                    value={searchText}
                    onChange={setSearchText}
                    style={{ width: 150 }}
                    size="small"
                  />
                </Space>
              }
            >
              <div style={{ height: 'calc(100vh - 280px)', overflowY: 'auto' }}>
                {organizationData.map(node => renderTreeNode(node, 0))}
              </div>
            </Card>
          </Col>

          {/* 右侧内容区域 */}
          <Col span={16}>
            <Card 
              style={{ 
                height: '100%',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderRadius: '8px'
              }}
            >
              {selectedNode ? (
                <div style={{ height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                      <Title heading={4} style={{ margin: 0 }}>
                        {selectedNode.name}
                      </Title>
                      <Text type="secondary">
                        {selectedNode.type === 'group' && '集团'}
                        {selectedNode.type === 'company' && '分公司'}
                        {selectedNode.type === 'department' && '部门'}
                        {selectedNode.type === 'role' && '角色'}
                      </Text>
                    </div>
                    <Space>
                      <Button 
                        icon={<IconEdit />}
                        type="outline"
                        style={{ borderColor: '#1890ff', color: '#1890ff' }}
                        onClick={handleEdit}
                      >
                        编辑信息
                      </Button>
                      {selectedNode.type === 'role' && (
                        <Button 
                          type="primary" 
                          icon={<IconSettings />}
                          onClick={handleConfigPermission}
                          style={{ background: '#1890ff', borderColor: '#1890ff' }}
                        >
                          配置权限
                        </Button>
                      )}
                    </Space>
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <div style={{ marginBottom: '12px' }}>
                      <Text bold>中文名称: </Text>
                      <Text>{selectedNode.chineseName}</Text>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <Text bold>英文名称: </Text>
                      <Text>{selectedNode.englishName}</Text>
                    </div>
                    {(selectedNode.type === 'group' || selectedNode.type === 'company') && (
                      <div style={{ marginBottom: '12px' }}>
                        <Text bold>代码: </Text>
                        <Text>{selectedNode.code}</Text>
                      </div>
                    )}
                  </div>

                  {(selectedNode.type === 'group' || selectedNode.type === 'company') && (
                    <div style={{ marginTop: '24px' }}>
                      <Space size="medium">
                        <Button
                          type="primary"
                          icon={<IconBranch />}
                          style={{ background: '#52c41a', borderColor: '#52c41a' }}
                          onClick={() => handleCreate('company')}
                        >
                          创建分公司
                        </Button>
                        <Button
                          type="outline"
                          icon={<IconFolder />}
                          style={{ borderColor: '#fa8c16', color: '#fa8c16' }}
                          onClick={() => handleCreate('department')}
                        >
                          创建部门
                        </Button>
                      </Space>
                    </div>
                  )}

                  {selectedNode.type === 'department' && (
                    <div style={{ marginTop: '24px' }}>
                      <Space size="medium">
                        <Button
                          type="primary"
                          icon={<IconFolder />}
                          style={{ background: '#fa8c16', borderColor: '#fa8c16' }}
                          onClick={() => handleCreate('department')}
                        >
                          创建部门
                        </Button>
                        <Button
                          type="outline"
                          icon={<IconUser />}
                          style={{ borderColor: '#722ed1', color: '#722ed1' }}
                          onClick={() => handleCreate('role')}
                        >
                          创建角色
                        </Button>
                      </Space>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}>
                  <Text type="secondary" style={{ fontSize: '16px' }}>
                    请选择左侧组织架构节点
                  </Text>
                  <Text type="secondary" style={{ marginTop: '8px' }}>
                    选择不同类型的节点可以进行相应的管理操作
                  </Text>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      ) : (
        // 权限配置页面
        <div style={{ height: 'calc(100vh - 140px)' }}>
          <Card 
            style={{ 
              height: '100%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px'
            }}
            extra={
              <Space>
                <Button onClick={backToOrgStructure}>
                  返回
                </Button>
                <Button type="primary" onClick={() => {
                  // 这里可以添加实际的保存逻辑
                  setIsPermissionConfigMode(false);
                  setSelectedAuthorizedPermissions([]);
                  setSelectedUnauthorizedPermissions([]);
                }}>
                  保存配置
                </Button>
              </Space>
            }
          >
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* 权限表格区域 */}
              <div style={{ flex: 1, marginBottom: '24px' }}>
                <Row gutter={16} style={{ height: '100%' }}>
                  {/* 已授权权限 */}
                  <Col span={12}>
                    {renderPermissionTable(authorizedPermissions, true, leftSearchValue)}
                  </Col>

                  {/* 未授权权限 */}
                  <Col span={12}>
                    {renderPermissionTable(unauthorizedPermissions, false, rightSearchValue)}
                  </Col>
                </Row>
              </div>

              {/* 底部操作按钮 */}
              <div style={{ 
                padding: '20px 16px',
                borderTop: '1px solid #f0f0f0',
                backgroundColor: '#fafafa',
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                marginTop: 'auto'
              }}>
                <Button
                  type="primary"
                  icon={<IconArrowLeft />}
                  onClick={moveToAuthorized}
                  disabled={selectedUnauthorizedPermissions.length === 0}
                  style={{ minWidth: '140px' }}
                >
                  添加权限 {selectedUnauthorizedPermissions.length > 0 && `(${selectedUnauthorizedPermissions.length})`}
                </Button>
                <Button
                  type="outline"
                  icon={<IconArrowRight />}
                  onClick={moveToUnauthorized}
                  disabled={selectedAuthorizedPermissions.length === 0}
                  style={{ minWidth: '140px' }}
                >
                  移除权限 {selectedAuthorizedPermissions.length > 0 && `(${selectedAuthorizedPermissions.length})`}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 编辑信息弹窗 */}
      <Modal
        title="编辑信息"
        visible={editModalVisible}
        onOk={handleSaveEdit}
        onCancel={() => setEditModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            label="中文名称" 
            field="chineseName"
            rules={[{ required: true, message: '请输入中文名称' }]}
          >
            <Input placeholder="请输入中文名称" />
          </Form.Item>
          <Form.Item 
            label="英文名称" 
            field="englishName"
            rules={[{ required: true, message: '请输入英文名称' }]}
          >
            <Input placeholder="请输入英文名称" />
          </Form.Item>
          {(selectedNode?.type === 'group' || selectedNode?.type === 'company') && (
            <Form.Item 
              label="代码" 
              field="code"
              rules={[{ required: true, message: '请输入代码' }]}
            >
              <Input placeholder="请输入代码" />
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* 创建弹窗 */}
      <Modal
        title={`创建${createType === 'company' ? '分公司' : createType === 'department' ? '部门' : '角色'}`}
        visible={createModalVisible}
        onOk={handleSaveCreate}
        onCancel={() => setCreateModalVisible(false)}
        okText="创建"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            label="中文名称" 
            field="chineseName"
            rules={[{ required: true, message: '请输入中文名称' }]}
          >
            <Input placeholder="请输入中文名称" />
          </Form.Item>
          <Form.Item 
            label="英文名称" 
            field="englishName"
            rules={[{ required: true, message: '请输入英文名称' }]}
          >
            <Input placeholder="请输入英文名称" />
          </Form.Item>
          {createType === 'company' && (
            <Form.Item 
              label="代码" 
              field="code"
              rules={[{ required: true, message: '请输入代码' }]}
            >
              <Input placeholder="请输入代码" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default PermissionManagement;