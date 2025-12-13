
import { GoogleGenAI } from "@google/genai";

// V1 is focused on structural transparency. 
// AI services are currently placeholders for the V2 roadmap (Automated ESG Reporting).

export const generateAIInsight = async () => {
  return "AI Impact Analysis module coming in V2.";
};

export const generateESGReport = async (impactMetrics: any, financialData: any): Promise<string> => {
    // Return a message if no API key is present
    if (!process.env.API_KEY) {
        return "Gemini API Key not configured. Unable to generate ESG report.";
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const model = 'gemini-2.5-flash';
        
        const prompt = `
            You are an ESG compliance officer. Generate a brief Executive Summary (max 150 words) for a CSR report based on the following data.
            Focus on Social ROI, Transparency, and Beneficiary Impact.

            Impact Metrics:
            ${JSON.stringify(impactMetrics, null, 2)}
            
            Financial Utilization:
            ${JSON.stringify(financialData, null, 2)}
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        return response.text || "Report generation incomplete.";
    } catch (error) {
        console.error("Error generating ESG report:", error);
        return "Error generating report. Please try again later.";
    }
};
