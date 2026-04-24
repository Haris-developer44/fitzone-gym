import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getMemberById, saveMembers, getMembers, updateMember, getMembershipPlans } from '../../utils/localStorage';
import { ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const EditMemberPage = () => {
    const { id } = useParams();
    console.log(id);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', address: '', plan: 'Basic', gender: 'Male', dob: ''
    });

    const [plans, setPlans] = useState([]);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await getMembershipPlans();
                setPlans(data || []);
            } catch (error) {
                console.error("Failed to fetch plans", error);
            }
        };
        fetchPlans();
    }, []);

    useEffect(() => {
        const loadData = async () => {
            const member = await getMemberById(id);

            console.log(member);
            if (!member) {
                toast.error('Member not found');
                navigate('/admin/members');
                return;
            }
            setFormData({
                name: member.name || '',
                email: member.email || '',
                phone: member.phone || '',
                address: member.address || '',
                plan: member.plan || 'Basic',
                gender: member.gender || 'Male',
                dob: member.dob ? new Date(member.dob).toISOString().split('T')[0] : ''
            });
            setLoading(false);
        };
        loadData();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // const members = getMembers();
        // const fee = feeFromPlan(formData.plan);

        // const updatedMembers = members.map(m => {
        //     if (m.id === id) {
        //         return {
        //             ...m,
        //             ...formData,
        //             fee,
        //         };
        //     }
        //     return m;
        // });

        // saveMembers(updatedMembers);
        // toast.success('Member details updated!');
        // navigate('/admin/members');
        const updatedMember = {
            ...formData
        };
        console.log(updatedMember, id);
        updateMember(updatedMember, id);
        toast.success('Member details updated!');
        navigate('/sub_admin/members');
    };

    if (loading) return null;

    return (
        <AdminSidebar>
            <div className="mb-8">
                <button onClick={() => navigate('/admin/members')} className="flex items-center text-gray-400 hover:text-white mb-4 transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Members
                </button>
                <h1 className="text-3xl font-bold mb-1">Edit Member</h1>
                <p className="text-gray-400">Update details for {formData.name}</p>
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
                        Save Changes
                    </button>
                </div>
            </form>
        </AdminSidebar>
    );
};

export default EditMemberPage;

