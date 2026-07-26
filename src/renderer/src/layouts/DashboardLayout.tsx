import { Outlet } from 'react-router-dom';
import Sidebar from '@renderer/global/components/Sidebar';

function DashboardLayout() {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
export default DashboardLayout;
