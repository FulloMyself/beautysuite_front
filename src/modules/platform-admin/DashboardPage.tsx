import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { tenants, currentTenant } = useTenant();

  const stats = [
    {
      title: 'Total Revenue',
      value: '$12,458',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Total Bookings',
      value: '342',
      change: '+8.2%',
      trend: 'up',
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Customers',
      value: '1,284',
      change: '+3.1%',
      trend: 'up',
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Staff Members',
      value: '24',
      change: '-2.4%',
      trend: 'down',
      icon: Users,
      color: 'bg-pink-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-pink-100">
              {user?.role === 'super_admin' 
                ? 'Manage your platform and monitor performance.'
                : `You're managing ${currentTenant?.name}. Keep up the great work!`
              }
            </p>
          </div>
          <div className="hidden md:block">
            <div className="h-24 w-24 bg-white/20 rounded-full flex items-center justify-center">
              <TrendingUp className="h-12 w-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className={`flex items-center ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend === 'up' ? (
                  <ArrowUp className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm font-medium">{stat.change}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-500 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Platform Admin Section */}
      {user?.role === 'super_admin' && (
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Platform Overview</h2>
            <button className="text-sm font-medium text-pink-600 hover:text-pink-700">
              View all
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Tenants</p>
                  <p className="text-2xl font-bold">{tenants.length}</p>
                </div>
              </div>
              <div className="space-y-2">
                {tenants.slice(0, 3).map((tenant) => (
                  <div key={tenant.id} className="flex items-center justify-between p-2 hover:bg-white rounded">
                    <span className="text-sm font-medium">{tenant.name}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      tenant.plan === 'growth' 
                        ? 'bg-green-100 text-green-800'
                        : tenant.plan === 'essentials'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tenant.plan}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                  <Calendar className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Bookings</p>
                  <p className="text-2xl font-bold">142</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Across all salons today</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                  <DollarSign className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Monthly Revenue</p>
                  <p className="text-2xl font-bold">$42,850</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">+15% from last month</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-colors">
            <Calendar className="h-8 w-8 text-pink-600 mb-2" />
            <span className="text-sm font-medium">New Booking</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
            <Users className="h-8 w-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium">Add Customer</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
            <Users className="h-8 w-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium">Add Staff</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors">
            <DollarSign className="h-8 w-8 text-teal-600 mb-2" />
            <span className="text-sm font-medium">Process Payment</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;