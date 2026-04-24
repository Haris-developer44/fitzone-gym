import { seedMembers } from '../data/seedData';
import axios from "axios";

export const MEMBERS_KEY = 'fitzon_members';
export const AUTH_KEY = 'fitzon_auth';
export const COMM_KEY = 'fitzon_community';
export const TICKET_KEY = 'fitzon_tickets';
export const CHALLAN_KEY = 'fitzon_challans';

export const initStorage = () => {
    const members = localStorage.getItem(MEMBERS_KEY);
    if (!members) {
        localStorage.setItem(MEMBERS_KEY, JSON.stringify(seedMembers));
    }

    if (!localStorage.getItem(COMM_KEY)) {
        localStorage.setItem(COMM_KEY, JSON.stringify([]));
    }

    if (!localStorage.getItem(TICKET_KEY)) {
        localStorage.setItem(TICKET_KEY, JSON.stringify([]));
    }

    if (!localStorage.getItem(CHALLAN_KEY)) {
        localStorage.setItem(CHALLAN_KEY, JSON.stringify([]));
    }
};

// Generate a unique ID
export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const getMembers = async () => {
    // return JSON.parse(localStorage.getItem(MEMBERS_KEY) || '[]');
    const response = await axios.get("http://localhost:3000/members");
    return response.data;
};
export const getPreviousMembers = async () => {
    const response = await axios.get("http://localhost:3000/members/previous");
    return response.data;
}
export const updateMember = async (members, id) => {
    // localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
    await axios.put(`http://localhost:3000/members/${id}`, members)
};
export const saveMember = async (member) => {
    await axios.post("http://localhost:3000/member", member);
}
export const saveMembers = () => {

}
export const deleteMember = async (id) => {
    await axios.delete(`http://localhost:3000/member/${id}`);
}
export const updateFeeStatus = async (id) => {
    console.log("Member Id to update member is: ", id);
    await axios.patch(`http://localhost:3000/fee/${id}`);
}

export const getFees = async (month, year) => {
    const response = await axios.get(`http://localhost:3000/fees?month=${month}&year=${year}`);
    console.log("response for selected months: ", response.data);
    return response.data;
};
export const refund = async (id, month, year) => {
    const response = await axios.post(`http://localhost:3000/fee/refund?id=${id}&month=${month}&year=${year}`)
    console.log(response.data)
    return response;
}

export const getFeePeriods = async () => {
    const response = await axios.get("http://localhost:3000/fees/periods");
    return response.data;
};
export const getAttPeriods = async () => {
    const response = await axios.get("http://localhost:3000/attendance/periods");
    return response.data;
};

export const getMemberFees = async (memberId) => {
    const response = await axios.get(`http://localhost:3000/fees/member/${memberId}`);
    return response.data;
};
export const getAttendance = async (day, month, year) => {
    const response = await axios.get(`http://localhost:3000/attendance?day=${day}&month=${month}&year=${year}`);
    console.log(month, year);
    console.log("attendance: ", response.data)
    return response.data;
}
export const markAtt = async (id, status) => {
    const response = await axios.post(`http://localhost:3000/attendance/${id}`, { status });
    return response.data;
}
export const payFee = async (feeRecord) => {
    console.log("Fee record to be marked as paid:", feeRecord);
    // Mark a specific fee as paid using fee ID
    console.log("Member id for fee is: ", feeRecord.member_id);
    const response = await axios.patch(`http://localhost:3000/fee/${feeRecord.member_id}`, feeRecord);
    return response.data;
};

export const createFee = async (feeData) => {
    // feeData should contain { member_id, amount, month, year, status: 'unpaid' }
    const response = await axios.post("http://localhost:3000/fee", feeData);
    return response.data;
};

export const getMemberById = async (id) => {
    const response = await axios.get(`http://localhost:3000/member/${id}`);
    return response.data;
};

export const getCommunityPosts = () => {
    return JSON.parse(localStorage.getItem(COMM_KEY) || '[]');
};

export const saveCommunityPosts = (posts) => {
    localStorage.setItem(COMM_KEY, JSON.stringify(posts));
};

export const getTickets = () => {
    return JSON.parse(localStorage.getItem(TICKET_KEY) || '[]');
};

export const saveTickets = (tickets) => {
    localStorage.setItem(TICKET_KEY, JSON.stringify(tickets));
};

export const getAuthUser = () => {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
};

export const setAuthUser = (user) => {
    if (user) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(AUTH_KEY);
    }
};

export const getChallans = async () => {
    try {
        const response = await axios.get("http://localhost:3000/challans");
        return response.data;
    } catch (error) {
        console.error("Error fetching challans", error);
        return [];
    }
};

export const saveChallan = async (challan) => {
    try {
        const response = await axios.post("http://localhost:3000/challan", challan);
        return response.data;
    } catch (error) {
        console.error("Error saving challan", error);
        throw error;
    }
};

export const getMembershipPlans = async () => {
    const response = await axios.get("http://localhost:3000/membership-plans");
    return response.data;
};

export const updateMembershipPlan = async (planName, data) => {
    const response = await axios.put(`http://localhost:3000/membership-plans/${planName}`, data);
    return response.data;
};
