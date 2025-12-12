import React, { useEffect, useState } from 'react';
import { ProjectBrief, TeamRecommendation, EmployeeProfile, SkillGapReport } from '../types';
import { suggestTeam, analyzeSkillGaps } from '../services/geminiService';
import { MOCK_EMPLOYEES } from '../services/mockData';
import { User, ShieldAlert, Sparkles, Check, ArrowRight, BookOpen, AlertTriangle } from 'lucide-react';

interface TeamMatcherProps {
  project: ProjectBrief;
  onTeamApproved: (team: EmployeeProfile[]) => void;
}

const TeamMatcher: React.FC<TeamMatcherProps> = ({ project, onTeamApproved }) => {
  const [recommendation, setRecommendation] = useState<TeamRecommendation | null>(null);
  const [skillGaps, setSkillGaps] = useState<SkillGapReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      const res = await suggestTeam(project);
      setRecommendation(res);
      
      // Prompt #4: Run Skill Gap Analysis concurrently
      if (res && res.suggested_team) {
        const gapRes = await analyzeSkillGaps(project, res.suggested_team);
        setSkillGaps(gapRes);
      }
      
      setLoading(false);
    };
    fetchTeam();
  }, [project]);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="relative w-24 h-24 mb-6">
           <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
           <div className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Matching Talent...</h3>
        <p className="text-gray-500 mt-2">AI is evaluating skills, availability, and past performance.</p>
      </div>
    );
  }

  if (!recommendation) return null;

  const getProfile = (id: string) => MOCK_EMPLOYEES.find(e => e.person_id === id);

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Team Assembly</h2>
          <p className="text-gray-500 mt-1">Review AI-suggested team for <strong>{project.title}</strong></p>
        </div>
        <div className="flex items-center gap-2 bg-brand-50 text-brand-800 px-4 py-2 rounded-lg border border-brand-100">
          <Sparkles size={18} />
          <span className="font-semibold">Match Score: {(recommendation.overall_match_score * 100).toFixed(0)}%</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Left: Team List */}
        <div className="lg:col-span-2 space-y-4 overflow-y-auto pr-2 pb-20">
          {recommendation.suggested_team.map((member) => {
            const profile = getProfile(member.person_id);
            if (!profile) return null;

            return (
              <div key={member.person_id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 flex items-start gap-4 transition-transform hover:-translate-y-1 duration-200">
                <img src={profile.avatar} alt={profile.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{profile.name}</h4>
                      <p className="text-brand-600 font-medium text-sm">{member.role}</p>
                    </div>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">
                      {(member.match * 100).toFixed(0)}% Match
                    </span>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {profile.skills.slice(0, 3).map((s, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md border border-gray-200">
                        {s.skill.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Skill Gap Analysis (Prompt #4) */}
          {skillGaps && skillGaps.team_gap_report.length > 0 && (
             <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mt-4">
                <h4 className="text-sm font-semibold text-orange-800 flex items-center gap-2 mb-3">
                   <BookOpen size={16} />
                   Upskilling Recommendations (Skill Gap Analysis)
                </h4>
                <div className="space-y-3">
                   {skillGaps.team_gap_report.map((gap, i) => {
                     const p = getProfile(gap.person_id);
                     return (
                       <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                          <span className="font-medium text-orange-900 w-32">{p?.name || gap.person_id}:</span>
                          <span className="text-orange-700 flex-1">Missing: <span className="font-semibold">{gap.missing.join(', ')}</span></span>
                          <div className="flex gap-2">
                             {gap.recommended_microcourses.map(mc => (
                               <span key={mc.id} className="px-2 py-1 bg-white border border-orange-200 rounded text-xs text-orange-800 font-medium cursor-pointer hover:bg-orange-100">
                                 Assign: {mc.title}
                               </span>
                             ))}
                          </div>
                       </div>
                     );
                   })}
                </div>
             </div>
          )}

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-4">
            <h4 className="text-sm font-semibold text-blue-800 flex items-center gap-2 mb-2">
               <Sparkles size={16} />
               Why this team?
            </h4>
            <p className="text-sm text-blue-700 leading-relaxed">
              {recommendation.explainability}
            </p>
          </div>
        </div>

        {/* Right: Risks & Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-fit">
           <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
             <ShieldAlert className="text-amber-500" size={20} />
             Risk Analysis
           </h3>

           <ul className="space-y-3 mb-6">
             {recommendation.risks.map((risk, i) => (
               <li key={i} className="text-sm text-gray-600 flex items-start gap-2 bg-amber-50 p-2 rounded-md">
                 <span className="text-amber-500 mt-0.5">•</span>
                 {risk}
               </li>
             ))}
           </ul>

           <h4 className="text-sm font-semibold text-gray-700 mb-2">Suggested Mitigations</h4>
           <ul className="space-y-2 mb-8">
             {recommendation.suggested_mitigations.map((mit, i) => (
               <li key={i} className="text-xs text-gray-500 border-l-2 border-brand-300 pl-3 py-1">
                 {mit}
               </li>
             ))}
           </ul>

           <button
             onClick={() => {
                const teamProfiles = recommendation.suggested_team
                  .map(m => getProfile(m.person_id))
                  .filter((p): p is EmployeeProfile => !!p);
                onTeamApproved(teamProfiles);
             }}
             className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg shadow-lg shadow-brand-200 font-semibold flex items-center justify-center gap-2"
           >
             Approve Team & Generate Plan
             <ArrowRight size={18} />
           </button>
           <button className="w-full mt-3 py-2 text-sm text-gray-500 hover:text-gray-800 font-medium">
             Customize Manually
           </button>
        </div>
      </div>
    </div>
  );
};

export default TeamMatcher;