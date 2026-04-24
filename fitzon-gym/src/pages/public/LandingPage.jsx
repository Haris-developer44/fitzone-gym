import Navbar from '../../components/shared/Navbar';
import { ArrowRight, CheckCircle2, ChevronDown, Dumbbell, MapPin, Mail, Phone, Users as UsersIcon, Clock, Star, Tag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getMembershipPlans } from '../../utils/localStorage';

const LandingPage = () => {
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await getMembershipPlans();
                setPlans(data || []);
            } catch (error) {
                console.error("Failed to fetch plans", error);
            }
        };
        fetchPlans();
    }, []);

    return (
        <div className="bg-dark text-white min-h-screen">
            <Navbar />

            {/* HERO SECTION */}
            <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent"></div>

                <div className="relative z-10 text-center max-w-5xl mx-auto px-4 flex flex-col items-center">
                    <h1 className="text-6xl sm:text-8xl md:text-9xl font-bebas text-white tracking-wider mb-2 leading-none">
                        DEFY YOUR <span className="text-neon block mt-2 sm:mt-0 sm:inline">LIMITS</span>
                    </h1>
                    <p className="text-xl sm:text-2xl text-gray-300 mb-10 tracking-wide font-light">
                        Islamabad's Most Electrifying Gym Experience
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6">
                        <a href="/login" className="btn-neon text-lg px-8 py-4">
                            Start Free Trial <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>

                    <div className="mt-20 flex flex-wrap justify-center gap-10 md:gap-20 text-center animate-in slide-in-from-bottom duration-1000">
                        <div>
                            <h3 className="text-4xl sm:text-5xl font-bebas text-neon">500+</h3>
                            <p className="text-gray-400 uppercase tracking-widest text-sm mt-1">Members</p>
                        </div>
                        <div>
                            <h3 className="text-4xl sm:text-5xl font-bebas text-neon">10+</h3>
                            <p className="text-gray-400 uppercase tracking-widest text-sm mt-1">Trainers</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* PLANS SECTION */}
            <section id="plans" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border">
                <div className="text-center mb-16">
                    <h2 className="heading-primary mb-4 text-neon">Membership Plans</h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Choose the perfect plan to reach your fitness goals. Transparent pricing, no hidden fees.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div key={plan.planName} className="fitzon-card flex flex-col hover:border-neon transition-colors duration-300">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-white mb-2">{plan.planName}</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bebas text-neon">Rs {plan.amount}</span>
                                    <span className="text-gray-500">/month</span>
                                </div>
                            </div>
                            <p className="text-gray-400 mb-8 flex-1">
                                {plan.description || 'Premium fitness access and amenities.'}
                            </p>
                            <a href="/login" className="btn-outline w-full text-center py-3">
                                Join Now
                            </a>
                        </div>
                    ))}
                    {plans.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Loading plans or no plans available at the moment.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* ABOUT SECTION */}
            <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="heading-primary mb-6 text-neon">Who We Are</h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            Fitzon Gym is not just a place to sweat; it's a community dedicated to transformation. Located in the heart of Islamabad, we provide state-of-the-art equipment, elite coaching, and an electrifying atmosphere that pushes you past your boundaries.
                        </p>

                        <div className="space-y-6">
                            {[
                                'Premium imported equipment',
                                'Certified international trainers',
                                'Custom nutrition and workout plans',
                                'Recovery and dynamic stretching zones'
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-neon shrink-0" />
                                    <span className="text-lg">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="fitzon-card mt-0 sm:mt-12 bg-gradient-to-br from-[#111] to-[#1a1a1a]">
                            <Dumbbell className="w-10 h-10 text-neon mb-4" />
                            <h3 className="text-xl font-bold mb-2">Modern Tech</h3>
                            <p className="text-gray-400 text-sm">Smart tracks and machines integration</p>
                        </div>
                        <div className="fitzon-card bg-gradient-to-br from-[#111] to-[#1a1a1a]">
                            <UsersIcon className="w-10 h-10 text-neon mb-4" />
                            <h3 className="text-xl font-bold mb-2">Community First</h3>
                            <p className="text-gray-400 text-sm">Join a tribe that motivates you</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTACT & FOOTER */}
            <footer id="contact" className="border-t border-border bg-[#050505] pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 mb-16">
                        <div>
                            <h2 className="text-4xl font-bebas tracking-wider text-neon mb-6">Let's Get In Touch</h2>
                            <p className="text-gray-400 mb-8">Ready to start your fitness journey? Drop us a message or visit us today.</p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="p-3 bg-neon/10 rounded-lg shrink-0"><MapPin className="text-neon w-6 h-6" /></div>
                                    <div>
                                        <h4 className="font-bold mb-1">Location</h4>
                                        <p className="text-gray-400 text-sm">F-7 Markaz, Islamabad, Pakistan</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="p-3 bg-neon/10 rounded-lg shrink-0"><Phone className="text-neon w-6 h-6" /></div>
                                    <div>
                                        <h4 className="font-bold mb-1">Phone</h4>
                                        <p className="text-gray-400 text-sm">051-1234567 | +92 300 0000000</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="p-3 bg-neon/10 rounded-lg shrink-0"><Mail className="text-neon w-6 h-6" /></div>
                                    <div>
                                        <h4 className="font-bold mb-1">Email</h4>
                                        <p className="text-gray-400 text-sm">hello@fitzon.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form className="fitzon-card bg-[#0a0a0a] space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Name</label>
                                <input type="text" className="input-field" placeholder="John Doe" required />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Email</label>
                                <input type="email" className="input-field" placeholder="john@example.com" required />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Message</label>
                                <textarea className="input-field h-32 resize-none" placeholder="How can we help?" required></textarea>
                            </div>
                            <button type="submit" className="btn-neon w-full">Send Message</button>
                        </form>
                    </div>

                    <div className="border-t border-[#1f1f1f] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="font-bebas text-2xl tracking-widest text-neon">FITZON</span>
                            <span className="font-bebas text-2xl tracking-widest text-white">GYM</span>
                        </div>
                        <p className="text-gray-500 text-sm">© 2026 Fitzon Gym Islamabad. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
