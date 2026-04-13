import { useEffect, useState } from 'react';

const StatCard = ({ icon: Icon, label, value, color = 'neon' }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const isNumber = typeof value === 'number';

    useEffect(() => {
        if (!isNumber) {
            setDisplayValue(value);
            return;
        }

        const duration = 1000;
        const steps = 20;
        const stepTime = duration / steps;
        const increment = value / steps;

        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setDisplayValue(value);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(current));
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, [value, isNumber]);

    return (
        <div className="fitzon-card fitzon-card-hover relative overflow-hidden group">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-gray-400 font-medium text-sm sm:text-base">{label}</h3>
                <div className={`p-2 rounded-lg bg-[${color}] bg-opacity-10`}>
                    <Icon className={`w-6 h-6 text-neon`} />
                </div>
            </div>
            <div className="mt-4">
                <span className="text-3xl sm:text-4xl font-bebas text-white group-hover:text-neon transition-colors duration-300">
                    {displayValue}
                </span>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-neon opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
        </div>
    );
};

export default StatCard;
