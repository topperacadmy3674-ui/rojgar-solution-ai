import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const [allJobs, setAllJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [activeTab, setActiveTab] = useState('All');
    const [loading, setLoading] = useState(true);

    // डेटा लाने के लिए केवल एक useEffect
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('https://rojgar-backend-ee9k.onrender.com/api/jobs/all');
                const data = res.data.outsourcing || [];
                setAllJobs(data);
                setFilteredJobs(data); // शुरू में सारा डेटा दिखाओ
            } catch (err) {
                console.error("Backend Connection Error!", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // फ़िल्टर करने का फंक्शन
    const handleFilter = (cat) => {
        setActiveTab(cat);
        if (cat === 'All') {
            setFilteredJobs(allJobs);
        } else {
            // 'post_category' के आधार पर फ़िल्टर करें
            const filtered = allJobs.filter(job => job.post_category === cat);
            setFilteredJobs(filtered);
        }
    };

    const tabs = ['All', 'IT/DEO', 'Medical', 'MTS/General', 'Security', 'Driver', 'Other'];

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#fff2f2]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#800000] mb-4"></div>
            <p className="font-bold text-[#800000] text-xl italic animate-pulse">Scanning Portals...</p>
        </div>
    );

    return (
        <div className="bg-[#fff2f2] min-h-screen font-sans">
            {/* Header Section */}
            <header className="bg-[#800000] p-6 text-center text-white border-b-4 border-black">
                <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">
                    ROJGAR SOLUTION <span className="text-blue-400 font-normal">AI</span>
                </h1>
                <p className="text-sm font-bold mt-1 tracking-widest uppercase">WWW.ROJGARSOLUTIONAI.COM</p>
            </header>

            {/* Navbar */}
            <nav className="bg-[#000080] text-white flex flex-wrap justify-center gap-4 md:gap-8 py-2 text-[11px] font-bold uppercase border-b border-gray-400 px-4">
                <span className="hover:text-yellow-400 cursor-pointer">Home</span> | 
                <span className="hover:text-yellow-400 cursor-pointer">Latest Outsourcing</span> | 
                <span className="hover:text-yellow-400 cursor-pointer">Admit Card</span> | 
                <span className="hover:text-yellow-400 cursor-pointer">Results</span>
            </nav>

            <div className="max-w-[1100px] mx-auto bg-white shadow-2xl mt-4 border border-gray-300 min-h-screen mb-10 pb-10">
                <div className="p-4">
                    <h2 className="text-2xl font-bold text-blue-800 mb-2">Government Outsourcing & Contract Jobs</h2>
                    <p className="text-xs text-gray-600 mb-6 italic">Welcome to India's AI-powered portal for all types of Contractual, Outsourcing, and Sanvida hiring across all departments.</p>

                    {/* 🚀 Filter Buttons Section 🚀 */}
                    <div className="flex flex-wrap gap-2 mb-8 justify-center bg-gray-50 p-4 border rounded-md shadow-inner">
                        {tabs.map(tab => (
                            <button 
                                key={tab}
                                onClick={() => handleFilter(tab)}
                                className={`px-5 py-2 rounded-full text-xs font-black transition-all transform active:scale-95 ${
                                    activeTab === tab 
                                    ? 'bg-[#800000] text-white shadow-lg' 
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-red-50 hover:border-red-300'
                                }`}
                            >
                                {tab.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* All Latest Jobs Section Header */}
                    <div className="bg-[#800000] text-white text-center py-2 font-bold text-lg md:xl uppercase tracking-wider rounded-t-sm">
                        {activeTab === 'All' ? 'All Latest Outsourcing Jobs' : `${activeTab} Category Jobs`}
                    </div>

                    {/* The Clean List Style */}
                    <div className="bg-[#fcfcfc] border border-gray-300 min-h-[400px]">
                        {filteredJobs.length > 0 ? (
                            <ul className="list-none p-2 m-0 divide-y divide-gray-200">
                                {filteredJobs.map((job, i) => (
                                    <li key={i} className="py-4 px-3 hover:bg-yellow-50 flex items-start transition-colors">
                                        <span className="mr-3 text-[#800000] font-bold mt-1 text-xl">•</span>
                                        <div className="flex-grow">
                                            <Link to={`/job/${job.id}`} className="text-[#0000ff] hover:text-red-600 text-[16px] md:text-[18px] font-bold leading-tight decoration-1">
                                                {job.title}
                                                {i < 5 && activeTab === 'All' && <span className="ml-2 text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded animate-pulse">NEW</span>}
                                            </Link>
                                            <div className="flex justify-between items-center mt-2">
                                                <div className="flex gap-3">
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase bg-gray-100 px-2 py-0.5 rounded">Source: {job.source}</span>
                                                    <span className="text-[10px] text-blue-600 font-bold uppercase bg-blue-50 px-2 py-0.5 rounded">Post: {job.post_category}</span>
                                                </div>
                                                <span className="text-[11px] text-red-700 font-black italic">Last Date : {job.last_date}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-32 text-gray-400">
                                <p className="text-4xl mb-3">🔍</p>
                                <p className="font-bold text-lg">No {activeTab} Jobs Found Currently.</p>
                                <p className="text-sm">Please try another category or check back later.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Section */}
                <footer className="mt-10 bg-[#800000] text-white p-8 text-center border-t-4 border-black">
                    <p className="font-black text-xl mb-1 italic">© 2024 ROJGAR SOLUTION AI</p>
                    <p className="text-xs italic text-gray-300">Direct Official Contractual Notifications Aggregator</p>
                </footer>
            </div>
        </div>
    );
};

export default Dashboard;