import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Tree, 
  Button, 
  Space, 
  Grid,
  Message,
  Input,
  Pagination
} from '@arco-design/web-react';
import { IconArrowRight, IconArrowLeft } from '@arco-design/web-react/icon';

/**
 * 权限项接口定义
 */
interface PermissionItem {
  id: string;
  title: string;
  children?: PermissionItem[];
}

/**
 * 树形数据节点接口
 */
interface TreeNode {
  key: string;
  title: string;
  children?: TreeNode[];
  isLeaf: boolean;
}



/**
 * 角色权限配置组件
 * 用于配置特定角色的权限设置
 */
const RolePermissionConfig: React.FC = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  
  // 解构 Grid 组件
  const { Row, Col } = Grid;

  // 状态管理
  const [authorizedPermissions, setAuthorizedPermissions] = useState<string[]>([]);
  const [unauthorizedPermissions, setUnauthorizedPermissions] = useState<string[]>([]);
  const [selectedAuthorized, setSelectedAuthorized] = useState<string[]>([]);
  const [selectedUnauthorized, setSelectedUnauthorized] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 搜索状态
  const [authorizedSearchText, setAuthorizedSearchText] = useState<string>('');
  const [unauthorizedSearchText, setUnauthorizedSearchText] = useState<string>('');

  // 分页状态
  const [authorizedCurrentPage, setAuthorizedCurrentPage] = useState<number>(1);
  const [unauthorizedCurrentPage, setUnauthorizedCurrentPage] = useState<number>(1);
  const pageSize = 10; // 每页显示数量

  /**
   * 模拟权限数据
   */
  const permissionData: PermissionItem[] = useMemo(() => [
    {
      id: 'customer',
      title: '客户管理',
      children: [
        { id: 'customer-list', title: '客户列表' },
        { id: 'customer-add', title: '新增客户' },
        { id: 'customer-edit', title: '编辑客户' },
        { id: 'customer-delete', title: '删除客户' },
      ],
    },
    {
      id: 'order',
      title: '订单管理',
      children: [
        { id: 'order-list', title: '订单列表' },
        { id: 'order-add', title: '新增订单' },
        { id: 'order-edit', title: '编辑订单' },
        { id: 'order-delete', title: '删除订单' },
        { id: 'order-export', title: '导出订单' },
      ],
    },
    {
      id: 'freight',
      title: '运价管理',
      children: [
        { id: 'freight-list', title: '运价列表' },
        { id: 'freight-add', title: '新增运价' },
        { id: 'freight-edit', title: '编辑运价' },
        { id: 'freight-delete', title: '删除运价' },
      ],
    },
    {
      id: 'user',
      title: '用户管理',
      children: [
        { id: 'user-list', title: '用户列表' },
        { id: 'user-add', title: '新增用户' },
        { id: 'user-edit', title: '编辑用户' },
        { id: 'user-delete', title: '删除用户' },
        { id: 'user-role', title: '角色分配' },
      ],
    },
    {
      id: 'company',
      title: '企业管理',
      children: [
        { id: 'company-list', title: '企业列表' },
        { id: 'company-add', title: '新增企业' },
        { id: 'company-edit', title: '编辑企业' },
        { id: 'company-delete', title: '删除企业' },
      ],
    },
    {
      id: 'basic',
      title: '基础资料管理',
      children: [
        { id: 'basic-port', title: '港口管理' },
        { id: 'basic-container', title: '箱型管理' },
        { id: 'basic-currency', title: '币种管理' },
        { id: 'basic-unit', title: '单位管理' },
      ],
    },
  ], []);

  /**
   * 获取所有权限ID的扁平化数组
   */
  const getAllPermissionIds = useCallback((permissions: PermissionItem[]): string[] => {
    const ids: string[] = [];
    
    const traverse = (items: PermissionItem[]) => {
      items.forEach(item => {
        ids.push(item.id);
        if (item.children) {
          traverse(item.children);
        }
      });
    };
    
    traverse(permissions);
    return ids;
  }, []);

  /**
   * 根据角色类型初始化默认权限
   */
  const initializePermissions = useCallback(() => {
    const allIds = getAllPermissionIds(permissionData);
    
    if (!roleId) {
      setUnauthorizedPermissions(allIds);
      return;
    }

    // 根据角色ID模拟不同的默认权限
    switch (roleId) {
      case '1': // 管理员
        setAuthorizedPermissions(['customer', 'customer-list', 'customer-add', 'order', 'order-list']);
        setUnauthorizedPermissions(allIds.filter(id => 
          !['customer', 'customer-list', 'customer-add', 'order', 'order-list'].includes(id)
        ));
        break;
      case '2': // 操作员
        setAuthorizedPermissions(['order', 'order-list', 'order-add']);
        setUnauthorizedPermissions(allIds.filter(id => 
          !['order', 'order-list', 'order-add'].includes(id)
        ));
        break;
      default:
        setUnauthorizedPermissions(allIds);
        setAuthorizedPermissions([]);
    }
  }, [roleId, permissionData, getAllPermissionIds]);

  /**
   * 组件初始化
   */
  useEffect(() => {
    initializePermissions();
  }, [initializePermissions]);

  /**
   * 将权限数据转换为Tree组件需要的格式
   */
  const convertToTreeData = useCallback((permissions: PermissionItem[]): TreeNode[] => {
    return permissions.map(permission => ({
      key: permission.id,
      title: permission.title,
      children: permission.children ? convertToTreeData(permission.children) : undefined,
      isLeaf: !permission.children || permission.children.length === 0,
    }));
  }, []);

  /**
   * 根据搜索文本过滤权限数据
   */
  const filterPermissionsBySearch = useCallback((permissions: PermissionItem[], searchText: string): PermissionItem[] => {
    if (!searchText.trim()) {
      return permissions;
    }
    
    const filterRecursive = (items: PermissionItem[]): PermissionItem[] => {
      return items.reduce((acc: PermissionItem[], item) => {
        const titleMatch = item.title.toLowerCase().includes(searchText.toLowerCase());
        const filteredChildren = item.children ? filterRecursive(item.children) : [];
        
        if (titleMatch || filteredChildren.length > 0) {
          acc.push({
            ...item,
            children: filteredChildren.length > 0 ? filteredChildren : item.children,
          });
        }
        
        return acc;
      }, []);
    };
    
    return filterRecursive(permissions);
  }, []);

  /**
   * 根据分页参数获取当前页数据
   */
  const getPaginatedPermissions = useCallback((permissions: PermissionItem[], currentPage: number, pageSize: number): PermissionItem[] => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return permissions.slice(startIndex, endIndex);
  }, []);

  /**
   * 获取已授权权限的树形数据（包含搜索和分页）
   */
  const authorizedTreeData = useMemo((): TreeNode[] => {
    const authorizedItems = permissionData.filter(p => 
      authorizedPermissions.includes(p.id) || 
      (p.children && p.children.some(child => authorizedPermissions.includes(child.id)))
    ).map(p => ({
      ...p,
      children: p.children?.filter(child => authorizedPermissions.includes(child.id)),
    }));
    
    const filteredData = filterPermissionsBySearch(authorizedItems, authorizedSearchText);
    const paginatedData = getPaginatedPermissions(filteredData, authorizedCurrentPage, pageSize);
    return convertToTreeData(paginatedData);
  }, [authorizedPermissions, permissionData, convertToTreeData, authorizedSearchText, authorizedCurrentPage, pageSize, filterPermissionsBySearch, getPaginatedPermissions]);

  /**
   * 获取未授权权限的树形数据（包含搜索和分页）
   */
  const unauthorizedTreeData = useMemo((): TreeNode[] => {
    const unauthorizedItems = permissionData.filter(p => 
      unauthorizedPermissions.includes(p.id) || 
      (p.children && p.children.some(child => unauthorizedPermissions.includes(child.id)))
    ).map(p => ({
      ...p,
      children: p.children?.filter(child => unauthorizedPermissions.includes(child.id)),
    }));
    
    const filteredData = filterPermissionsBySearch(unauthorizedItems, unauthorizedSearchText);
    const paginatedData = getPaginatedPermissions(filteredData, unauthorizedCurrentPage, pageSize);
    return convertToTreeData(paginatedData);
  }, [unauthorizedPermissions, permissionData, convertToTreeData, unauthorizedSearchText, unauthorizedCurrentPage, pageSize, filterPermissionsBySearch, getPaginatedPermissions]);

  /**
   * 获取已授权权限的总数（用于分页）
   */
  const authorizedTotalCount = useMemo(() => {
    const authorizedItems = permissionData.filter(p => 
      authorizedPermissions.includes(p.id) || 
      (p.children && p.children.some(child => authorizedPermissions.includes(child.id)))
    ).map(p => ({
      ...p,
      children: p.children?.filter(child => authorizedPermissions.includes(child.id)),
    }));
    return filterPermissionsBySearch(authorizedItems, authorizedSearchText).length;
  }, [authorizedPermissions, permissionData, authorizedSearchText, filterPermissionsBySearch]);

  /**
   * 获取未授权权限的总数（用于分页）
   */
  const unauthorizedTotalCount = useMemo(() => {
    const unauthorizedItems = permissionData.filter(p => 
      unauthorizedPermissions.includes(p.id) || 
      (p.children && p.children.some(child => unauthorizedPermissions.includes(child.id)))
    ).map(p => ({
      ...p,
      children: p.children?.filter(child => unauthorizedPermissions.includes(child.id)),
    }));
    return filterPermissionsBySearch(unauthorizedItems, unauthorizedSearchText).length;
  }, [unauthorizedPermissions, permissionData, unauthorizedSearchText, filterPermissionsBySearch]);

  /**
   * 默认展开的节点keys
   */
  const defaultExpandedKeys = useMemo(() => {
    return permissionData.map(p => p.id);
  }, [permissionData]);

  /**
   * 已授权权限选择回调
   */
  const handleAuthorizedCheck = useCallback((checkedKeys: string[] | { checked: string[]; halfChecked: string[] }) => {
    const keys = Array.isArray(checkedKeys) ? checkedKeys : checkedKeys.checked;
    setSelectedAuthorized(keys);
  }, []);

  /**
   * 未授权权限选择回调
   */
  const handleUnauthorizedCheck = useCallback((checkedKeys: string[] | { checked: string[]; halfChecked: string[] }) => {
    const keys = Array.isArray(checkedKeys) ? checkedKeys : checkedKeys.checked;
    setSelectedUnauthorized(keys);
  }, []);

  /**
   * 将选中的权限移动到已授权
   */
  const moveToAuthorized = useCallback(() => {
    if (selectedUnauthorized.length === 0) {
      Message.warning('请先选择要授权的权限');
      return;
    }

    setAuthorizedPermissions(prev => [...prev, ...selectedUnauthorized]);
    setUnauthorizedPermissions(prev => prev.filter(id => !selectedUnauthorized.includes(id)));
    setSelectedUnauthorized([]);
    Message.success(`已授权 ${selectedUnauthorized.length} 个权限`);
  }, [selectedUnauthorized]);

  /**
   * 将选中的权限移动到未授权
   */
  const moveToUnauthorized = useCallback(() => {
    if (selectedAuthorized.length === 0) {
      Message.warning('请先选择要取消授权的权限');
      return;
    }

    setUnauthorizedPermissions(prev => [...prev, ...selectedAuthorized]);
    setAuthorizedPermissions(prev => prev.filter(id => !selectedAuthorized.includes(id)));
    setSelectedAuthorized([]);
    Message.success(`已取消授权 ${selectedAuthorized.length} 个权限`);
  }, [selectedAuthorized]);

  /**
   * 保存权限配置
   */
  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Message.success('权限配置保存成功');
      navigate('/controltower/role-permission-management');
    } catch {
      Message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  /**
   * 取消操作
   */
  const handleCancel = useCallback(() => {
    navigate('/controltower/role-permission-management');
  }, [navigate]);

  /**
   * 处理已授权权限搜索框变化
   */
  const handleAuthorizedSearchChange = (value: string) => {
    setAuthorizedSearchText(value);
    setAuthorizedCurrentPage(1); // 重置到第一页
  };

  /**
   * 处理未授权权限搜索框变化
   */
  const handleUnauthorizedSearchChange = (value: string) => {
    setUnauthorizedSearchText(value);
    setUnauthorizedCurrentPage(1); // 重置到第一页
  };

  /**
   * 处理已授权权限分页变化
   */
  const handleAuthorizedPageChange = (page: number) => {
    setAuthorizedCurrentPage(page);
  };

  /**
   * 处理未授权权限分页变化
   */
  const handleUnauthorizedPageChange = (page: number) => {
    setUnauthorizedCurrentPage(page);
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 权限配置区域 */}
      <Card>
        <Row gutter={24}>
          {/* 未授权权限 */}
          <Col span={10}>
            <Card 
              title="可选权限" 
              size="small"
              style={{ height: '500px' }}
              bodyStyle={{ padding: '12px', display: 'flex', flexDirection: 'column', height: '440px' }}
            >
              <Input.Search
                placeholder="搜索权限名称"
                value={unauthorizedSearchText}
                onChange={handleUnauthorizedSearchChange}
                style={{ marginBottom: '12px', flexShrink: 0 }}
                allowClear
              />
              <div style={{ flex: 1, overflow: 'hidden', marginBottom: '12px' }}>
                <Tree
                  checkable
                  defaultExpandedKeys={defaultExpandedKeys}
                  checkedKeys={selectedUnauthorized}
                  onCheck={handleUnauthorizedCheck}
                  treeData={unauthorizedTreeData}
                  height={320}
                  style={{ height: '100%' }}
                />
              </div>
              <Pagination
                current={unauthorizedCurrentPage}
                total={unauthorizedTotalCount}
                pageSize={pageSize}
                onChange={handleUnauthorizedPageChange}
                showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
                size="small"
                style={{ textAlign: 'center', flexShrink: 0 }}
              />
            </Card>
          </Col>

          {/* 操作按钮 */}
          <Col span={4} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Space direction="vertical" size="large">
              <Button
                type="primary"
                icon={<IconArrowRight />}
                onClick={moveToAuthorized}
                disabled={selectedUnauthorized.length === 0}
                style={{ width: '120px' }}
              >
                授权
              </Button>
              <Button
                icon={<IconArrowLeft />}
                onClick={moveToUnauthorized}
                disabled={selectedAuthorized.length === 0}
                style={{ width: '120px' }}
              >
                取消授权
              </Button>
            </Space>
          </Col>

          {/* 已授权权限 */}
          <Col span={10}>
            <Card 
              title="已授权权限" 
              size="small"
              style={{ height: '500px' }}
              bodyStyle={{ padding: '12px', display: 'flex', flexDirection: 'column', height: '440px' }}
            >
              <Input.Search
                placeholder="搜索权限名称"
                value={authorizedSearchText}
                onChange={handleAuthorizedSearchChange}
                style={{ marginBottom: '12px', flexShrink: 0 }}
                allowClear
              />
              <div style={{ flex: 1, overflow: 'hidden', marginBottom: '12px' }}>
                <Tree
                  checkable
                  defaultExpandedKeys={defaultExpandedKeys}
                  checkedKeys={selectedAuthorized}
                  onCheck={handleAuthorizedCheck}
                  treeData={authorizedTreeData}
                  height={320}
                  style={{ height: '100%' }}
                />
              </div>
              <Pagination
                current={authorizedCurrentPage}
                total={authorizedTotalCount}
                pageSize={pageSize}
                onChange={handleAuthorizedPageChange}
                showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
                size="small"
                style={{ textAlign: 'center', flexShrink: 0 }}
              />
            </Card>
          </Col>
        </Row>

        {/* 底部操作按钮 */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Space size="large">
            <Button onClick={handleCancel} size="large">
              取消
            </Button>
            <Button 
              type="primary" 
              onClick={handleSave} 
              loading={loading}
              size="large"
            >
              保存
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default RolePermissionConfig;