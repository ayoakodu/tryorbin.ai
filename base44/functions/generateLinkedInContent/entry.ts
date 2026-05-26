import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const {
      task_type,
      contact_name,
      contact_title,
      contact_company,
      contact_industry,
      tone = 'professional',
      existing_message = '',
      refine_instruction = '',
    } = await req.json();

    const toneGuide = {
      professional: 'professional, concise, and respectful',
      friendly:     'warm, friendly, and approachable',
      direct:       'direct, confident, and value-focused',
      casual:       'conversational and casual without being too informal',
    }[tone] || 'professional';

    const contextBlock = [
      contact_name    && `Prospect name: ${contact_name}`,
      contact_title   && `Title: ${contact_title}`,
      contact_company && `Company: ${contact_company}`,
      contact_industry && `Industry: ${contact_industry}`,
    ].filter(Boolean).join('\n');

    const taskPrompts = {
      send_connection_request: `Write a short, personalised LinkedIn connection request note (max 300 characters). 
        It should feel human, reference something relevant about the prospect, and avoid generic openers like "I'd like to add you".
        Do NOT mention RVNU or that this is AI-generated. Write in first person.`,
      send_linkedin_message: `Write a personalised LinkedIn direct message (2-3 short paragraphs).
        The goal is to open a conversation and offer genuine value. Be specific to their role and company.
        End with a soft CTA (e.g. "Would it make sense to connect for 15 minutes?"). Do NOT be pushy.`,
      follow_up_message: `Write a brief, natural follow-up LinkedIn message for someone who hasn't responded yet.
        Acknowledge you reached out before. Keep it short (2-3 sentences). No pressure, just checking in with fresh value.`,
      reply_reminder: `Write a short internal reminder note (for the user's eyes only) about why they should follow up on this LinkedIn conversation
        and what to say. Include suggested talking points based on the prospect's context.`,
      engage_with_post: `Suggest a genuine, thoughtful LinkedIn comment the user could leave on this prospect's post.
        It should add value, show expertise, and be 1-3 sentences. Do NOT sound like AI.`,
    };

    const basePrompt = taskPrompts[task_type] || taskPrompts['send_linkedin_message'];

    let finalPrompt = `You are an expert B2B sales copywriter helping a sales rep with LinkedIn outreach.\n\n`;
    finalPrompt += `Tone: ${toneGuide}\n\n`;
    if (contextBlock) finalPrompt += `Prospect context:\n${contextBlock}\n\n`;
    finalPrompt += basePrompt;

    if (existing_message && refine_instruction) {
      finalPrompt += `\n\nThe user has an existing draft:\n"${existing_message}"\n\nRefine instruction: ${refine_instruction}\n\nProvide the improved version only.`;
    } else if (existing_message) {
      finalPrompt += `\n\nExisting draft to improve:\n"${existing_message}"\n\nProvide the improved version only.`;
    }

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: finalPrompt,
      response_json_schema: {
        type: 'object',
        properties: {
          message:         { type: 'string' },
          recommendation:  { type: 'string' },
          character_count: { type: 'number' },
        },
      },
    });

    return Response.json({
      message:        result.message || '',
      recommendation: result.recommendation || '',
      character_count: (result.message || '').length,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});