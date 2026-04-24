import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getMembers, saveMembers, saveChallan, getFees, payFee, createFee, getFeePeriods, refund } from '../../utils/localStorage';
import { DollarSign, AlertCircle, Calendar, CheckCircle2, FileText, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/shared/Modal';
import html2pdf from "html2pdf.js";

const PaymentsPage = () => {
    const [members, setMembers] = useState([]);
    const [fees, setFees] = useState([]);
    const [filterStatus, setFilterStatus] = useState('All');
    // Month/Year filter states
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Available periods from database
    const [availablePeriods, setAvailablePeriods] = useState([]);

    // Challan states
    const [selectedChallan, setSelectedChallan] = useState(null);
    const [isChallanOpen, setIsChallanOpen] = useState(false);

    useEffect(() => {
        const fetchM = async () => {
            const data = await getMembers();
            setMembers(data || []);
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
            console.log("fees", data);
            setFees(data || []);
        };
        fetchF();
    }, [selectedMonth, selectedYear]);

    // const formattedMembers = members.map(m => {
    //     const matchingFee = fees.find(f => Number(f.member_id) === Number(m.id));
    //     return {
    //         ...m,
    //         feeId: matchingFee ? matchingFee.id : null,
    //         feeStatus: matchingFee ? matchingFee.status : "no record found",
    //         feeAmount: matchingFee ? matchingFee.amount : (m.fee || 0),
    //         refund: matchingFee ? matchingFee.refund : 'null',
    //         paidDate: matchingFee ? matchingFee.paidDate : null
    //     };
    // }).filter(m => m.feeId); // Only include members with fees for this month
    const formattedMembers = fees
    console.log("formattedMembers: ", formattedMembers);
    const totalCollected = formattedMembers.filter(m => m.status === 'Paid' || m.status === 'paid').reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const pendingAmount = formattedMembers.filter(m => m.status === 'Pending' || m.status === 'pending').reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const refunded = formattedMembers.filter(m => m.refund === 'refunded').reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
    console.log("refunded: ", refunded);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Get unique months and years from available periods
    const availableMonths = [...new Set(availablePeriods.map(p => p.month))].sort((a, b) => a - b);
    const availableYears = [...new Set(availablePeriods.map(p => p.year))].sort((a, b) => b - a);
    const currentMonthLabel = `${monthNames[selectedMonth - 1]} ${selectedYear}`;

    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

    const formatRs = (n) => `Rs ${Number(n || 0).toLocaleString()}`;

    const generateChallanNo = () => {
        return `CHL-${Date.now().toString(36).toUpperCase()}`;
    };

    const nextMonthDate = () => {
        const d = new Date();
        d.setMonth(d.getMonth() + 1);
        return d.toISOString().split('T')[0];
    };
    const printChallan = async (challan) => {
        const element = document.createElement("div");
        element.innerHTML = `
        <div style="font-family: Arial; padding: 24px; color: #111;">
            <div style="border: 1px solid #ddd; border-radius: 10px; padding: 18px; max-width: 720px; margin: 0 auto;">
                <h1 style="margin:0 0 6px; font-size:18px;">FITZON Gym Challan</h1>
                <div style="color:#555; font-size:12px;">Generated for fee payment</div>
                <hr/>

                <div style="display:flex; justify-content:space-between;">
                    <div><b>Challan No:</b> ${challan.id}</div>
                    <div><b>Paid Date:</b> ${challan.paidDate}</div>
                </div>

                <div style="margin-top:10px;">
                    <b>Member:</b> ${challan.memberName}<br/>
                    <b>Phone:</b> ${challan.phone || "N/A"}
                </div>

                <div style="margin-top:10px;">
                    <b>Address:</b> ${challan.address || "N/A"}
                </div>

                <hr/>

                <div style="display:flex; justify-content:space-between;">
                    <div><b>Amount:</b> ${formatRs(challan.amount)}</div>
                    <div><b>Due Date:</b> ${challan.dueDate || "N/A"}</div>
                </div>

                <div style="margin-top:15px;">
                    Status: <b>Paid</b>
                </div>
                <div style="display:flex; justify-content:center"><b>Payment Method:</b> ${challan.paymentmethod}</div>
            </div>
            <script>window.onload = function(){ window.print(); };</script>
        </div>
    `;

        const opt = {
            margin: 0.3,
            filename: `challan-${challan.id}.pdf`,
            image: {
                type: "jpeg",
                quality: 1 // 🔥 highest quality
            },
            html2canvas: {
                scale: 3, // 🔥 important (default is ~1)
                useCORS: true
            },
            jsPDF: {
                unit: "in",
                format: "a4",
                orientation: "portrait"
            }
        };

        try {
            // 🔥 Generate PDF as Blob
            const pdfBlob = await html2pdf().from(element).set(opt).outputPdf("blob");

            // 🔥 Send to backend
            const formData = new FormData();
            formData.append("file", pdfBlob, `challan-${challan.id}.pdf`);
            formData.append("phone", challan.phone);

            await fetch("http://localhost:3000/send-whatsapp", {
                method: "POST",
                body: formData
            });

            alert("Challan sent to WhatsApp successfully!");
            const w = window.open('', '_blank');
            if (!w) {
                toast.error('Popup blocked. Please allow popups to print challan.');
                return;
            }
            w.document.write(element.innerHTML);
            w.document.close();


        } catch (err) {
            console.error(err);
            alert("Error generating/sending PDF");
        }
    };

    const markAsPaidAndGenerateChallan = async (memberId) => {
        const member = formattedMembers.find(m => m.member_id === memberId);
        if (!member) return;

        try {
            // Find the fee record ID for this member in this month/year
            const feeRecord = fees.find(f => Number(f.member_id) === Number(memberId) && f.month === selectedMonth && f.year === selectedYear);

            console.log("Member ID:", memberId);
            console.log("Selected Month/Year:", selectedMonth, selectedYear);
            console.log("All fees:", fees);
            console.log("Found fee record:", feeRecord);

            if (!feeRecord) {
                toast.error('Fee record not found for this member.');
                return;
            }
            const method = prompt("method of payment: ");
            // Mark the fee as paid using the fee ID
            console.log("Marking fee as paid with ID:", feeRecord.id);
            // await payFee(feeRecord);
            console.log(feeRecord)
            await payFee({
                member_id: feeRecord.member_id,
                amount: Number(feeRecord.amount || 0),
                month: selectedMonth,
                year: selectedYear,
                status: 'Paid',
                paid_date: new Date().toISOString().split('T')[0],
                method: method
            })

            // Refresh fees
            const updatedFees = await getFees(selectedMonth, selectedYear);
            console.log("Updated fees:", updatedFees);
            setFees(updatedFees || []);

            const challanId = generateChallanNo();
            const paidDate = new Date().toISOString().split('T')[0];

            const challan = {
                id: challanId,
                memberId: member.member_id,
                memberName: member.name,
                phone: member.phone,
                address: member.address || '',
                amount: Number(member.amount || 0),
                dueDate: member.nextPaymentDate || '',
                paidDate,
                paymentmethod: method,
                createdAt: new Date().toISOString(),
            };

            await saveChallan(challan);

            toast.success('Payment marked as paid. Challan generated!');
            setSelectedChallan(challan);
            setIsChallanOpen(true);
        } catch (error) {
            console.error("Error marking payment as paid:", error);
            toast.error('Failed to mark payment as paid.');
        }
    };

    const filteredMembers = formattedMembers.filter(m => {
        let matchesStatus = filterStatus === 'All' ? true : m.status === filterStatus;
        return matchesStatus;
    });

    return (
        <AdminSidebar>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-1">Payments Overview</h1>
                <p className="text-gray-400">Manage member subscriptions and revenue</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="fitzon-card bg-gradient-to-br from-[#111] to-[#0a1a0a] border-green-500/20 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-gray-400 font-medium text-sm">Total Collected</h3>
                        <div className="p-2 rounded-lg bg-green-500 bg-opacity-10">
                            <DollarSign className="w-5 h-5 text-green-500" />
                        </div>
                    </div>
                    <div className="mt-2 group-hover:scale-105 transition-transform origin-left">
                        <span className="text-4xl font-bebas text-white">Rs {totalCollected.toLocaleString()}</span>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-green-500 opacity-5 rounded-full blur-2xl"></div>
                </div>

                <div className="fitzon-card bg-gradient-to-br from-[#111] to-[#1a0a0a] border-red-500/20 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-gray-400 font-medium text-sm">Pending Amount</h3>
                        <div className="p-2 rounded-lg bg-red-500 bg-opacity-10">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                    </div>
                    <div className="mt-2 group-hover:scale-105 transition-transform origin-left">
                        <span className="text-4xl font-bebas text-white">Rs {pendingAmount.toLocaleString()}</span>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-red-500 opacity-5 rounded-full blur-2xl"></div>
                </div>

                <div className="fitzon-card relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-gray-400 font-medium text-sm">Selected Period</h3>
                        <div className="p-2 rounded-lg bg-neon bg-opacity-10">
                            <Calendar className="w-5 h-5 text-neon" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-2xl font-bold text-white">{currentMonthLabel}</span>
                    </div>
                </div>
                <div className="fitzon-card bg-gradient-to-br from-[#111] to-[#1a0a0a] border-red-500/20 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-gray-400 font-medium text-sm">Refunded Amount</h3>
                        <div className="p-2 rounded-lg bg-red-500 bg-opacity-10">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                    </div>
                    <div className="mt-2 group-hover:scale-105 transition-transform origin-left">
                        <span className="text-4xl font-bebas text-white">Rs {refunded.toLocaleString()}</span>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-red-500 opacity-5 rounded-full blur-2xl"></div>
                </div>
            </div>

            <div className="fitzon-card p-0 overflow-hidden">
                <div className="p-6 border-b border-[#1f1f1f] flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#151515]">
                    <h3 className="text-xl font-bold">Transaction History</h3>
                    <div className="flex gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                            <select
                                className="input-field py-2 bg-[#1a1a1a] w-auto"
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
                                className="input-field py-2 bg-[#1a1a1a] w-auto"
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
                        <select
                            className="input-field py-2 bg-[#1a1a1a] w-auto"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#1a1a1a] text-gray-400 text-sm border-b border-[#1f1f1f] uppercase tracking-wider">
                            <tr>
                                <th className="p-4 font-medium">Member</th>
                                <th className="p-4 font-medium">Amount</th>
                                <th className="p-4 font-medium">Due Date</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Payment Method</th>
                                <th className="p-4 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1f1f1f]">
                            {filteredMembers.map((member) => (
                                <tr key={member.id} className="hover:bg-[#111111] transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-dark border border-[#333] flex items-center justify-center text-neon font-bold text-xs">
                                                {getInitials(member.name)}
                                            </div>
                                            <div>
                                                <span className="font-bold">{member.name}</span>
                                                <div className="text-xs text-gray-500 mt-0.5">{member.phone || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="font-bebas text-lg tracking-wide">{formatRs(member.amount)}</span>
                                    </td>
                                    <td className="p-4 text-gray-400">{member.status === 'Paid' ? member.paidDate : 'Overdue'}</td>
                                    <td className="p-4">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${member.status === 'Paid' || member.status === 'paid' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className="font-bebas text-lg tracking-wide">{member.paymentmethod}</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        {member.status === 'Pending' || member.status === 'pending' ? (
                                            <button
                                                onClick={() => markAsPaidAndGenerateChallan(member.member_id)}
                                                className="btn-neon py-1.5 px-3 text-xs w-full sm:w-auto overflow-hidden whitespace-nowrap"
                                            >
                                                <CreditCard className="w-4 h-4" />
                                                <span className="ml-2">Pay & Challan</span>
                                            </button>
                                        ) : (
                                            <span className="inline-flex items-center gap-2 text-gray-500 text-sm italic">
                                                <FileText className="w-4 h-4" />
                                                Paid
                                                {
                                                    member.refund == "refunded" ? (
                                                        <>
                                                            <FileText className="w-4 h-4"></FileText>
                                                            refunded
                                                        </>
                                                    ) : (
                                                        <button onClick={async () => {
                                                            await refund(member.member_id, selectedMonth, selectedYear);
                                                            const updatedFees = await getFees(selectedMonth, selectedYear);
                                                            setFees(updatedFees || []);

                                                            toast.success("Refund successful");
                                                        }} className="btn-neon py-1.5 px-3 text-xs w-full sm:w-auto">
                                                            Refund
                                                        </button>
                                                    )
                                                }
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredMembers.length === 0 && (
                        <div className="text-center py-10 text-gray-500">No payment records found.</div>
                    )}
                </div>
            </div>

            {/* Challan Modal */}
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
                                        Fee Challan (Admin)
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
                                <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Payment Method</div>
                                    <div className="text-neon font-bebas text-3xl mt-1">
                                        {selectedChallan.paymentmethod}
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
        </AdminSidebar>
    );
};

export default PaymentsPage;
