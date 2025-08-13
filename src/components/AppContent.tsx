import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useModal } from '../contexts/ModalContext';
import LeadFormModal from './common/LeadFormModal';
import LoadingSpinner from './common/LoadingSpinner';
import CookieConsent from './common/CookieConsent';

// 使用懒加载优化性能
const Home = lazy(() => import('./home/Home'));
const Auth = lazy(() => import('./pages/Auth'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const About = lazy(() => import('./pages/About'));
const CookieSettings = lazy(() => import('./pages/CookieSettings'));
const FMCQualification = lazy(() => import('./pages/FMCQualification'));
const SuperFreight = lazy(() => import('./pages/SuperFreight'));
const Portal = lazy(() => import('./portalhome/Portal'));
const VuePortalBridge = lazy(() => import('./walltechhome/VuePortalBridge'));
const VueAuthBridge = lazy(() => import('./walltechhome/VueAuthBridge'));
const NewsListPage = lazy(() => import('./portalhome/NewsListPage'));
const NewsDetailPage = lazy(() => import('./portalhome/NewsDetailPage'));
const BusinessServicesPage = lazy(() => import('./portalhome/BusinessServicesPage'));
const AboutUsPage = lazy(() => import('./portalhome/AboutUsPage'));
const AuthPageWrapper = lazy(() => import('./portalhome/AuthPageWrapper'));
const StaffAuthPageWrapper = lazy(() => import('./portalhome/StaffAuthPageWrapper'));
const SampleStaffRegisterWrapper = lazy(() => import('./portalhome/SampleStaffRegisterWrapper'));
const SampleExpiredLinkWrapper = lazy(() => import('./portalhome/SampleExpiredLinkWrapper'));
const SSOAuthPageWrapper = lazy(() => import('./portalhome/SSOAuthPageWrapper'));
const ProfilePageWrapper = lazy(() => import('./portalhome/ProfilePageWrapper'));
const CompanyPageWrapper = lazy(() => import('./portalhome/CompanyPageWrapper'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ControlTower = lazy(() => import('./controltower/ControlTower'));
const ControlTowerClient = lazy(() => import('./controltower-client/ControlTower'));
const PlatformAdmin = lazy(() => import('./platformadmin/PlatformAdmin'));

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AppContentProps {}

const AppContent = (/* eslint-disable-line no-empty-pattern */ {}: AppContentProps) => {
  const { modalState, closeModal } = useModal();

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" color="primary" />
      </div>
    }>
      <CookieConsent />
      <LeadFormModal isOpen={modalState.leadForm.isOpen} onClose={() => closeModal('leadForm')} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/about" element={<About />} />
        <Route path="/cookie-settings" element={<CookieSettings />} />
        <Route path="/fmc-qualification" element={<FMCQualification />} />
        <Route path="/super-freight" element={<SuperFreight />} />
        <Route path="/portal" element={<Portal />} />
        <Route path="/walltech" element={<VuePortalBridge />} />
        <Route path="/walltech-vue3" element={<VuePortalBridge />} />
        <Route path="/walltech-vue3-sso-etower" element={<VueAuthBridge authType="sso" provider="etower" />} />
        <Route path="/walltech-vue3-sso-cargoware" element={<VueAuthBridge authType="sso" provider="cargoware" />} />
        <Route path="/walltech-vue3-auth" element={<VueAuthBridge authType="auth" />} />
        <Route path="/portal/news" element={<NewsListPage />} />
        <Route path="/portal/news/:id" element={<NewsDetailPage />} />
        <Route path="/portal/business-services" element={<BusinessServicesPage />} />
        <Route path="/portal/about-us" element={<AboutUsPage />} />
        <Route path="/portal/auth" element={<AuthPageWrapper />} />
        <Route path="/staff/auth" element={<StaffAuthPageWrapper />} />
        <Route path="/sample-staff-register" element={<SampleStaffRegisterWrapper />} />
        <Route path="/sample-expired-link" element={<SampleExpiredLinkWrapper />} />
        <Route path="/sso/auth/:provider" element={<SSOAuthPageWrapper />} />
        <Route path="/profile" element={<ProfilePageWrapper />} />
        <Route path="/company" element={<CompanyPageWrapper />} />
        <Route path="/controltower/*" element={<ControlTower />} />
        <Route path="/controltower-client/*" element={<ControlTowerClient />} />
        <Route path="/platformadmin/*" element={<PlatformAdmin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppContent;
