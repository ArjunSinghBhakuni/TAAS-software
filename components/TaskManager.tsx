import React, { useEffect, useState } from 'react';
import { ProjectBrief, EmployeeProfile, ProjectPlan, MonitoringReport } from '../types';
import { generateTaskPlan, evaluateProjectHealth } from '../services/geminiService';
import { Calendar, CheckCircle2, Circle, Clock, Activity, AlertTriangle, FileCheck } from 'lucide-react';

interface TaskManagerProps {
  project: ProjectBrief;
  team: EmployeeProfile[];
}

const TaskManager: React.FC<TaskManagerProps> = ({ project, team }) => {
  const [plan, setPlan] = useState<ProjectPlan | null>(null);
  const [view, setView] = useState<'PLAN' | 'MONITOR'>('PLAN');
  const [monitoringData, setMonitoringData] = useState<MonitoringReport | null>(null);

  useEffect(() => {
    const createPlan = async () => {
      const p = await generateTaskPlan(project, team);
      setPlan(p);
      // Simulate fetching monitoring data after plan exists
      if(p) {
        const m = await evaluateProjectHealth(p.project_plan_id);
        setMonitoringData(m);
      }
    };
    createPlan();
  }, [project, team]);

  if (!plan) return <div className="p-10 text-center text-gray-500">Generating Operational Plan...</div>;

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto">
      <header className="mb-6 flex justify-between items-start">
        <div>
           <h2 className="text-3xl font-bold text-gray-900">Execution & Monitoring</h2>
           <p className="text-gray-500">Manage tasks and verify field evidence.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
           <button 
             onClick={() => setView('PLAN')}
             className={`px-4 py-2 text-sm font-medium rounded-md transition ${view === 'PLAN' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
           >
             Project Plan
           </button>
           <button 
             onClick={() => setView('MONITOR')}
             className={`px-4 py-2 text-sm font-medium rounded-md transition ${view === 'MONITOR' ? 'bg-white shadow text-brand-700' : 'text-gray-500 hover:text-gray-900'}`}
           >
             AI Monitoring
           </button>
        </div>
      </header>

      {view === 'PLAN' && (
        <div className="space-y-8 overflow-y-auto pb-20 pr-4">
          {plan.milestones.map((milestone, idx) => (
            <div key={milestone.id} className="relative pl-8 border-l-2 border-gray-200 pb-2">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-500 border-4 border-white shadow-sm"></div>
              
              <div className="flex items-center gap-4 mb-4">
                <h3 className="text-xl font-bold text-gray-800">{milestone.title}</h3>
                <span className="flex items-center gap-1 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  <Calendar size={14} /> Due {milestone.due}
                </span>
              </div>

              <div className="grid gap-3">
                {milestone.tasks.map((task) => {
                   const assignee = team.find(t => t.person_id === task.assignee_id) || team[0];
                   
                   return (
                    <div key={task.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between group hover:border-brand-300 transition-colors">
                      <div className="flex items-center gap-3">
                         {task.status === 'completed' 
                           ? <CheckCircle2 className="text-green-500" />
                           : <Circle className="text-gray-300" />
                         }
                         <div>
                           <p className="font-medium text-gray-900 group-hover:text-brand-700">{task.title}</p>
                           <p className="text-xs text-gray-400">{task.est_hours} hrs • Due {task.due_date}</p>
                         </div>
                      </div>

                      <div className="flex items-center gap-3">
                         <span className={`px-2 py-1 rounded text-xs font-semibold capitalize
                           ${task.status === 'completed' ? 'bg-green-50 text-green-700' : 
                             task.status === 'in-progress' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                           {task.status}
                         </span>
                         <div className="relative group/avatar cursor-pointer">
                           <img src={assignee.avatar} className="w-8 h-8 rounded-full border border-gray-200" title={assignee.name} />
                         </div>
                      </div>
                    </div>
                   );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PROMPT #6: MONITORING VIEW */}
      {view === 'MONITOR' && monitoringData && (
        <div className="space-y-6 overflow-y-auto pb-20 pr-4">
           {/* Health Stats */}
           <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                 <p className="text-sm text-gray-500">Project Health</p>
                 <p className={`text-2xl font-bold capitalize ${monitoringData.project_health === 'green' ? 'text-green-600' : 'text-amber-500'}`}>
                   {monitoringData.project_health}
                 </p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                 <p className="text-sm text-gray-500">Active Alerts</p>
                 <p className="text-2xl font-bold text-red-600">{monitoringData.alerts.length}</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                 <p className="text-sm text-gray-500">Evidence Verified</p>
                 <p className="text-2xl font-bold text-brand-600">85%</p>
              </div>
           </div>

           {/* Alerts Section */}
           {monitoringData.alerts.length > 0 && (
             <div className="bg-red-50 border border-red-100 rounded-xl p-4">
               <h4 className="font-bold text-red-800 flex items-center gap-2 mb-2">
                 <AlertTriangle size={18} /> 
                 Attention Required
               </h4>
               {monitoringData.alerts.map((alert, i) => (
                 <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg border border-red-100 mb-2">
                    <span className="text-sm text-red-700 font-medium">{alert.message}</span>
                    <button className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200">
                      View Ticket {alert.ticket_id}
                    </button>
                 </div>
               ))}
             </div>
           )}

           {/* Task Evidence Table */}
           <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-sm text-left">
                 <thead className="bg-gray-50 text-gray-500 font-medium">
                    <tr>
                       <th className="px-6 py-4">Task ID</th>
                       <th className="px-6 py-4">Status</th>
                       <th className="px-6 py-4">Quality Score</th>
                       <th className="px-6 py-4">Authenticity</th>
                       <th className="px-6 py-4">AI Checks</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {monitoringData.task_status.map((status) => (
                       <tr key={status.task_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">{status.task_id}</td>
                          <td className="px-6 py-4 capitalize">{status.status}</td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                   <div className="h-full bg-blue-500" style={{ width: `${status.quality_score * 100}%` }}></div>
                                </div>
                                <span className="text-xs text-gray-500">{(status.quality_score * 100).toFixed(0)}%</span>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                   <div className={`h-full ${status.authenticity_score < 0.8 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${status.authenticity_score * 100}%` }}></div>
                                </div>
                                <span className={`text-xs font-bold ${status.authenticity_score < 0.8 ? 'text-red-600' : 'text-green-600'}`}>
                                  {(status.authenticity_score * 100).toFixed(0)}%
                                </span>
                             </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-500">
                             {status.checks.join(', ')}
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;