import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ChevronLeft } from 'lucide-react';
import SubAdminSidebar from '../../components/sub_admin/SubAdminSidebar';
import { getMembers, generateId, saveMember } from '../../utils/localStorage';

const SubAdminAddMemberPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', address: '', plan: 'Basic', gender: 'Male'
    });

    const feeFromPlan = (plan) => {
        if (plan === 'Basic') return 3000;
        if (plan === 'Pro') return 5500;
        if (plan === 'Elite') return 9000;
        return 3000;
    };

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const members = await getMembers();

        if (members.some(m => m.email === formData.email)) {
            toast.error('A member with this email already exists!');
            return;
        }

        const joinDate = new Date();
        const nextPay = new Date(joinDate);
        nextPay.setMonth(nextPay.getMonth() + 1);

        const fee = feeFromPlan(formData.plan);

        const newMember = {
            ...formData,
            id: generateId(),
            fee,
            status: 'Active',
            feeStatus: 'Pending',
            joinDate: joinDate.toISOString().split('T')[0],
            nextPaymentDate: nextPay.toISOString().split('T')[0],
            attendanceHistory: []
        };

        members.push(newMember);
        saveMember(newMember);

        toast.success('Member added successfully!');
        navigate('/sub_admin/members');
    };

    return (
        <SubAdminSidebar>
            <div className="mb-8">
                <button
                    onClick={() => navigate('/sub_admin/members')}
                    className="flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Members
                </button>
                <h1 className="text-3xl font-bold mb-1">Add Member</h1>
                <p className="text-gray-400">Add a new member for fee tracking & challan.</p>
            </div>

            <form onSubmit={handleSubmit} className="fitzon-card max-w-2xl">
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-neon border-b border-[#2f2f2f] pb-2 uppercase tracking-wide">
                        Member Details
                    </h3>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Full Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" required />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Email Address *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" required />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Phone Number *</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Membership Plan *</label>
                            <select name="plan" value={formData.plan} onChange={handleChange} className="input-field">
                                <option value="Basic">Basic (Rs 3,000)</option>
                                <option value="Pro">Pro (Rs 5,500)</option>
                                <option value="Elite">Elite (Rs 9,000)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Gender *</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Address</label>
                        <textarea name="address" value={formData.address} onChange={handleChange} className="input-field h-24 resize-none" />
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-[#2f2f2f] flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/sub_admin/members')}
                        className="px-6 py-3 border border-border rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                    >
                        Cancel
                    </button>
                    <button type="submit" className="btn-neon">
                        Add Member
                    </button>
                </div>
            </form>
        </SubAdminSidebar>
    );
};

export default SubAdminAddMemberPage;

