'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface SidebarContextType {
  collapsed: boolean;
  toggleSidebar: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  toggleSidebar: () => {},
  setCollapsed: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsedState] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cakrawala_admin_sidebar_collapsed');
      if (stored !== null) {
        setCollapsedState(stored === 'true');
      }
    } catch {}
  }, []);

  const toggleSidebar = () => {
    setCollapsedState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('cakrawala_admin_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const setCollapsed = (val: boolean) => {
    setCollapsedState(val);
    try {
      localStorage.setItem('cakrawala_admin_sidebar_collapsed', String(val));
    } catch {}
  };

  return (
    <SidebarContext.Provider value={{ collapsed, toggleSidebar, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
