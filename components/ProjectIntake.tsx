import React, { useState } from 'react';
import { Upload, FileText, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { analyzeProjectRequirements } from '../services/geminiService';
import { ProjectBrief } from '../types';

interface ProjectIntakeProps {
  onBriefGenerated: (brief: ProjectBrief) => void;
}

const ProjectIntake: React.FC<ProjectIntakeProps> = ({ onBriefGenerated }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedBrief, setGeneratedBrief] = useState<ProjectBrief | null>(null);

  const handleAnalyze = async () => {
    if (!description) return;
    setLoading(true);
    try {
      const brief = await analyzeProjectRequirements(description);
      setGeneratedBrief(brief);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    if (generatedBrief) {
      onBriefGenerated(generatedBrief);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 max-w-5xl mx-auto">
      <header>
        <h2 className="text-3xl font-bold text-gray-900">Project Intake</h2>
        <p className="text-gray-500 mt-1">AI analyzes client requests to structure requirements automatically.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full overflow-hidden">
        {/* Left: Input */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
          <div className="flex-1 space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Project Description / Email Dump
            </label>
            <textarea
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none text-gray-700"
              placeholder="Paste the client email, WhatsApp message, or project brief here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
              <Upload className="text-gray-400 mb-2" size={32} />
              <p className="text-sm font-medium text-gray-600">Drop PDF, DOCX, or Video requirements here</p>
              <p className="text-xs text-gray-400 mt-1">Supports multi-modal extraction</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={handleAnalyze}
              disabled={loading || !description}
              className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all
                ${loading || !description 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-200'}`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Analyzing Requirements...
                </>
              ) : (
                <>
                  <FileText size={20} />
                  Analyze with AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Output */}
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full transition-opacity duration-500 ${generatedBrief ? 'opacity-100' : 'opacity-50'}`}>
          {!generatedBrief ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText size={32} className="opacity-50" />
              </div>
              <p>Analysis results will appear here</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
               <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-2">
                       Confidence: {(generatedBrief.estimated_budget.confidence * 100).toFixed(0)}%
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">{generatedBrief.title}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                    ${generatedBrief.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {generatedBrief.priority} Priority
                  </span>
               </div>

               <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                 <div className="space-y-2">
                   <h4 className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Summary</h4>
                   <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg">
                     {generatedBrief.summary}
                   </p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Budget Estimate</h4>
                      <p className="text-lg font-medium text-gray-900">
                        {generatedBrief.estimated_budget.value.toLocaleString()} {generatedBrief.estimated_budget.currency}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Timeline</h4>
                      <p className="text-lg font-medium text-gray-900">
                        {generatedBrief.timeline.duration_days} Days <span className="text-sm text-gray-500 font-normal">by {generatedBrief.timeline.start_by}</span>
                      </p>
                    </div>
                 </div>

                 <div>
                   <h4 className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-2">Key Deliverables</h4>
                   <ul className="space-y-1">
                     {generatedBrief.deliverables.map((d, i) => (
                       <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                         <CheckCircle size={14} className="text-brand-500" />
                         {d}
                       </li>
                     ))}
                   </ul>
                 </div>

                 <div>
                    <h4 className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {generatedBrief.skills_required.map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-brand-50 text-brand-700 text-xs rounded-md font-medium border border-brand-100">
                          {skill.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                 </div>
               </div>

               <div className="mt-6 pt-6 border-t border-gray-100">
                 <button
                   onClick={handleProceed}
                   className="w-full py-3 px-4 bg-gray-900 hover:bg-black text-white rounded-lg flex items-center justify-center gap-2 font-semibold transition-all"
                 >
                   Confirm Brief & Find Team
                   <ArrowRight size={18} />
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectIntake;
