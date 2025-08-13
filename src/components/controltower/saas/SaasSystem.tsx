import React from 'react';
import { Button, Typography, Breadcrumb } from '@arco-design/web-react';
import {
  IconFile,
  IconMessage,
  IconUser,
  IconNav
} from '@arco-design/web-react/icon';
import ControlTowerSaasLayout from './ControlTowerSaasLayout';
import '@arco-design/web-react/dist/css/arco.css';

const { Title } = Typography;

const SaasSystem: React.FC = () => {
  return (
    <ControlTowerSaasLayout menuSelectedKey="1" breadcrumb={
      <Breadcrumb>
        <Breadcrumb.Item>首页</Breadcrumb.Item>
        <Breadcrumb.Item>控制台</Breadcrumb.Item>
      </Breadcrumb>
    }>
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <Title heading={4}>欢迎使用Walltech超级运价系统</Title>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-500 text-sm">待处理询价</div>
                <div className="mt-2 text-2xl font-bold">26</div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <IconNav className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="p-6 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-500 text-sm">本月新增客户</div>
                <div className="mt-2 text-2xl font-bold">128</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <IconUser className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="p-6 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-500 text-sm">运价更新</div>
                <div className="mt-2 text-2xl font-bold">1,024</div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <IconFile className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Title heading={5}>快速入口</Title>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button type="outline" size="large" style={{ height: '100px' }}>
              <div className="flex flex-col items-center">
                <IconFile className="text-xl mb-2" />
                <span>新增运价</span>
              </div>
            </Button>
            <Button type="outline" size="large" style={{ height: '100px' }}>
              <div className="flex flex-col items-center">
                <IconMessage className="text-xl mb-2" />
                <span>发布询价</span>
              </div>
            </Button>
            <Button type="outline" size="large" style={{ height: '100px' }}>
              <div className="flex flex-col items-center">
                <IconUser className="text-xl mb-2" />
                <span>添加客户</span>
              </div>
            </Button>
            <Button type="outline" size="large" style={{ height: '100px' }}>
              <div className="flex flex-col items-center">
                <IconFile className="text-xl mb-2" />
                <span>数据报表</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </ControlTowerSaasLayout>
  );
};

export default SaasSystem; 