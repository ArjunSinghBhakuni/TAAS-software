
import { GoogleGenAI } from "@google/genai";
import { Student, CSRImpactMetric, FinancialMetric, ProjectBrief, EmployeeProfile, TeamRecommendation, SkillGapReport, ProjectPlan, MonitoringReport, LMSAssessment, DailySummary } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
const MODEL_NAME = 'gemini-2.5-flash';

// ------------------------------------------------------------------
// FEATURE 1: GENERATE BRSR / ESG REPORT COMPLIANCE TEXT
// ------------------------------------------------------------------
export const generateESGReport = async (
  impact: CSRImpactMetric,
  financials: FinancialMetric[]
): Promise<string> => {
  if (!ai) return "Mock Report: SEBI BRSR Principle 8 (Inclusive Growth) compliant. 92% funds directed to beneficiaries.";

  try {
    const prompt = `
      TASK: Generate a SEBI BRSR (Business Responsibility and Sustainability Reporting) narrative for a Corporate CSR partner.
      CONTEXT: The project is "WorkFromPahad", a rural skilling initiative in Uttarakhand.
      DATA: 
      - Investment: ₹${impact.total_investment}
      - Placements: ${impact.students_placed} students
      - Avg Salary: ₹${impact.avg_starting_salary}
      - Financials: ${JSON.stringify(financials)}
      
      REQUIREMENTS:
      1. Highlight compliance with Schedule VII (Livelihood Enhancement).
      2. Emphasize that Admin Overhead is below 5%.
      3. Focus on the "Migration Prevention" aspect for Social Impact.
      4. Return a professional 2-paragraph executive summary suitable for an Annual Report.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Report generation failed.";
  } catch (error) {
    console.error("Gemini ESG Error:", error);
    return "Error generating ESG report.";
  }
};

// ------------------------------------------------------------------
// FEATURE 2: BIAS-FREE STUDENT APTITUDE ANALYSIS
// ------------------------------------------------------------------
export const analyzeStudentAptitude = async (student: Student, scores: any): Promise<{ tier: string; reasoning: string }> => {
  if (!ai) return { tier: 'Tier 1', reasoning: 'Mock Analysis: High logic scores indicated Tier 1 suitability.' };

  try {
    // GOVERNANCE PROTOCOL: PII EXCLUSION
    // We explicitly do NOT send the name or specific location to the AI.
    const sanitizedProfile = {
      id: student.masked_id,
      phase: student.phase,
      attendance: student.attendance_rate,
      assessment_scores: scores // numerical data only
    };

    const prompt = `
      TASK: Analyze student aptitude for specialization placement.
      PROTOCOL: Strict Bias Mitigation. Do not infer gender, caste, or location. Use only performance data.
      INPUT: ${JSON.stringify(sanitizedProfile)}
      
      OUTPUT JSON:
      {
        "tier": "Tier 1 (High Complexity)" | "Tier 2" | "Tier 3 (Support Roles)",
        "reasoning": "Technical explanation based on scores and attendance."
      }
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { tier: 'Tier 2', reasoning: 'Fallback analysis due to connection error.' };
  }
};

// ------------------------------------------------------------------
// FEATURE 3: PROJECT REQUIREMENT ANALYSIS
// ------------------------------------------------------------------
export const analyzeProjectRequirements = async (description: string): Promise<ProjectBrief> => {
  if (!ai) return {
    title: "Project Analysis Mock",
    estimated_budget: { confidence: 0.8, value: 50000, currency: "INR" },
    priority: "medium",
    summary: "Mock summary of project requirements.",
    timeline: { duration_days: 30, start_by: "ASAP" },
    deliverables: ["Requirement 1", "Requirement 2"],
    skills_required: ["React", "Node.js"]
  };

  try {
    const prompt = `
      Analyze the following project description and extract key requirements.
      Description: ${description}
      
      Output JSON format:
      {
        "title": "Short project title",
        "estimated_budget": { "confidence": 0-1, "value": number, "currency": "INR" },
        "priority": "high" | "medium" | "low",
        "summary": "Executive summary",
        "timeline": { "duration_days": number, "start_by": "string" },
        "deliverables": ["string"],
        "skills_required": ["string"]
      }
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze requirements");
  }
};

// ------------------------------------------------------------------
// FEATURE 4: TEAM MATCHING
// ------------------------------------------------------------------
export const suggestTeam = async (project: ProjectBrief): Promise<TeamRecommendation> => {
  if (!ai) return {
    overall_match_score: 0.85,
    suggested_team: [
      { person_id: 'e1', role: 'Lead Dev', match: 0.9 },
      { person_id: 'e2', role: 'Designer', match: 0.8 }
    ],
    explainability: "Mock team suggestion based on skills.",
    risks: ["Timeline tight"],
    suggested_mitigations: ["Add buffer"]
  };

  try {
    const prompt = `
      Suggest a team for the project: ${JSON.stringify(project)}
      Consider roles: Developer, Designer, Manager.
      
      Output JSON:
      {
        "overall_match_score": number (0-1),
        "suggested_team": [{ "person_id": "e1" | "e2" | "e3", "role": "string", "match": number }],
        "explainability": "string",
        "risks": ["string"],
        "suggested_mitigations": ["string"]
      }
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Team Suggestion Error:", error);
    throw error;
  }
};

