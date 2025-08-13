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
 * 公司信息接口定义
 */
interface CompanyItem {
  id: string;
  title: string;
  children?: CompanyItem[];
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
 * 角色客商配置组件
 * 用于配置特定角色可以访问的公司列表
 */
const RoleCustomerConfig: React.FC = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  
  // 解构 Grid 组件
  const { Row, Col } = Grid;

  // 状态管理
  const [authorizedCompanies, setAuthorizedCompanies] = useState<string[]>([]);
  const [unauthorizedCompanies, setUnauthorizedCompanies] = useState<string[]>([]);
  const [selectedAuthorized, setSelectedAuthorized] = useState<string[]>([]);
  const [selectedUnauthorized, setSelectedUnauthorized] = useState<string[]>([]);

  // 搜索状态
  const [authorizedSearchText, setAuthorizedSearchText] = useState<string>('');
  const [unauthorizedSearchText, setUnauthorizedSearchText] = useState<string>('');

  // 分页状态
  const [authorizedCurrentPage, setAuthorizedCurrentPage] = useState<number>(1);
  const [unauthorizedCurrentPage, setUnauthorizedCurrentPage] = useState<number>(1);
  const pageSize = 10; // 每页显示数量
  const [loading, setLoading] = useState(false);

  /**
   * 模拟公司数据（扁平结构）
   */
  const companyData: CompanyItem[] = useMemo(() => [
    { id: 'shanghai', title: '上海分公司' },
    { id: 'hangzhou', title: '杭州分公司' },
    { id: 'nanjing', title: '南京分公司' },
    { id: 'suzhou', title: '苏州分公司' },
    { id: 'guangzhou', title: '广州分公司' },
    { id: 'shenzhen', title: '深圳分公司' },
    { id: 'dongguan', title: '东莞分公司' },
    { id: 'foshan', title: '佛山分公司' },
    { id: 'beijing', title: '北京分公司' },
    { id: 'tianjin', title: '天津分公司' },
    { id: 'shijiazhuang', title: '石家庄分公司' },
    { id: 'taiyuan', title: '太原分公司' },
    { id: 'wuhan', title: '武汉分公司' },
    { id: 'changsha', title: '长沙分公司' },
    { id: 'zhengzhou', title: '郑州分公司' },
    { id: 'nanchang', title: '南昌分公司' },
    { id: 'chengdu', title: '成都分公司' },
    { id: 'chongqing', title: '重庆分公司' },
    { id: 'kunming', title: '昆明分公司' },
    { id: 'guiyang', title: '贵阳分公司' },
    { id: 'xian', title: '西安分公司' },
    { id: 'lanzhou', title: '兰州分公司' },
    { id: 'yinchuan', title: '银川分公司' },
    { id: 'urumqi', title: '乌鲁木齐分公司' },
    { id: 'shenyang', title: '沈阳分公司' },
    { id: 'dalian', title: '大连分公司' },
    { id: 'harbin', title: '哈尔滨分公司' },
    { id: 'changchun', title: '长春分公司' },
  ], []);

  /**
   * 获取所有公司ID（扁平化）
   */
  const getAllCompanyIds = useCallback((companies: CompanyItem[]): string[] => {
    return companies.map(company => company.id);
  }, []);

  /**
   * 根据角色类型初始化默认公司权限
   */
  const initializeCompanies = useCallback(() => {
    const allIds = getAllCompanyIds(companyData);
    
    if (!roleId) {
      setUnauthorizedCompanies(allIds);
      return;
    }

    // 根据角色ID模拟不同的默认权限
    switch (roleId) {
      case '1': // 管理员
        setAuthorizedCompanies(['shanghai', 'hangzhou', 'nanjing', 'suzhou', 'guangzhou', 'shenzhen']);
        setUnauthorizedCompanies(allIds.filter(id => 
          !['shanghai', 'hangzhou', 'nanjing', 'suzhou', 'guangzhou', 'shenzhen'].includes(id)
        ));
        break;
      case '2': // 操作员
        setAuthorizedCompanies(['beijing', 'tianjin', 'wuhan', 'changsha', 'chengdu']);
        setUnauthorizedCompanies(allIds.filter(id => 
          !['beijing', 'tianjin', 'wuhan', 'changsha', 'chengdu'].includes(id)
        ));
        break;
      case '3': // 普通用户
        setAuthorizedCompanies(['dongguan', 'foshan', 'zhengzhou']);
        setUnauthorizedCompanies(allIds.filter(id => 
          !['dongguan', 'foshan', 'zhengzhou'].includes(id)
        ));
        break;
      default:
        setUnauthorizedCompanies(allIds);
        setAuthorizedCompanies([]);
    }
  }, [roleId, companyData, getAllCompanyIds]);

