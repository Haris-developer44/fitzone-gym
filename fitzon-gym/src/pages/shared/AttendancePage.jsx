// import { useState, useEffect } from 'react';
// import AdminSidebar from '../../components/admin/AdminSidebar';
// import SubAdminSidebar from '../../components/sub_admin/SubAdminSidebar';
// import { getMembers, saveMember ,getAttendance,getAttPeriods,markAtt} from '../../utils/localStorage';
// import { CheckCircle } from 'lucide-react';
// import toast from 'react-hot-toast';

// const AttendancePage = () => {
//     const [members, setMembers] = useState([]);
//     const [att,setAtt]=useState([]);
//     // Determine which sidebar to render based on URL
//     const isAdmin = window.location.pathname.startsWith('/admin');
//     const Sidebar = isAdmin ? AdminSidebar : SubAdminSidebar;




//     const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//     const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//     const [availablePeriods, setAvailablePeriods] = useState([]);

//     useEffect(()=>{
//         async function getAtt(){
//             const data = await getAttendance(selectedDay,selectedMonth,selectedYear);
//             setMembers(data);
//             setAtt(data);
//         }
//         getAtt();
//     },[selectedMonth, selectedYear])
//      useEffect(() => {
//             const fetchPeriods = async () => {
//                 try {
//                     const periods = await getAttPeriods();
//                     setAvailablePeriods(periods || []);

//                     // Set default to most recent period if available
//                     if (periods && periods.length > 0) {
//                         const mostRecent = periods[0]; // Already sorted by year DESC, month DESC
//                         setSelectedMonth(mostRecent.month);
//                         setSelectedYear(mostRecent.year);
//                     }
//                 } catch (error) {
//                     console.error("Error fetching fee periods:", error);
//                 }
//             };
//             fetchPeriods();
//         }, []);
//     // console.log("attendance",att);
//     // useEffect(() => {
//     //     async function loadData(){
//     //         const data = await getMembers();
//     //         setMembers(data);
//     //         // console.log("member data for attendance is : ",data);
//     //     }
//     //     loadData();
//     // }, []);
//     const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

//     // Get unique months and years from available periods
//     const availableMonths = [...new Set(availablePeriods.map(p => p.month))].sort((a, b) => a - b);
//     const availableYears = [...new Set(availablePeriods.map(p => p.year))].sort((a, b) => b - a);
//     const markAttendance = (memberId) => {
//         const today = new Date().toISOString().split('T')[0];
//         markAtt(memberId);
//         toast.success("Attendance marked for today!");
//     };

//     const hasAttendedToday = (member) => {
//         const today = new Date().toISOString().split('T')[0];
//         return (member.attendanceHistory || []).includes(today);
//     };

//     return (
//         <Sidebar>
//             <div className="mb-8">
//                 <h1 className="text-3xl font-bold mb-1">Attendance Tracking</h1>
//                 <p className="text-gray-400">Mark daily attendance for gym members</p>
//             </div>
//             <div>
//                         <h3 className="text-xl font-bold">Transactions</h3>
//                         <div className="flex items-center gap-2 mt-2">
//                             <select
//                                 className="input-field py-1 bg-[#1a1a1a] w-auto text-sm"
//                                 value={selectedMonth}
//                                 onChange={(e) => setSelectedMonth(Number(e.target.value))}
//                             >
//                                 {availableMonths.length > 0 ? (
//                                     availableMonths.map(month => (
//                                         <option key={month} value={month}>
//                                             {monthNames[month - 1]}
//                                         </option>
//                                     ))
//                                 ) : (
//                                     <option value={selectedMonth}>
//                                         {monthNames[selectedMonth - 1]}
//                                     </option>
//                                 )}
//                             </select>
//                             <select
//                                 className="input-field py-1 bg-[#1a1a1a] w-auto text-sm"
//                                 value={selectedYear}
//                                 onChange={(e) => setSelectedYear(Number(e.target.value))}
//                             >
//                                 {availableYears.length > 0 ? (
//                                     availableYears.map(year => (
//                                         <option key={year} value={year}>{year}</option>
//                                     ))
//                                 ) : (
//                                     <option value={selectedYear}>{selectedYear}</option>
//                                 )}
//                             </select>
//                         </div>
//                     </div>
//             <div className="fitzon-card p-0 overflow-hidden">
//                 <div className="p-6 border-b border-[#1f1f1f] bg-[#151515]">
//                     <h3 className="text-xl font-bold">Today's Attendance</h3>
//                 </div>

