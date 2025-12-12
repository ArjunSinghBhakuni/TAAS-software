import React, { useState } from 'react';
import { Video, Upload, MessageCircle, Award, CheckCircle } from 'lucide-react';
import { assessStudentSubmission } from '../services/geminiService';
import { LMSAssessment } from '../types';

const LMSPortal: React.FC = () => {
  const [submissionText, setSubmissionText] = useState('');
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState<LMSAssessment | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    const result = await assessStudentSubmission("s-001", submissionText || "Video upload");
    setAssessment(result);
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">AI Coach</h2>
        <p className="text-gray-500">Upload your practice work for instant, personalized feedback in your language.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Left: Learning Task */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-lg mb-2">Current Task: Hemming a Sleeve</h3>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4 text-gray-400">
                 <Video size={48} />
                 <span className="ml-2">Instructional Video (Hindi)</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                 Watch the video above. Practice the stitch on your sample fabric. Record a 30-second video of your result and upload it here.
              </p>
           </div>

           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Evidence</label>
              <textarea 
                className="w-full border border-gray-300 rounded-lg p-3 text-sm mb-4 h-24"
                placeholder="Describe what you did (or simulate video upload)..."
                value={submissionText}
                onChange={e => setSubmissionText(e.target.value)}
              />
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 flex items-center justify-center gap-2"
              >
                 {loading ? 'AI Analyzing...' : <><Upload size={18} /> Submit for Review</>}
              </button>
           </div>
        </div>

        {/* Right: AI Feedback */}
        <div className="h-full">
           {assessment ? (
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="font-bold text-lg flex items-center gap-2">
                     <MessageCircle size={20} className="text-brand-600" />
                     Coach Feedback
                   </h3>
                   <span className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full">
                     Score: {(assessment.score * 100).toFixed(0)}%
                   </span>
                </div>

                <div className="prose prose-sm text-gray-600 mb-6 bg-brand-50 p-4 rounded-lg border border-brand-100">
                   <p className="italic">"{assessment.feedback}"</p>
                </div>

                <div className="space-y-4">
                   <div>
                      <h4 className="text-xs font-semibold uppercase text-gray-400 mb-2">Detailed Snippets</h4>
                      {assessment.demo_snippets?.map((snip, i) => (
                        <div key={i} className="flex gap-3 items-start text-sm border-l-2 border-red-300 pl-3 py-1">
                           <span className="font-mono text-red-600 font-bold">{snip.time}</span>
                           <span className="text-gray-700">{snip.note}</span>
                        </div>
                      ))}
                   </div>

                   <div className="pt-6 border-t border-gray-100">
                      <h4 className="text-sm font-bold text-gray-900 mb-3">Recommended Next Step</h4>
                      <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-brand-500 cursor-pointer transition-colors bg-gray-50">
                         <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm text-brand-600">
                           <Video size={18} />
                         </div>
                         <div>
                            <p className="text-sm font-semibold text-gray-900">{assessment.next_recommendation.title}</p>
                            <p className="text-xs text-gray-500">Micro-lesson • 5 mins</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                <Award size={48} className="mb-2 opacity-50" />
                <p>Submit work to receive AI coaching</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default LMSPortal;