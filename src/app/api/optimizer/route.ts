import { NextResponse } from 'next/server';

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(request: Request) {
  const { text } = await request.json();
  const apiToken = process.env.GROQ_API_KEY;

  if (!text?.trim()) {
    return NextResponse.json({ error: 'Input text is required.' }, { status: 400 });
  }

  if (!apiToken || !apiToken.startsWith('gsk_')) {
    console.error('Groq API token is missing or invalid.');
    return NextResponse.json({ error: 'AI service is not configured on the server.' }, { status: 500 });
  }

  const prompt = `You are a viral social media marketing expert named 'Kitt'. Your goal is to rewrite user-provided text to maximize engagement on platforms like Instagram, Facebook, and LinkedIn. When rewriting, you should:
1. Start with a strong, attention-grabbing hook.
2. Use relevant emojis to add personality and break up text.
3. Structure the content with short paragraphs and bullet points for readability.
4. Incorporate a clear call-to-action if appropriate.
5. Maintain a positive and professional tone.
The output should be only the rewritten text, without any of your own commentary or preamble.

Now, rewrite the following text: "${text}"`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1024,
        stream: false,
      }),
    });

    if (!response.ok) {
      console.error(`Groq API request failed with status ${response.status}.`);
      const errorBody = await response.text();
      console.error("Error Body:", errorBody);
      return NextResponse.json({ error: 'Failed to get a response from the AI service.' }, { status: 502 });
    }

    const result = await response.json();
    const optimizedText = result.choices?.[0]?.message?.content;

    if (!optimizedText) {
      console.error("Invalid response format from Groq API.");
      return NextResponse.json({ error: 'AI returned an invalid response.' }, { status: 502 });
    }

    return NextResponse.json({ optimizedText: optimizedText.trim() });

  } catch (e: any) {
    console.error("An unexpected error occurred while calling Groq API:", e.message);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
