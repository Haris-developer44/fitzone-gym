import { createContext, useState, useEffect } from 'react';
import { getAuthUser, setAuthUser, getMembers, saveMember } from '../utils/localStorage';
import { generateId } from '../data/seedData';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = getAuthUser();
        if (user) {
            setCurrentUser(user);
            setUserRole(user.role);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { default: axios } = await import('axios');
            const response = await axios.post("http://localhost:3000/login", { email, password });
            
            if (response.data.success) {
                const role = response.data.role;
                const user = { email, role, name: role === 'admin' ? 'Admin' : 'Sub Admin' };
                setCurrentUser(user);
                setUserRole(role);
                setAuthUser(user);
                toast.success(`Welcome back, ${role === 'admin' ? 'Admin' : 'Sub Admin'}!`);
                return { success: true, role };
            } else {
                toast.error('Invalid email or password');
                return { success: false, message: 'Invalid email or password' };
            }
        } catch (error) {
            // Fallback to mock data if backend isn't running
            if (email === 'admin@fitzon.com' && password === '123') {
                const adminUser = { email, role: 'admin', name: 'Admin' };
                setCurrentUser(adminUser);
                setUserRole('admin');
                setAuthUser(adminUser);
                toast.success('Welcome back, Admin!');
                return { success: true, role: 'admin' };
            }
    
            if (email === 'subadmin@fitzon.com' && password === '1234') {
                const subAdminUser = { email, role: 'sub_admin', name: 'Sub Admin' };
                setCurrentUser(subAdminUser);
                setUserRole('sub_admin');
                setAuthUser(subAdminUser);
                toast.success('Welcome back, Sub Admin!');
                return { success: true, role: 'sub_admin' };
            }
    
            toast.error('Invalid email or password');
            return { success: false, message: 'Invalid email or password' };
        }
    };

    const signup = (userData) => {
        const members = getMembers();
        const existingMember = members.find(m => m.email === userData.email);

        if (existingMember) {
            toast.error('Email already in use');
            return { success: false, message: 'Email already in use' };
        }

        const newMember = {
            ...userData,
            id: generateId(),
            joinDate: new Date().toISOString().split('T')[0],
            status: 'Active',
            feeStatus: 'Pending',
            classesAttended: 0,
            nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            weight: [],
            measurements: { chest: 0, waist: 0, arms: 0, legs: 0 },
            attendanceHistory: []
        };

        members.push(newMember);
        saveMember(members);

        const user = { ...newMember, role: 'member' };
        setCurrentUser(user);
        setUserRole('member');
        setAuthUser(user);

        toast.success('Registration successful!');
        return { success: true, role: 'member' };
    };

    const logout = () => {
        setCurrentUser(null);
        setUserRole(null);
        setAuthUser(null);
        toast.success('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{ currentUser, userRole, login, signup, logout, loading, setCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
};
