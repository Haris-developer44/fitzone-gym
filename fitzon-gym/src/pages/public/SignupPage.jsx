import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const SignupPage = () => {
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', password: '', confirmPassword: '', plan: 'Basic'
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        // eslint-disable-next-line no-unused-vars
        const { confirmPassword, ...signupData } = formData;
        const result = signup(signupData);

        if (result.success) {
            navigate('/member/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark py-12 px-4 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-neon/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-2xl relative z-10">
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center gap-2 mb-2">
                        <span className="font-bebas text-5xl tracking-widest text-white">JOIN</span>
                        <span className="font-bebas text-5xl tracking-widest text-neon">FITZON</span>
                    </Link>
                    <p className="text-gray-400">Start your fitness journey today</p>
                </div>

                <form onSubmit={handleSubmit} className="fitzon-card space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Full Name *</label>
                            <input
                                type="text" name="name" value={formData.name} onChange={handleChange}
                                className="input-field" placeholder="John Doe" required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Phone Number *</label>
                            <input
                                type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                className="input-field" placeholder="0300-1234567" required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Email Address *</label>
                        <input
                            type="email" name="email" value={formData.email} onChange={handleChange}
                            className="input-field" placeholder="john@example.com" required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Password *</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"} name="password"
                                    value={formData.password} onChange={handleChange}
                                    className="input-field pr-12" placeholder="••••••••" required
                                />
                                <button
                                    type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Confirm Password *</label>
                            <input
                                type={showPassword ? "text" : "password"} name="confirmPassword"
                                value={formData.confirmPassword} onChange={handleChange}
                                className="input-field" placeholder="••••••••" required
                            />
                        </div>
                    </div>

                    <div className="text-sm text-gray-400">
                        Membership plan is set automatically.
                    </div>

                    <button type="submit" className="btn-neon w-full mt-8">
                        CREATE ACCOUNT
                    </button>

                    <p className="text-center mt-6 text-sm text-gray-400">
                        Already have an account? <Link to="/login" className="text-neon hover:underline">Log in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
