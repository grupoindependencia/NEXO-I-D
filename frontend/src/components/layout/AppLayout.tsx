import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import './AppLayout.css';

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className={`app ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => {
          if (window.innerWidth <= 768) setMobileOpen((v) => !v);
          else setCollapsed((v) => !v);
        }}
      />
      <Topbar />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
