import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const prompt = reqBody.prompt || reqBody.customPrompt;
    const subject = reqBody.subject;
    const body = reqBody.body || reqBody.bodyTemplate;
    const tone = reqBody.tone || 'persuasive';
    const targetAudience = reqBody.targetAudience || 'general';

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // High-quality smart fallback generator if API key is not yet set
      const fallbackSubjects = [
        `Application for CA Articleship - Statutory Audit | {{first_name}} {{last_name}}`,
        `Application for Articleship Opportunity at {{company}}`,
        `CA Intermediate Qualified - Seeking Articleship in Audit & Assurance`,
      ];
      const fallbackBody = `Dear {{first_name}},\n\nI hope you are doing well.\n\nI recently cleared the CA Intermediate examination in my first attempt and am seeking an Articleship opportunity in the Statutory Audit practice at {{company}}.\n\nPlease find my resume attached for your kind consideration. I would be grateful if you could consider my application for a suitable Articleship opportunity. I am eager to learn, contribute, and adhere to the highest professional standards of {{company}}.\n\nThank you for your time and consideration.\n\nWarm regards,\n[Your Name]`;

      return NextResponse.json({
        subjects: fallbackSubjects,
        subjectSuggestions: fallbackSubjects,
        body: fallbackBody,
        enhancedBody: fallbackBody,
        isFallback: true,
        message: 'Generated using built-in smart template engine. Add GEMINI_API_KEY in .env.local to enable live Gemini AI inference.',
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are an expert career application coach and professional correspondence writer.
Your task is to write polished, respectful, and effective job and articleship application cover letters.
CRITICAL RULES:
1. Preserve variable placeholders exactly as written: {{first_name}}, {{last_name}}, {{company}}, {{role}}, or any other {{variables}}.
2. The tone should match: ${tone} (e.g., professional, concise, respectful, or value-driven).
3. Target Audience: ${targetAudience}.
4. Keep the body concise (under 150 words), professional, with a polite request for interview or consideration.
5. Output format must be valid JSON with two fields:
   - "subjects": an array of 3 distinct, professional subject lines (can use {{company}} or {{role}}).
   - "body": the enhanced email body template.`;

    const userPrompt = `
Current Subject: ${subject || 'None'}
Current Body: ${body || 'None'}
User Request / Focus: ${prompt || 'Enhance this email for higher reply rates'}

Please return ONLY raw JSON matching:
{
  "subjects": ["subject 1", "subject 2", "subject 3"],
  "body": "enhanced body with {{first_name}}, {{company}} etc."
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch {
      // Regex match if wrapped in markdown code fence
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse JSON response from Gemini');
      }
    }

    const generatedSubjects = parsedData.subjects || [subject];
    const generatedBody = parsedData.body || body;

    return NextResponse.json({
      subjects: generatedSubjects,
      subjectSuggestions: generatedSubjects,
      body: generatedBody,
      enhancedBody: generatedBody,
      isFallback: false,
    });
  } catch (error: any) {
    console.error('[API /api/ai/enhance] Error:', error);
    const errorSubjects = [
      `Application for CA Articleship - Statutory Audit | {{first_name}}`,
      `Application for Articleship Opportunity at {{company}}`,
    ];
    const errorBody = `Dear {{first_name}},\n\nI hope you are doing well.\n\nI recently cleared CA Intermediate in my first attempt and am seeking an Articleship opportunity in Statutory Audit at {{company}}.\n\nPlease find my resume attached for your kind consideration.\n\nWarm regards,\n[Your Name]`;
    return NextResponse.json(
      {
        error: error.message || 'Failed to enhance email with Gemini AI',
        subjects: errorSubjects,
        subjectSuggestions: errorSubjects,
        body: errorBody,
        enhancedBody: errorBody,
      },
      { status: 500 }
    );
  }
}
