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
        `Quick idea for {{company}}'s outreach strategy`,
        `Hi {{first_name}}, loved your recent work at {{company}}`,
        `Scaling cold outreach for {{company}} (quick question)`,
      ];
      const fallbackBody = `Hi {{first_name}},\n\nI noticed the impressive milestones {{company}} has reached lately. In leading your team as {{role}}, I imagine optimizing outreach deliverability and engagement remains top of mind.\n\nWe built ArticlO to help high-growth teams automate personalized cold outreach through Gmail with built-in rate-limiting (2 emails/sec) to keep your domain 100% spam-free.\n\nWould you be open to a 5-minute chat this Thursday to see how this could save your team 10+ hours a week?\n\nBest regards,\n[Your Name]`;

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

    const systemInstruction = `You are an elite B2B cold email copywriter and outreach strategist.
Your task is to write high-converting, personalized cold email templates for sales outreach.
CRITICAL RULES:
1. Preserve variable placeholders exactly as written: {{first_name}}, {{last_name}}, {{company}}, {{role}}, or any other {{variables}}.
2. The tone should match: ${tone} (e.g., persuasive, executive concise, casual and warm, or direct value-driven).
3. Target Audience: ${targetAudience}.
4. Keep the body concise (under 120 words), punchy, with a single clear call-to-action (CTA).
5. Output format must be valid JSON with two fields:
   - "subjects": an array of 3 distinct, high-open-rate subject lines (can use {{first_name}} or {{company}}).
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
      `Quick question regarding {{company}}`,
      `Idea for {{first_name}} at {{company}}`,
    ];
    const errorBody = `Hi {{first_name}},\n\nReaching out because I've been following {{company}}'s recent growth. As {{role}}, would you be open to a quick 5-min intro on automating your cold outreach with zero spam flags?\n\nBest,\n[Your Name]`;
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