//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left">
//                         <thead className="bg-[#1a1a1a] text-gray-400 text-sm border-b border-[#1f1f1f] uppercase tracking-wider">
//                             <tr>
//                                 <th className="p-4 font-medium">Member</th>
//                                 <th className="p-4 font-medium">Plan</th>
//                                 <th className="p-4 font-medium text-center">Total Attended</th>
//                                 <th className="p-4 font-medium text-right">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-[#1f1f1f]">
//                             {members.map(member => (
//                                 <tr key={member.id} className="hover:bg-[#111111] transition-colors">
//                                     <td className="p-4">
//                                         <div className="font-bold">{member.name}</div>
//                                         <div className="text-xs text-gray-500 mt-0.5">{member.phone || 'N/A'}</div>
//                                     </td>
//                                     <td className="p-4 text-gray-300">{member.plan || 'Basic'}</td>
//                                     <td className="p-4 text-center font-bold text-white">
//                                         {member.present_days} days
//                                     </td>
//                                     <td className="p-4 text-right">
//                                         {hasAttendedToday(member) ? (
//                                             <span className="inline-flex items-center gap-2 text-green-500 text-sm font-bold">
//                                                 <CheckCircle className="w-4 h-4" />
//                                                 Present
//                                             </span>
//                                         ) : (
//                                             <button 
//                                                 onClick={() => markAttendance(member.id)}
//                                                 className="btn-outline py-1.5 px-3 text-xs"
//                                             >
//                                                 Mark Present
//                                             </button>
//                                         )}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                     {members.length === 0 && (
//                         <div className="text-center py-10 text-gray-500">No active members found.</div>
//                     )}
//                 </div>
//             </div>
//         </Sidebar>
//     );
// };

// export default AttendancePage;









//updated

// import { useState, useEffect } from 'react';
// import AdminSidebar from '../../components/admin/AdminSidebar';
// import SubAdminSidebar from '../../components/sub_admin/SubAdminSidebar';
// import { getMembers, saveMember, getAttendance, getAttPeriods, markAtt } from '../../utils/localStorage';
// import { CheckCircle } from 'lucide-react';
// import toast from 'react-hot-toast';

// const AttendancePage = () => {
//     const [members, setMembers] = useState([]);
//     const [att, setAtt] = useState([]);
//     const isAdmin = window.location.pathname.startsWith('/admin');
//     const Sidebar = isAdmin ? AdminSidebar : SubAdminSidebar;

//     const [selectedDay, setSelectedDay] = useState(new Date().getDate());
//     const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//     const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//     const [availablePeriods, setAvailablePeriods] = useState([]);

//     // Generate available days for the selected month/year
//     const getDaysInMonth = (month, year) => {
//         return new Date(year, month, 0).getDate();
//     };
//     // Replace this:
//     // const availableDays = Array.from(
//     //     { length: getDaysInMonth(selectedMonth, selectedYear) },
//     //     (_, i) => i + 1
//     // );

//     // With this:
//     const today = new Date();
//     const isCurrentMonthYear =
//         selectedMonth === today.getMonth() + 1 &&
//         selectedYear === today.getFullYear();

//     const maxDay = isCurrentMonthYear ? today.getDate() : getDaysInMonth(selectedMonth, selectedYear);