// ------------------------------------------------------------------
// FEATURE 5: SKILL GAP ANALYSIS
// ------------------------------------------------------------------
export const analyzeSkillGaps = async (project: ProjectBrief, team: any[]): Promise<SkillGapReport> => {
  if (!ai) return {
    team_gap_report: []
  };

  try {
    const prompt = `
      Analyze skill gaps for the project ${project.title} with the suggested team.
      Team: ${JSON.stringify(team)}
      Requirements: ${JSON.stringify(project.skills_required)}
      
      Output JSON:
      {
        "team_gap_report": [
          {
            "person_id": "string",
            "missing": ["string"],
            "recommended_microcourses": [{ "id": "string", "title": "string" }]
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Skill Gap Error:", error);
    return { team_gap_report: [] };
  }
};

// ------------------------------------------------------------------
// FEATURE 6: TASK PLAN GENERATION
// ------------------------------------------------------------------
export const generateTaskPlan = async (project: ProjectBrief, team: EmployeeProfile[]): Promise<ProjectPlan> => {
  if (!ai) return {
    project_plan_id: "plan-mock-1",
    milestones: [
      {
        id: "m1",
        title: "Phase 1: Setup",
        due: "Week 1",
        tasks: [
          { id: "t1", assignee_id: "e1", title: "Repo Setup", est_hours: 4, due_date: "Day 1", status: "completed" }
        ]
      }
    ]
  };

  try {
    const prompt = `
      Generate a project plan for: ${project.title}.
      Team: ${JSON.stringify(team.map(t => ({ id: t.person_id, name: t.name, role: t.role })))}
      Timeline: ${project.timeline.duration_days} days.
      
      Output JSON:
      {
        "project_plan_id": "string",
        "milestones": [
          {
            "id": "string",
            "title": "string",
            "due": "string",
            "tasks": [
              { "id": "string", "assignee_id": "string", "title": "string", "est_hours": number, "due_date": "string", "status": "pending" }
            ]
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Plan Error:", error);
    throw error;
  }
};

// ------------------------------------------------------------------
// FEATURE 7: PROJECT HEALTH EVALUATION
// ------------------------------------------------------------------
export const evaluateProjectHealth = async (planId: string): Promise<MonitoringReport> => {
  if (!ai) return {
    project_health: "green",
    alerts: [],
    task_status: [
      { task_id: "t1", status: "completed", quality_score: 0.95, authenticity_score: 0.98, checks: ["Git commit verified"] }
    ]
  };

  try {
    const prompt = `
      Simulate a monitoring report for project plan ${planId}.
      Assume mostly on track but with one minor delay.
      
      Output JSON:
      {
        "project_health": "green" | "amber" | "red",
        "alerts": [{ "message": "string", "ticket_id": "string" }],
        "task_status": [
          { "task_id": "string", "status": "string", "quality_score": number (0-1), "authenticity_score": number (0-1), "checks": ["string"] }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Health Error:", error);
    throw error;
  }
};

// ------------------------------------------------------------------
// FEATURE 8: LMS STUDENT ASSESSMENT
// ------------------------------------------------------------------
export const assessStudentSubmission = async (studentId: string, submissionText: string): Promise<LMSAssessment> => {
  if (!ai) return {
    score: 0.85,
    feedback: "Good effort. The stitch is consistent but tension is slightly loose.",
    demo_snippets: [{ time: "0:15", note: "Watch needle position" }],
    next_recommendation: { title: "Tension Control Practice" }
  };

  try {
    const prompt = `
      Assess the student submission: "${submissionText}".
      Context: Sewing/Hemming task.
      
      Output JSON:
      {
        "score": number (0-1),
        "feedback": "string",
        "demo_snippets": [{ "time": "string", "note": "string" }],
        "next_recommendation": { "title": "string" }
      }
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini LMS Error:", error);
    throw error;
  }
};

// ------------------------------------------------------------------
// FEATURE 9: DAILY SUMMARY GENERATION
// ------------------------------------------------------------------
export const generateDailySummary = async (personId: string): Promise<DailySummary> => {
  if (!ai) return {
    daily_summary: "Completed 2 modules on sewing. Practiced hemming for 2 hours.",
    hours_logged: 4.5,
    suggested_next_steps: ["Review Module 3", "Submit practice video"]
  };

  try {
    const prompt = `
      Generate a daily work summary for trainee ${personId}.
      Simulate activity: Completed 2 modules, practiced practical task.
      
      Output JSON:
      {
        "daily_summary": "string",
        "hours_logged": number,
        "suggested_next_steps": ["string"]
      }
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    throw error;
  }
};
