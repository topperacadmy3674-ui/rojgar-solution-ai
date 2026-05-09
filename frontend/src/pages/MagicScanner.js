import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MagicScanner = () => {
    const [url, setUrl] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleScan = async () => {
        if (!url) return alert("Please paste a URL first!");
        setLoading(true);
        try {
            const res = await axios.post('https://rojgar-backend-ee9k.onrender.com/api/scan-url', { url });
            setResults(res.data);
        } catch (err) {
            alert("Scanner failed to read this website.");
        }
        setLoading(false);
    };

    return (
        <div className="bg-slate-900 min-h-screen p-4 md:p-10 font-sans text-white">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-black text-indigo-400 mb-2 uppercase">AI Magic Scanner</h1>
                <p className="text-slate-400 mb-8 text-sm">किसी भी सरकारी वेबसाइट का URL डालें और ताज़ा वैकेंसी निकालें।</p>

                {/* Input Box */}
                <div className="flex gap-2 mb-10">
                    <input 
                        type="text" 
                        className="flex-1 bg-slate-800 p-4 rounded-xl border border-slate-700 outline-none focus:border-indigo-500 shadow-2xl"
                        placeholder="Paste URL here (e.g. https://mha.gov.in/...)"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <button 
                        onClick={handleScan}
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-500 px-8 rounded-xl font-bold uppercase transition-all shadow-lg shadow-indigo-900/40"
                    >
                        {loading ? "Scanning..." : "Scan Now"}
                    </button>
                </div>

                {/* Results List */}
                <div className="space-y-4">
                    {results.length > 0 ? results.map((item, i) => (
                        <div key={i} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex justify-between items-center group hover:border-indigo-500 transition-all">
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-lg leading-tight group-hover:text-indigo-400">{item.title}</h3>
                                <p className="text-[10px] text-slate-500 mt-1 uppercase font-black">Detected Source: {item.source}</p>
                            </div>
                            <a href={item.link} target="_blank" rel="noreferrer" className="bg-slate-700 hover:bg-white hover:text-black px-4 py-2 rounded-lg text-xs font-bold transition-all ml-4">
                                OPEN LINK
                            </a>
                        </div>
                    )) : !loading && (
                        <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl">
                            <p className="text-slate-600 font-bold uppercase">Ready to Scan. Paste a link above.</p>
                        </div>
                    )}
                </div>

                <div className="mt-10 text-center">
                    <Link to="/" className="text-slate-500 hover:text-white text-xs underline">Back to Dashboard</Link>
                </div>
            </div>
        </div>
    );
};

export default MagicScanner;