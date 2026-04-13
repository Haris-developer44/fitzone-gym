import { useState } from 'react';
import MemberSidebar from '../../components/member/MemberSidebar';
import { Clock, CalendarDays, User, PlusCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const MyClasses = () => {
    const [enrolledClasses, setEnrolledClasses] = useState([1, 4, 6]);

    const allClasses = [
        { id: 1, name: 'Weightlifting', icon: '🏋️‍♂️', trainer: 'David Goggins', time: '06:00 AM - 07:30 AM', days: 'Mon, Wed, Fri', totalEnrolled: 18 },
        { id: 2, name: 'CrossFit', icon: '🔥', trainer: 'Sarah Connor', time: '08:00 AM - 09:00 AM', days: 'Tue, Thu, Sat', totalEnrolled: 14 },
        { id: 3, name: 'Yoga', icon: '🧘‍♀️', trainer: 'Jane Doe', time: '10:00 AM - 11:00 AM', days: 'Mon, Wed, Fri', totalEnrolled: 20 },
        { id: 4, name: 'Zumba', icon: '💃', trainer: 'Elena Rodriguez', time: '05:00 PM - 06:00 PM', days: 'Tue, Thu', totalEnrolled: 25 },
        { id: 5, name: 'Boxing', icon: '🥊', trainer: 'Mike Tyson', time: '07:00 PM - 08:30 PM', days: 'Mon, Wed, Fri', totalEnrolled: 12 },
        { id: 6, name: 'HIIT', icon: '⏱️', trainer: 'Arnold S.', time: '06:30 PM - 07:15 PM', days: 'Tue, Thu, Sat', totalEnrolled: 19 },
        { id: 7, name: 'Cardio Blast', icon: '🏃‍♂️', trainer: 'Usain Bolt', time: '07:00 AM - 08:00 AM', days: 'Mon, Wed', totalEnrolled: 15 },
        { id: 8, name: 'Pilates', icon: '🤸‍♀️', trainer: 'Emma Stone', time: '04:00 PM - 05:00 PM', days: 'Wed, Fri', totalEnrolled: 10 },
    ];

    const handleEnroll = (id, name) => {
        if (enrolledClasses.includes(id)) {
            toast.error('You are already enrolled in this class');
            return;
        }
        setEnrolledClasses([...enrolledClasses, id]);
        toast.success(`Successfully enrolled in ${name}!`);
    };

    const mySchedule = allClasses.filter(c => enrolledClasses.includes(c.id));

    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <MemberSidebar>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-1">My Classes</h1>
                <p className="text-gray-400">Manage your class schedule and enrollments</p>
            </div>

            <div className="space-y-10">
                <section>
                    <h2 className="text-xl font-bold text-neon mb-6 flex items-center gap-2 border-b border-[#1f1f1f] pb-2">
                        <CalendarDays className="w-5 h-5" /> Weekly Schedule
                    </h2>

                    <div className="overflow-x-auto">
                        <div className="flex gap-4 min-w-max pb-4">
                            {weekDays.map(day => {
                                const dayClasses = mySchedule.filter(c => c.days.includes(day.slice(0, 3)));

                                return (
                                    <div key={day} className="w-64 flex flex-col pt-2">
                                        <h3 className="font-bold text-center bg-[#1a1a1a] py-2 border-b-2 border-neon uppercase tracking-wider text-sm sticky top-0 z-10">{day}</h3>
                                        <div className="flex-1 bg-[#111111] border border-[#1f1f1f] border-t-0 p-3 flex flex-col gap-3 min-h-[300px]">
                                            {dayClasses.length > 0 ? (
                                                dayClasses.map(c => (
                                                    <div key={c.id} className="bg-[#1a1a1a] p-3 rounded-lg border border-[#2f2f2f] hover:border-neon transition-colors">
                                                        <h4 className="font-bold text-white text-sm mb-1">{c.name}</h4>
                                                        <p className="text-xs text-gray-400 flex items-center gap-1 mb-1"><Clock className="w-3 h-3" /> {c.time}</p>
                                                        <p className="text-xs text-neon flex items-center gap-1 mt-2.5 pt-2.5 border-t border-[#2f2f2f]"><User className="w-3 h-3" /> {c.trainer}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="flex-1 flex flex-col justify-center items-center opacity-30 p-4text-center">
                                                    <p className="text-sm">No classes</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-6 border-b border-[#1f1f1f] pb-2 flex justify-between items-center">
                        <span>Available Classes</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {allClasses.map(cls => {
                            const isEnrolled = enrolledClasses.includes(cls.id);

                            return (
                                <div key={cls.id} className={`fitzon-card flex flex-col relative overflow-hidden transition-all duration-300 ${isEnrolled ? 'border-neon/50 bg-[#151a11]' : 'hover:border-neon'}`}>
                                    {isEnrolled && (
                                        <div className="absolute top-0 right-0 bg-neon text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider z-10">
                                            Enrolled
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 mb-4 relative z-10">
                                        <div className="text-4xl">{cls.icon}</div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white leading-tight">{cls.name}</h3>
                                            <p className="text-gray-400 text-xs mt-1">{cls.trainer}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-6 flex-1 text-sm text-gray-300 relative z-10">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-neon" /> <span>{cls.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="w-4 h-4 text-neon" /> <span>{cls.days}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleEnroll(cls.id, cls.name)}
                                        disabled={isEnrolled}
                                        className={`w-full py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium relative z-10 text-sm ${isEnrolled
                                                ? 'bg-[#1a1a1a] text-neon cursor-default border border-neon/20'
                                                : 'bg-white hover:bg-neon hover:text-black text-black'
                                            }`}
                                    >
                                        {isEnrolled ? <><CheckCircle2 className="w-4 h-4" /> Enrolled ✓</> : <><PlusCircle className="w-4 h-4" /> Enroll Now</>}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </MemberSidebar>
    );
};

export default MyClasses;
