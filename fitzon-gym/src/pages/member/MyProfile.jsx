import { useState, useContext } from 'react';
import MemberSidebar from '../../components/member/MemberSidebar';
import { AuthContext } from '../../context/AuthContext';
import { getMembers, saveMembers } from '../../utils/localStorage';
import { Save, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const MyProfile = () => {
    const { currentUser, setCurrentUser } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        phone: currentUser?.phone || '',
        dob: currentUser?.dob || '',
        gender: currentUser?.gender || 'Male',
        emergencyContact: currentUser?.emergencyContact || '',
        medicalConditions: currentUser?.medicalConditions || ''
    });

    const [passwordForm, setPasswordForm] = useState({
        current: '', newPass: '', confirm: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handlePassChange = (e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

    const handleProfileSave = (e) => {
        e.preventDefault();
        const members = getMembers();
        const updatedMembers = members.map(m => {
            if (m.id === currentUser.id) {
                return { ...m, ...formData };
            }
            return m;
        });

        saveMembers(updatedMembers);

        // Update Context
        const updatedUser = { ...currentUser, ...formData };
        setCurrentUser(updatedUser);
        localStorage.setItem('fitzon_auth', JSON.stringify(updatedUser));

        toast.success('Profile updated successfully!');
    };

    const handlePasswordSave = (e) => {
        e.preventDefault();

        if (passwordForm.current !== currentUser.password) {
            toast.error('Current password is incorrect');
            return;
        }

        if (passwordForm.newPass !== passwordForm.confirm) {
            toast.error('New passwords do not match');
            return;
        }

        const members = getMembers();
        const updatedMembers = members.map(m => {
            if (m.id === currentUser.id) {
                return { ...m, password: passwordForm.newPass };
            }
            return m;
        });

        saveMembers(updatedMembers);

        const updatedUser = { ...currentUser, password: passwordForm.newPass };
        setCurrentUser(updatedUser);
        localStorage.setItem('fitzon_auth', JSON.stringify(updatedUser));

        toast.success('Password updated successfully');
        setPasswordForm({ current: '', newPass: '', confirm: '' });
    };

    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

    return (
        <MemberSidebar>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-1">My Profile</h1>
                <p className="text-gray-400">Manage your personal information and account security</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Avatar & Summary */}
                <div className="space-y-6">
                    <div className="fitzon-card flex flex-col items-center text-center p-8">
                        <div className="w-32 h-32 rounded-full border-4 border-[#1f1f1f] bg-dark flex flex-col justify-center items-center text-neon font-bold text-5xl mb-6 shadow-[0_0_30px_rgba(204,255,0,0.1)] relative">
                            {getInitials(currentUser.name)}
                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-dark rounded-full"></div>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">{currentUser.name}</h2>
                        <div className="bg-[#1a1a1a] px-4 py-1.5 rounded-full border border-[#2f2f2f] text-sm text-gray-300 font-medium tracking-wide mb-4">
                            {currentUser.plan} Plan
                        </div>
                        <p className="text-gray-500 text-sm">Member since {currentUser.joinDate}</p>
                    </div>
                </div>

                {/* Right Column: Forms */}
                <div className="lg:col-span-2 space-y-8">

                    <form className="fitzon-card" onSubmit={handleProfileSave}>
                        <h2 className="text-xl font-bold text-neon mb-6 border-b border-[#1f1f1f] pb-4">Personal Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                                <input
                                    type="text" name="name" value={formData.name}
                                    onChange={handleChange} className="input-field" required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Email Address (Read-only)</label>
                                <input
                                    type="email" value={currentUser.email} readOnly
                                    className="input-field bg-[#151515] text-gray-500 cursor-not-allowed border-[#1f1f1f]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                                <input
                                    type="tel" name="phone" value={formData.phone}
                                    onChange={handleChange} className="input-field" required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Date of Birth</label>
                                    <input
                                        type="date" name="dob" value={formData.dob}
                                        onChange={handleChange} className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Gender</label>
                                    <select
                                        name="gender" value={formData.gender}
                                        onChange={handleChange} className="input-field h-[46px]"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Emergency Contact</label>
                                <input
                                    type="text" name="emergencyContact" value={formData.emergencyContact}
                                    onChange={handleChange} className="input-field"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm text-gray-400 mb-2">Medical Conditions (Optional)</label>
                                <textarea
                                    name="medicalConditions" value={formData.medicalConditions}
                                    onChange={handleChange} className="input-field h-24 resize-none"
                                    placeholder="Any allergies, previous injuries, etc."
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-[#1f1f1f]">
                            <button type="submit" className="btn-neon text-sm py-2.5 px-6">
                                <Save className="w-4 h-4 mr-2" /> Save Profile Details
                            </button>
                        </div>
                    </form>

                    <form className="fitzon-card" onSubmit={handlePasswordSave}>
                        <h2 className="text-xl font-bold text-white mb-6 border-b border-[#1f1f1f] pb-4 flex items-center gap-2">
                            <Lock className="w-5 h-5" /> Account Security
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="md:col-span-2 max-w-md">
                                <label className="block text-sm text-gray-400 mb-2">Current Password</label>
                                <input
                                    type="password" name="current" value={passwordForm.current}
                                    onChange={handlePassChange} className="input-field" required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">New Password</label>
                                <input
                                    type="password" name="newPass" value={passwordForm.newPass}
                                    onChange={handlePassChange} className="input-field" required minLength="6"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Confirm New Password</label>
                                <input
                                    type="password" name="confirm" value={passwordForm.confirm}
                                    onChange={handlePassChange} className="input-field" required minLength="6"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-[#1f1f1f]">
                            <button type="submit" className="btn-outline border-[#2f2f2f] text-gray-300 hover:border-white hover:bg-white hover:text-black text-sm py-2.5 px-6">
                                Update Password
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </MemberSidebar>
    );
};

export default MyProfile;
