import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Form, 
  Input, 
  Button, 
  Space, 
  Message,
  Avatar,
  Upload,
  Grid,
  Tag,
  Spin
} from '@arco-design/web-react';
import { 
  IconUser,
  IconArrowLeft,
  IconSave,
  IconCamera
} from '@arco-design/web-react/icon';

const { Title, Text } = Typography;
const { Row, Col } = Grid;

// 状态配置
const statusConfig = {
  'active': { color: 'green', text: '正常' },
  'inactive': { color: 'red', text: '禁用' },
  'pending': { color: 'orange', text: '待激活' }
};

const EditStaff: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [employeeStatus, setEmployeeStatus] = useState<'active' | 'inactive' | 'pending'>('active');

  // 加载员工数据
  useEffect(() => {
    const loadEmployeeData = async () => {
      try {
        setLoading(true);
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 模拟员工数据
        const mockEmployeeData = {
          id: id || '1',
          username: '张三',
          email: 'zhangsan@example.com',
          phone: '13800138000',
          status: 'active' as const,
          avatar: '',
          lastLogin: '2024-01-15 10:30:00',
          createTime: '2023-12-01 09:00:00'
        };

        // 设置表单数据
        form.setFieldsValue({
          username: mockEmployeeData.username,
          email: mockEmployeeData.email,
          phone: mockEmployeeData.phone
        });

        setAvatar(mockEmployeeData.avatar || '');
        setEmployeeStatus(mockEmployeeData.status);
      } catch (error) {
        console.error('加载员工数据失败:', error);
        Message.error('加载员工数据失败');
      } finally {
        setLoading(false);
      }
    };

    loadEmployeeData();
  }, [id, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validate();

      const employeeData = {
        ...values,
        avatar,
        status: employeeStatus
      };
      
      console.log('更新员工:', employeeData);
      Message.success('员工信息更新成功');
      navigate('/platformadmin/staff-management');
    } catch (error) {
      console.log('表单验证失败:', error);
    }
  };

  const handleCancel = () => {
    navigate('/platformadmin/staff-management');
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size={40} />
        <div style={{ marginTop: '16px' }}>
          <Text>加载员工数据中...</Text>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[employeeStatus];

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
          <Title heading={3} style={{ margin: 0 }}>编辑员工</Title>
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
          <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
          <Text type="secondary">
            {employeeStatus === 'active' && '员工状态正常，可以正常使用系统'}
            {employeeStatus === 'inactive' && '员工已被禁用，无法登录系统'}
                         {employeeStatus === 'pending' && '员工待激活，首次登录后，自动激活'}
          </Text>
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
                    <Button icon={<IconCamera />}>更换头像</Button>
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
    </div>
  );
};

export default EditStaff; 