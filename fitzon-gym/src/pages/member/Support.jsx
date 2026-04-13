import { useState, useContext, useEffect } from 'react';
import MemberSidebar from '../../components/member/MemberSidebar';
import { AuthContext } from '../../context/AuthContext';
import { getTickets, saveTickets, generateId } from '../../utils/localStorage';
import { HelpCircle, Send, ChevronDown, ChevronUp, Clock, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Support = () => {
    const { currentUser } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [openFaq, setOpenFaq] = useState(0);

    const [ticketForm, setTicketForm] = useState({
        subject: 'General Inquiry',
        message: ''
    });

    useEffect(() => {
        const allTickets = getTickets();
        setTickets(allTickets.filter(t => t.userId === currentUser.id));
    }, [currentUser]);

    const faqs = [
        { q: 'How do I change or upgrade my membership plan?', a: 'You can upgrade your plan directly from the "My Payments" page. Select the desired plan and the new benefits will be activated immediately upon confirmation.' },
        { q: 'What payment methods do you accept?', a: 'We accept all major Credit/Debit cards, local bank transfers, and JazzCash/EasyPaisa for monthly and annual subscriptions.' },
        { q: 'What is the body freeze policy?', a: 'Elite members can freeze their membership for up to 30 days per year with no extra charge. Other members can freeze for a small administrative fee. Please submit a support ticket.' },
        { q: 'Can I bring a guest?', a: 'Elite members are allowed to bring one guest per month for free. Other members can purchase a day pass for their guests at the front desk.' },
        { q: 'How early should I book the group classes?', a: 'We recommend booking 24 hours in advance as popular classes like HIIT and Yoga fill up quickly. You can enroll via the "My Classes" tab.' }
    ];

    const handleTicketSubmit = (e) => {
        e.preventDefault();
        if (!ticketForm.message.trim()) return;

        const newTicket = {
            id: `TKT-${generateId().slice(-6)}`,
            userId: currentUser.id,
            subject: ticketForm.subject,
            message: ticketForm.message,
            date: new Date().toLocaleDateString(),
            status: 'Open'
        };

        const allTickets = getTickets();
        allTickets.unshift(newTicket);
        saveTickets(allTickets);

        setTickets([newTicket, ...tickets]);
        setTicketForm({ ...ticketForm, message: '' });
        toast.success('Support ticket submitted successfully. We will get back to you soon!');
    };

    return (
        <MemberSidebar>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-1">Help & Support</h1>
                <p className="text-gray-400">Find answers or get in touch with our team</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Support Form & Tickets */}
                <div className="space-y-8">
                    <form className="fitzon-card" onSubmit={handleTicketSubmit}>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-[#1f1f1f] pb-4">
                            <Send className="w-5 h-5 text-neon" /> Contact Support
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Topic</label>
                                <select
                                    value={ticketForm.subject}
                                    onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="General Inquiry">General Inquiry</option>
                                    <option value="Billing Issue">Billing Issue</option>
                                    <option value="Technical Support">Technical Support (App/Website)</option>
                                    <option value="Feedback/Complaint">Feedback/Complaint</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Message</label>
                                <textarea
                                    value={ticketForm.message}
                                    onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                                    className="input-field h-32 resize-none"
                                    placeholder="How can we help you today?"
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="btn-neon w-full pt-4">
                                Submit Ticket
                            </button>
                        </div>
                    </form>

                    {/* Past Tickets */}
                    <div className="fitzon-card p-0 overflow-hidden">
                        <div className="p-6 border-b border-[#1f1f1f] bg-[#151515]">
                            <h3 className="text-lg font-bold">Recent Tickets</h3>
                        </div>
                        <div className="divide-y divide-[#1f1f1f]">
                            {tickets.length > 0 ? (
                                tickets.map(ticket => (
                                    <div key={ticket.id} className="p-6 hover:bg-[#111111] transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-white mb-1">{ticket.subject}</span>
                                                <span className="text-xs text-gray-500 font-mono">ID: {ticket.id}</span>
                                            </div>
                                            <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md border ${ticket.status === 'Open' ? 'text-orange-500 border-orange-500/30 bg-orange-500/10' : 'text-green-500 border-green-500/30 bg-green-500/10'
                                                }`}>
                                                {ticket.status === 'Open' ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                                                {ticket.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-300 mt-2 line-clamp-2">{ticket.message}</p>
                                        <p className="text-xs text-gray-500 mt-3">{ticket.date}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500 text-sm">
                                    You have no support tickets.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* FAQs */}
                <div className="space-y-6">
                    <div className="fitzon-card">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <HelpCircle className="w-5 h-5 text-neon" /> Frequently Asked Questions
                        </h2>

                        <div className="space-y-4">
                            {faqs.map((faq, idx) => (
                                <div
                                    key={idx}
                                    className={`border rounded-xl transition-all duration-300 overflow-hidden ${openFaq === idx ? 'border-neon bg-[#151515] shadow-[0_0_15px_rgba(204,255,0,0.05)]' : 'border-[#2f2f2f] bg-[#1a1a1a] hover:border-gray-500'
                                        }`}
                                >
                                    <button
                                        onClick={() => setOpenFaq(idx === openFaq ? -1 : idx)}
                                        className="w-full flex justify-between items-center p-4 text-left font-medium text-white focus:outline-none"
                                    >
                                        <span>{faq.q}</span>
                                        {openFaq === idx ? (
                                            <ChevronUp className="w-5 h-5 text-neon shrink-0" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />
                                        )}
                                    </button>
                                    <div
                                        className={`px-4 text-gray-400 text-sm overflow-hidden transition-all duration-300 ${openFaq === idx ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'
                                            }`}
                                    >
                                        {faq.a}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </MemberSidebar>
    );
};

export default Support;
