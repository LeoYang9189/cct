import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ControlTowerPanel from './pages/ControlTowerPanel';
import ControlTowerPanelTemp from './pages/ControlTowerPanelTemp';
// 运价中心相关组件暂时注释
// import FreightRateQuery from './pages/FreightRateQuery';
// import InquiryManagement from './pages/InquiryManagement';
import BillingManagement from './pages/BillingManagement';
import InvoiceManagement from './pages/InvoiceManagement';
import UserProfile from './pages/UserProfile';
import CompanyProfile from './pages/CompanyProfile';
import OrderManagement from './pages/OrderManagement';
import OrderDetail from './pages/OrderDetail';
import BLAddition from './pages/BLAddition';
import ScheduleQuery from './pages/ScheduleQuery';
import ViewFclRate from './pages/ViewFclRate';
import ViewPrecarriageRate from './pages/ViewPrecarriageRate';
import ViewOncarriageRate from './pages/ViewOncarriageRate';

// 引入客户版运价组件
import FclRatesClient from './pages/FclRatesClient';
import InquiryManagementSaas from '../controltower/saas/InquiryManagement';
import CombinationRateQuery from '../controltower/saas/CombinationRateQuery';

// 引入包装器
import SaasPageWrapper from './pages/SaasPageWrapper';

const ControlTowerClientRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/control-tower-panel" element={<ControlTowerPanel />} />
      <Route path="/control-tower-panel-temp" element={<ControlTowerPanelTemp />} />
      <Route path="/schedule-query" element={<ScheduleQuery />} />
      {/* 运价中心相关路由已暂时注释
      <Route path="/freight-rate-query" element={<FreightRateQuery />} />
      <Route path="/inquiry-management" element={<InquiryManagement />} />
      */}
      <Route path="/order-management" element={<OrderManagement />} />
      <Route path="/order-detail/:orderId" element={<OrderDetail />} />
      <Route path="/bl-addition/:orderId" element={<BLAddition />} />
      <Route path="/billing-management" element={<BillingManagement />} />
      <Route path="/invoice-management" element={<InvoiceManagement />} />
      <Route path="/user-profile" element={<UserProfile />} />
      <Route path="/company-profile" element={<CompanyProfile />} />
      
      {/* 超级运价系统路由 - 使用包装器隐藏重复布局 */}
      <Route path="/saas/rate-query" element={
        <SaasPageWrapper>
          <FclRatesClient />
        </SaasPageWrapper>
      } />
      <Route path="/saas/inquiry-management" element={
        <SaasPageWrapper>
          <InquiryManagementSaas />
        </SaasPageWrapper>
      } />
      <Route path="/combination-rate-query" element={
        <SaasPageWrapper>
          <CombinationRateQuery />
        </SaasPageWrapper>
      } />
      
      {/* 查看运价详情页面 */}
      <Route path="/view-fcl-rate/:id" element={<ViewFclRate />} />
      <Route path="/view-precarriage-rate/:id" element={<ViewPrecarriageRate />} />
      <Route path="/view-oncarriage-rate/:id" element={<ViewOncarriageRate />} />
    </Routes>
  );
};

export default ControlTowerClientRoutes; 