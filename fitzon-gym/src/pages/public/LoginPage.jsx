import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
    const [activePortal, setActivePortal] = useState('sub_admin'); // 'sub_admin' | 'admin'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);

        if (result.success) {
            navigate(result.role === 'admin' ? '/admin/dashboard' : '/sub_admin/members');
        }
    };

    const emailPlaceholder = activePortal === 'admin' ? 'admin@fitzon.com' : 'subadmin@fitzon.com';
    const portalLabel = activePortal === 'admin' ? 'ADMIN' : 'SUB ADMIN';

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-neon/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-neon/5 rounded-full blur-[100px]"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center gap-2 mb-2">
                        <span className="font-bebas text-5xl tracking-widest text-neon">FITZON</span>
                        <span className="font-bebas text-5xl tracking-widest text-white">GYM</span>
                    </Link>
                    <p className="text-gray-400">Enter the portal to greatness</p>
                </div>

                <div className="fitzon-card">
                    {/* Tabs */}
                    <div className="flex bg-[#1a1a1a] p-1 rounded-lg mb-8">
                        <button
                            className={`flex-1 py-2 rounded-md transition-all duration-300 font-medium text-sm ${activePortal === 'sub_admin' ? 'bg-card text-neon shadow-md' : 'text-gray-400'}`}
                            onClick={() => setActivePortal('sub_admin')}
                        >
                            Sub Admin
                        </button>
                        <button
                            className={`flex-1 py-2 rounded-md transition-all duration-300 font-medium text-sm ${activePortal === 'admin' ? 'bg-card text-neon shadow-md' : 'text-gray-400'}`}
                            onClick={() => setActivePortal('admin')}
                        >
                            Admin
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                placeholder={emailPlaceholder}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field pr-12"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-neon"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-600 text-neon focus:ring-neon accent-neon bg-[#1a1a1a]" defaultChecked />
                                <span className="text-sm text-gray-400">Remember me</span>
                            </label>
                        </div>

                        <button type="submit" className="btn-neon w-full pt-4">
                            LOG IN AS {portalLabel}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
