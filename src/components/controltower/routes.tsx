import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ControlTowerPanel from './pages/ControlTowerPanel';
import ControlTowerPanelTemp from './pages/ControlTowerPanelTemp';
import ApplicationCenter from './pages/ApplicationCenter';
// 运价中心相关组件暂时注释
// import FreightRateQuery from './pages/FreightRateQuery';
// import InquiryManagement from './pages/InquiryManagement';
import UserProfile from './pages/UserProfile';
import CompanyProfile from './pages/CompanyProfile';
import CompanyCertification from './pages/CompanyCertification';
import CompanyDataManagement from './pages/CompanyDataManagement';
import OrderManagement from './pages/OrderManagement';
import OrderDetail from './pages/OrderDetail';
import BLAddition from './pages/BLAddition';

// 引入控制塔下的超级运价系统组件
import FclRates from './saas/FclRates';
import RateQuery from './saas/RateQuery';
import LastMileRates from './saas/LastMileRates';
import InquiryManagementSaas from './saas/InquiryManagement';
import RouteManagement from './saas/RouteManagement';
import RegionManagement from './saas/RegionManagement';
import ZipcodeManagement from './saas/ZipcodeManagement';
import FbaWarehouseManagement from './saas/FbaWarehouseManagement';
import QuoteManagement from './saas/QuoteManagement';
import ContractManagement from './saas/ContractManagement';
import ContractForm from './saas/ContractForm';
import PricingRuleManagement from './saas/PricingRuleManagement';
import PricingRuleForm from './saas/PricingRuleForm';
import SurchargeManagement from './saas/SurchargeManagement';
import SurchargeForm from './saas/SurchargeForm';
import CreatePrecarriageRate from './saas/CreatePrecarriageRate';
import CreateLastMileRate from './saas/CreateLastMileRate';
import CreateFclRate from './saas/CreateFclRate';
import CreateRoute from './saas/CreateRoute';
import CreateRegion from './saas/CreateRegion';
import CreateFclInquiry from './saas/CreateFclInquiry';
import CreateLclInquiry from './saas/CreateLclInquiry';
import CreateAirInquiry from './saas/CreateAirInquiry';
import EditFclInquiry from './saas/EditFclInquiry';
import InquiryDetail from './saas/InquiryDetail';
import ViewPrecarriageRate from './saas/ViewPrecarriageRate';
import ViewLastMileRate from './saas/ViewLastMileRate';
import ViewFclRate from './saas/ViewFclRate';
import ViewQuote from './saas/ViewQuote';
import CombinationRateQuery from './saas/CombinationRateQuery';
import QuoteForm from './saas/QuoteForm';

// 引入包装器
import SaasPageWrapper from './pages/SaasPageWrapper';

// --- 新增：从 platformadmin 复制的基础资料维护页面 ---
import PortManagement from './pages/PortManagement';
import CarrierManagement from './pages/CarrierManagement';
import CountryRegionManagement from './pages/CountryRegionManagement';
import ChinaAdministrativeDivision from './pages/ChinaAdministrativeDivision';
import OverseasWarehouseManagement from './pages/OverseasWarehouseManagement';
import ZipcodeManagementCt from './pages/ZipcodeManagement';
import RouteManagementCt from './pages/RouteManagement';
import ContainerManagement from './pages/ContainerManagement';
import PackageUnitManagement from './pages/PackageUnitManagement';
import TransportTermsManagement from './pages/TransportTermsManagement';
import TradeTermsManagement from './pages/TradeTermsManagement';
import CalculationUnitManagement from './pages/CalculationUnitManagement';
import ChargeManagement from './pages/ChargeManagement';
import ShipAgentManagement from './pages/ShipAgentManagement';
import ShipDataManagement from './pages/ShipDataManagement';
import TerminalManagement from './pages/TerminalManagement';
import UserManagement from './pages/UserManagement';
import EmployeeManagement from './pages/EmployeeManagement';
import PermissionManagement from './pages/PermissionManagement';
import AddEmployee from './pages/AddEmployee';
import EditEmployee from './pages/EditEmployee';
import CompanyManagement from './pages/CompanyManagement';
import CompanyForm from './pages/CompanyForm';
import RouteMaintenance from './pages/RouteMaintenance';
import RouteForm from './pages/RouteForm';
import ScheduleQuery from './pages/ScheduleQuery';
import UIStandards from './pages/UIStandards';
import CurrencyManagement from './pages/CurrencyManagement';
import ExchangeRateManagement from './pages/ExchangeRateManagement';
import PersonalizationConfig from './pages/PersonalizationConfig';
import TemplateSettings from './pages/TemplateSettings';
import NewsManagement from './pages/NewsManagement';
import BusinessManagement from './pages/BusinessManagement';
import AboutManagement from './pages/AboutManagement';
import HomeManagement from './pages/HomeManagement';
import TaskManagement from './pages/TaskManagement';
import ImportTaskDetail from './pages/ImportTaskDetail';
import RolePermissionManagement from './pages/RolePermissionManagement';
import BusinessNodeSettings from './pages/BusinessNodeSettings';
import RolePermissionConfig from './pages/RolePermissionConfig';
import RoleCustomerConfig from './pages/RoleCustomerConfig';
import ApiCenter from './pages/ApiCenter';
import ApiDocDetail from './pages/ApiDocDetail';
import ApiSettings from './pages/ApiSettings';
// BI统计分析
import BiAnalytics from './bi/BiAnalytics';