//     const availableDays = Array.from({ length: maxDay }, (_, i) => i + 1);
//     useEffect(() => {
//         async function getAtt() {
//             const data = await getAttendance(selectedDay, selectedMonth, selectedYear);
//             setMembers(data);
//             setAtt(data);
//             console.log("filtered data: ", data);
//         }
//         getAtt();
//     }, [selectedDay, selectedMonth, selectedYear]); // ← added selectedDay

//     useEffect(() => {
//         const fetchPeriods = async () => {
//             try {
//                 const periods = await getAttPeriods();
//                 setAvailablePeriods(periods || []);
//                 if (periods && periods.length > 0) {
//                     const mostRecent = periods[0];
//                     setSelectedMonth(mostRecent.month);
//                     setSelectedYear(mostRecent.year);
//                     // If today's day is valid for most recent period, keep it; else default to 1
//                     const daysInRecent = new Date(mostRecent.year, mostRecent.month, 0).getDate();
//                     setSelectedDay(prev => (prev <= daysInRecent ? prev : 1));
//                 }
//             } catch (error) {
//                 console.error("Error fetching attendance periods:", error);
//             }
//         };
//         fetchPeriods();
//     }, []);

//     // Reset day to 1 if current selectedDay exceeds days in new month/year
//     // Replace this:
//     // useEffect(() => {
//     //     const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
//     //     if (selectedDay > daysInMonth) {
//     //         setSelectedDay(1);
//     //     }
//     // }, [selectedMonth, selectedYear]);

//     // With this:
//     useEffect(() => {
//         const today = new Date();
//         const isCurrentMonthYear =
//             selectedMonth == today.getMonth() + 1 &&
//             selectedYear == today.getFullYear();
//         console.log("isCurrentMonthYear; ", isCurrentMonthYear)
//         const maxDay = isCurrentMonthYear
//             ? today.getDate()
//             : getDaysInMonth(selectedMonth, selectedYear);
//         console.log("maxDay: ", maxDay);
//         if (selectedDay > maxDay) {
//             setSelectedDay(maxDay);
//         }
//     }, [selectedDay, selectedMonth, selectedYear]);

//     const monthNames = ["January", "February", "March", "April", "May", "June",
//         "July", "August", "September", "October", "November", "December"];

//     // const availableMonths = [...new Set(availablePeriods.map(p => p.month))].sort((a, b) => a - b);
//     const currentMonth = today.getMonth() + 1;
//     const currentYear = today.getFullYear();

//     const availableMonths = [...new Set(availablePeriods.map(p => p.month))]
//         .filter(month => selectedYear < currentYear || month <= currentMonth)
//         .sort((a, b) => a - b);

//     // const availableYears = [...new Set(availablePeriods.map(p => p.year))].sort((a, b) => b - a);
//     const availableYears = [...new Set(availablePeriods.map(p => p.year))]
//         .filter(year => year <= currentYear)
//         .sort((a, b) => b - a);
//     useEffect(() => {
//         if (selectedYear == currentYear && selectedMonth > currentMonth) {
//             setSelectedMonth(currentMonth);
//         }
//     }, [selectedYear]);


//     const markAttendance = (memberId) => {
//         markAtt(memberId);
//         setMembers(prev =>
//             prev.map(member =>
//                 member.id === memberId
//                     ? { ...member, status: 'present' }
//                     : member
//             )
//         );
//         toast.success("Attendance marked for today!");
//     };

//     const hasAttendedToday = (member) => {
//         const today = new Date().getDate();
//         return selectedDay === new Date().getDate() && member.status == 'present';
//     };

//     return (
//         <Sidebar>
//             <div className="mb-8">
//                 <h1 className="text-3xl font-bold mb-1">Attendance Tracking</h1>
//                 <p className="text-gray-400">Mark daily attendance for gym members</p>
//             </div>

