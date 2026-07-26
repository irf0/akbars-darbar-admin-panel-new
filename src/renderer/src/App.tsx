import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@renderer/layouts/DashboardLayout';
import Login from './routes/Login';
import RequireAuth from './global/components/RequireAuth';
import OrdersScreen from '@renderer/features/orders/screens/OrdersScreen';
import { Toaster } from 'sonner';
import { useOrdersListener } from './features/orders/hooks/useOrdersListener';
import NewOrderAlertBanner from './global/components/NewOrderAlertBanner';
import AnalyticsScreen from './features/analytics/screens/AnalyticsScreen';
import SettingsScreen from './features/settings/screens/SettingsScreen';
import MenuScreen from './features/menu/screens/MenuScreen';
import DeliveryScreen from './features/delivery/screens/DeliveryScreen';
import { useAdminSettingsListener } from './global/hooks/useAdminSettingsListener';
import CouponsScreen from './features/coupons/screens/CouponsScreen';
import RidersScreen from './features/riders/screens/RidersScreen';
import ReviewsScreen from './features/reviews/screens/ReviewsScreen';
import OrderHistoryScreen from './features/orderHistory/screens/orderHistoryScreen';

function App() {
  useAdminSettingsListener();
  useOrdersListener();
  return (
    <HashRouter>
      <Toaster position="top-right" richColors />
      <NewOrderAlertBanner />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }>
          <Route index element={<Navigate to="/orders" replace />} />
          <Route path="/orders" element={<OrdersScreen />} />
          <Route path="/menu" element={<MenuScreen />} />
          <Route path="/delivery" element={<DeliveryScreen />} />
          <Route path="/analytics" element={<AnalyticsScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/coupons" element={<CouponsScreen />} />
          <Route path="/riders" element={<RidersScreen />} />
          <Route path="/reviews" element={<ReviewsScreen />} />
          <Route path="/orders/history" element={<OrderHistoryScreen />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
