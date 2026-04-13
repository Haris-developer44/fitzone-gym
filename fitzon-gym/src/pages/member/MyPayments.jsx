import { useContext, useState } from 'react';
import MemberSidebar from '../../components/member/MemberSidebar';
import { AuthContext } from '../../context/AuthContext';
import { getMembers, saveMembers, getMemberFees } from '../../utils/localStorage';
import { CreditCard, Download, Zap, TrendingUp, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const MyPayments = () => {
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const [isUpgrading, setIsUpgrading] = useState(false);

    const [paymentHistory, setPaymentHistory] = useState([]);

    useEffect(() => {
        if (!currentUser?.id) return;
        const fetchHistory = async () => {
             try {
                 const fees = await getMemberFees(currentUser.id);
                 if (fees) {
                     const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                     const historyMap = fees.map(f => ({
                         id: `TRX-${f.id || Date.now().toString().slice(-4)}`,
                         month: `${monthNames[f.month - 1]} ${f.year}`,
                         amount: f.amount,
                         date: f.paid_date || 'N/A',
                         status: (f.status === 'paid' || f.status === 'Paid') ? 'Paid' : 'Pending',
                         rawMonth: Number(f.month),
                         rawYear: Number(f.year)
                     }));
                     
                     historyMap.sort((a, b) => {
                         if(a.rawYear !== b.rawYear) return b.rawYear - a.rawYear;
                         return b.rawMonth - a.rawMonth;
                     });

                     const curMonth = new Date().getMonth() + 1;
                     const curYear = new Date().getFullYear();
                     const hasCurrent = fees.find(f => Number(f.month) === curMonth && Number(f.year) === curYear);
                     
                     if (!hasCurrent) {
                         historyMap.unshift({
                            id: 'TRX-PENDING',
                            month: `${monthNames[curMonth - 1]} ${curYear} (Current)`,
                            amount: currentUser.fee || 5000,
                            date: 'Pending',
                            status: 'Pending'
                         });
                     }
                     setPaymentHistory(historyMap);
                 }
             } catch(err) {
                 console.error("Error fetching fee history", err);
             }
        };
        fetchHistory();
    }, [currentUser?.id]);

    const handleDownload = () => {
        toast.success('Receipt downloaded successfully');
    };

    const handleUpgrade = (newPlan, newFee) => {
        const members = getMembers();
        const updatedMembers = members.map(m => {
            if (m.id === currentUser.id) {
                return { ...m, plan: newPlan, fee: newFee };
            }
            return m;
        });

        saveMembers(updatedMembers);

        const updatedUser = { ...currentUser, plan: newPlan, fee: newFee };
        setCurrentUser(updatedUser);
        localStorage.setItem('fitzon_auth', JSON.stringify(updatedUser));

        toast.success(`Successfully upgraded to ${newPlan} Plan!`);
        setIsUpgrading(false);
    };

    const showProUpgrade = currentUser.plan === 'Basic';
    const showEliteUpgrade = currentUser.plan === 'Basic' || currentUser.plan === 'Pro';

    return (
        <MemberSidebar>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-1">Billing & Payments</h1>
                <p className="text-gray-400">Manage your subscription and view payment history</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-1 space-y-6">
                    <div className="fitzon-card bg-gradient-to-br from-[#1a1a1a] to-[#111111] border-neon/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <CreditCard className="w-32 h-32 text-neon" />
                        </div>

                        <h3 className="text-gray-400 uppercase tracking-widest text-xs mb-2">Current Plan</h3>
                        <div className="flex items-baseline gap-2 mb-6">
                            <h2 className="text-4xl font-bebas text-white tracking-wide">{currentUser.plan}</h2>
                            <span className="text-neon font-bold">Plan</span>
                        </div>

                        <div className="mb-6">
                            <span className="text-gray-400 text-sm block mb-1">Monthly Fee</span>
                            <span className="text-3xl font-bebas text-white">Rs {currentUser.fee}</span>
                        </div>

                        <div className="pt-6 border-t border-[#2f2f2f]">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-400 text-sm">Action</span>
                                <span className={`px-2 py-1 rounded text-xs font-bold bg-green-500/20 text-green-500`}>
                                    Active
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Member ID</span>
                                <span className="text-white font-medium">{currentUser.id}</span>
                            </div>
                        </div>

                        {(showProUpgrade || showEliteUpgrade) && (
                            <button
                                onClick={() => setIsUpgrading(!isUpgrading)}
                                className="w-full mt-6 btn-outline border-[#2f2f2f] text-gray-300 hover:border-neon hover:bg-neon hover:text-black py-2.5 flex items-center justify-center gap-2 text-sm"
                            >
                                <TrendingUp className="w-4 h-4" /> Upgrade Plan
                            </button>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8">

                    {isUpgrading && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                            <h3 className="text-xl font-bold text-neon mb-4 flex items-center gap-2">
                                <Zap className="w-5 h-5" /> Level Up Your Fitness
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {showProUpgrade && (
                                    <div className="fitzon-card border-[#2f2f2f] hover:border-neon transition-colors group cursor-pointer" onClick={() => handleUpgrade('Pro', 5500)}>
                                        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-neon transition-colors">Pro Plan</h4>
                                        <p className="font-bebas text-3xl mb-4">Rs 5,500 <span className="text-sm font-sans text-gray-500">/mo</span></p>
                                        <ul className="space-y-2 mb-6 text-sm text-gray-300">
                                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-neon" /> Full Gym Access</li>
                                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-neon" /> All Group Classes</li>
                                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-neon" /> Locker & Towels</li>
                                        </ul>
                                        <button className="btn-outline w-full py-2 text-sm border-gray-600 group-hover:border-neon">Upgrade to Pro</button>
                                    </div>
                                )}

                                {showEliteUpgrade && (
                                    <div className="fitzon-card border-neon shadow-[0_0_15px_rgba(204,255,0,0.1)] group cursor-pointer relative overflow-hidden" onClick={() => handleUpgrade('Elite', 9000)}>
                                        <div className="absolute top-0 right-0 bg-neon text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase">Best Value</div>
                                        <h4 className="text-xl font-bold text-white mb-2">Elite Plan</h4>
                                        <p className="font-bebas text-3xl mb-4 text-neon">Rs 9,000 <span className="text-sm font-sans text-gray-500">/mo</span></p>
                                        <ul className="space-y-2 mb-6 text-sm text-gray-300">
                                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-neon" /> 24/7 VIP Access</li>
                                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-neon" /> Personal Trainer</li>
                                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-neon" /> Custom Diet Plan</li>
                                        </ul>
                                        <button className="btn-neon w-full py-2 text-sm">Upgrade to Elite</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="fitzon-card p-0 overflow-hidden">
                        <div className="p-6 border-b border-[#1f1f1f] bg-[#151515]">
                            <h3 className="text-xl font-bold">Payment History</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#1a1a1a] text-gray-400 text-xs border-b border-[#1f1f1f] uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4 font-medium">Transaction ID</th>
                                        <th className="p-4 font-medium">Month</th>
                                        <th className="p-4 font-medium">Date</th>
                                        <th className="p-4 font-medium">Amount</th>
                                        <th className="p-4 font-medium">Status</th>
                                        <th className="p-4 font-medium text-right">Receipt</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1f1f1f] text-sm">
                                    {paymentHistory.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-[#111111] transition-colors">
                                            <td className="p-4 font-mono text-gray-400">{payment.id}</td>
                                            <td className="p-4 font-medium text-white">{payment.month}</td>
                                            <td className="p-4 text-gray-400">{payment.date}</td>
                                            <td className="p-4 font-bebas text-lg tracking-wide">Rs {payment.amount}</td>
                                            <td className="p-4">
                                                <span className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${payment.status === 'Paid' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                    }`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={handleDownload}
                                                    disabled={payment.status === 'Pending'}
                                                    className={`p-2 rounded-lg transition-colors border ${payment.status === 'Paid'
                                                            ? 'text-neon border-neon/30 hover:bg-neon hover:text-black cursor-pointer'
                                                            : 'text-gray-600 border-gray-800 cursor-not-allowed'
                                                        }`}
                                                    title="Download Receipt"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </MemberSidebar>
    );
};

export default MyPayments;
