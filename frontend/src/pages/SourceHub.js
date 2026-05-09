import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SourceHub = () => {
    const [searchTerm, setSearchQuery] = useState("");

    // सरकारी वेबसाइट्स का मास्टर डेटाबेस
    const officialPortals = [
        { name: "UPSC", desc: "Union Public Service Commission", cat: "Central", url: "https://www.upsc.gov.in", contact: "https://www.upsc.gov.in/contact-us" },
        { name: "SSC", desc: "Staff Selection Commission", cat: "Central", url: "https://ssc.gov.in", contact: "https://ssc.gov.in/contact-us" },
        { name: "IBPS", desc: "Banking Personnel Selection", cat: "Banking", url: "https://www.ibps.in", contact: "https://www.ibps.in/contact-us/" },
        { name: "RRB", desc: "Railway Recruitment Board", cat: "Railways", url: "https://indianrailways.gov.in", contact: "https://indianrailways.gov.in/railwayboard/view_section.jsp?lang=0&id=0,7,1281" },
        { name: "GeM Portal", desc: "Government e-Marketplace (Outsourcing)", cat: "Outsourcing", url: "https://gem.gov.in", contact: "https://gem.gov.in/contactUs" },
        { name: "BECIL", desc: "Broadcast Engineering Consultants", cat: "Outsourcing", url: "https://www.becil.com", contact: "https://www.becil.com/contact-us" },
        { name: "BPSC", desc: "Bihar Public Service Commission", cat: "State (Bihar)", url: "https://bpsc.bih.nic.in", contact: "https://bpsc.bih.nic.in/Contact.htm" },
        { name: "Beltron", desc: "Bihar State Electronics Dev Corp", cat: "Outsourcing", url: "https://bsedc.bihar.gov.in", contact: "https://bsedc.bihar.gov.in/contact-us" },
        { name: "NTA", desc: "National Testing Agency (Admissions)", cat: "Education", url: "https://nta.ac.in", contact: "https://nta.ac.in/ContactUs" },
        { name: "DRDO", desc: "Defense Research & Development", cat: "Technical", url: "https://www.drdo.gov.in", contact: "https://www.drdo.gov.in/contact-us" },
        { name: "ISRO", desc: "Indian Space Research Org", cat: "Technical", url: "https://www.isro.gov.in", contact: "https://www.isro.gov.in/contact-isro" },
        { name: "NHM Bihar", desc: "National Health Mission", cat: "Medical", url: "https://shs.bihar.gov.in", contact: "https://shs.bihar.gov.in/contact-us" },
    ];

    const filteredSources = officialPortals.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.cat.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            {/* Branding Header */}
            <div className="bg-slate-900 text-white py-12 px-4 text-center">
                <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Official <span className="text-indigo-400">Source Hub</span></h1>
                <p className="text-slate-400 max-w-2xl mx-auto">हमारा AI इंजन इन सभी सरकारी पोर्टल्स को 24/7 स्कैन करता है। आप सीधे विभाग की वेबसाइट पर जाने के लिए नीचे दिए गए लिंक्स का उपयोग कर सकते हैं।</p>
                
                {/* Search Bar */}
                <div className="max-w-xl mx-auto mt-8 relative">
                    <input 
                        type="text" 
                        placeholder="Search department (e.g. Bihar, Railway, Bank)..." 
                        className="w-full p-4 pl-12 rounded-2xl bg-slate-800 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <span className="absolute left-4 top-4 text-slate-500">🔍</span>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSources.map((source, index) => (
                        <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-100">
                                    {source.cat}
                                </span>
                                <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">● Live</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{source.name}</h2>
                            <p className="text-slate-500 text-sm mb-6 h-10">{source.desc}</p>
                            
                            <div className="grid grid-cols-2 gap-3 mt-auto">
                                <a 
                                    href={source.url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 py-3 rounded-xl font-bold text-xs text-center transition-all"
                                >
                                    Official Portal
                                </a>
                                <a 
                                    href={source.contact} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold text-xs text-center transition-all"
                                >
                                    Contact Dept.
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredSources.length === 0 && (
                    <div className="text-center py-20 text-slate-400 font-medium italic">
                        No sources found for "{searchTerm}".
                    </div>
                )}

                <div className="mt-16 text-center">
                    <Link to="/" className="text-indigo-600 font-bold hover:underline">← Back to Main Job Dashboard</Link>
                </div>
            </div>

            <footer className="py-10 border-t border-slate-200 text-center text-slate-400 text-xs">
                © 2026 ROJGAR SOLUTION AI • DATA VERIFICATION HUB
            </footer>
        </div>
    );
};

export default SourceHub;