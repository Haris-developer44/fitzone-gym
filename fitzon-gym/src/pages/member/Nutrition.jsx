import { useState, useContext, useEffect } from 'react';
import MemberSidebar from '../../components/member/MemberSidebar';
import { AuthContext } from '../../context/AuthContext';
import { Apple, Plus, Trash2, Droplets, Utensils } from 'lucide-react';
import toast from 'react-hot-toast';

const Nutrition = () => {
    const { currentUser } = useContext(AuthContext);

    const [foods, setFoods] = useState([
        { id: 1, name: 'Oatmeal & Berries', calories: 350 },
        { id: 2, name: 'Grilled Chicken Salad', calories: 450 }
    ]);
    const [newFood, setNewFood] = useState('');
    const [newCals, setNewCals] = useState('');
    const [waterGlasses, setWaterGlasses] = useState(3);

    const goalCalories = 2200;
    const consumedCalories = foods.reduce((acc, curr) => acc + curr.calories, 0);
    const percentage = Math.min(100, (consumedCalories / goalCalories) * 100);

    const handleAddFood = (e) => {
        e.preventDefault();
        if (!newFood || !newCals) return;

        setFoods([...foods, { id: Date.now(), name: newFood, calories: parseInt(newCals) }]);
        setNewFood('');
        setNewCals('');
        toast.success('Food added to log');
    };

    const removeFood = (id) => {
        setFoods(foods.filter(f => f.id !== id));
    };

    const getMealSuggestions = (plan) => {
        if (plan === 'Elite') {
            return {
                breakfast: 'Protein Pancakes, 3 Egg Whites, Complete Greens',
                lunch: 'Quinoa Bowl with Salmon, Roasted Asparagus',
                dinner: 'Lean Steak, Sweet Potato, Steamed Broccoli'
            };
        } else if (plan === 'Pro') {
            return {
                breakfast: 'Oatmeal with Whey Protein, Banana',
                lunch: 'Chicken Breast Wrap with Whole Wheat',
                dinner: 'White Fish, Brown Rice, Mixed Veggies'
            };
        }
        return {
            breakfast: 'Scrambled Eggs (3), Whole Wheat Toast',
            lunch: 'Tuna Salad with Olive Oil Dressing',
            dinner: 'Chicken Breast, Rice, Side Salad'
        };
    };

    const suggestions = getMealSuggestions(currentUser?.plan || 'Basic');

    return (
        <MemberSidebar>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-1">Nutrition & Diet</h1>
                <p className="text-gray-400">Track your daily intake and follow your meal plan</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column - Tracker */}
                <div className="lg:col-span-2 space-y-8">

                    <div className="fitzon-card">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Apple className="w-5 h-5 text-neon" /> Daily Calorie Tracker
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-8">
                            <div className="col-span-1 flex justify-center">
                                <div className="relative w-40 h-40">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="80" cy="80" r="70" className="stroke-[#1f1f1f]" strokeWidth="12" fill="none" />
                                        <circle
                                            cx="80" cy="80" r="70"
                                            className="stroke-neon transition-all duration-1000 ease-out"
                                            strokeWidth="12" fill="none"
                                            strokeDasharray="439.8"
                                            strokeDashoffset={439.8 - (439.8 * percentage) / 100}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-bebas text-white tracking-wide">{consumedCalories}</span>
                                        <span className="text-xs text-gray-500 uppercase tracking-widest">/ {goalCalories} kcal</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-2 space-y-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400">Remaining</span>
                                    <span className="font-bold text-white">{Math.max(0, goalCalories - consumedCalories)} kcal</span>
                                </div>

                                <form onSubmit={handleAddFood} className="flex gap-2 bg-[#1a1a1a] p-2 rounded-lg border border-[#2f2f2f]">
                                    <input
                                        type="text" value={newFood} onChange={(e) => setNewFood(e.target.value)}
                                        placeholder="Food item..." className="bg-transparent text-white px-2 py-1 w-full text-sm focus:outline-none" required
                                    />
                                    <input
                                        type="number" value={newCals} onChange={(e) => setNewCals(e.target.value)}
                                        placeholder="kcal" className="bg-[#111] text-white px-2 py-1 w-20 rounded border border-[#333] text-sm focus:outline-none focus:border-neon" required
                                    />
                                    <button type="submit" className="bg-neon text-black p-1.5 rounded hover:brightness-110">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            {foods.map(food => (
                                <div key={food.id} className="flex justify-between items-center p-3 rounded-lg border border-[#1f1f1f] bg-[#151515] hover:border-[#2f2f2f] transition-colors">
                                    <span className="text-sm font-medium">{food.name}</span>
                                    <div className="flex items-center gap-4">
                                        <span className="text-neon font-bebas text-lg tracking-wide">{food.calories} kcal</span>
                                        <button onClick={() => removeFood(food.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {foods.length === 0 && <p className="text-center text-gray-500 text-sm py-4">No meals logged today</p>}
                        </div>
                    </div>

                    <div className="fitzon-card">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Utensils className="w-5 h-5 text-neon" /> Suggested Meal Plan
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#2f2f2f]">
                                <h3 className="font-bold text-neon mb-2 text-sm uppercase tracking-wider">Breakfast</h3>
                                <p className="text-gray-300 text-sm">{suggestions.breakfast}</p>
                            </div>
                            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#2f2f2f]">
                                <h3 className="font-bold text-neon mb-2 text-sm uppercase tracking-wider">Lunch</h3>
                                <p className="text-gray-300 text-sm">{suggestions.lunch}</p>
                            </div>
                            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#2f2f2f]">
                                <h3 className="font-bold text-neon mb-2 text-sm uppercase tracking-wider">Dinner</h3>
                                <p className="text-gray-300 text-sm">{suggestions.dinner}</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column - Water & Macros */}
                <div className="space-y-8">

                    <div className="fitzon-card flex flex-col items-center">
                        <h2 className="text-xl font-bold mb-2 flex items-center gap-2 w-full justify-center">
                            <Droplets className="w-5 h-5 text-blue-400" /> Water Intake
                        </h2>
                        <p className="text-gray-400 text-sm mb-6 text-center">{waterGlasses} / 8 glasses today</p>

                        <div className="grid grid-cols-4 gap-4 mb-6">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    onClick={() => setWaterGlasses(i === waterGlasses - 1 ? i : i + 1)}
                                    className={`w-12 h-14 rounded-b-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 flex items-end overflow-hidden ${i < waterGlasses ? 'border-blue-400/50 bg-[#111]' : 'border-[#2f2f2f] bg-[#1a1a1a]'
                                        }`}
                                >
                                    <div className={`w-full transition-all duration-500 ${i < waterGlasses ? 'bg-blue-400/80 h-full' : 'h-0'}`}></div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setWaterGlasses(8)}
                            className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2"
                        >
                            Fill all glasses
                        </button>
                    </div>

                    <div className="fitzon-card">
                        <h2 className="text-xl font-bold mb-6">Macro Targets</h2>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium">Protein (160g)</span>
                                    <span className="text-neon font-bold">60%</span>
                                </div>
                                <div className="w-full bg-[#1a1a1a] rounded-full h-1.5 shadow-inner">
                                    <div className="bg-neon h-1.5 rounded-full shadow-[0_0_10px_rgba(204,255,0,0.5)]" style={{ width: '60%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium">Carbs (200g)</span>
                                    <span className="text-blue-400 font-bold">45%</span>
                                </div>
                                <div className="w-full bg-[#1a1a1a] rounded-full h-1.5 shadow-inner">
                                    <div className="bg-blue-400 h-1.5 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.5)]" style={{ width: '45%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium">Fats (65g)</span>
                                    <span className="text-orange-400 font-bold">30%</span>
                                </div>
                                <div className="w-full bg-[#1a1a1a] rounded-full h-1.5 shadow-inner">
                                    <div className="bg-orange-400 h-1.5 rounded-full shadow-[0_0_10px_rgba(251,146,60,0.5)]" style={{ width: '30%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </MemberSidebar>
    );
};

export default Nutrition;