// 销售百宝箱页面
import AiCustomerAcquisition from './pages/AiCustomerAcquisition';
import CustomerManagement from './pages/CustomerManagement';
import ContactManagement from './pages/ContactManagement';
import ContractManagementSales from './pages/ContractManagement';
import AiMarketing from './pages/AiMarketing';
// --- 结束 ---

// 默认路由重定向组件
const DefaultRoute: React.FC = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const isPersonalMode = urlParams.get('mode') === 'personal';
  
  if (isPersonalMode) {
    return <Navigate to="/controltower/user-profile?mode=personal" replace />;
  }
  
  return <Dashboard />;
};

const ControlTowerRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DefaultRoute />} />
      <Route path="/bi-analytics" element={<BiAnalytics />} />
      <Route path="/ui-standards" element={<UIStandards />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/control-tower-panel" element={<ControlTowerPanel />} />
      <Route path="/control-tower-panel-temp" element={<ControlTowerPanelTemp />} />
      <Route path="/application-center" element={<ApplicationCenter />} />
      <Route path="/api-center" element={<ApiCenter />} />
      <Route path="/api-docs/:apiId" element={<ApiDocDetail />} />
      <Route path="/api-settings" element={<ApiSettings />} />
      {/* 运价中心相关路由已暂时注释
      <Route path="/freight-rate-query" element={<FreightRateQuery />} />
      <Route path="/inquiry-management" element={<InquiryManagement />} />
      */}
      <Route path="/order-management" element={<OrderManagement />} />
      <Route path="/order-detail/:orderId" element={<OrderDetail />} />
      <Route path="/bl-addition/:orderId" element={<BLAddition />} />
      <Route path="/user-profile" element={<UserProfile />} />
      <Route path="/company-profile" element={<CompanyProfile />} />
      <Route path="/company-certification" element={<CompanyCertification />} />
      <Route path="/company-data-management" element={<CompanyDataManagement />} />
      
      {/* 超级运价系统路由 - 使用包装器隐藏重复布局 */}
      {/* 控制台和数据分析路由已删除
      <Route path="/saas/super-freight-dashboard" element={
        <SaasPageWrapper>
          <SaasSystem />
        </SaasPageWrapper>
      } />
      */}
      <Route path="/saas/fcl-rates" element={
        <SaasPageWrapper>
          <FclRates />
        </SaasPageWrapper>
      } />
      <Route path="/saas/rate-query" element={
        <SaasPageWrapper>
          <RateQuery />
        </SaasPageWrapper>
      } />
      <Route path="/saas/lastmile-rates" element={
        <SaasPageWrapper>
          <LastMileRates />
        </SaasPageWrapper>
      } />
      <Route path="/saas/inquiry-management" element={
        <SaasPageWrapper>
          <InquiryManagementSaas />
        </SaasPageWrapper>
      } />
      <Route path="/saas/quote-management" element={
        <SaasPageWrapper>
          <QuoteManagement />
        </SaasPageWrapper>
      } />
      <Route path="/saas/contract-management" element={
        <SaasPageWrapper>
          <ContractManagement />
        </SaasPageWrapper>
      } />
      <Route path="/saas/contract/add" element={
        <SaasPageWrapper>
          <ContractForm />
        </SaasPageWrapper>
      } />
      <Route path="/saas/contract/edit/:id" element={
        <SaasPageWrapper>
          <ContractForm />
        </SaasPageWrapper>
      } />
      <Route path="/saas/pricing-rule-management" element={
        <SaasPageWrapper>
          <PricingRuleManagement />
        </SaasPageWrapper>
      } />
      <Route path="/saas/pricing-rule-management/add" element={
        <SaasPageWrapper>
          <PricingRuleForm />
        </SaasPageWrapper>
      } />
      <Route path="/saas/pricing-rule-management/edit/:id" element={
        <SaasPageWrapper>
          <PricingRuleForm />
        </SaasPageWrapper>
      } />
      <Route path="/saas/surcharge" element={
        <SaasPageWrapper>
          <SurchargeManagement />
        </SaasPageWrapper>
      } />
      <Route path="/saas/surcharge/add" element={
        <SaasPageWrapper>
          <SurchargeForm />
        </SaasPageWrapper>
      } />
      <Route path="/saas/surcharge/edit/:id" element={
        <SaasPageWrapper>
          <SurchargeForm />
        </SaasPageWrapper>
      } />
      <Route path="/saas/surcharge/view/:id" element={
        <SaasPageWrapper>
          <SurchargeForm />
        </SaasPageWrapper>
      } />
      <Route path="/saas/route-management" element={
        <SaasPageWrapper>
          <RouteManagement />
        </SaasPageWrapper>
      } />
      <Route path="/saas/region-management" element={
        <SaasPageWrapper>
          <RegionManagement />
        </SaasPageWrapper>
      } />
      <Route path="/saas/zipcode-management" element={
        <SaasPageWrapper>
          <ZipcodeManagement />
        </SaasPageWrapper>
      } />
      <Route path="/saas/fba-warehouse" element={
        <SaasPageWrapper>
          <FbaWarehouseManagement />
        </SaasPageWrapper>
      } />
      <Route path="/saas/create-precarriage-rate" element={
        <SaasPageWrapper>
          <CreatePrecarriageRate />
        </SaasPageWrapper>
      } />
      <Route path="/saas/create-lastmile-rate" element={
        <SaasPageWrapper>
          <CreateLastMileRate />
        </SaasPageWrapper>
      } />
      <Route path="/saas/create-fcl-rate" element={
        <SaasPageWrapper>
          <CreateFclRate />
        </SaasPageWrapper>
      } />
      <Route path="/saas/edit-fcl-rate/:id" element={
        <SaasPageWrapper>
          <CreateFclRate />
        </SaasPageWrapper>
      } />
      
      {/* 新增路由 - 创建页面 */}
      <Route path="/saas/create-route" element={
        <SaasPageWrapper>
          <CreateRoute />
        </SaasPageWrapper>
      } />
      <Route path="/saas/create-region" element={
        <SaasPageWrapper>
          <CreateRegion />
        </SaasPageWrapper>
      } />
      
      {/* 新增询价路由 */}
      <Route path="/saas/create-inquiry/fcl" element={
        <SaasPageWrapper>
          <CreateFclInquiry />
        </SaasPageWrapper>
      } />
      <Route path="/saas/create-inquiry/lcl" element={
        <SaasPageWrapper>
          <CreateLclInquiry />
        </SaasPageWrapper>
      } />
      <Route path="/saas/create-inquiry/air" element={
        <SaasPageWrapper>
          <CreateAirInquiry />
        </SaasPageWrapper>
      } />
      
      {/* 编辑询价路由 */}
      <Route path="/saas/edit-inquiry/fcl/:id" element={
        <SaasPageWrapper>
          <EditFclInquiry />
        </SaasPageWrapper>
      } />
      <Route path="/saas/edit-inquiry/lcl/:id" element={
        <SaasPageWrapper>
          <CreateLclInquiry />
        </SaasPageWrapper>
      } />
      <Route path="/saas/edit-inquiry/air/:id" element={
        <SaasPageWrapper>
          <CreateAirInquiry />
        </SaasPageWrapper>
      } />
      
      {/* 询价详情 */}
      <Route path="/saas/inquiry-detail/:type/:id" element={
        <SaasPageWrapper>
          <InquiryDetail />
        </SaasPageWrapper>
      } />
      
      {/* 报价表单 - 新增和编辑 */}
      <Route path="/saas/quote-form/:type" element={
        <SaasPageWrapper>
          <QuoteForm />
        </SaasPageWrapper>
      } />
      <Route path="/saas/quote-form/:type/:id" element={
        <SaasPageWrapper>
          <QuoteForm />
        </SaasPageWrapper>
      } />
      
      {/* 查看运价页面 */}
      <Route path="/saas/view-fcl-rate/:id" element={
        <SaasPageWrapper>
          <ViewFclRate />
        </SaasPageWrapper>
      } />
      <Route path="/saas/view-precarriage-rate/:id" element={
        <SaasPageWrapper>
          <ViewPrecarriageRate />
        </SaasPageWrapper>
      } />
      <Route path="/saas/view-lastmile-rate/:id" element={
        <SaasPageWrapper>
          <ViewLastMileRate />
        </SaasPageWrapper>
      } />
      
      {/* 查看报价详情页面 */}
      <Route path="/saas/view-quote/:quoteId" element={
        <SaasPageWrapper>
          <ViewQuote />
        </SaasPageWrapper>
      } />
      
      {/* 组合运价查询 */}
      <Route path="/saas/combination-rate-query" element={
        <SaasPageWrapper>
          <CombinationRateQuery />
        </SaasPageWrapper>
      } />

      {/* --- 新增：基础资料维护路由 --- */}
      <Route path="/port-management" element={<PortManagement />} />
      <Route path="/carrier-management" element={<CarrierManagement />} />
      <Route path="/country-region-management" element={<CountryRegionManagement />} />
      <Route path="/china-administrative" element={<ChinaAdministrativeDivision />} />
      <Route path="/overseas-warehouse" element={<OverseasWarehouseManagement />} />
      <Route path="/zipcode-management" element={<ZipcodeManagementCt />} />
      <Route path="/route-management" element={<RouteManagementCt />} />
      <Route path="/container-management" element={<ContainerManagement />} />
      <Route path="/package-unit" element={<PackageUnitManagement />} />
      <Route path="/transport-terms" element={<TransportTermsManagement />} />
      <Route path="/trade-terms" element={<TradeTermsManagement />} />
      <Route path="/calculation-unit" element={<CalculationUnitManagement />} />
      <Route path="/charge-management" element={<ChargeManagement />} />
      <Route path="/ship-agent" element={<ShipAgentManagement />} />
      <Route path="/ship-data" element={<ShipDataManagement />} />
      <Route path="/terminal-management" element={<TerminalManagement />} />
      <Route path="/user-management" element={<UserManagement />} />
      <Route path="/company-management" element={<CompanyManagement />} />
      <Route path="/company-management/add" element={<CompanyForm />} />
      <Route path="/company-management/edit/:id" element={<CompanyForm />} />
      <Route path="/role-permission-management" element={<RolePermissionManagement />} />
      <Route path="/role-permission-config/:roleId" element={<RolePermissionConfig />} />
      <Route path="/role-customer-config/:roleId" element={<RoleCustomerConfig />} />
      <Route path="/employee-management" element={<EmployeeManagement />} />
      <Route path="/permission-management" element={<PermissionManagement />} />
      <Route path="/add-employee" element={<AddEmployee />} />
      <Route path="/edit-employee/:id" element={<EditEmployee />} />
      
      {/* 船期中心 */}
      <Route path="/route-maintenance" element={<RouteMaintenance />} />
      <Route path="/route-maintenance/add" element={<RouteForm />} />
      <Route path="/route-maintenance/edit/:id" element={<RouteForm />} />
      <Route path="/schedule-query" element={<ScheduleQuery />} />
      <Route path="/currency-management" element={<CurrencyManagement />} />
      <Route path="/exchange-rate-management" element={<ExchangeRateManagement />} />
      
      {/* 个性化配置 */}
      <Route path="/personalization-config" element={<PersonalizationConfig />} />
      
      {/* 模板设置 */}
      <Route path="/template-settings" element={<TemplateSettings />} />
      
      {/* 运营管理 */}
      <Route path="/home-management" element={<HomeManagement />} />
      <Route path="/news-management" element={<NewsManagement />} />
      <Route path="/business-management" element={<BusinessManagement />} />
      <Route path="/about-management" element={<AboutManagement />} />
      
      {/* 系统设置 */}
      <Route path="/task-management" element={<TaskManagement />} />
      <Route path="/import-task-detail/:id" element={<ImportTaskDetail />} />
      <Route path="/business-node-settings" element={<BusinessNodeSettings />} />
      
      {/* 销售百宝箱 */}
      <Route path="/sales-toolkit/ai-customer-acquisition" element={<AiCustomerAcquisition />} />
      <Route path="/sales-toolkit/customer-management" element={<CustomerManagement />} />
      <Route path="/sales-toolkit/contact-management" element={<ContactManagement />} />
      <Route path="/sales-toolkit/contract-management" element={<ContractManagementSales />} />
      <Route path="/sales-toolkit/ai-marketing" element={<AiMarketing />} />
      {/* --- 结束 --- */}
    </Routes>
  );
};

export default ControlTowerRoutes;