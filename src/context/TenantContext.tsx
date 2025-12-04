import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { tenantsAPI } from '../services/api/api';

export interface Tenant {
  id: string;
  name: string;
  subdomain: string | null;
  plan: string;
  settings: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TenantContextType {
  currentTenant: Tenant | null;
  tenants: Tenant[];
  isLoading: boolean;
  switchTenant: (tenantId: string) => void;
  refreshTenants: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load tenants on mount
  useEffect(() => {
    refreshTenants();
  }, []);

  const refreshTenants = async () => {
    try {
      setIsLoading(true);
      const response = await tenantsAPI.getAll();
      setTenants(response.data.data);
      
      // If no current tenant, set the first one
      if (response.data.data.length > 0 && !currentTenant) {
        setCurrentTenant(response.data.data[0]);
      }
    } catch (error) {
      console.error('Failed to load tenants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const switchTenant = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (tenant) {
      setCurrentTenant(tenant);
      // In a real app, you might want to store this in localStorage
      localStorage.setItem('current_tenant_id', tenantId);
    }
  };

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        tenants,
        isLoading,
        switchTenant,
        refreshTenants,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};