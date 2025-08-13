import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Empty } from '@arco-design/web-react';
import { IconArrowLeft, IconSettings } from '@arco-design/web-react/icon';
import { useUser } from './UserContext';

const CompanyPage: React.FC = () => {
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
            <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center">
              <IconSettings className="text-3xl text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">企业信息</h1>
              <p className="text-gray-500">管理您的企业资料</p>
            </div>
          </div>

          <div className="mb-8">
            <Empty
              icon={<IconSettings className="text-4xl text-gray-300" />}
              description={
                <div className="text-center">
                  <p className="text-gray-500 mb-2">您还没有设置企业信息</p>
                  <p className="text-sm text-gray-400">完善企业信息，享受更多专业服务</p>
                </div>
              }
            />
          </div>

          <div className="text-center">
            <Button type="primary" size="large">
              设置企业信息
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CompanyPage; 