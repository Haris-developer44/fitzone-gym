import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Modal from '../../components/shared/Modal';
import { Tag, FileEdit } from 'lucide-react';
import { getMembershipPlans, updateMembershipPlan } from '../../utils/localStorage';
import toast from 'react-hot-toast';

const PlansPage = () => {
    const [plans, setPlans] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [editFormData, setEditFormData] = useState({ amount: '', description: '' });

    const fetchPlans = async () => {
        try {
            const data = await getMembershipPlans();
            setPlans(data || []);
        } catch (error) {
            console.error("Error fetching plans:", error);
            toast.error("Failed to load plans");
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleEditClick = (plan) => {
        setSelectedPlan(plan);
        setEditFormData({
            amount: plan.amount || '',
            description: plan.description || ''
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateMembershipPlan(selectedPlan.planName, {
                amount: parseInt(editFormData.amount, 10),
                description: editFormData.description
            });
            toast.success("Plan updated successfully");
            setIsEditModalOpen(false);
            fetchPlans();
        } catch (error) {
            console.error("Error updating plan:", error);
            toast.error("Failed to update plan");
        }
    };

    return (
        <AdminSidebar>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Membership Plans</h1>
                    <p className="text-gray-400">Manage pricing and details for all gym plans</p>
                </div>
            </div>

            <div className="fitzon-card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#1a1a1a] text-gray-400 text-sm border-b border-[#1f1f1f] uppercase tracking-wider">
                            <tr>
                                <th className="p-4 font-medium w-16 text-center">#</th>
                                <th className="p-4 font-medium">Plan Name</th>
                                <th className="p-4 font-medium">Monthly Fee</th>
                                <th className="p-4 font-medium">Description</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1f1f1f]">
                            {plans.map((plan, index) => (
                                <tr key={plan.planName} className="hover:bg-[#111111] transition-colors">
                                    <td className="p-4 text-center text-gray-500">{index + 1}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-dark border border-[#333] flex items-center justify-center text-neon">
                                                <Tag className="w-5 h-5" />
                                            </div>
                                            <div className="font-bold text-white text-lg">{plan.planName}</div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-lg text-neon font-bebas tracking-wide">
                                            Rs {plan.amount}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-400 max-w-xs truncate" title={plan.description}>
                                        {plan.description || 'No description provided'}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEditClick(plan)}
                                                className="p-2 text-gray-400 hover:text-neon bg-[#1a1a1a] rounded-lg border border-[#2f2f2f] hover:border-neon transition-colors"
                                                title="Edit Price"
                                            >
                                                <FileEdit className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {plans.length === 0 && (
                        <div className="text-center py-16 text-gray-500 flex flex-col items-center">
                            <Tag className="w-12 h-12 mb-4 opacity-50" />
                            <p>No membership plans found.</p>
                        </div>
                    )}
                </div>
            </div>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Plan Details">
                {selectedPlan && (
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Plan Name</label>
                            <input
                                type="text"
                                className="input-field bg-[#1a1a1a] text-gray-500 cursor-not-allowed"
                                value={selectedPlan.planName}
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Monthly Fee (Rs)</label>
                            <input
                                type="number"
                                required
                                className="input-field focus:border-neon focus:ring-1 focus:ring-neon"
                                value={editFormData.amount}
                                onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                            <textarea
                                className="input-field h-24 resize-none focus:border-neon focus:ring-1 focus:ring-neon"
                                value={editFormData.description}
                                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(false)}
                                className="btn-outline flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-neon flex-1"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </AdminSidebar>
    );
};

export default PlansPage;
