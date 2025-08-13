import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Form, 
  Input, 
  Select, 
  Button, 
  Space, 
  Message,
  Avatar,
  Upload,
  Grid,
  Tag,
  Divider
} from '@arco-design/web-react';
import { 
  IconUser,
  IconArrowLeft,
  IconSave,
  IconCamera,
  IconPlus,
  IconDelete
} from '@arco-design/web-react/icon';

const { Title, Text } = Typography;
const { Option } = Select;
const { Row, Col } = Grid;

// 组织架构数据接口
interface OrganizationGroup {
  id: string;
  branchId: string;
  departmentIds: string[];
  roleIds: string[];
}

// 模拟数据
const branchData = [
  { id: '1', name: '货拉拉物流科技有限公司' },
  { id: '2', name: '货拉拉华南分公司' },
  { id: '3', name: '顺丰速运集团' },
  { id: '4', name: '顺丰华东分公司' },
  { id: '5', name: '德邦物流股份有限公司' }
];

const departmentData = {
  '1': [
    { id: '1-1', name: '物流运营部' },
    { id: '1-2', name: '技术研发部' },
    { id: '1-3', name: '客户服务部' },
    { id: '1-4', name: '市场推广部' }
  ],
  '2': [
    { id: '2-1', name: '华南运营中心' },
    { id: '2-2', name: '华南客服中心' },
    { id: '2-3', name: '华南销售部' }
  ],
  '3': [
    { id: '3-1', name: '快递事业部' },
    { id: '3-2', name: '物流事业部' },
    { id: '3-3', name: '科技事业部' }
  ],
  '4': [
    { id: '4-1', name: '华东运营部' },
    { id: '4-2', name: '华东客服部' }
  ],
  '5': [
    { id: '5-1', name: '零担事业部' },
    { id: '5-2', name: '整车事业部' }
  ]
};

const roleData = {
  '1-1': [
    { id: 'role-1-1-1', name: '运营经理' },
    { id: 'role-1-1-2', name: '运营专员' },
    { id: 'role-1-1-3', name: '调度员' }
  ],
  '1-2': [
    { id: 'role-1-2-1', name: '技术总监' },
    { id: 'role-1-2-2', name: '前端工程师' },
    { id: 'role-1-2-3', name: '后端工程师' },
    { id: 'role-1-2-4', name: '产品经理' }
  ],
  '1-3': [
    { id: 'role-1-3-1', name: '客服经理' },
    { id: 'role-1-3-2', name: '客服专员' }
  ],
  '1-4': [
    { id: 'role-1-4-1', name: '市场总监' },
    { id: 'role-1-4-2', name: '市场专员' }
  ],
  '2-1': [
    { id: 'role-2-1-1', name: '区域经理' },
    { id: 'role-2-1-2', name: '运营主管' }
  ],
  '2-2': [
    { id: 'role-2-2-1', name: '客服主管' },
    { id: 'role-2-2-2', name: '在线客服' }
  ],
  '2-3': [
    { id: 'role-2-3-1', name: '销售经理' },
    { id: 'role-2-3-2', name: '销售代表' }
  ]
};

