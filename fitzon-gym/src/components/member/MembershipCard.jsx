import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const MembershipCard = () => {
    const { currentUser } = useContext(AuthContext);

    if (!currentUser) return null;

    const validFrom = currentUser.joinDate;
    const validUntil = currentUser.nextPaymentDate;

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#111111] to-[#0a0a0a] border border-[#2f2f2f] shadow-2xl p-6 mb-8 transform transition-transform hover:-translate-y-1 hover:shadow-neon/10 group">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-neon opacity-10 rounded-full blur-[60px] pointer-events-none group-hover:opacity-20 transition-opacity"></div>

            {/* Header */}
            <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                    <div className="flex items-center gap-1 mb-1">
                        <span className="font-bebas text-2xl tracking-widest text-neon">FITZON</span>
                        <span className="font-bebas text-2xl tracking-widest text-white">GYM</span>
                    </div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Islamabad, PK</p>
                </div>

                <div className="bg-[#1a1a1a] border border-[#333] px-3 py-1 rounded-full text-xs font-bold text-gray-300 uppercase tracking-widest shadow-inner">
                    {currentUser.plan} pass
                </div>
            </div>

            {/* Member Info */}
            <div className="relative z-10 space-y-4">
                <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Passholder</p>
                    <p className="text-2xl font-bold text-white tracking-wide">{currentUser.name}</p>
                    <p className="text-sm text-neon font-mono mt-1">ID: {currentUser.id.substring(0, 8).toUpperCase()}</p>
                </div>

                <div className="flex gap-10">
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Valid From</p>
                        <p className="text-sm font-medium text-white">{validFrom}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Valid Until</p>
                        <p className="text-sm font-medium text-white">{validUntil}</p>
                    </div>
                </div>
            </div>

            {/* Barcode & Footer Decor */}
            <div className="mt-8 pt-6 border-t border-[#1f1f1f] relative z-10 flex justify-between items-center">
                <div className="flex gap-1 items-end h-8 opacity-40 group-hover:opacity-70 transition-opacity">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className={`bg-white rounded-t-sm w-1`}
                            style={{ height: `${Math.max(10, Math.random() * 32)}px` }}
                        ></div>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    {currentUser.feeStatus === 'Paid' ? (
                        <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></span>
                    ) : (
                        <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]"></span>
                    )}
                    <span className="text-xs text-gray-400 font-mono tracking-wider">{currentUser.feeStatus.toUpperCase()}</span>
                </div>
            </div>
        </div>
    );
};

export default MembershipCard;