//             <div>
//                 <h3 className="text-xl font-bold">Transactions</h3>
//                 <div className="flex items-center gap-2 mt-2">

//                     {/* ── Day selector (NEW) ── */}
//                     <select
//                         className="input-field py-1 bg-[#1a1a1a] w-auto text-sm"
//                         value={selectedDay}
//                         onChange={(e) => setSelectedDay(Number(e.target.value))}
//                     >
//                         {availableDays.map(day => (
//                             <option key={day} value={day}>{day}</option>
//                         ))}
//                     </select>

//                     {/* Month selector */}
//                     <select
//                         className="input-field py-1 bg-[#1a1a1a] w-auto text-sm"
//                         value={selectedMonth}
//                         onChange={(e) => setSelectedMonth(Number(e.target.value))}
//                     >
//                         {availableMonths.length > 0 ? (
//                             availableMonths.map(month => (
//                                 <option key={month} value={month}>
//                                     {monthNames[month - 1]}
//                                 </option>
//                             ))
//                         ) : (
//                             <option value={selectedMonth}>{monthNames[selectedMonth - 1]}</option>
//                         )}
//                     </select>

//                     {/* Year selector */}
//                     <select
//                         className="input-field py-1 bg-[#1a1a1a] w-auto text-sm"
//                         value={selectedYear}
//                         onChange={(e) => setSelectedYear(Number(e.target.value))}
//                     >
//                         {availableYears.length > 0 ? (
//                             availableYears.map(year => (
//                                 <option key={year} value={year}>{year}</option>
//                             ))
//                         ) : (
//                             <option value={selectedYear}>{selectedYear}</option>
//                         )}
//                     </select>
//                 </div>
//             </div>

//             <div className="fitzon-card p-0 overflow-hidden mt-6">
//                 <div className="p-6 border-b border-[#1f1f1f] bg-[#151515]">
//                     <h3 className="text-xl font-bold">Today's Attendance</h3>
//                 </div>
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left">
//                         <thead className="bg-[#1a1a1a] text-gray-400 text-sm border-b border-[#1f1f1f] uppercase tracking-wider">
//                             <tr>
//                                 <th className="p-4 font-medium">Member</th>
//                                 <th className="p-4 font-medium text-center">Status</th>
//                                 <th className="p-4 font-medium text-right">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-[#1f1f1f]">
//                             {members.map(member => (
//                                 <tr key={member.id} className="hover:bg-[#111111] transition-colors">
//                                     <td className="p-4">
//                                         <div className="font-bold">{member.name}</div>
//                                         <div className="text-xs text-gray-500 mt-0.5">{member.phone || 'N/A'}</div>
//                                     </td>
//                                     <td className="p-4 text-center font-bold text-white">
//                                         {member.status}
//                                     </td>
//                                     <td className="p-4 text-right">
//                                         {hasAttendedToday(member) ? (
//                                             <span className="inline-flex items-center gap-2 text-green-500 text-sm font-bold">
//                                                 <CheckCircle className="w-4 h-4" />
//                                                 Present
//                                             </span>
//                                         ) : (
//                                             selectedDay === new Date().getDate() ? (

//                                                 <button
//                                                     onClick={() => markAttendance(member.id)}
//                                                     className="btn-outline py-1.5 px-3 text-xs"
//                                                 >
//                                                     Mark Present
//                                                 </button>
//                                             ) : (
//                                                 <span className="inline-flex items-center gap-2 text-green-500 text-sm font-bold">
//                                                     <CheckCircle className="w-4 h-4" />
//                                                     {member.status}
//                                                 </span>
//                                             )
//                                         )}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                     {members.length === 0 && (
//                         <div className="text-center py-10 text-gray-500">No active members found.</div>
//                     )}
//                 </div>
//             </div>
//         </Sidebar>
//     );
// };

// export default AttendancePage;





//again updaed