const AddEmployee: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState<string>('');
  const [organizationGroups, setOrganizationGroups] = useState<OrganizationGroup[]>([
    { id: '1', branchId: '', departmentIds: [], roleIds: [] }
  ]);

  // 获取部门选项
  const getDepartmentOptions = (branchId: string) => {
    return departmentData[branchId as keyof typeof departmentData] || [];
  };

  // 获取角色选项
  const getRoleOptions = (departmentIds: string[]) => {
    let roles: { id: string; name: string }[] = [];
    departmentIds.forEach(deptId => {
      const deptRoles = roleData[deptId as keyof typeof roleData] || [];
      roles = [...roles, ...deptRoles];
    });
    return roles;
  };

  // 添加组织架构组
  const addOrganizationGroup = () => {
    const newGroup: OrganizationGroup = {
      id: Date.now().toString(),
      branchId: '',
      departmentIds: [],
      roleIds: []
    };
    setOrganizationGroups([...organizationGroups, newGroup]);
  };

  // 删除组织架构组
  const removeOrganizationGroup = (groupId: string) => {
    if (organizationGroups.length <= 1) {
      Message.warning('至少需要保留一个组织架构');
      return;
    }
    setOrganizationGroups(organizationGroups.filter(group => group.id !== groupId));
  };

  // 更新组织架构组
  const updateOrganizationGroup = (groupId: string, updates: Partial<OrganizationGroup>) => {
    setOrganizationGroups(groups => 
      groups.map(group => 
        group.id === groupId ? { ...group, ...updates } : group
      )
    );
  };

  // 分公司变化处理
  const handleBranchChange = (groupId: string, branchId: string) => {
    updateOrganizationGroup(groupId, {
      branchId,
      departmentIds: [], // 清空部门选择
      roleIds: [] // 清空角色选择
    });
  };

  // 部门变化处理
  const handleDepartmentChange = (groupId: string, departmentIds: string[]) => {
    updateOrganizationGroup(groupId, {
      departmentIds,
      roleIds: [] // 清空角色选择
    });
  };

  // 角色变化处理
  const handleRoleChange = (groupId: string, roleIds: string[]) => {
    updateOrganizationGroup(groupId, { roleIds });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validate();
      
      // 验证组织架构
      const hasValidOrganization = organizationGroups.some(group => 
        group.branchId && group.departmentIds.length > 0
      );
      
      if (!hasValidOrganization) {
        Message.error('请至少选择一个完整的组织架构（分公司和部门）');
        return;
      }

      const employeeData = {
        ...values,
        avatar,
        organizationGroups,
        status: 'pending' // 新员工默认为待激活状态
      };
      
      console.log('添加员工:', employeeData);
      Message.success('员工添加成功');
      navigate('/controltower/employee-management');
    } catch (error) {
      console.log('表单验证失败:', error);
    }
  };

  const handleCancel = () => {
    navigate('/controltower/employee-management');
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button 
            icon={<IconArrowLeft />} 
            onClick={handleCancel}
            size="large"
          />
          <Title heading={3} style={{ margin: 0 }}>添加员工</Title>
        </div>
        <Space>
          <Button size="large" onClick={handleCancel}>
            取消
          </Button>
          <Button 
            type="primary" 
            size="large" 
            icon={<IconSave />}
            onClick={handleSubmit}
          >
            保存
          </Button>
        </Space>
      </div>

      {/* 状态展示 */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Text style={{ fontWeight: 'bold' }}>当前状态：</Text>
          <Tag color="orange">待激活</Tag>
          <Text type="secondary">新员工创建后默认为待激活状态，首次登录后，自动激活</Text>
        </div>
      </Card>

      {/* 基本信息 */}
      <Card title="基本信息" style={{ marginBottom: '24px' }}>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item label="员工头像">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <Avatar size={80} style={{ backgroundColor: '#165DFF' }}>
                    {avatar ? <img src={avatar} alt="avatar" /> : <IconUser />}
                  </Avatar>
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    onChange={(fileList) => {
                      if (fileList && fileList.length > 0) {
                        const file = fileList[0].originFile;
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setAvatar(e.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }
                    }}
                  >
                    <Button icon={<IconCamera />}>上传头像</Button>
                  </Upload>
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="用户名"
                field="username"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { minLength: 2, message: '用户名至少2个字符' }
                ]}
              >
                <Input placeholder="请输入用户名" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="邮箱"
                field="email"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input placeholder="请输入邮箱" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="手机号"
                field="phone"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { 
                    validator: (value, callback) => {
                      if (value && !/^1[3-9]\d{9}$/.test(value)) {
                        callback('请输入有效的手机号');
                      } else {
                        callback();
                      }
                    }
                  }
                ]}
              >
                <Input placeholder="请输入手机号" size="large" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 组织架构 */}
      <Card 
        title="组织架构" 
        extra={
          <Button 
            type="primary" 
            icon={<IconPlus />} 
            onClick={addOrganizationGroup}
          >
            添加组织架构
          </Button>
        }
      >
        {organizationGroups.map((group, index) => (
          <div key={group.id} style={{ marginBottom: '24px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginBottom: '16px' 
            }}>
              <Text style={{ fontWeight: 'bold' }}>组织架构 {index + 1}</Text>
              {organizationGroups.length > 1 && (
                <Button 
                  type="text" 
                  status="danger"
                  icon={<IconDelete />}
                  onClick={() => removeOrganizationGroup(group.id)}
                >
                  删除
                </Button>
              )}
            </div>

            <Row gutter={16}>
              <Col span={8}>
                <div style={{ marginBottom: '8px' }}>
                  <Text>分公司 <Text style={{ color: '#f53f3f' }}>*</Text></Text>
                </div>
                <Select
                  placeholder="选择分公司"
                  value={group.branchId}
                  onChange={(value) => handleBranchChange(group.id, value)}
                  style={{ width: '100%' }}
                  size="large"
                >
                  {branchData.map(branch => (
                    <Option key={branch.id} value={branch.id}>
                      {branch.name}
                    </Option>
                  ))}
                </Select>
              </Col>

              <Col span={8}>
                <div style={{ marginBottom: '8px' }}>
                  <Text>部门 <Text style={{ color: '#f53f3f' }}>*</Text></Text>
                </div>
                <Select
                  mode="multiple"
                  placeholder="选择部门"
                  value={group.departmentIds}
                  onChange={(value) => handleDepartmentChange(group.id, value)}
                  style={{ width: '100%' }}
                  size="large"
                  disabled={!group.branchId}
                  maxTagCount={2}
                >
                  {getDepartmentOptions(group.branchId).map(dept => (
                    <Option key={dept.id} value={dept.id}>
                      {dept.name}
                    </Option>
                  ))}
                </Select>
              </Col>

              <Col span={8}>
                <div style={{ marginBottom: '8px' }}>
                  <Text>角色</Text>
                </div>
                <Select
                  mode="multiple"
                  placeholder="选择角色"
                  value={group.roleIds}
                  onChange={(value) => handleRoleChange(group.id, value)}
                  style={{ width: '100%' }}
                  size="large"
                  disabled={group.departmentIds.length === 0}
                  maxTagCount={2}
                >
                  {getRoleOptions(group.departmentIds).map(role => (
                    <Option key={role.id} value={role.id}>
                      {role.name}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>

            {index < organizationGroups.length - 1 && (
              <Divider style={{ margin: '24px 0' }} />
            )}
          </div>
        ))}
      </Card>
    </div>
  );
};

export default AddEmployee; 