import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Modal from '../../components/shared/Modal';
import { Search, Plus, Filter, FileEdit, Trash2, Eye, Users } from 'lucide-react';
import { getMembers, deleteMember, getPreviousMembers } from '../../utils/localStorage';
import toast from 'react-hot-toast';

const MembersPage = () => {
    const [members, setMembers] = useState([]);
    const [previousMembers, setPMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('Active'); // 'All' | 'Active' | 'Inactive'
    const [genderFilter, setGenderFilter] = useState('All'); // 'All' | 'Male' | 'Female'

    const [selectedMember, setSelectedMember] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const data = await getMembers();
                setMembers(data || []);
            } catch (error) {
                console.error("Error fetching members:", error);
                setMembers([]);
            }
        };
        fetchMembers();
    }, []);
    useEffect(() => {
        const FetchPMembers = async () => {
            const data = await getPreviousMembers();
            setPMembers(data);
        };
        FetchPMembers();
    }, [])

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this member? This action cannot be undone.")) {
            const updatedMembers = members.filter(m => m.id !== id);
            setMembers(updatedMembers);
            deleteMember(id);
            toast.success('Member deleted successfully');
        }
    };

    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

    // const filteredMembers = members.filter(member => {
    //     const matchesSearch = (member.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         (member.email || '').toLowerCase().includes(searchTerm.toLowerCase());

    //     let matchesFilter = true;
    //     if (filterType !== 'All') {
    //         matchesFilter = member.status === filterType;
    //     }

    //     let matchesGender = true;
    //     if (genderFilter !== 'All') {
    //         matchesGender = member.gender === genderFilter;
    //     }

    //     return matchesSearch && matchesFilter && matchesGender;
    // });


    const filteredMembers = (() => {
        // Step 1: Select dataset based on filter
        const data =
            filterType === 'Active'
                ? members
                : filterType === 'Inactive'
                    ? previousMembers
                    : [...members, ...previousMembers]; // "All"
        console.log("data according to the filter is: ", data);
        // Step 2: Apply filtering
        return data.filter((member) => {
            const q = searchTerm.toLowerCase();

            const matchesSearch =
                (member.name || '').toLowerCase().includes(q) ||
                (member.email || '').toLowerCase().includes(q);

            let matchesGender = true;
            if (genderFilter !== 'All') {
                matchesGender = member.gender === genderFilter;
            }

            return matchesSearch && matchesGender;
        });
    })();

    //

    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
    const currentMembers = filteredMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <AdminSidebar>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Members Base</h1>
                    <p className="text-gray-400">Manage all registered gym members</p>
                </div>
                <button
                    onClick={() => navigate('/admin/members/add')}
                    className="btn-neon text-sm py-2.5 px-6"
                >
                    <Plus size={18} /> Add New Member
                </button>
            </div>

            <div className="fitzon-card p-0 overflow-hidden">
                {/* Toolbar */}
                <div className="p-6 border-b border-[#1f1f1f] flex flex-col sm:flex-row gap-4 justify-between bg-[#151515]">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="pl-10 input-field"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
                            <select
                                value={filterType}
                                onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
                                className="pl-10 input-field appearance-none cursor-pointer pr-10 min-w-[150px]"
                            >
                                <option value="All">All Members</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
                            <select
                                value={genderFilter}
                                onChange={(e) => { setGenderFilter(e.target.value); setCurrentPage(1); }}
                                className="pl-10 input-field appearance-none cursor-pointer pr-10 min-w-[150px]"
                            >
                                <option value="All">All Genders</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#1a1a1a] text-gray-400 text-sm border-b border-[#1f1f1f] uppercase tracking-wider">
                            <tr>
                                <th className="p-4 font-medium w-16 text-center">#</th>
                                <th className="p-4 font-medium">Member</th>
                                <th className="p-4 font-medium">Contact</th>
                                <th className="p-4 font-medium">Fee</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1f1f1f]">
                            {currentMembers.map((member, index) => (
                                <tr key={member.id} className="hover:bg-[#111111] transition-colors">
                                    <td className="p-4 text-center text-gray-500">
                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-dark border border-[#333] flex items-center justify-center text-neon font-bold text-sm">
                                                {getInitials(member.name)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{member.name} <sup>{member.id}</sup></div>
                                                <div className="text-xs text-gray-500">Joined: {member.joinDate}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 min-w-[150px]">
                                        <div className="text-sm text-gray-300 truncate max-w-[200px]" title={member.email}>{member.email}</div>
                                        <div className="text-xs text-gray-500">{member.phone}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col items-start gap-1">
                                            <span className="text-xs text-neon font-bebas tracking-wide">
                                                Rs {member.fee}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1 items-start">
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${member.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-400'}`}>
                                                {member.status || 'Inactive'}
                                            </span>

                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => { setSelectedMember(member); setIsViewModalOpen(true); }}
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
                                            <button
                                                onClick={() => handleDelete(member.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 bg-[#1a1a1a] rounded-lg border border-[#2f2f2f] hover:border-red-500 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {currentMembers.length === 0 && (
                        <div className="text-center py-16 text-gray-500 flex flex-col items-center">
                            <Users className="w-12 h-12 mb-4 opacity-50" />
                            <p>No members found matching your criteria.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-[#1f1f1f] flex justify-between items-center bg-[#151515]">
                        <span className="text-sm text-gray-400">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredMembers.length)} of {filteredMembers.length}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-[#1a1a1a] border border-[#2f2f2f] rounded pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#222]"
                            >
                                Prev
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-[#1a1a1a] border border-[#2f2f2f] rounded pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#222]"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Member Profile">
                {selectedMember && (
                    <div className="space-y-6 text-gray-300">
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 rounded-full border-2 border-neon flex items-center justify-center text-neon font-bold text-4xl">
                                {getInitials(selectedMember.name)}
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-1">{selectedMember.name}</h2>
                                <div className="flex gap-2 mb-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${selectedMember.status === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}`}>{selectedMember.status}</span>
                                </div>
                                <p className="text-sm text-gray-500">Member since {selectedMember.joinDate}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t border-[#1f1f1f]">
                            <div className="space-y-1">
                                <span className="text-xs text-gray-500 uppercase">Email Address</span>
                                <p className="font-medium text-white">{selectedMember.email || 'N/A'}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-gray-500 uppercase">Phone</span>
                                <p className="font-medium text-white">{selectedMember.phone || 'N/A'}</p>
                            </div>
                            <div className="col-span-2 space-y-1">
                                <span className="text-xs text-gray-500 uppercase">Address</span>
                                <p className="font-medium text-white">{selectedMember.address || 'N/A'}</p>
                            </div>
                            <div className="col-span-2 space-y-1 mt-2">
                                <span className="text-xs text-gray-500 uppercase">Gender</span>
                                <p className="font-medium text-white">{selectedMember.gender || 'Not specified'}</p>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-between items-center border-t border-[#1f1f1f]">
                            <div className="space-y-1">
                                <span className="text-xs text-gray-500 uppercase">Membership Plan</span>
                                <p className="font-bebas text-2xl text-neon">{selectedMember.plan || 'Basic'}</p>
                                <div className="mt-2">
                                    <span className="text-xs text-gray-500 uppercase">Monthly Fee</span>
                                    <p className="font-bebas text-xl text-white">Rs {selectedMember.fee}</p>
                                </div>
                            </div>
                            <div className="text-right space-y-1">
                                <span className="text-xs text-gray-500 uppercase">Next Payment Due</span>
                                <p className="font-medium text-white">{selectedMember.nextPaymentDate}</p>
                                <div className="mt-1">
                                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${selectedMember.feeStatus === 'Paid' ? 'bg-green-500/10 text-green-500 border border-green-500/30' : 'bg-red-500/10 text-red-500 border border-red-500/30'}`}>
                                        {selectedMember.feeStatus}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3 flex-wrap">
                            <button
                                onClick={() => { setIsViewModalOpen(false); navigate(`/admin/members/edit/${selectedMember.id}`); }}
                                className="btn-outline flex-1 text-sm py-2"
                            >
                                Edit Member
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </AdminSidebar>
    );
};

export default MembersPage;
