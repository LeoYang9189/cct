import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Descriptions, Avatar } from '@arco-design/web-react';
import { IconArrowLeft } from '@arco-design/web-react/icon';
import { useUser } from './UserContext';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  if (!user) {
    navigate('/portal/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/portal')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <IconArrowLeft />
            <span>返回首页</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar size={80} style={{ backgroundColor: '#3B82F6' }}>
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">个人中心</h1>
              <p className="text-gray-500">管理您的个人信息</p>
            </div>
          </div>

          <Descriptions
            title="基本信息"
            data={[
              {
                label: '用户名',
                value: user.username,
              },
              {
                label: '邮箱',
                value: user.email || '未设置',
              },
              {
                label: '手机号',
                value: user.phone || '未设置',
              },
              {
                label: '用户ID',
                value: user.id,
              },
            ]}
            column={1}
            layout="inline-horizontal"
            labelStyle={{ width: '120px' }}
          />

          <div className="mt-8 flex justify-end">
            <Button type="primary">编辑信息</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage; 