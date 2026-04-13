import { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    Home,
    User,
    CalendarCheck,
    CreditCard,
    TrendingUp,
    Apple,
    Users,
    Headset,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const MemberSidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { currentUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { icon: Home, label: 'Dashboard', path: '/member/dashboard' },
        { icon: User, label: 'My Profile', path: '/member/profile' },
        { icon: CalendarCheck, label: 'My Classes', path: '/member/classes' },
        { icon: CreditCard, label: 'My Payments', path: '/member/payments' },
        { icon: TrendingUp, label: 'Progress', path: '/member/progress' },
        { icon: Apple, label: 'Nutrition', path: '/member/nutrition' },
        { icon: Users, label: 'Community', path: '/member/community' },
        { icon: Headset, label: 'Support', path: '/member/support' },
    ];

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
    };

    const SidebarContent = () => (
        <>
            <div className="h-24 flex items-center px-6 border-b border-[#1f1f1f] gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-neon bg-[#1a1a1a] flex items-center justify-center text-neon font-bold text-lg">
                    {getInitials(currentUser?.name)}
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-white truncate max-w-[140px]">{currentUser?.name || 'Member'}</span>
                    <span className="text-xs text-neon tracking-wider uppercase">{currentUser?.plan || 'Plan'} Member</span>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-neon text-black font-semibold shadow-[0_0_15px_rgba(204,255,0,0.3)]'
                                    : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                                }`
                            }
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-[#1f1f1f]">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-500 hover:bg-red-500/10 transition-colors duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-dark text-white flex">
            {/* Mobile Sidebar Toggle */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0d0d0d] border-b border-[#1f1f1f] flex items-center px-4 z-40">
                <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white hover:text-neon">
                    {isOpen ? <X /> : <Menu />}
                </button>
                <span className="font-bebas text-2xl tracking-widest text-white ml-4">
                    <span className="text-neon">FITZON</span> MEMBER
                </span>
            </div>

            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 h-full bg-[#0d0d0d] border-r border-[#1f1f1f] z-30">
                <SidebarContent />
            </aside>

            {/* Sidebar Mobile */}
            <aside
                className={`md:hidden fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } w-64 bg-[#0d0d0d] border-r border-[#1f1f1f] transition-transform duration-300 ease-in-out z-50 flex flex-col`}
            >
                <SidebarContent />
            </aside>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 md:ml-64 pt-16 md:pt-0 p-4 md:p-8 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
};

export default MemberSidebar;
