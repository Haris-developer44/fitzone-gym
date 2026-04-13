import { useState, useContext, useEffect } from 'react';
import MemberSidebar from '../../components/member/MemberSidebar';
import { AuthContext } from '../../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Target, Medal, Flame } from 'lucide-react';
import { getMembers, saveMembers } from '../../utils/localStorage';
import toast from 'react-hot-toast';

const ProgressTracker = () => {
    const { currentUser, setCurrentUser } = useContext(AuthContext);

    const [weightData, setWeightData] = useState([]);
    const [newWeight, setNewWeight] = useState('');

    const [measurements, setMeasurements] = useState({
        chest: '', waist: '', arms: '', legs: ''
    });

    useEffect(() => {
        if (currentUser) {
            setWeightData(currentUser.weight || []);
            setMeasurements({
                chest: currentUser.measurements?.chest || 0,
                waist: currentUser.measurements?.waist || 0,
                arms: currentUser.measurements?.arms || 0,
                legs: currentUser.measurements?.legs || 0
            });
        }
    }, [currentUser]);

    const handleLogWeight = (e) => {
        e.preventDefault();
        if (!newWeight) return;

        const currentMonth = new Date().toLocaleString('default', { month: 'short' });
        const newDataPoint = { name: currentMonth, weight: parseFloat(newWeight) };

        // Create new array, replacing existing month or adding new
        let updatedWeightData = [...weightData];
        const existingIndex = updatedWeightData.findIndex(d => d.name === currentMonth);

        if (existingIndex >= 0) {
            updatedWeightData[existingIndex] = newDataPoint;
        } else {
            updatedWeightData.push(newDataPoint);
        }

        // Keep only last 6 months
        if (updatedWeightData.length > 6) {
            updatedWeightData = updatedWeightData.slice(-6);
        }

        updateUserData({ weight: updatedWeightData });
        setWeightData(updatedWeightData);
        setNewWeight('');
        toast.success('Weight logged successfully!');
    };

    const handleSaveMeasurements = (e) => {
        e.preventDefault();
        updateUserData({ measurements });
        toast.success('Measurements saved successfully!');
    };

    const updateUserData = (updatedFields) => {
        const members = getMembers();
        const updatedMembers = members.map(m => {
            if (m.id === currentUser.id) {
                return { ...m, ...updatedFields };
            }
            return m;
        });

        saveMembers(updatedMembers);

        const updatedUser = { ...currentUser, ...updatedFields };
        setCurrentUser(updatedUser);
        localStorage.setItem('fitzon_auth', JSON.stringify(updatedUser));
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#1a1a1a] border border-[#2f2f2f] p-3 rounded-lg shadow-xl">
                    <p className="text-gray-400 mb-1">{label}</p>
                    <p className="font-bebas text-neon text-xl">{payload[0].value} kg</p>
                </div>
            );
        }
        return null;
    };

    return (
        <MemberSidebar>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-1">Progress Tracker</h1>
                <p className="text-gray-400">Track your weight, measurements, and fitness goals</p>
            </div>

            {/* Stats/Goals Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="fitzon-card bg-gradient-to-br from-[#111] to-[#1a1a1a]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-neon/10 rounded-lg"><Target className="w-5 h-5 text-neon" /></div>
                        <h3 className="font-bold">Weight Goal</h3>
                    </div>
                    <div className="mb-2 flex justify-between tracking-wide">
                        <span className="text-2xl font-bebas text-white">
                            {weightData.length > 0 ? weightData[weightData.length - 1].weight : 0} kg
                        </span>
                        <span className="text-2xl font-bebas text-gray-500">75 kg</span>
                    </div>
                    <div className="w-full bg-[#1a1a1a] rounded-full h-2 shadow-inner">
                        <div className="bg-neon h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                </div>

                <div className="fitzon-card bg-gradient-to-br from-[#111] to-[#1a1a1a]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-neon/10 rounded-lg"><Flame className="w-5 h-5 text-neon" /></div>
                        <h3 className="font-bold">Strength Goal</h3>
                    </div>
                    <div className="mb-2 flex justify-between tracking-wide">
                        <span className="text-2xl font-bebas text-white">Bench 80kg</span>
                        <span className="text-2xl font-bebas text-gray-500">100kg</span>
                    </div>
                    <div className="w-full bg-[#1a1a1a] rounded-full h-2 shadow-inner">
                        <div className="bg-neon h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                </div>

                <div className="fitzon-card bg-gradient-to-br from-[#111] to-[#1a1a1a]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-neon/10 rounded-lg"><Medal className="w-5 h-5 text-neon" /></div>
                        <h3 className="font-bold">Attendance Goal</h3>
                    </div>
                    <div className="mb-2 flex justify-between tracking-wide">
                        <span className="text-2xl font-bebas text-white">{currentUser.classesAttended || 0}</span>
                        <span className="text-2xl font-bebas text-gray-500">20 / mo</span>
                    </div>
                    <div className="w-full bg-[#1a1a1a] rounded-full h-2 shadow-inner">
                        <div className="bg-neon h-2 rounded-full" style={{ width: `${Math.min(100, ((currentUser.classesAttended || 0) / 20) * 100)}%` }}></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Chart Section */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="fitzon-card h-[450px] flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Weight Progress</h2>
                            <form onSubmit={handleLogWeight} className="flex gap-2">
                                <input
                                    type="number" step="0.1"
                                    value={newWeight} onChange={(e) => setNewWeight(e.target.value)}
                                    placeholder="e.g. 78.5"
                                    className="bg-[#1a1a1a] border border-[#2f2f2f] text-white rounded-lg px-3 py-1.5 w-24 text-sm focus:outline-none focus:border-neon"
                                />
                                <button type="submit" className="bg-neon text-black rounded-lg px-3 py-1.5 flex items-center justify-center font-bold hover:brightness-110 shrink-0">
                                    Log
                                </button>
                            </form>
                        </div>

                        <div className="flex-1 w-full min-h-0">
                            {weightData && weightData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={weightData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                                        <XAxis dataKey="name" stroke="#666" axisLine={false} tickLine={false} dy={10} />
                                        <YAxis stroke="#666" axisLine={false} tickLine={false} dx={-10} domain={['auto', 'auto']} />
                                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2f2f2f', strokeWidth: 1, strokeDasharray: '3 3' }} />
                                        <Line
                                            type="monotone"
                                            dataKey="weight"
                                            stroke="#CCFF00"
                                            strokeWidth={4}
                                            dot={{ r: 6, fill: '#111', stroke: '#CCFF00', strokeWidth: 2 }}
                                            activeDot={{ r: 8, fill: '#CCFF00', stroke: '#111' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-gray-500">
                                    No weight data recorded yet. Log your first weight to see the chart!
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Measurements Section */}
                <div className="space-y-8">
                    <form className="fitzon-card" onSubmit={handleSaveMeasurements}>
                        <h2 className="text-xl font-bold mb-6 border-b border-[#1f1f1f] pb-4">Body Measurements</h2>

                        <div className="space-y-4">
                            <div className="relative">
                                <label className="block text-sm text-gray-400 mb-1">Chest (cm)</label>
                                <input
                                    type="number" value={measurements.chest}
                                    onChange={(e) => setMeasurements({ ...measurements, chest: e.target.value })}
                                    className="input-field"
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-sm text-gray-400 mb-1">Waist (cm)</label>
                                <input
                                    type="number" value={measurements.waist}
                                    onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })}
                                    className="input-field"
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-sm text-gray-400 mb-1">Arms (cm)</label>
                                <input
                                    type="number" value={measurements.arms}
                                    onChange={(e) => setMeasurements({ ...measurements, arms: e.target.value })}
                                    className="input-field"
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-sm text-gray-400 mb-1">Legs (cm)</label>
                                <input
                                    type="number" value={measurements.legs}
                                    onChange={(e) => setMeasurements({ ...measurements, legs: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-outline w-full mt-6 py-2 border-[#2f2f2f] text-gray-300 hover:border-white hover:bg-white hover:text-black">
                            Save Measurements
                        </button>
                    </form>
                </div>

            </div>
        </MemberSidebar>
    );
};

export default ProgressTracker;
