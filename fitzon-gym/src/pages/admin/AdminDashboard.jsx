import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatCard from '../../components/shared/StatCard';
import Modal from '../../components/shared/Modal';
import { Users, UserCheck, BadgeDollarSign, Eye, FileEdit } from 'lucide-react';
import { getMembers } from '../../utils/localStorage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const data = await getMembers();
                setMembers(data || []);
            } catch (error) {
                console.error("Error fetching members:", error);
                setMembers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, []);

    const activeMembers = members.length;
    console.log(members);
    const monthlyRevenue = members.reduce((acc, curr) => acc + Number(curr.fee), 0);
    console.log(monthlyRevenue);
    // Chart Data
    const revenueData = [
        { name: 'Oct', revenue: monthlyRevenue * 0.7 },
        { name: 'Nov', revenue: monthlyRevenue * 0.8 },
        { name: 'Dec', revenue: monthlyRevenue * 0.9 },
        { name: 'Jan', revenue: monthlyRevenue },
        { name: 'Feb', revenue: monthlyRevenue * 1.1 },
        { name: 'Mar', revenue: monthlyRevenue },
    ];

    const latestMembers = [...members].sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate)).slice(0, 5);

    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#1a1a1a] border border-[#2f2f2f] p-3 rounded-lg shadow-xl">
                    <p className="text-gray-400 mb-1">{label}</p>
                    <p className="font-bebas text-neon text-xl">Rs {payload[0].value.toLocaleString()}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <AdminSidebar>
            {loading ? (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading dashboard...</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Good Morning, Admin 👋</h1>
                        <p className="text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>

                    {/* STATS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard icon={Users} label="Total Members" value={members.length} />
                        <StatCard icon={UserCheck} label="Active Members" value={activeMembers} />
                        <StatCard icon={BadgeDollarSign} label="Monthly Revenue" value={monthlyRevenue} color="text-green-500" />
                    </div>

                    {/* CHARTS */}
                    {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="fitzon-card">
                            <h3 className="text-xl font-bold mb-6">Revenue Overview</h3>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                                        <XAxis dataKey="name" stroke="#666" axisLine={false} tickLine={false} />
                                        <YAxis stroke="#666" axisLine={false} tickLine={false} tickFormatter={(val) => `Rs ${val / 1000}k`} />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1a1a1a' }} />
                                        <Bar dataKey="revenue" fill="#CCFF00" radius={[4, 4, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div> */}

                    {/* RECENT ENROLLMENTS */}
                    <div className="fitzon-card overflow-hidden p-0">
                        <div className="p-6 border-b border-[#1f1f1f] flex justify-between items-center">
                            <h3 className="text-xl font-bold">Recent Enrollments</h3>
                            <button onClick={() => navigate('/admin/members')} className="text-neon text-sm hover:underline">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#1a1a1a] text-gray-400 text-sm border-b border-[#1f1f1f] uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4 font-medium">Member</th>
                                        <th className="p-4 font-medium">Join Date</th>
                                        {/* <th className="p-4 font-medium">Fee Status</th> */}
                                        <th className="p-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1f1f1f]">
                                    {latestMembers.map((member) => (
                                        <tr key={member.id} className="hover:bg-[#151515] transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-dark border border-[#333] flex items-center justify-center text-neon font-bold text-sm">
                                                        {getInitials(member.name)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">{member.name} <sup>{member.id}</sup></div>
                                                        <div className="text-xs text-gray-500">{member.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-400 text-sm">{member.joinDate}</td>
                                            {/* <td className="p-4">
                                        {member.feeStatus === 'Paid' ? (
                                            <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded-full text-xs font-bold">Paid</span>
                                        ) : (
                                            <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-full text-xs font-bold">Pending</span>
                                        )}
                                    </td> */}
                                            <td className="p-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => { setSelectedMember(member); setIsModalOpen(true); }}
                                                        className="p-2 text-gray-400 hover:text-white bg-[#1a1a1a] rounded-lg border border-[#2f2f2f] hover:border-white transition-colors"
                                                        title="View"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/admin/members/edit/${member.id}`)}
                                                        className="p-2 text-gray-400 hover:text-neon bg-[#1a1a1a] rounded-lg border border-[#2f2f2f] hover:border-neon transition-colors"
                                                        title="Edit"
                                                    >
                                                        <FileEdit className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {latestMembers.length === 0 && (
                                <div className="text-center py-10 text-gray-500">No members found.</div>
                            )}
                        </div>
                    </div>

                    {/* MEMBER DETAILS MODAL */}
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        title="Member Details"
                    >
                        {selectedMember && (
                            <div className="space-y-6 text-gray-300">
                                <div className="flex items-center gap-4 border-b border-[#2f2f2f] pb-6">
                                    <div className="w-20 h-20 rounded-full border-2 border-neon flex items-center justify-center text-neon font-bold text-3xl">
                                        {getInitials(selectedMember.name)}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{selectedMember.name}</h2>
                                        <div className="flex gap-2">
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${selectedMember.status === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}`}>{selectedMember.status}</span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${selectedMember.feeStatus === 'Paid' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>{selectedMember.feeStatus}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email Details</p>
                                        <p>{selectedMember.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                                        <p>{selectedMember.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date of Birth</p>
                                        <p>{selectedMember.dob}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Gender</p>
                                        <p>{selectedMember.gender}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Join Date</p>
                                        <p>{selectedMember.joinDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Monthly Fee</p>
                                        <p className="font-bebas text-xl text-white">Rs {selectedMember.fee}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Emergency Contact</p>
                                        <p>{selectedMember.emergencyContact || 'N/A'}</p>
                                    </div>
                                    <div className="col-span-2 bg-[#1a1a1a] p-3 rounded-lg border border-[#2f2f2f]">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Medical Conditions</p>
                                        <p className="text-white">{selectedMember.medicalConditions || 'None reported'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Modal>
                </>
            )}
        </AdminSidebar>
    );
};

export default AdminDashboard;