  /**
   * 组件初始化
   */
  useEffect(() => {
    initializeCompanies();
  }, [initializeCompanies]);

  /**
   * 将公司数据转换为Tree组件需要的格式
   */
  const convertToTreeData = useCallback((companies: CompanyItem[]): TreeNode[] => {
    return companies.map(company => ({
      key: company.id,
      title: company.title,
      isLeaf: true,
    }));
  }, []);

  /**
   * 根据搜索文本过滤公司数据
   */
  const filterCompaniesBySearch = useCallback((companies: CompanyItem[], searchText: string): CompanyItem[] => {
    if (!searchText.trim()) {
      return companies;
    }
    return companies.filter(company => 
      company.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }, []);

  /**
   * 根据分页参数获取当前页数据
   */
  const getPaginatedData = useCallback((data: CompanyItem[], currentPage: number, pageSize: number): CompanyItem[] => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, []);

  /**
   * 获取已授权公司的树形数据（包含搜索和分页）
   */
  const authorizedTreeData = useMemo((): TreeNode[] => {
    const authorizedCompaniesData = companyData.filter(company => 
      authorizedCompanies.includes(company.id)
    );
    const filteredData = filterCompaniesBySearch(authorizedCompaniesData, authorizedSearchText);
    const paginatedData = getPaginatedData(filteredData, authorizedCurrentPage, pageSize);
    return convertToTreeData(paginatedData);
  }, [authorizedCompanies, companyData, convertToTreeData, authorizedSearchText, authorizedCurrentPage, pageSize, filterCompaniesBySearch, getPaginatedData]);

  /**
   * 获取未授权公司的树形数据（包含搜索和分页）
   */
  const unauthorizedTreeData = useMemo((): TreeNode[] => {
    const unauthorizedCompaniesData = companyData.filter(company => 
      unauthorizedCompanies.includes(company.id)
    );
    const filteredData = filterCompaniesBySearch(unauthorizedCompaniesData, unauthorizedSearchText);
    const paginatedData = getPaginatedData(filteredData, unauthorizedCurrentPage, pageSize);
    return convertToTreeData(paginatedData);
  }, [unauthorizedCompanies, companyData, convertToTreeData, unauthorizedSearchText, unauthorizedCurrentPage, pageSize, filterCompaniesBySearch, getPaginatedData]);

  /**
   * 获取已授权公司的总数（用于分页）
   */
  const authorizedTotalCount = useMemo(() => {
    const authorizedCompaniesData = companyData.filter(company => 
      authorizedCompanies.includes(company.id)
    );
    return filterCompaniesBySearch(authorizedCompaniesData, authorizedSearchText).length;
  }, [authorizedCompanies, companyData, authorizedSearchText, filterCompaniesBySearch]);

  /**
   * 获取未授权公司的总数（用于分页）
   */
  const unauthorizedTotalCount = useMemo(() => {
    const unauthorizedCompaniesData = companyData.filter(company => 
      unauthorizedCompanies.includes(company.id)
    );
    return filterCompaniesBySearch(unauthorizedCompaniesData, unauthorizedSearchText).length;
  }, [unauthorizedCompanies, companyData, unauthorizedSearchText, filterCompaniesBySearch]);



  /**
   * 已授权公司选择回调
   */
  const handleAuthorizedCheck = useCallback((checkedKeys: string[] | { checked: string[]; halfChecked: string[] }) => {
    const keys = Array.isArray(checkedKeys) ? checkedKeys : checkedKeys.checked;
    setSelectedAuthorized(keys);
  }, []);

  /**
   * 未授权公司选择回调
   */
  const handleUnauthorizedCheck = useCallback((checkedKeys: string[] | { checked: string[]; halfChecked: string[] }) => {
    const keys = Array.isArray(checkedKeys) ? checkedKeys : checkedKeys.checked;
    setSelectedUnauthorized(keys);
  }, []);

  /**
   * 将选中的公司移动到已授权
   */
  const moveToAuthorized = useCallback(() => {
    if (selectedUnauthorized.length === 0) {
      Message.warning('请先选择要授权的公司');
      return;
    }

    setAuthorizedCompanies(prev => [...prev, ...selectedUnauthorized]);
    setUnauthorizedCompanies(prev => prev.filter(id => !selectedUnauthorized.includes(id)));
    setSelectedUnauthorized([]);
    Message.success(`已授权 ${selectedUnauthorized.length} 个公司`);
  }, [selectedUnauthorized]);

  /**
   * 将选中的公司移动到未授权
   */
  const moveToUnauthorized = useCallback(() => {
    if (selectedAuthorized.length === 0) {
      Message.warning('请先选择要取消授权的公司');
      return;
    }

    setUnauthorizedCompanies(prev => [...prev, ...selectedAuthorized]);
    setAuthorizedCompanies(prev => prev.filter(id => !selectedAuthorized.includes(id)));
    setSelectedAuthorized([]);
    Message.success(`已取消授权 ${selectedAuthorized.length} 个公司`);
  }, [selectedAuthorized]);

  /**
   * 保存公司配置
   */
  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Message.success('公司配置保存成功');
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
   * 处理已授权公司搜索框变化
   */
  const handleAuthorizedSearchChange = (value: string) => {
    setAuthorizedSearchText(value);
    setAuthorizedCurrentPage(1); // 搜索时重置到第一页
  };

  /**
   * 处理未授权公司搜索框变化
   */
  const handleUnauthorizedSearchChange = (value: string) => {
    setUnauthorizedSearchText(value);
    setUnauthorizedCurrentPage(1); // 搜索时重置到第一页
  };

  /**
   * 处理已授权公司分页变化
   */
  const handleAuthorizedPageChange = (page: number) => {
    setAuthorizedCurrentPage(page);
  };

  /**
   * 处理未授权公司分页变化
   */
  const handleUnauthorizedPageChange = (page: number) => {
    setUnauthorizedCurrentPage(page);
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 公司配置区域 */}
      <Card>
        <Row gutter={24}>
          {/* 未授权公司 */}
          <Col span={10}>
            <Card 
              title="可选公司" 
              style={{ height: '500px' }}
              bodyStyle={{ padding: '12px', display: 'flex', flexDirection: 'column', height: '440px' }}
            >
              {/* 搜索框 */}
              <Input.Search
                placeholder="搜索公司名称"
                value={unauthorizedSearchText}
                onChange={handleUnauthorizedSearchChange}
                style={{ marginBottom: '12px', flexShrink: 0 }}
                allowClear
              />
              
              {/* Tree组件容器 */}
              <div style={{ flex: 1, overflow: 'hidden', marginBottom: '12px' }}>
                <Tree
                  treeData={unauthorizedTreeData}
                  checkable
                  checkedKeys={selectedUnauthorized}
                  onCheck={handleUnauthorizedCheck}
                  height={320}
                  style={{ height: '100%' }}
                />
              </div>
              
              {/* 分页器 */}
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

          {/* 已授权公司 */}
          <Col span={10}>
            <Card 
              title="已授权公司" 
              style={{ height: '500px' }}
              bodyStyle={{ padding: '12px', display: 'flex', flexDirection: 'column', height: '440px' }}
            >
              {/* 搜索框 */}
              <Input.Search
                placeholder="搜索公司名称"
                value={authorizedSearchText}
                onChange={handleAuthorizedSearchChange}
                style={{ marginBottom: '12px', flexShrink: 0 }}
                allowClear
              />
              
              {/* Tree组件容器 */}
              <div style={{ flex: 1, overflow: 'hidden', marginBottom: '12px' }}>
                <Tree
                  checkable
                  checkedKeys={selectedAuthorized}
                  onCheck={handleAuthorizedCheck}
                  treeData={authorizedTreeData}
                  height={320}
                  style={{ height: '100%' }}
                />
              </div>
              
              {/* 分页器 */}
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

export default RoleCustomerConfig;