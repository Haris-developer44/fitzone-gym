import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    BarChart3,
    Users,
    UserPlus,
    CreditCard,
    ClipboardList,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const AdminSidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { icon: BarChart3, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Users, label: 'Members', path: '/admin/members' },
        { icon: UserPlus, label: 'Add Member', path: '/admin/members/add' },
        { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
        { icon: ClipboardList, label: 'Attendance', path: '/admin/attendance' },
    ];

    const SidebarContent = () => (
        <>
            <div className="h-20 flex items-center px-6 border-b border-[#1f1f1f]">
                <span className="font-bebas text-3xl tracking-widest text-neon">FITZON</span>
                <span className="font-bebas text-3xl tracking-widest text-white ml-2">ADMIN</span>
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
                <span className="font-bebas text-2xl tracking-widest text-neon ml-4">FITZON ADMIN</span>
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

export default AdminSidebar;
