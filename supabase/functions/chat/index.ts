
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to clean markdown formatting
const cleanMarkdown = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
    .replace(/\*(.*?)\*/g, '$1')     // Remove italic formatting
    .replace(/^\* /gm, '• ')         // Replace bullet points
    .replace(/^# (.*$)/gm, '$1')     // Remove heading markers
    .replace(/^## (.*$)/gm, '$1')    // Remove subheading markers
    .replace(/^### (.*$)/gm, '$1')   // Remove sub-subheading markers
    .trim();
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory, generateAudio } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    // Prepare the conversation with career counselor context
    const systemPrompt = {
      role: 'model',
      parts: [{
        text: `You are an AI career counselor with expertise in helping people discover their ideal career paths. You should:

1. Ask thoughtful questions about their interests, skills, values, and goals
2. Provide personalized career recommendations based on their responses
3. Suggest specific learning paths and resources
4. Offer practical advice on skill development and career transitions
5. Be encouraging and supportive while being realistic about career prospects
6. Focus on actionable guidance they can implement

Keep your responses conversational, helpful, and focused on career development. Ask follow-up questions to better understand their situation. 

IMPORTANT: Do not use markdown formatting like asterisks (*) or hashtags (#). Write in clean, plain text format.`
      }]
    };

    const contents = [
      systemPrompt,
      ...conversationHistory,
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                    "I'm sorry, I couldn't generate a response. Please try again.";

    // Clean the response from markdown formatting
    aiResponse = cleanMarkdown(aiResponse);

    const responseData: any = { response: aiResponse };

    // Generate audio if requested
    if (generateAudio) {
      try {
        const audioResponse = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: { text: aiResponse },
            voice: {
              languageCode: 'en-US',
              name: 'en-US-Neural2-F',
              ssmlGender: 'FEMALE'
            },
            audioConfig: {
              audioEncoding: 'MP3'
            }
          }),
        });

        if (audioResponse.ok) {
          const audioData = await audioResponse.json();
          responseData.audioContent = audioData.audioContent;
        } else {
          console.error('Text-to-speech error:', await audioResponse.text());
        }
      } catch (audioError) {
        console.error('Audio generation error:', audioError);
      }
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process chat message',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
