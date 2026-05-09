import React, { useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
    const [formData, setFormData] = useState({
        category: 'permanent', title: '', short_info: '',
        start_date: '', last_date: '', fee_last_date: '', exam_date: '', admit_card_date: '',
        fee_gen: '', fee_sc: '', fee_note: '',
        min_age: '', max_age: '', age_note: '',
        total_posts: '', vacancy_details: '', eligibility_details: '',
        how_to_fill: '', selection_mode: '',
        apply_link: '', pdf_link: '', syllabus_link: '', official_site: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://rojgar-backend-ee9k.onrender.com/api/add-job', formData);
            alert("🔥 JOB POSTED SUCCESSFULLY WITH FULL DETAILS! 🔥");
            // फॉर्म को रिसेट करने के लिए पेज रिफ्रेश कर सकते हैं या स्टेट को खाली कर सकते हैं
            window.scrollTo(0, 0);
        } catch (err) { 
            console.error(err);
            alert("Error: Backend is not responding!"); 
        }
    };

    const inputClass = "w-full p-2 border border-gray-300 rounded focus:border-blue-600 outline-none text-sm";
    const labelClass = "block text-xs font-black uppercase text-gray-600 mb-1";

    return (
        <div className="bg-gray-100 min-h-screen p-4 md:p-10 font-sans">
            <div className="max-w-6xl mx-auto bg-white p-8 rounded shadow-2xl border-t-8 border-blue-800">
                <h1 className="text-3xl font-black text-center mb-10 text-blue-800 uppercase tracking-tighter">
                    Admin: Post Detailed Notification
                </h1>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* SECTION 1: Category & Title */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded border">
                        <div className="md:col-span-1">
                            <label className={labelClass}>Job Category</label>
                            <select name="category" className={inputClass} onChange={handleChange} value={formData.category}>
                                <option value="permanent">Sarkari Job (Permanent)</option>
                                <option value="outsourcing">Outsourcing / Contract</option>
                                <option value="local">Local / State Job</option>
                                <option value="admit_card">Admit Card</option>
                                <option value="result">Result</option>
                                <option value="admission">Admission</option>
                                <option value="yojna">Sarkari Yojna</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className={labelClass}>Full Job Title</label>
                            <input name="title" placeholder="e.g. BPSC 72nd Pre Online Form 2026" className={inputClass} onChange={handleChange} required />
                        </div>
                        <div className="md:col-span-3">
                            <label className={labelClass}>Short Information</label>
                            <textarea name="short_info" className="w-full p-2 border h-20 text-sm" onChange={handleChange} placeholder="Write 2-3 lines about the job..."></textarea>
                        </div>
                    </div>

                    {/* SECTION 2: Important Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-blue-50 p-4 rounded border">
                        <h3 className="md:col-span-5 font-bold text-blue-800 border-b border-blue-200 pb-1">Important Dates</h3>
                        <div>
                            <label className={labelClass}>Apply Start</label>
                            <input name="start_date" placeholder="07/05/2026" className={inputClass} onChange={handleChange} />
                        </div>
                        <div>
                            <label className={labelClass}>Last Date</label>
                            <input name="last_date" placeholder="31/05/2026" className={inputClass} onChange={handleChange} />
                        </div>
                        <div>
                            <label className={labelClass}>Fee Last Date</label>
                            <input name="fee_last_date" placeholder="31/05/2026" className={inputClass} onChange={handleChange} />
                        </div>
                        <div>
                            <label className={labelClass}>Exam Date</label>
                            <input name="exam_date" placeholder="Notify Soon" className={inputClass} onChange={handleChange} />
                        </div>
                        <div>
                            <label className={labelClass}>Admit Card</label>
                            <input name="admit_card_date" placeholder="Before Exam" className={inputClass} onChange={handleChange} />
                        </div>
                    </div>

                    {/* SECTION 3: Fees & Age */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-pink-50 p-4 rounded border">
                        <div className="space-y-4">
                            <h3 className="font-bold text-red-800 border-b border-red-200">Application Fee</h3>
                            <input name="fee_gen" placeholder="Gen/OBC/EWS Fee" className={inputClass} onChange={handleChange} />
                            <input name="fee_sc" placeholder="SC/ST/PH Fee" className={inputClass} onChange={handleChange} />
                            <input name="fee_note" placeholder="Fee Note (e.g. Pay via Online)" className={inputClass} onChange={handleChange} />
                        </div>
                        <div className="md:col-span-2 space-y-4">
                            <h3 className="font-bold text-green-800 border-b border-green-200">Age Limit</h3>
                            <div className="flex gap-4">
                                <input name="min_age" placeholder="Min Age" className={inputClass} onChange={handleChange} />
                                <input name="max_age" placeholder="Max Age" className={inputClass} onChange={handleChange} />
                            </div>
                            <input name="age_note" placeholder="Age relaxation note..." className={inputClass} onChange={handleChange} />
                        </div>
                    </div>

                    {/* SECTION 4: Vacancy & Eligibility (Long Text) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Total Posts</label>
                            <input name="total_posts" placeholder="e.g. 1186 Posts" className={inputClass} onChange={handleChange} />
                        </div>
                        <div className="md:col-span-2">
                            <label className={labelClass}>Vacancy Details (Category-wise)</label>
                            <textarea name="vacancy_details" className="w-full p-2 border h-32 text-sm" onChange={handleChange} placeholder="General: 513, EWS: 116..."></textarea>
                        </div>
                        <div className="md:col-span-2">
                            <label className={labelClass}>Eligibility / Qualification Criteria</label>
                            <textarea name="eligibility_details" className="w-full p-2 border h-32 text-sm" onChange={handleChange} placeholder="Bachelor Degree in any stream..."></textarea>
                        </div>
                    </div>

                    {/* SECTION 5: How to Fill & Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-yellow-50 p-4 rounded border">
                        <div className="md:col-span-2">
                            <label className={labelClass}>How to Fill Form (Instructions)</label>
                            <textarea name="how_to_fill" className="w-full p-2 border h-32 text-sm" onChange={handleChange} placeholder="Step 1: Scan photo, Step 2:..."></textarea>
                        </div>
                        <div className="md:col-span-2">
                            <label className={labelClass}>Selection Process / Mode</label>
                            <textarea name="selection_mode" className="w-full p-2 border h-20 text-sm" onChange={handleChange} placeholder="Pre Exam, Mains Exam, Interview..."></textarea>
                        </div>
                    </div>

                    {/* SECTION 6: Links */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-800 p-4 rounded text-white">
                        <h3 className="md:col-span-2 font-bold text-yellow-400 border-b border-gray-600 pb-1">Useful Important Links</h3>
                        <input name="apply_link" placeholder="Apply Online Link" className="w-full p-2 rounded text-black" onChange={handleChange} />
                        <input name="pdf_link" placeholder="Notification PDF Link" className="w-full p-2 rounded text-black" onChange={handleChange} />
                        <input name="syllabus_link" placeholder="Syllabus Link" className="w-full p-2 rounded text-black" onChange={handleChange} />
                        <input name="official_site" placeholder="Official Website URL" className="w-full p-2 rounded text-black" onChange={handleChange} />
                    </div>

                    <button type="submit" className="w-full bg-blue-700 text-white font-black py-5 rounded-lg hover:bg-black uppercase tracking-widest text-xl shadow-xl transition-all">
                        🚀 Publish Full Notification Now
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminPanel;