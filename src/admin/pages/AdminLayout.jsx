import { useState, createContext, useContext } from 'react';
import AdminNav from '../components/AdminNav';
import AdminSidebar from '../components/AdminSidebar';

const SidebarContext = createContext();
export const useSidebar = () => useContext(SidebarContext);

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <div
        style={{
          background: '#f5f5f7',
          minHeight: '100vh',
          fontFamily: "-apple-system, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif",
          color: '#1d1d1f',
        }}
      >
        <AdminNav />
        <AdminSidebar />

        {/* Mobile overlay */}
        <div
          className={`admin-sidebar-overlay${sidebarOpen ? ' open' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        <main
          className="admin-main"
          style={{
            marginTop: 52,
            marginLeft: 220,
            padding: '40px',
            transition: 'margin-left 0.3s ease',
            minHeight: 'calc(100vh - 52px)',
          }}
        >
          {children}
        </main>
      </div>
    </SidebarContext.Provider>
  );
}
