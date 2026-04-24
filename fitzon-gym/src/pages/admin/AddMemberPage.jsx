import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getMembers, saveMember, getMembershipPlans } from '../../utils/localStorage';
import { ChevronLeft } from 'lucide-react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const AddMemberPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', address: '', plan: 'Basic', gender: 'Male', dob: '', admissionFee: 0
    });

    const [plans, setPlans] = useState([]);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await getMembershipPlans();
                setPlans(data || []);
                if (data && data.length > 0) {
                    setFormData(prev => ({ ...prev, plan: data[0].planName }));
                }
            } catch (error) {
                console.error("Failed to fetch plans", error);
            }
        };
        fetchPlans();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Check email uniqueness by fetching existing members
            const members = await getMembers();
            if (members.some(m => m.email === formData.email)) {
                toast.error('A member with this email already exists!');
                return;
            }

            const joinDate = new Date();

            const newMember = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                gender: formData.gender,
                plan: formData.plan,
                dob: formData.dob,
                admissionFee: formData.admissionFee,
                joinDate: joinDate.toISOString().split('T')[0]
            };

            await saveMember(newMember);
            toast.success('Member added successfully!');
            navigate('/admin/members');
        } catch (error) {
            console.error('Error adding member:', error);
            toast.error('Failed to add member. Please try again.');
        }
    };

    return (
        <AdminSidebar>
            <div className="mb-8">
                <button onClick={() => navigate('/admin/members')} className="flex items-center text-gray-400 hover:text-white mb-4 transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Members
                </button>
                <h1 className="text-3xl font-bold mb-1">Add New Member</h1>
                <p className="text-gray-400">Register a new client to Fitzon Gym</p>
            </div>

            <form onSubmit={handleSubmit} className="fitzon-card max-w-2xl">
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-neon border-b border-[#2f2f2f] pb-2 uppercase tracking-wide">Member Details</h3>

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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Membership Plan *</label>
                            <select name="plan" value={formData.plan} onChange={handleChange} className="input-field">
                                {plans.map((p) => (
                                    <option key={p.planName} value={p.planName}>
                                        {p.planName} (Rs {p.amount})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Gender *</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Date of Birth *</label>
                            <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="input-field" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Admission Fee (Paid Once)</label>
                                <input type="number" name="admissionFee" value={formData.admissionFee} onChange={handleChange} className="input-field" placeholder="0" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Address</label>
                            <textarea name="address" value={formData.address} onChange={handleChange} className="input-field h-24 resize-none" />
                        </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-[#2f2f2f] flex justify-end gap-4">
                        <button type="button" onClick={() => navigate('/admin/members')} className="px-6 py-3 border border-border rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1a1a]">
                            Cancel
                        </button>
                        <button type="submit" className="btn-neon">
                            Add Member
                        </button>
                    </div>
                </div>
            </form>
        </AdminSidebar>
    );
};

export default AddMemberPage;

