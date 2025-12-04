import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, Package, Scissors, Activity } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');

  // Revenue data
  const revenueData = [
    { month: 'Jan', revenue: 42000, bookings: 320 },
    { month: 'Feb', revenue: 38000, bookings: 290 },
    { month: 'Mar', revenue: 45000, bookings: 340 },
    { month: 'Apr', revenue: 52000, bookings: 410 },
    { month: 'May', revenue: 48000, bookings: 380 },
    { month: 'Jun', revenue: 55000, bookings: 430 },
    { month: 'Jul', revenue: 60000, bookings: 480 },
  ];

  // Service categories data
  const serviceData = [
    { name: 'Hair Services', value: 45, color: '#EC4899' },
    { name: 'Nail Services', value: 25, color: '#8B5CF6' },
    { name: 'Skin Services', value: 20, color: '#14B8A6' },
    { name: 'Massage', value: 10, color: '#F59E0B' },
  ];

  // Staff performance
  const staffData = [
    { name: 'Emma Wilson', revenue: 18500, bookings: 142, satisfaction: 4.8 },
    { name: 'Lisa Rodriguez', revenue: 14200, bookings: 118, satisfaction: 4.7 },
    { name: 'Sophia Martinez', revenue: 12800, bookings: 95, satisfaction: 4.9 },
    { name: 'Alex Johnson', revenue: 9800, bookings: 76, satisfaction: 4.6 },
  ];

  // Key metrics
  const metrics = [
    {
      title: 'Total Revenue',
      value: '$42,850',
      change: '+15.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Total Bookings',
      value: '342',
      change: '+8.7%',
      trend: 'up',
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      title: 'New Customers',
      value: '48',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Product Sales',
      value: '$8,240',
      change: '+5.3%',
      trend: 'up',
      icon: Package,
      color: 'bg-pink-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor your salon's performance and growth</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${metric.color} p-3 rounded-lg`}>
                <metric.icon className="h-6 w-6 text-white" />
              </div>
              <div className={`flex items-center ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm font-medium">{metric.change}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
            <p className="text-gray-500 text-sm">{metric.title}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Revenue & Bookings</h2>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  formatter={(value) => [`$${value}`, 'Revenue']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#EC4899"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  name="Bookings"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Distribution */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Service Distribution</h2>
            <Scissors className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Staff Performance */}
      <div className="bg-white rounded-xl shadow-soft p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Staff Performance</h2>
          <Users className="h-5 w-5 text-gray-400" />
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={staffData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                formatter={(value, name) => {
                  if (name === 'revenue') return [`$${value}`, 'Revenue'];
                  if (name === 'bookings') return [value, 'Bookings'];
                  return [value, 'Satisfaction'];
                }}
              />
              <Legend />
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill="#EC4899"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="bookings"
                name="Bookings"
                fill="#8B5CF6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          {staffData.map((staff, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{staff.name}</h4>
                <span className="text-sm font-medium text-yellow-600">
                  ⭐ {staff.satisfaction}
                </span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-medium">${staff.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bookings:</span>
                  <span className="font-medium">{staff.bookings}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Bookings</h3>
          <div className="space-y-4">
            {[
              { customer: 'Sarah Johnson', service: 'Haircut & Color', time: '10:00 AM', status: 'Confirmed' },
              { customer: 'Michael Chen', service: 'Manicure', time: '2:00 PM', status: 'Pending' },
              { customer: 'Jessica Williams', service: 'Facial', time: '4:30 PM', status: 'Confirmed' },
              { customer: 'David Smith', service: 'Massage', time: '11:00 AM', status: 'Completed' },
            ].map((booking, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{booking.customer}</div>
                  <div className="text-sm text-gray-600">{booking.service}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{booking.time}</div>
                  <span className={`text-xs px-2 py-1 rounded-full ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                    }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Products</h3>
          <div className="space-y-4">
            {[
              { name: 'Hydrating Facial Cream', sales: 42, revenue: 1890 },
              { name: 'Volumizing Shampoo', sales: 38, revenue: 1235 },
              { name: 'Anti-Aging Serum', sales: 25, revenue: 2250 },
              { name: 'Nail Polish Set', sales: 31, revenue: 930 },
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-600">{product.sales} units sold</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">${product.revenue}</div>
                  <div className="text-sm text-green-600">${(product.revenue / product.sales).toFixed(2)} avg</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;