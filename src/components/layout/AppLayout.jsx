import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen" style={{ background: '#f8fafc' }}>
      <Sidebar />
      <main className="flex-1 ml-[220px] min-h-screen overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}