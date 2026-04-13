import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, FileEdit, Filter } from 'lucide-react';
import { getMembers, getPreviousMembers } from '../../utils/localStorage';
import SubAdminSidebar from '../../components/sub_admin/SubAdminSidebar';
import Modal from '../../components/shared/Modal';

const SubAdminMembersPage = () => {
    // const [members] = useState(() => getMembers());
    const [members, setMembers] = useState([]);
    const [previousMembers, setPMembers] = useState([]);

    useEffect(() => {
        async function loadMembers() {
            const data = await getMembers();
            setMembers(data);
            console.log("members data is : ", data);
        }

        loadMembers();
    }, []);
    useEffect(() => {
        async function loadPMembers() {
            const data = await getPreviousMembers();
            console.log("previous member data is: ", data)
            setPMembers(data);
        }
        loadPMembers();
    }, []);

    // 
    const [tab, setTab] = useState('active'); // 'active' | 'inactive'
    const [searchTerm, setSearchTerm] = useState('');
    const [genderFilter, setGenderFilter] = useState('All'); // 'All' | 'Male' | 'Female'
    const [selectedMember, setSelectedMember] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const navigate = useNavigate();

    const { activeMembersCount, inactiveMembersCount } = useMemo(() => {
        const active = members.length;
        // const active = members.filter((m) => m.status === 'Active').length;
        const inactive = previousMembers.length;
        // const inactive = members.filter((m) => m.status === 'Inactive').length;
        return { activeMembersCount: active, inactiveMembersCount: inactive };
    }, [members]);

    // const filteredMembers = useMemo(() => {
    //     return members.filter((member) => {
    //         if (tab === 'active' && member.length > -1) return false;
    //         // if (tab === 'active' && member.status !== 'Active') return false;
    //         if (tab === 'inactive' && previousMembers.length > -1) return false;
    //         // if (tab === 'inactive' && member.status !== 'Inactive') return false;

    //         let matchSearch = true;
    //         if (searchTerm.trim()) {
    //             const q = searchTerm.toLowerCase();
    //             matchSearch = (member.name || '').toLowerCase().includes(q) ||
    //                 (member.phone || '').toLowerCase().includes(q) ||
    //                 (member.address || '').toLowerCase().includes(q);
    //         }
    //         if (!matchSearch) return false;

    //         if (genderFilter !== 'All' && member.gender !== genderFilter) return false;

    //         return true;
    //     });
    // }, [members, tab, searchTerm, genderFilter]);



    const filteredMembers = useMemo(() => {
        // Step 1: choose dataset based on tab
        const data = tab === 'active' ? members : previousMembers;

        // Step 2: apply filters
        return data.filter((member) => {
            let matchSearch = true;

            if (searchTerm.trim()) {
                const q = searchTerm.toLowerCase();
                matchSearch =
                    (member.name || '').toLowerCase().includes(q) ||
                    (member.phone || '').toLowerCase().includes(q) ||
                    (member.address || '').toLowerCase().includes(q);
            }

            if (!matchSearch) return false;

            if (genderFilter !== 'All' && member.gender !== genderFilter) return false;

            return true;
        });
    }, [members, previousMembers, tab, searchTerm, genderFilter]);


    //
    const getInitials = (name) =>
        name?.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

    return (
        <SubAdminSidebar>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Members</h1>
                    <p className="text-gray-400">Current: Active members. Previous: Inactive members.</p>
                </div>

                <button
                    onClick={() => navigate('/sub_admin/members/add')}
                    className="btn-neon text-sm py-2.5 px-6"
                >
                    <Plus size={18} /> Add Member
                </button>
            </div>

            <div className="fitzon-card p-0 overflow-hidden mb-6">
                <div className="p-6 border-b border-[#1f1f1f] flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-[#151515]">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, phone, or address..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 input-field"
                        />
                    </div>

                    <div className="flex gap-3 items-center flex-wrap">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
                            <select
                                value={genderFilter}
                                onChange={(e) => setGenderFilter(e.target.value)}
                                className="pl-10 input-field appearance-none cursor-pointer pr-10 min-w-[140px]"
                            >
                                <option value="All">All Genders</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <button
                            onClick={() => setTab('active')}
                            className={`px-4 py-2 rounded-lg border transition-all ${tab === 'active'
                                ? 'border-neon bg-[#1a1a1a] text-neon shadow-[0_0_15px_rgba(204,255,0,0.12)]'
                                : 'border-[#2f2f2f] text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                                }`}
                        >
                            Current ({activeMembersCount})
                        </button>
                        <button
                            onClick={() => setTab('inactive')}
                            className={`px-4 py-2 rounded-lg border transition-all ${tab === 'inactive'
                                ? 'border-neon bg-[#1a1a1a] text-neon shadow-[0_0_15px_rgba(204,255,0,0.12)]'
                                : 'border-[#2f2f2f] text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                                }`}
                        >
                            Previous ({inactiveMembersCount})
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#1a1a1a] text-gray-400 text-sm border-b border-[#1f1f1f] uppercase tracking-wider">
                            <tr>
                                <th className="p-4 font-medium w-20">Member</th>
                                <th className="p-4 font-medium">Contact</th>
                                <th className="p-4 font-medium">Address</th>
                                <th className="p-4 font-medium">Fee</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#1f1f1f]">
                            {filteredMembers.map((member) => (
                                <tr key={member.id} className="hover:bg-[#111111] transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-dark border border-[#333] flex items-center justify-center text-neon font-bold text-sm">
                                                {getInitials(member.name)}
                                            </div>
                                            <div className="min-w-[120px]">
                                                <div className="font-bold text-white">{member.name}</div>
                                                <div className="text-xs text-gray-500">{member.joinDate || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-4">
                                        <div className="text-sm text-gray-300">{member.phone || 'N/A'}</div>
                                        <div
                                            className={`text-xs font-bold inline-block mt-2 px-3 py-1 rounded-full border ${member.status === 'Active'
                                                ? 'text-green-500 border-green-500/20 bg-green-500/10'
                                                : 'text-red-500 border-red-500/20 bg-red-500/10'
                                                }`}
                                        >
                                            {member.status || 'Inactive'}
                                        </div>
                                    </td>

                                    <td className="p-4">
                                        <div className="text-sm text-gray-400 truncate max-w-[280px]" title={member.address || ''}>
                                            {member.address || 'N/A'}
                                        </div>
                                    </td>

                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-bebas text-lg text-white">Rs {Number(member.fee || 0).toLocaleString()}</span>
                                            <span className="text-xs text-gray-500 mt-1">Due: {member.nextPaymentDate || 'N/A'}</span>
                                        </div>
                                    </td>

                                    <td className="p-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedMember(member);
                                                    setIsViewModalOpen(true);
                                                }}
                                                className="p-2 text-gray-400 hover:text-white bg-[#1a1a1a] rounded-lg border border-[#2f2f2f] hover:border-white transition-colors"
                                                title="View"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => navigate(`/sub_admin/members/edit/${member.id}`)}
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

                    {filteredMembers.length === 0 && (
                        <div className="text-center py-16 text-gray-500 flex flex-col items-center">
                            No members found.
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
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
                                <p className="text-gray-400">{selectedMember.phone || 'N/A'}</p>
                                <div className="flex gap-2 mt-2">
                                    <span className="bg-[#1a1a1a] px-3 py-1 rounded-full text-xs font-bold border border-[#2f2f2f] text-gray-300">
                                        Fee Rs {Number(selectedMember.fee || 0).toLocaleString()}
                                    </span>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold border ${selectedMember.feeStatus === 'Paid'
                                            ? 'text-green-500 border-green-500/20 bg-green-500/10'
                                            : 'text-red-500 border-red-500/20 bg-red-500/10'
                                            }`}
                                    >
                                        {selectedMember.feeStatus}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Address</p>
                                <p className="text-white">{selectedMember.address || 'N/A'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Next Due</p>
                                <p className="text-white">{selectedMember.nextPaymentDate || 'N/A'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Joined</p>
                                <p className="text-white">{selectedMember.joinDate || 'N/A'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Gender</p>
                                <p className="text-white">{selectedMember.gender || 'Not specified'}</p>
                            </div>
                        </div>

                        <div className="pt-2">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Member Type</p>
                            <p className="text-white font-medium">
                                {selectedMember.status === 'Inactive' ? 'Previous (Inactive)' : 'Current (Active)'}
                            </p>
                        </div>
                    </div>
                )}
            </Modal>
        </SubAdminSidebar>
    );
};

export default SubAdminMembersPage;

