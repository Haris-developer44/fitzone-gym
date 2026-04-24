import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getChallans } from '../../utils/localStorage';
import { FileText, Search, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import html2pdf from "html2pdf.js";

const ChallansPage = () => {
    const [challans, setChallans] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChallans = async () => {
            try {
                const data = await getChallans();
                setChallans(data || []);
            } catch (error) {
                console.error("Failed to fetch challans", error);
                toast.error("Failed to load challans");
            } finally {
                setLoading(false);
            }
        };
        fetchChallans();
    }, []);

    const formatRs = (n) => `Rs ${Number(n || 0).toLocaleString()}`;

    const printChallan = async (challan) => {
        const element = document.createElement("div");
        element.innerHTML = `
        <div style="font-family: Arial; padding: 24px; color: #111;">
            <div style="border: 1px solid #ddd; border-radius: 10px; padding: 18px; max-width: 720px; margin: 0 auto;">
                <h1 style="margin:0 0 6px; font-size:18px;">FITZON Gym Challan</h1>
                <div style="color:#555; font-size:12px;">Generated for fee payment</div>
                <hr/>

                <div style="display:flex; justify-content:space-between;">
                    <div><b>Challan No:</b> ${challan.id}</div>
                    <div><b>Paid Date:</b> ${challan.paidDate}</div>
                </div>

                <div style="margin-top:10px;">
                    <b>Member:</b> ${challan.memberName}<br/>
                    <b>Phone:</b> ${challan.phone || "N/A"}
                </div>

                <div style="margin-top:10px;">
                    <b>Address:</b> ${challan.address || "N/A"}
                </div>

                <hr/>

                <div style="display:flex; justify-content:space-between;">
                    <div><b>Amount:</b> ${formatRs(challan.amount)}</div>
                    <div><b>Due Date:</b> ${challan.dueDate || "N/A"}</div>
                </div>

                <div style="margin-top:15px;">
                    Status: <b>Paid</b>
                </div>
                <div style="display:flex; justify-content:center"><b>Payment Method:</b> ${challan.paymentmethod}</div>
            </div>
            <script>window.onload = function(){ window.print(); };</script>
        </div>
    `;

        const opt = {
            margin: 0.3,
            filename: `challan-${challan.id}.pdf`,
            image: {
                type: "jpeg",
                quality: 1 // 🔥 highest quality
            },
            html2canvas: {
                scale: 3, // 🔥 important (default is ~1)
                useCORS: true
            },
            jsPDF: {
                unit: "in",
                format: "a4",
                orientation: "portrait"
            }
        };

        try {
            // 🔥 Generate PDF as Blob
            const pdfBlob = await html2pdf().from(element).set(opt).outputPdf("blob");

            // 🔥 Send to backend
            const formData = new FormData();
            formData.append("file", pdfBlob, `challan-${challan.id}.pdf`);
            formData.append("phone", challan.phone);

            await fetch("http://localhost:3000/send-whatsapp", {
                method: "POST",
                body: formData
            });

            alert("Challan sent to WhatsApp successfully!");
            const w = window.open('', '_blank');
            if (!w) {
                toast.error('Popup blocked. Please allow popups to print challan.');
                return;
            }
            w.document.write(element.innerHTML);
            w.document.close();

        } catch (err) {
            console.error(err);
            alert("Error generating/sending PDF");
        }
    };

    const filteredChallans = challans.filter(c => 
        (c.memberName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (c.id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (c.phone || '').includes(searchTerm)
    );

    return (
        <AdminSidebar>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-1">Generated Challans</h1>
                <p className="text-gray-400">View and print past payment challans.</p>
            </div>

            <div className="fitzon-card p-0 overflow-hidden">
                <div className="p-6 border-b border-[#1f1f1f] flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#151515]">
                    <h3 className="text-xl font-bold">Challan History</h3>
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Search by name, ID or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-10"
                        />
                        <Search className="w-5 h-5 text-gray-500 absolute left-3 top-3" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#1a1a1a] text-gray-400 text-sm border-b border-[#1f1f1f] uppercase tracking-wider">
                            <tr>
                                <th className="p-4 font-medium">Challan ID</th>
                                <th className="p-4 font-medium">Member</th>
                                <th className="p-4 font-medium">Amount</th>
                                <th className="p-4 font-medium">Paid Date</th>
                                <th className="p-4 font-medium">Method</th>
                                <th className="p-4 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1f1f1f]">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center text-gray-500">Loading challans...</td>
                                </tr>
                            ) : filteredChallans.length > 0 ? (
                                filteredChallans.map((challan) => (
                                    <tr key={challan.id} className="hover:bg-[#111111] transition-colors">
                                        <td className="p-4 font-mono text-neon">{challan.id}</td>
                                        <td className="p-4">
                                            <div className="font-bold text-white">{challan.memberName}</div>
                                            <div className="text-xs text-gray-500 mt-0.5">{challan.phone || 'N/A'}</div>
                                        </td>
                                        <td className="p-4 font-bebas text-lg tracking-wide">
                                            {formatRs(challan.amount)}
                                        </td>
                                        <td className="p-4 text-gray-400">{challan.paidDate}</td>
                                        <td className="p-4">
                                            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20 capitalize">
                                                {challan.paymentmethod || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => printChallan(challan)}
                                                className="btn-outline py-1.5 px-3 text-xs inline-flex items-center gap-2"
                                            >
                                                <Download className="w-4 h-4" />
                                                Print PDF
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center text-gray-500">No challans found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminSidebar>
    );
};

export default ChallansPage;
