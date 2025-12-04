import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, User, Calendar, Scissors, Phone, Mail, Clock, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface StaffMember {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    specialization: string[];
    hourlyRate: number;
    schedule: {
        monday: { start: string; end: string }[];
        tuesday: { start: string; end: string }[];
        wednesday: { start: string; end: string }[];
        thursday: { start: string; end: string }[];
        friday: { start: string; end: string }[];
        saturday: { start: string; end: string }[];
        sunday: { start: string; end: string }[];
    };
    isActive: boolean;
}

const StaffPage: React.FC = () => {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');


    // Sample data
    useEffect(() => {
        const sampleStaff: StaffMember[] = [
            {
                id: '1',
                firstName: 'Emma',
                lastName: 'Wilson',
                email: 'emma@salon.com',
                phone: '(555) 123-4567',
                role: 'Senior Stylist',
                specialization: ['Haircut', 'Color', 'Extensions'],
                hourlyRate: 45,
                schedule: {
                    monday: [{ start: '09:00', end: '17:00' }],
                    tuesday: [{ start: '09:00', end: '17:00' }],
                    wednesday: [{ start: '09:00', end: '17:00' }],
                    thursday: [{ start: '09:00', end: '17:00' }],
                    friday: [{ start: '09:00', end: '17:00' }],
                    saturday: [{ start: '10:00', end: '16:00' }],
                    sunday: []
                },
                isActive: true
            },
            {
                id: '2',
                firstName: 'Lisa',
                lastName: 'Rodriguez',
                email: 'lisa@salon.com',
                phone: '(555) 987-6543',
                role: 'Nail Technician',
                specialization: ['Manicure', 'Pedicure', 'Nail Art'],
                hourlyRate: 35,
                schedule: {
                    monday: [{ start: '10:00', end: '18:00' }],
                    tuesday: [{ start: '10:00', end: '18:00' }],
                    wednesday: [{ start: '10:00', end: '18:00' }],
                    thursday: [{ start: '10:00', end: '18:00' }],
                    friday: [{ start: '10:00', end: '18:00' }],
                    saturday: [{ start: '11:00', end: '15:00' }],
                    sunday: []
                },
                isActive: true
            }
        ];
        setStaff(sampleStaff);
        setLoading(false);
    }, []);

    const roles = ['all', 'Senior Stylist', 'Junior Stylist', 'Nail Technician', 'Esthetician', 'Manager'];

    const handleToggleActive = (id: string) => {
        setStaff(prev => prev.map(member =>
            member.id === id
                ? { ...member, isActive: !member.isActive }
                : member
        ));
        toast.success('Status updated');
    };

    const filteredStaff = staff.filter(member => {
        const matchesSearch = `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.role.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = selectedRole === 'all' || member.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    const getDaySchedule = (schedule: any, day: string) => {
        const daySchedule = schedule[day.toLowerCase()];
        return daySchedule.length > 0
            ? `${daySchedule[0].start} - ${daySchedule[0].end}`
            : 'Off';
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
                    <p className="text-gray-600">Manage your salon's team and schedules</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Staff</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-soft p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Staff</p>
                            <p className="text-2xl font-bold">{staff.length}</p>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-soft p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Active Today</p>
                            <p className="text-2xl font-bold">
                                {staff.filter(s => s.isActive).length}
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Clock className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-soft p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Avg. Hourly Rate</p>
                            <p className="text-2xl font-bold">
                                ${(staff.reduce((sum, s) => sum + s.hourlyRate, 0) / staff.length || 0).toFixed(0)}
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-soft p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Roles</p>
                            <p className="text-2xl font-bold">{roles.length - 1}</p>
                        </div>
                        <div className="h-12 w-12 bg-pink-100 rounded-lg flex items-center justify-center">
                            <Scissors className="h-6 w-6 text-pink-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-soft p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search staff by name, email, or role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Filter className="h-5 w-5 text-gray-400" />
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            >
                                {roles.map(role => (
                                    <option key={role} value={role}>
                                        {role === 'all' ? 'All Roles' : role}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Staff Table */}
            <div className="bg-white rounded-xl shadow-soft overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading staff...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Staff Member
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role & Rate
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Schedule
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredStaff.map((member) => (
                                    <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                                                    {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {member.firstName} {member.lastName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {member.specialization.slice(0, 2).join(', ')}
                                                        {member.specialization.length > 2 && '...'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                                    {member.email}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                                    {member.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{member.role}</div>
                                                <div className="text-sm text-gray-600">${member.hourlyRate}/hr</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="text-xs">
                                                    <span className="font-medium">Mon:</span> {getDaySchedule(member.schedule, 'monday')}
                                                </div>
                                                <div className="text-xs">
                                                    <span className="font-medium">Fri:</span> {getDaySchedule(member.schedule, 'friday')}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleActive(member.id)}
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${member.isActive
                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                    }`}
                                            >
                                                {member.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => {/* View/edit schedule */ }}
                                                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="Schedule"
                                                >
                                                    <Calendar className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => {/* Edit */ }}
                                                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                                                    title="Edit"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredStaff.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">👥</div>
                                <p className="text-gray-500">No staff members found</p>
                                {searchTerm && (
                                    <p className="text-sm text-gray-400 mt-2">
                                        Try adjusting your search criteria
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Create Staff Modal - Similar to customer modal but with staff fields */}
            {/* Implement similar to Create Customer Modal with staff-specific fields */}
        </div>
    );
};

export default StaffPage;