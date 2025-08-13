import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Tag
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

const AddStaff: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState<string>('');
  const [employeeStatus] = useState<'active' | 'inactive' | 'pending'>('pending');

  const handleSubmit = async () => {
    try {
      const values = await form.validate();
      
      const employeeData = {
        ...values,
        avatar,
        status: employeeStatus
      };
      
      console.log('新增员工:', employeeData);
      Message.success('员工创建成功');
      navigate('/platformadmin/staff-management');
    } catch (error) {
      console.log('表单验证失败:', error);
    }
  };

  const handleCancel = () => {
    navigate('/platformadmin/staff-management');
  };

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
          <Title heading={3} style={{ margin: 0 }}>新增员工</Title>
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
          <Text style={{ fontWeight: 'bold' }}>初始状态：</Text>
          <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
          <Text type="secondary">
            新创建的员工默认为待激活状态，首次登录后自动激活
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
    </div>
  );
};

export default AddStaff; 