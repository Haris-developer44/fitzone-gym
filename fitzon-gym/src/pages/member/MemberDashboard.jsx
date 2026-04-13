import { useContext, useEffect, useState } from 'react';
import MemberSidebar from '../../components/member/MemberSidebar';
import MembershipCard from '../../components/member/MembershipCard';
import StatCard from '../../components/shared/StatCard';
import { AuthContext } from '../../context/AuthContext';
import { Award, CalendarCheck, Clock, AlignLeft } from 'lucide-react';
import { getMembers } from '../../utils/localStorage';

const MemberDashboard = () => {
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const [classesAttended, setClassesAttended] = useState(0);

    useEffect(() => {
        // Refresh user data from localStorage
        if (currentUser) {
            const allMembers = getMembers();
            const updatedUser = allMembers.find(m => m.id === currentUser.id);
            if (updatedUser) {
                setCurrentUser({ ...updatedUser, role: 'member' });
                setClassesAttended(updatedUser.attendanceHistory?.length || 0);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!currentUser) return null;

    const calculateDaysSince = (dateString) => {
        const start = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const daysMember = calculateDaysSince(currentUser.joinDate);

    const upcomingClasses = [
        { id: 1, name: 'HIIT Session', time: 'Today, 06:30 PM', trainer: 'Arnold S.', room: 'Studio 1' },
        { id: 2, name: 'Weightlifting', time: 'Tomorrow, 06:00 AM', trainer: 'David Goggins', room: 'Main Floor' },
        { id: 3, name: 'CrossFit', time: 'Friday, 08:00 AM', trainer: 'Sarah Connor', room: 'Zone A' }
    ];

    const recentActivity = currentUser.attendanceHistory?.slice(0, 5) || [];

    return (
        <MemberSidebar>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-1">Welcome back, {currentUser.name.split(' ')[0]}! 💪</h1>
                <p className="text-gray-400">Ready to crush your goals today?</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Left Column: Membership & Stats */}
                <div className="lg:col-span-2 space-y-8">

                    <MembershipCard />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <StatCard icon={Award} label="Days as Member" value={daysMember} />
                        <StatCard icon={CalendarCheck} label="Classes Attended" value={classesAttended} color="text-green-500" />
                        <div className="fitzon-card flex flex-col justify-center">
                            <h3 className="text-gray-400 font-medium text-sm mb-2">Next Payment</h3>
                            <p className="text-2xl font-bold text-white mb-1">{currentUser.nextPaymentDate}</p>
                            <div className="flex gap-2 items-center">
                                {currentUser.feeStatus === 'Paid' ? (
                                    <span className="text-xs text-green-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> All set</span>
                                ) : (
                                    <span className="text-xs text-red-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Due soon</span>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column: Upcoming & Activity */}
                <div className="space-y-8">

                    <div className="fitzon-card p-0 overflow-hidden h-fit">
                        <div className="p-5 border-b border-[#1f1f1f] bg-[#151515] flex justify-between items-center">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Clock className="w-5 h-5 text-neon" /> Upcoming Classes
                            </h3>
                        </div>
                        <div className="divide-y divide-[#1f1f1f]">
                            {upcomingClasses.map(cls => (
                                <div key={cls.id} className="p-4 hover:bg-[#111111] transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-white group-hover:text-neon transition-colors">{cls.name}</h4>
                                        <span className="text-xs bg-[#1a1a1a] px-2 py-1 rounded text-gray-400 border border-[#2f2f2f]">{cls.room}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-1">{cls.time}</p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <AlignLeft className="w-3 h-3" /> {cls.trainer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="fitzon-card p-0 overflow-hidden h-fit">
                        <div className="p-5 border-b border-[#1f1f1f] bg-[#151515]">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <CalendarCheck className="w-5 h-5 text-neon" /> Recent Check-ins
                            </h3>
                        </div>
                        <div className="p-5 relative">
                            {recentActivity.length > 0 ? (
                                <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-2.5 before:w-px before:bg-[#2f2f2f]">
                                    {recentActivity.map((date, idx) => (
                                        <div key={idx} className="relative pl-8 flex items-center gap-4 group">
                                            <div className="absolute left-1.5 w-3 h-3 rounded-full bg-[#1a1a1a] border-2 border-[#2f2f2f] group-hover:border-neon group-hover:bg-neon transition-colors shadow"></div>
                                            <div className="text-sm font-medium text-white">{date}</div>
                                            <div className="text-xs text-gray-500 bg-[#1a1a1a] px-2 py-0.5 rounded border border-[#2f2f2f]">Front Desk</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm italic text-center py-4">No recent attendance recorded.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </MemberSidebar>
    );
};

export default MemberDashboard;
