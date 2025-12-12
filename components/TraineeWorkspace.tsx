import React, { useState } from 'react';
import { generateDailySummary } from '../services/geminiService';
import { DailySummary } from '../types';
import { Clock, CheckSquare, Sparkles, QrCode, Share2 } from 'lucide-react';

const TraineeWorkspace: React.FC = () => {
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateSummary = async () => {
    setLoading(true);
    const res = await generateDailySummary("p-1");
    setSummary(res);
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto gap-8">
      <header>
        <h2 className="text-3xl font-bold text-gray-900">My Workspace</h2>
        <p className="text-gray-500">Track your work, generate reports, and view your digital ID.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Daily Summary (Prompt #7) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Clock size={20} className="text-brand-600" />
                  Daily Log & Summary
                </h3>
                <button 
                  onClick={handleGenerateSummary}
                  disabled={loading}
                  className="text-sm bg-brand-600 text-white px-3 py-2 rounded-lg hover:bg-brand-700 flex items-center gap-2"
                >
                  <Sparkles size={14} />
                  {loading ? 'Generating...' : 'Auto-Generate Summary'}
                </button>
             </div>

             {summary ? (
               <div className="animate-in fade-in space-y-4">
                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{summary.daily_summary}</p>
                 </div>
                 
                 <div className="flex gap-4 text-sm">
                   <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100 font-medium">
                     Hours Logged: {summary.hours_logged}
                   </div>
                   <div className="text-gray-500 flex items-center">
                     Saved to Timesheet
                   </div>
                 </div>

                 <div className="pt-4 border-t border-gray-100">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">AI Suggested Next Steps</p>
                   <ul className="space-y-1">
                     {summary.suggested_next_steps.map((step, i) => (
                       <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                         <CheckSquare size={14} className="text-brand-400" />
                         {step}
                       </li>
                     ))}
                   </ul>
                 </div>
               </div>
             ) : (
               <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                 <p>Click Auto-Generate to create your EOD report from your activity.</p>
               </div>
             )}
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-lg mb-4">My Tasks (Today)</h3>
            <div className="space-y-2">
               {['Script Approval (T1)', 'Location Scouting (T2)'].map((task, i) => (
                 <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <span className="text-gray-700">{task}</span>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Done</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Right Col: Digital ID (Prompt #12) */}
        <div className="space-y-6">
           <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <QrCode size={120} />
              </div>
              
              <div className="relative z-10">
                 <div className="w-16 h-16 rounded-full bg-brand-500 border-2 border-white mb-4 flex items-center justify-center font-bold text-xl">
                    AP
                 </div>
                 <h3 className="text-xl font-bold">Aarav Patel</h3>
                 <p className="text-brand-200 text-sm mb-6">Skill ID: DSID-2025-0042</p>

                 <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm border-b border-gray-700 pb-1">
                       <span className="text-gray-400">Video Editing</span>
                       <span className="font-bold text-green-400">Level 2 (Verified)</span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-gray-700 pb-1">
                       <span className="text-gray-400">Storyboarding</span>
                       <span className="font-bold text-green-400">Level 1</span>
                    </div>
                 </div>

                 <div className="flex gap-2">
                    <button className="flex-1 bg-white text-gray-900 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-100">
                       <Share2 size={16} /> Share
                    </button>
                    <button className="flex-1 bg-brand-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-brand-500">
                       View Certs
                    </button>
                 </div>
              </div>
           </div>
           
           <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
             <p className="text-xs text-gray-500 mb-2">Scan to verify credentials on blockchain</p>
             <div className="bg-white p-2 inline-block rounded border border-gray-200">
                <QrCode size={96} className="text-gray-800" />
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default TraineeWorkspace;