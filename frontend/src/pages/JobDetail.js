import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const JobDetail = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);

    useEffect(() => {
        axios.get(`https://rojgar-backend-ee9k.onrender.com/api/job-detail/${id}`)
            .then(res => setJob(res.data))
            .catch(err => console.log(err));
    }, [id]);

    if (!job) return <div className="p-20 text-center font-bold text-xl">Loading Detailed Notification...</div>;

    return (
        <div className="bg-[#fff2f2] min-h-screen p-2 md:p-6 pb-20 font-sans">
            <div className="max-w-5xl mx-auto bg-white border-2 border-gray-300 p-4 shadow-2xl">
                
                {/* 1. Main Header */}
                <div className="text-center border-b-4 border-red-700 pb-4 mb-6">
                    <h1 className="text-red-700 text-2xl md:text-4xl font-black uppercase">{job.title}</h1>
                    <p className="text-blue-800 font-bold mt-2 text-lg">WWW.ROJGARSOLUTION.COM</p>
                </div>

                {/* 2. Short Info Box */}
                <div className="mb-6 p-4 bg-white border border-gray-300 text-sm leading-relaxed">
                    <p className="text-red-600 font-bold mb-1">Post Date: {job.timestamp}</p>
                    <p><b>Short Information:</b> {job.short_info}</p>
                </div>

                {/* 3. Dates & Fees Table */}
                <table className="w-full border-collapse border-4 border-[#800000] mb-8">
                    <thead>
                        <tr className="bg-[#800000] text-white">
                            <th className="p-2 text-lg uppercase" colSpan="2">{job.title} : SHORT DETAILS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border-2 border-[#800000] p-4 w-1/2 align-top bg-pink-50">
                                <h3 className="text-[#800000] font-black text-center underline mb-3">Important Dates</h3>
                                <ul className="space-y-1 list-none">
                                    <li>• Application Begin : <b>{job.start_date}</b></li>
                                    <li>• Last Date for Apply : <b className="text-red-600">{job.last_date}</b></li>
                                    <li>• Pay Exam Fee Last Date : <b>{job.fee_last_date}</b></li>
                                    <li>• Exam Date : <b>{job.exam_date}</b></li>
                                    <li>• Admit Card Available : <b>{job.admit_card_date}</b></li>
                                </ul>
                            </td>
                            <td className="border-2 border-[#800000] p-4 align-top bg-pink-50">
                                <h3 className="text-[#800000] font-black text-center underline mb-3">Application Fee</h3>
                                <ul className="space-y-1 list-none">
                                    <li>• Gen / OBC / EWS : <b>{job.fee_gen}</b></li>
                                    <li>• SC / ST / PH : <b>{job.fee_sc}</b></li>
                                    <li className="mt-2 text-xs italic"><b>Note:</b> {job.fee_note}</li>
                                </ul>
                            </td>
                        </tr>
                        {/* Age Limit */}
                        <tr className="bg-[#006400] text-white font-bold text-center">
                            <td className="p-2 border-2 border-white uppercase" colSpan="2">Age Limit as on 01/01/2026</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border-2 border-[#800000] p-4 text-center font-bold" colSpan="2">
                                Minimum Age: {job.min_age} | Maximum Age: {job.max_age} <br/>
                                <span className="text-xs text-gray-600">{job.age_note}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* 4. Vacancy Details Section */}
                <div className="bg-red-600 text-white text-center py-2 font-black uppercase text-xl border-2 border-black mb-1">
                    Vacancy Details Total : {job.total_posts} Post
                </div>
                <div className="border-4 border-[#800000] p-4 mb-8 bg-gray-50 whitespace-pre-wrap font-medium">
                    {job.vacancy_details}
                </div>

                {/* 5. Selection Mode & Eligibility */}
                <div className="bg-blue-800 text-white text-center py-2 font-black uppercase text-xl border-2 border-black mb-1">
                    Eligibility & Mode of Selection
                </div>
                <div className="border-4 border-blue-800 p-4 mb-8 bg-blue-50">
                    <h4 className="font-bold underline mb-2">Eligibility Criteria:</h4>
                    <p className="whitespace-pre-wrap mb-4">{job.eligibility_details}</p>
                    <h4 className="font-bold underline mb-2">Selection Process:</h4>
                    <p className="whitespace-pre-wrap">{job.selection_mode}</p>
                </div>

                {/* 6. How to Fill Form */}
                <div className="bg-orange-600 text-white text-center py-2 font-black uppercase text-xl border-2 border-black mb-1">
                    How to Fill {job.title} Online Form
                </div>
                <div className="border-4 border-orange-600 p-6 mb-8 bg-orange-50 text-sm leading-relaxed">
                    <div className="whitespace-pre-wrap">{job.how_to_fill}</div>
                    <p className="text-red-600 font-bold mt-4 animate-pulse">NOTE: Candidates are advised to read the full notification before applying.</p>
                </div>

                {/* 7. Important Links Table */}
                <div className="bg-yellow-50 p-6 border-4 border-dashed border-red-700 text-center">
                    <h2 className="font-black text-2xl text-red-700 mb-6 underline">SOME USEFUL IMPORTANT LINKS</h2>
                    <table className="w-full border-2 border-black font-bold">
                        <tbody>
                            <tr className="border-b border-black">
                                <td className="p-3 bg-yellow-200 w-1/2">Apply Online Link</td>
                                <td className="p-3">
                                    <a href={job.apply_link} target="_blank" rel="noreferrer" className="text-blue-700 underline">Click Here</a>
                                </td>
                            </tr>
                            <tr className="border-b border-black">
                                <td className="p-3 bg-yellow-200">Download Official Notification</td>
                                <td className="p-3">
                                    <a href={job.pdf_link} target="_blank" rel="noreferrer" className="text-blue-700 underline">Click Here</a>
                                </td>
                            </tr>
                            <tr className="border-b border-black">
                                <td className="p-3 bg-yellow-200">Check Syllabus / Pattern</td>
                                <td className="p-3">
                                    <a href={job.syllabus_link} target="_blank" rel="noreferrer" className="text-blue-700 underline">Click Here</a>
                                </td>
                            </tr>
                            <tr>
                                <td className="p-3 bg-yellow-200">Official Website</td>
                                <td className="p-3">
                                    <a href={job.official_site} target="_blank" rel="noreferrer" className="text-blue-700 underline">Click Here</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Navigation */}
                <div className="text-center mt-12">
                    <Link to="/" className="bg-black text-white px-12 py-3 rounded-full font-black text-xs hover:bg-gray-800 transition-all shadow-lg uppercase">
                        ← BACK TO DASHBOARD
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default JobDetail;