import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // वापस जाने के लिए
import axios from 'axios';

const SourceManager = () => {
    const [sources, setSources] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // सर्च के लिए
    const [formData, setFormData] = useState({ 
        name: '', official_url: '', recruitment_url: '', 
        category: 'State Govt', description: '', notes: ''
    });

    const fetchSources = () => {
        axios.get('https://rojgar-backend-ee9k.onrender.com/api/sources')
            .then(res => setSources(res.data))
            .catch(err => console.error("Fetch Error", err));
    };

    useEffect(() => { fetchSources(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://rojgar-backend-ee9k.onrender.com/api/sources', formData);
            alert("✅ Source Registered Successfully!");
            setFormData({ name: '', official_url: '', recruitment_url: '', category: 'State Govt', description: '', notes: '' });
            fetchSources();
        } catch (err) { alert("❌ Error saving: Check if Backend is running"); }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Are you sure you want to delete this source?")) {
            try {
                await axios.delete(`https://rojgar-backend-ee9k.onrender.com/api/sources/${id}`);
                fetchSources();
            } catch (err) { alert("Delete failed"); }
        }
    };

    // सर्च फिल्टर लॉजिक
    const filteredSources = sources.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const inputClass = "bg-slate-900 p-3 rounded-xl border border-slate-700 outline-none focus:border-indigo-500 text-sm transition-all";

    return (
        <div className="bg-slate-950 min-h-screen p-4 md:p-10 font-sans text-white">
            <div className="max-w-6xl mx-auto">
                
                {/* Header with Back Button */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 uppercase tracking-tighter">
                            Master Source Hub
                        </h1>
                        <p className="text-slate-500 text-sm">Manage your recruitment portal directory ({sources.length})</p>
                    </div>
                    <Link to="/" className="bg-slate-800 hover:bg-slate-700 px-6 py-2 rounded-full text-xs font-bold transition-all border border-slate-700">
                        ← BACK TO DASHBOARD
                    </Link>
                </div>

                {/* --- Add Form --- */}
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 mb-8 shadow-2xl">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <span className="bg-indigo-600 w-2 h-6 rounded-full"></span>
                        Register New Portal
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <input className={inputClass} placeholder="Website/Dept Name" required 
                            value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} />
                        
                        <select className={inputClass} value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})}>
                            <option value="State Govt">State Govt</option>
                            <option value="Central Govt">Central Govt</option>
                            <option value="Outsourcing">Outsourcing</option>
                            <option value="Bank/PSU">Bank/PSU</option>
                        </select>

                        <input className={inputClass} placeholder="Official Link (https://...)" required 
                            value={formData.official_url} onChange={(e)=>setFormData({...formData, official_url: e.target.value})} />
                        
                        <input className={inputClass} placeholder="Direct Vacancy Link" 
                            value={formData.recruitment_url} onChange={(e)=>setFormData({...formData, recruitment_url: e.target.value})} />
                        
                        <textarea className={`${inputClass} lg:col-span-2 h-12`} placeholder="Short Description..."
                            value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})}></textarea>

                        <textarea className={`${inputClass} md:col-span-2 lg:col-span-3 h-20 border-indigo-900/30`} 
                            placeholder="Personal Notes (IDs, Passwords, Update timings...)"
                            value={formData.notes} onChange={(e)=>setFormData({...formData, notes: e.target.value})}></textarea>
                        
                        <button className="lg:col-start-3 bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-black transition-all uppercase text-sm shadow-lg">
                            + SAVE TO DIRECTORY
                        </button>
                    </form>
                </div>

                {/* --- Search Filter --- */}
                <div className="mb-8 relative">
                    <input 
                        type="text" 
                        placeholder="Search your saved sources..." 
                        className="w-full bg-slate-900/50 p-4 pl-12 rounded-2xl border border-slate-800 outline-none focus:border-indigo-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute left-4 top-4 opacity-30">🔍</span>
                </div>

                {/* --- Display Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredSources.map(s => (
                        <div key={s.id} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition-all group relative">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400">{s.name}</h3>
                                    <span className="text-[10px] font-black bg-slate-800 text-slate-400 px-2 py-1 rounded-md uppercase">{s.category}</span>
                                </div>
                                <button onClick={() => handleDelete(s.id)} className="text-slate-700 hover:text-red-500">🗑️</button>
                            </div>

                            {s.description && <p className="text-slate-400 text-sm mb-4 italic">"{s.description}"</p>}
                            
                            {s.notes && (
                                <div className="bg-indigo-950/40 border-l-4 border-indigo-500 p-3 mb-6 rounded-r-xl">
                                    <p className="text-[11px] text-slate-300 whitespace-pre-wrap">{s.notes}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <a href={s.official_url} target="_blank" rel="noreferrer" className="bg-slate-800 hover:bg-slate-700 text-center py-3 rounded-xl text-xs font-bold">Official Site</a>
                                <a href={s.recruitment_url} target="_blank" rel="noreferrer" className="bg-indigo-600 hover:bg-indigo-500 text-center py-3 rounded-xl text-xs font-bold shadow-lg">Vacancy Page</a>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredSources.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-600 font-bold uppercase">No matching sources found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SourceManager;