import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import SubAdminSidebar from '../../components/sub_admin/SubAdminSidebar';
import { getAttendance, getAttPeriods, markAtt } from '../../utils/localStorage';
import { CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AttendancePage = () => {
    const [members, setMembers] = useState([]);
    const [att, setAtt] = useState([]);
    const isAdmin = window.location.pathname.startsWith('/admin');
    const Sidebar = isAdmin ? AdminSidebar : SubAdminSidebar;
    const startDate = new Date(2026, 3, 1);

    // ── Define today's values ONCE at the top ──
    const todayDate = new Date();
    const currentDay = todayDate.getDate();
    const currentMonth = todayDate.getMonth() + 1;
    const currentYear = todayDate.getFullYear();

    const [selectedDay, setSelectedDay] = useState(currentDay);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [availablePeriods, setAvailablePeriods] = useState([]);

    // ── Helpers ──
    const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();

    const isSelectedToday =
        selectedDay == currentDay &&
        selectedMonth == currentMonth &&
        selectedYear == currentYear;

    // ── Available days: cap at today if current month/year ──
    const isCurrentMonthYear =
        selectedMonth == currentMonth && selectedYear == currentYear;
    const maxDay = isCurrentMonthYear ? currentDay : getDaysInMonth(selectedMonth, selectedYear);
    const availableDays = Array.from({ length: maxDay }, (_, i) => i + 1);


    //replace this
    // // ── Available months: cap at current month if current year ──
    // const availableMonths = [...new Set(availablePeriods.map(p => p.month))]
    //     .filter(month => selectedYear < currentYear || month <= currentMonth)
    //     .sort((a, b) => a - b);

    // // ── Available years: only up to current year ──
    // const availableYears = [...new Set(availablePeriods.map(p => p.year))]
    //     .filter(year => year <= currentYear)
    //     .sort((a, b) => b - a);
    // with this
    const availableMonths = Array.from({ length: 12 }, (_, i) => i + 1)
        .filter(month => selectedYear < currentYear || month <= currentMonth);

    const availableYears = Array.from(
        { length: currentYear - 2020 + 1 },   // adjust 2020 to your app's start year
        (_, i) => 2020 + i
    ).filter(year => year <= currentYear)
        .sort((a, b) => b - a);




    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    // ── Fetch attendance when date changes ──
    useEffect(() => {
        async function getAtt() {
            const data = await getAttendance(selectedDay, selectedMonth, selectedYear);
            setMembers(data);
            setAtt(data);
        }
        getAtt();
    }, [selectedDay, selectedMonth, selectedYear]);

    // ── Fetch available periods on mount ──
    useEffect(() => {
        const fetchPeriods = async () => {
            try {
                const periods = await getAttPeriods();
                setAvailablePeriods(periods || []);
                // if (periods && periods.length > 0) {
                //     const mostRecent = periods[0];
                //     setSelectedMonth(mostRecent.month);
                //     setSelectedYear(mostRecent.year);
                //     const daysInRecent = getDaysInMonth(mostRecent.month, mostRecent.year);
                //     setSelectedDay(prev => (prev <= daysInRecent ? prev : 1));
                // }
            } catch (error) {
                console.error("Error fetching attendance periods:", error);
            }
        };
        fetchPeriods();
    }, []);

    // ── Reset day if it exceeds max for selected month/year ──
    useEffect(() => {
        if (selectedDay > maxDay) {
            setSelectedDay(maxDay);
        }
    }, [selectedMonth, selectedYear]);

    // ── Reset month if it exceeds current month when switching to current year ──
    useEffect(() => {
        if (selectedYear == currentYear && selectedMonth > currentMonth) {
            setSelectedMonth(currentMonth);
        }
    }, [selectedYear]);

    // ── Mark attendance ──
    const markAttendance = (memberId) => {
        markAtt(memberId);
        setMembers(prev =>
            prev.map(member =>
                member.id == memberId
                    ? { ...member, status: 'present' }
                    : member
            )
        );
        toast.success("Attendance marked for today!");
    };
    const selectedDate = new Date(selectedYear, selectedMonth, selectedDay);
    console.log("separete ", selectedDay, selectedMonth, selectedYear)
    console.log("start date is : ", startDate);
    console.log("selectedDate is: ", selectedDate.getTime());
    console.log("date equality", selectedDate.getTime() == startDate.getTime());
    const ShowData = selectedDate.getTime() < startDate.getTime();
    console.log(ShowData);
    return (
        <Sidebar>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-1">Attendance Tracking</h1>
                <p className="text-gray-400">Mark daily attendance for gym members</p>
            </div>

            <div>
                <h3 className="text-xl font-bold">Filter Attendance</h3>
                <div className="flex items-center gap-2 mt-2">

                    {/* Day */}
                    <select
                        className="input-field py-1 bg-[#1a1a1a] w-auto text-sm"
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(Number(e.target.value))}
                    >
                        {availableDays.map(day => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>

                    {/* Month */}
                    <select
                        className="input-field py-1 bg-[#1a1a1a] w-auto text-sm"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    >
                        {availableMonths.length > 0 ? (
                            availableMonths.map(month => (
                                <option key={month} value={month}>
                                    {monthNames[month - 1]}
                                </option>
                            ))
                        ) : (
                            <option value={selectedMonth}>{monthNames[selectedMonth - 1]}</option>
                        )}
                    </select>

                    {/* Year */}
                    <select
                        className="input-field py-1 bg-[#1a1a1a] w-auto text-sm"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                        {availableYears.length > 0 ? (
                            availableYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))
                        ) : (
                            <option value={selectedYear}>{selectedYear}</option>
                        )}
                    </select>
                </div>
            </div>

            <div className="fitzon-card p-0 overflow-hidden mt-6">
                <div className="p-6 border-b border-[#1f1f1f] bg-[#151515]">
                    <h3 className="text-xl font-bold">
                        {isSelectedToday ? "Today's Attendance" : `Attendance — ${selectedDay} ${monthNames[selectedMonth - 1]} ${selectedYear}`}
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#1a1a1a] text-gray-400 text-sm border-b border-[#1f1f1f] uppercase tracking-wider">
                            <tr>
                                <th className="p-4 font-medium">Member</th>
                                <th className="p-4 font-medium text-center">Status</th>
                                <th className="p-4 font-medium text-center">Check In</th>
                                <th className="p-4 font-medium text-center">Check Out</th>
                                <th className="p-4 font-medium text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1f1f1f]">
                            {members.map(member => (
                                <tr key={member.id} className="hover:bg-[#111111] transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold">{member.name}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{member.phone || 'N/A'}</div>
                                    </td>
                                    <td className="p-4 text-center font-bold text-white">
                                        {member.status}
                                    </td>
                                    <td className="p-4 text-center">
                                        {member.check_in || "--:--"}
                                    </td>
                                    <td className="p-4 text-center">
                                        {member.check_out || "--:--"}
                                    </td>
                                    <td className="p-4 text-center">
                                        {member.status === 'present' ? (
                                            // Already marked present — show badge regardless of date
                                            <span className="inline-flex items-center gap-2 text-green-500 text-sm font-bold">
                                                <CheckCircle className="w-4 h-4" />
                                                Present
                                            </span>
                                        ) : isSelectedToday ? (
                                            // Past date or future — just show status, no button
                                            <button
                                                onClick={() => markAttendance(member.id)}
                                                className="btn-outline py-1.5 px-3 text-xs"
                                            >
                                                Mark Present
                                            </button>
                                        ) : (
                                            <span className="text-gray-500 text-sm">
                                                {member.status}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {members.length === 0 && (
                        <div className="text-center py-10 text-gray-500">No record members found.</div>
                    )}
                </div>
            </div>
        </Sidebar>
    );
};

export default AttendancePage;