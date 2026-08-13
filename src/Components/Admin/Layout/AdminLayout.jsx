import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        isDrawer={false}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}
      <Sidebar
        isOpen={mobileDrawerOpen}
        isDrawer={true}
        onClose={() => setMobileDrawerOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar
          onMenuClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
        />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
