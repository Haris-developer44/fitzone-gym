import { useMemo, useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, CreditCard, FileText, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import SubAdminSidebar from '../../components/sub_admin/SubAdminSidebar';
import Modal from '../../components/shared/Modal';
import { getChallans, getMembers, saveChallans, getFees, payFee, getFeePeriods } from '../../utils/localStorage';

const SubAdminPaymentsPage = () => {
    const [members, setMembers] = useState([]);
    const [fees, setFees] = useState([]);
    const [tab, setTab] = useState('pending'); // 'pending' | 'paid'
    const [selectedChallan, setSelectedChallan] = useState(null);
    const [isChallanOpen, setIsChallanOpen] = useState(false);

    // Month/Year filter states
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Available periods from database
    const [availablePeriods, setAvailablePeriods] = useState([]);

    useEffect(() => {
        const fetchM = async () => {
            const data = await getMembers();
            setMembers(data || []);
            console.log(data);
        };
        fetchM();
    }, []);

    useEffect(() => {
        const fetchPeriods = async () => {
            try {
                const periods = await getFeePeriods();
                setAvailablePeriods(periods || []);

                // Set default to most recent period if available
                if (periods && periods.length > 0) {
                    const mostRecent = periods[0]; // Already sorted by year DESC, month DESC
                    setSelectedMonth(mostRecent.month);
                    setSelectedYear(mostRecent.year);
                }
            } catch (error) {
                console.error("Error fetching fee periods:", error);
            }
        };
        fetchPeriods();
    }, []);

    useEffect(() => {
        const fetchF = async () => {
            const data = await getFees(selectedMonth, selectedYear);
            setFees(data || []);
            console.log("data for selected month:",data);
        };
        fetchF();
    }, [selectedMonth, selectedYear]);

    const formattedMembers = members.map(m => {
        const matchingFee = fees.find(f => Number(f.member_id) === Number(m.id) && Number(f.month) === selectedMonth && Number(f.year) === selectedYear);
        return {
            ...m,
            fee_status: (matchingFee && matchingFee.status && matchingFee.status.toLowerCase() === 'paid') ? 'Paid' : 'Pending',
            feeAmount: matchingFee ? matchingFee.amount : (m.fee || 5000),
            paidDate: matchingFee ? matchingFee.paid_date : null
        };
    });
    console.log("format: ", formattedMembers);
    const pendingMembers = useMemo(
        () => formattedMembers.filter((m) => m.fee_status === 'Pending'),
        // () => formattedMembers.filter((m) => m.status === 'Active' && m.fee_status === 'Pending'),
        [formattedMembers]
    );
    console.log("pending: ", pendingMembers);
    const paidMembers = useMemo(
        () => formattedMembers.filter((m) => m.status === 'Active' && m.fee_status === 'Paid'),
        [formattedMembers]
    );

    const filteredMembers = tab === 'pending' ? pendingMembers : paidMembers;

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Get unique months and years from available periods
    const availableMonths = [...new Set(availablePeriods.map(p => p.month))].sort((a, b) => a - b);
    const availableYears = [...new Set(availablePeriods.map(p => p.year))].sort((a, b) => b - a);

    const formatRs = (n) => `Rs ${Number(n || 0).toLocaleString()}`;

    const nextMonthDate = () => {
        const d = new Date();
        d.setMonth(d.getMonth() + 1);
        return d.toISOString().split('T')[0];
    };

    const generateChallanNo = () => {
        return `CHL-${Date.now().toString(36).toUpperCase()}`;
    };

    const printChallan = (challan) => {
        const html = `
        <html>
          <head>
            <title>${challan.id}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
              .box { border: 1px solid #ddd; border-radius: 10px; padding: 18px; max-width: 720px; margin: 0 auto; }
              h1 { margin: 0 0 6px; font-size: 18px; }
              .muted { color: #555; font-size: 12px; }
              .row { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-top: 8px; }
              .k { font-size: 12px; color: #555; }
              .v { font-size: 14px; font-weight: bold; }
              hr { border: none; border-top: 1px solid #eee; margin: 14px 0; }
              .footer { margin-top: 18px; font-size: 12px; color: #555; }
            </style>
          </head>
          <body>
            <div class="box">
              <h1>FITZON Gym Challan</h1>
              <div class="muted">Generated for fee payment</div>
              <hr />
              <div class="row">
                <div><div class="k">Challan No</div><div class="v">${challan.id}</div></div>
                <div><div class="k">Paid Date</div><div class="v">${challan.paidDate}</div></div>
              </div>
              <div class="row">
                <div><div class="k">Member</div><div class="v">${challan.memberName}</div></div>
                <div><div class="k">Phone</div><div class="v">${challan.phone || 'N/A'}</div></div>
              </div>
              <div style="margin-top: 10px;">
                <div class="k">Address</div>
                <div class="v" style="font-weight: normal;">${challan.address || 'N/A'}</div>
              </div>
              <hr />
              <div class="row">
                <div><div class="k">Amount</div><div class="v">${formatRs(challan.amount)}</div></div>
                <div><div class="k">Due Date</div><div class="v">${challan.dueDate || 'N/A'}</div></div>
              </div>
              <div class="footer">
                Status: <b>Paid</b>
              </div>
            </div>
            <script>window.onload = function(){ window.print(); };</script>
          </body>
        </html>
        `;

        const w = window.open('', '_blank');
        if (!w) {
            toast.error('Popup blocked. Please allow popups to print challan.');
            return;
        }
        w.document.write(html);
        w.document.close();
    };

    const markAsPaidAndGenerateChallan = async (memberId) => {
        const member = formattedMembers.find(m => m.id === memberId);
        if (!member) return;
        if (member.status !== 'Active') return;
        if (member.fee_status !== 'Pending') return;

        try {
            await payFee({
                member_id: member.id,
                amount: Number(member.feeAmount || 0),
                month: selectedMonth,
                year: selectedYear,
                status: 'Paid',
                paid_date: new Date().toISOString().split('T')[0]
            });

            // Refresh fees
            const updatedFees = await getFees(selectedMonth, selectedYear);
            setFees(updatedFees || []);

            const challanId = generateChallanNo();
            const paidDate = new Date().toISOString().split('T')[0];

            const challan = {
                id: challanId,
                memberId: member.id,
                memberName: member.name,
                phone: member.phone,
                address: member.address || '',
                amount: Number(member.feeAmount || 0),
                dueDate: member.nextPaymentDate || '',
                paidDate,
                createdAt: new Date().toISOString(),
            };

            const challans = getChallans();
            challans.unshift(challan);
            saveChallans(challans);

            toast.success('Payment marked as paid. Challan generated!');
            setSelectedChallan(challan);
            setIsChallanOpen(true);
        } catch (error) {
            toast.error('Failed to update member status.');
        }
    };

    return (
        <SubAdminSidebar>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-1">Fee Management</h1>
                <p className="text-gray-400">Mark fees as paid and generate challans.</p>
            </div>

            <div className="fitzon-card p-0 overflow-hidden mb-6">
                <div className="p-6 border-b border-[#1f1f1f] flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-[#151515]">
                    <div>
                        <h3 className="text-xl font-bold">Transactions</h3>
                        <div className="flex items-center gap-2 mt-2">
                            <select
                                className="input-field py-1 bg-[#1a1a1a] w-auto text-sm"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            >
                                {availableMonths.length > 0 ? (
                                    availableMonths.map(month => (
                                        <option key={month} value={month}>
                                            {monthNames[month - 1]}
                                        </option>
                                    ))
                                ) : (
                                    <option value={selectedMonth}>
                                        {monthNames[selectedMonth - 1]}
                                    </option>
                                )}
                            </select>
                            <select
                                className="input-field py-1 bg-[#1a1a1a] w-auto text-sm"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                            >
                                {availableYears.length > 0 ? (
                                    availableYears.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))
                                ) : (
                                    <option value={selectedYear}>{selectedYear}</option>
                                )}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setTab('pending')}
                            className={`px-4 py-2 rounded-lg border transition-all ${tab === 'pending'
                                ? 'border-neon bg-[#1a1a1a] text-neon shadow-[0_0_15px_rgba(204,255,0,0.12)]'
                                : 'border-[#2f2f2f] text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> Pending Fees
                                <span className="text-xs text-gray-500">
                                    ({pendingMembers.length})
                                </span>
                            </span>
                        </button>
                        <button
                            onClick={() => setTab('paid')}
                            className={`px-4 py-2 rounded-lg border transition-all ${tab === 'paid'
                                ? 'border-neon bg-[#1a1a1a] text-neon shadow-[0_0_15px_rgba(204,255,0,0.12)]'
                                : 'border-[#2f2f2f] text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Paid Fees
                                <span className="text-xs text-gray-500">
                                    ({paidMembers.length})
                                </span>
                            </span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#1a1a1a] text-gray-400 text-sm border-b border-[#1f1f1f] uppercase tracking-wider">
                            <tr>
                                <th className="p-4 font-medium">Member</th>
                                <th className="p-4 font-medium">Fee</th>
                                <th className="p-4 font-medium">Due Date</th>
                                <th className="p-4 font-medium">Address</th>
                                <th className="p-4 font-medium text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#1f1f1f]">
                            {filteredMembers.map((member) => (
                                <tr key={member.id} className="hover:bg-[#111111] transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-white">{member.name}</div>
                                        <div className="text-xs text-gray-500 mt-1">{member.phone || 'N/A'}</div>
                                    </td>

                                    <td className="p-4 text-gray-400">
                                        <span className="font-bebas text-lg tracking-wide">
                                            {formatRs(member.fee)}
                                        </span>
                                    </td>

                                    <td className="p-4 text-gray-400 text-sm">
                                        <span className="inline-flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                            {member.fee_status === 'Paid' ? member.paidDate : 'Overdue'}
                                        </span>
                                    </td>

                                    <td className="p-4">
                                        <div className="text-sm text-gray-400 truncate max-w-[300px]" title={member.address || ''}>
                                            {member.address || 'N/A'}
                                        </div>
                                    </td>

                                    <td className="p-4 text-right">
                                        {member.fee_status === 'Pending' ? (
                                            <button
                                                onClick={() => markAsPaidAndGenerateChallan(member.id)}

                                                className="btn-neon py-1.5 px-3 text-xs w-full sm:w-auto"
                                            >
                                                <CreditCard className="w-4 h-4" />
                                                <span className="ml-2">Pay & Generate Challan</span>
                                            </button>
                                        ) : (
                                            <span className="inline-flex items-center gap-2 text-gray-500 text-sm italic">
                                                <FileText className="w-4 h-4" />
                                                Settled
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {filteredMembers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center text-gray-500">
                                        No records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={isChallanOpen}
                onClose={() => setIsChallanOpen(false)}
                title="Challan Preview"
            >
                {selectedChallan && (
                    <div className="space-y-6">
                        <div className="fitzon-card p-5 bg-[#0d0d0d] border-[#2f2f2f]">
                            <div className="flex justify-between items-start gap-6">
                                <div>
                                    <div className="text-neon font-bebas tracking-widest text-xl">
                                        FITZON GYM
                                    </div>
                                    <div className="text-sm text-gray-400 mt-1">
                                        Fee Challan (Sub Admin)
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-500 uppercase">Challan No</div>
                                    <div className="text-white font-bebas text-2xl">
                                        {selectedChallan.id}
                                    </div>
                                </div>
                            </div>

                            <hr className="my-5 border-[#1f1f1f]" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Paid Date</div>
                                    <div className="text-white font-medium mt-1">{selectedChallan.paidDate}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Due Date</div>
                                    <div className="text-white font-medium mt-1">{selectedChallan.dueDate || 'N/A'}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Member Name</div>
                                    <div className="text-white font-medium mt-1">{selectedChallan.memberName}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Phone</div>
                                    <div className="text-white font-medium mt-1">{selectedChallan.phone || 'N/A'}</div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="text-xs text-gray-500 uppercase tracking-wider">Address</div>
                                <div className="text-white font-medium mt-1">
                                    {selectedChallan.address || 'N/A'}
                                </div>
                            </div>

                            <div className="mt-6 flex justify-between items-end gap-4">
                                <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Amount Paid</div>
                                    <div className="text-neon font-bebas text-3xl mt-1">
                                        {formatRs(selectedChallan.amount)}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/10 text-green-500 font-bold text-xs">
                                        <CheckCircle2 className="w-4 h-4" />
                                        PAID
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => printChallan(selectedChallan)}
                                className="btn-neon"
                            >
                                Print Challan
                            </button>
                            <button
                                onClick={() => setIsChallanOpen(false)}
                                className="btn-outline"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </SubAdminSidebar>
    );
};

export default SubAdminPaymentsPage;

