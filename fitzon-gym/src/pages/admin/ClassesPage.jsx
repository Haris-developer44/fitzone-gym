import { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Modal from '../../components/shared/Modal';
import { Clock, Users, CalendarDays, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';

const ClassesPage = () => {
    const defaultClasses = [
        { id: 1, name: 'Weightlifting', icon: '🏋️‍♂️', trainer: 'David Goggins', time: '06:00 AM - 07:30 AM', days: 'Mon, Wed, Fri', totalEnrolled: 18 },
        { id: 2, name: 'CrossFit', icon: '🔥', trainer: 'Sarah Connor', time: '08:00 AM - 09:00 AM', days: 'Tue, Thu, Sat', totalEnrolled: 14 },
        { id: 3, name: 'Yoga', icon: '🧘‍♀️', trainer: 'Jane Doe', time: '10:00 AM - 11:00 AM', days: 'Mon, Wed, Fri', totalEnrolled: 20 },
        { id: 4, name: 'Zumba', icon: '💃', trainer: 'Elena Rodriguez', time: '05:00 PM - 06:00 PM', days: 'Tue, Thu', totalEnrolled: 25 },
        { id: 5, name: 'Boxing', icon: '🥊', trainer: 'Mike Tyson', time: '07:00 PM - 08:30 PM', days: 'Mon, Wed, Fri', totalEnrolled: 12 },
        { id: 6, name: 'HIIT', icon: '⏱️', trainer: 'Arnold S.', time: '06:30 PM - 07:15 PM', days: 'Tue, Thu, Sat', totalEnrolled: 19 },
        { id: 7, name: 'Cardio Blast', icon: '🏃‍♂️', trainer: 'Usain Bolt', time: '07:00 AM - 08:00 AM', days: 'Mon, Wed', totalEnrolled: 15 },
        { id: 8, name: 'Pilates', icon: '🤸‍♀️', trainer: 'Emma Stone', time: '04:00 PM - 05:00 PM', days: 'Wed, Fri', totalEnrolled: 10 },
    ];

    const [classes, setClasses] = useState(defaultClasses);
    const [selectedClass, setSelectedClass] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({ trainer: '', time: '', days: '' });

    const handleEditClick = (cls) => {
        setSelectedClass(cls);
        setEditForm({ trainer: cls.trainer, time: cls.time, days: cls.days });
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const updated = classes.map(c => {
            if (c.id === selectedClass.id) {
                return { ...c, ...editForm };
            }
            return c;
        });
        setClasses(updated);
        setIsModalOpen(false);
        toast.success(`${selectedClass.name} schedule updated!`);
    };

    return (
        <AdminSidebar>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Class Schedule</h1>
                    <p className="text-gray-400">Manage gym classes and trainer assignments</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                    <div key={cls.id} className="fitzon-card flex flex-col group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-neon/5 rounded-bl-[100px] pointer-events-none group-hover:bg-neon/10 transition-colors"></div>

                        <div className="flex justify-between items-start mb-6 z-10">
                            <div className="flex items-center gap-4">
                                <div className="text-4xl">{cls.icon}</div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{cls.name}</h3>
                                    <p className="text-neon text-sm uppercase tracking-wide font-medium">{cls.trainer}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8 flex-1 z-10">
                            <div className="flex items-center gap-3 text-gray-300">
                                <Clock className="w-5 h-5 text-gray-500" />
                                <span className="text-sm">{cls.time}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <CalendarDays className="w-5 h-5 text-gray-500" />
                                <span className="text-sm">{cls.days}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <Users className="w-5 h-5 text-gray-500" />
                                <span className="text-sm">{cls.totalEnrolled} / 30 Enrolled</span>
                            </div>

                            <div className="w-full bg-[#1a1a1a] rounded-full h-1.5 mt-2">
                                <div
                                    className="bg-neon h-1.5 rounded-full"
                                    style={{ width: `${(cls.totalEnrolled / 30) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <button
                            onClick={() => handleEditClick(cls)}
                            className="w-full py-3 bg-[#1a1a1a] hover:bg-neon hover:text-black text-gray-300 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium z-10 border border-[#2f2f2f] hover:border-transparent cursor-pointer"
                        >
                            <Edit3 className="w-4 h-4" /> Edit Schedule
                        </button>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Edit ${selectedClass?.name}`}>
                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Trainer Name</label>
                        <input
                            type="text"
                            value={editForm.trainer}
                            onChange={(e) => setEditForm({ ...editForm, trainer: e.target.value })}
                            className="input-field"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Time Slot</label>
                        <input
                            type="text"
                            value={editForm.time}
                            onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                            className="input-field"
                            placeholder="e.g. 06:00 AM - 07:30 AM"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Active Days</label>
                        <input
                            type="text"
                            value={editForm.days}
                            onChange={(e) => setEditForm({ ...editForm, days: e.target.value })}
                            className="input-field"
                            placeholder="e.g. Mon, Wed, Fri"
                            required
                        />
                    </div>
                    <button type="submit" className="btn-neon w-full">Save Changes</button>
                </form>
            </Modal>
        </AdminSidebar>
    );
};

export default ClassesPage;
