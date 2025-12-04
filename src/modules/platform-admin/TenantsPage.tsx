import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Check } from 'lucide-react';
import { tenantsAPI } from '../../services/api/api';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';

interface Tenant {
    id: string;
    name: string;
    subdomain: string | null;
    plan: string;
    isActive: boolean;
    createdAt: string;
    settings: Record<string, any>;
}

interface CreateTenantForm {
    name: string;
    subdomain: string;
    plan: 'free' | 'essentials' | 'growth';
}

const TenantsPage: React.FC = () => {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPlan, setSelectedPlan] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<CreateTenantForm>({
        defaultValues: {
            name: '',
            subdomain: '',
            plan: 'essentials'
        }
    });

    const selectedPlanForm = watch('plan');

    const loadTenants = async () => {
        try {
            setLoading(true);
            const response = await tenantsAPI.getAll();
            setTenants(response.data.data);
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || 'Failed to load tenants');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTenants();
    }, []);

    // In the create tenant function, remove unused response variable:
    const onSubmit = async (data: CreateTenantForm) => {
        try {
            setCreating(true);
            await tenantsAPI.create({
                ...data,
                settings: {
                    theme: 'light',
                    currency: 'USD',
                    timezone: 'UTC'
                }
            });

            toast.success('Tenant created successfully!');
            setShowCreateModal(false);
            reset();
            loadTenants(); // Refresh list
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || 'Failed to create tenant');
        } finally {
            setCreating(false);
        }
    };

    const filteredTenants = tenants.filter(tenant => {
        const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tenant.subdomain?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPlan = selectedPlan === 'all' || tenant.plan === selectedPlan;
        return matchesSearch && matchesPlan;
    });

    const getPlanColor = (plan: string) => {
        switch (plan) {
            case 'growth': return 'bg-green-100 text-green-800';
            case 'essentials': return 'bg-blue-100 text-blue-800';
            case 'free': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleDeleteTenant = async (id: string) => {
        if (window.confirm('Are you sure you want to deactivate this tenant?')) {
            try {
                await tenantsAPI.delete(id);
                toast.success('Tenant deactivated successfully');
                loadTenants();
            } catch (error: any) {
                toast.error(error.response?.data?.error?.message || 'Failed to deactivate tenant');
            }
        }
    };

    const handleActivateTenant = async (id: string) => {
        try {
            await tenantsAPI.update(id, { isActive: true });
            toast.success('Tenant activated successfully');
            loadTenants();
        } catch (error: any) {
            toast.error('Failed to activate tenant');
        }
    };

    const plans = [
        { value: 'all', label: 'All Plans' },
        { value: 'free', label: 'Free' },
        { value: 'essentials', label: 'Essentials' },
        { value: 'growth', label: 'Growth' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tenant Management</h1>
                    <p className="text-gray-600">Manage all beauty salons on the platform</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Tenant</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-soft p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Tenants</p>
                            <p className="text-2xl font-bold">{tenants.length}</p>
                        </div>
                        <div className="h-12 w-12 bg-pink-100 rounded-lg flex items-center justify-center">
                            <Eye className="h-6 w-6 text-pink-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-soft p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Growth Plan</p>
                            <p className="text-2xl font-bold">
                                {tenants.filter(t => t.plan === 'growth').length}
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">💎</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-soft p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Essentials Plan</p>
                            <p className="text-2xl font-bold">
                                {tenants.filter(t => t.plan === 'essentials').length}
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">⭐</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-soft p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Free Plan</p>
                            <p className="text-2xl font-bold">
                                {tenants.filter(t => t.plan === 'free').length}
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">🎯</span>
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
                            placeholder="Search tenants by name or subdomain..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Filter className="h-5 w-5 text-gray-400" />
                            <select
                                value={selectedPlan}
                                onChange={(e) => setSelectedPlan(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            >
                                {plans.map(plan => (
                                    <option key={plan.value} value={plan.value}>
                                        {plan.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tenants Table */}
            <div className="bg-white rounded-xl shadow-soft overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading tenants...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tenant
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Plan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredTenants.map((tenant) => (
                                    <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                                                        {tenant.name.charAt(0)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {tenant.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {tenant.subdomain || 'No subdomain'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPlanColor(tenant.plan)}`}>
                                                {tenant.plan.charAt(0).toUpperCase() + tenant.plan.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${tenant.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {tenant.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(tenant.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => {/* View details */ }}
                                                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="View"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => {/* Edit */ }}
                                                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                                                    title="Edit"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTenant(tenant.id)}
                                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Deactivate"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredTenants.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">📭</div>
                                <p className="text-gray-500">No tenants found</p>
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

            {/* Create Tenant Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-slide-up">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Create New Tenant</h2>
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    reset();
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Salon Name *
                                </label>
                                <input
                                    type="text"
                                    {...register('name', { required: 'Name is required' })}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${errors.name ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="e.g., Sunshine Beauty Spa"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subdomain *
                                </label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-500">
                                        https://
                                    </span>
                                    <input
                                        type="text"
                                        {...register('subdomain', {
                                            required: 'Subdomain is required',
                                            pattern: {
                                                value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                                                message: 'Only lowercase letters, numbers, and hyphens'
                                            }
                                        })}
                                        className={`flex-1 px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent ${errors.subdomain ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="your-salon"
                                    />
                                    <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 text-gray-500">
                                        .localhost
                                    </span>
                                </div>
                                {errors.subdomain && (
                                    <p className="mt-1 text-sm text-red-600">{errors.subdomain.message}</p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    This will be used for the salon's unique URL
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subscription Plan *
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: 'free', label: 'Free', desc: 'Basic features', color: 'gray' },
                                        { value: 'essentials', label: 'Essentials', desc: 'Most popular', color: 'pink' },
                                        { value: 'growth', label: 'Growth', desc: 'Advanced', color: 'green' }
                                    ].map((plan) => (
                                        <label
                                            key={plan.value}
                                            className={`relative cursor-pointer p-4 border rounded-lg text-center transition ${selectedPlanForm === plan.value
                                                ? `border-${plan.color}-500 bg-${plan.color}-50 text-${plan.color}-700 ring-2 ring-${plan.color}-200`
                                                : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                value={plan.value}
                                                {...register('plan')}
                                                className="sr-only"
                                            />
                                            {selectedPlanForm === plan.value && (
                                                <Check className="absolute top-2 right-2 h-5 w-5" />
                                            )}
                                            <div className="font-medium capitalize">{plan.label}</div>
                                            <div className="text-xs text-gray-500 mt-1">{plan.desc}</div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        reset();
                                    }}
                                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                    disabled={creating}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary px-6 py-2 flex items-center"
                                    disabled={creating}
                                >
                                    {creating ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Tenant'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TenantsPage;