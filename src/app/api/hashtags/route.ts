import { NextResponse } from 'next/server';
import { getHashtags } from '@/lib/hashtag-engine';

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

function getFallbackHashtags(): string[] {
  // The existing engine provides trending hashtags by default, which is a perfect fallback.
  return getHashtags('trending', 15);
}

export async function POST(request: Request) {
  const { keyword } = await request.json();
  const apiToken = process.env.GROQ_API_KEY;

  if (!keyword?.trim()) {
    return NextResponse.json({ hashtags: getFallbackHashtags() });
  }

  // If the API token is missing on the server, return fallback hashtags silently.
  if (!apiToken || !apiToken.startsWith('gsk_')) {
    console.error('Groq API token is missing or invalid. Returning fallback hashtags.');
    return NextResponse.json({ hashtags: getFallbackHashtags() });
  }

  const prompt = `You are a viral social media expert. Generate 15 trending and relevant hashtags for the keyword: "${keyword}". Your response MUST be a single string of words separated by spaces. Do not include any other text, explanations, or the '#' symbol. For example: "hashtag1 hashtag2 hashtag3"`;

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
        max_tokens: 100,
        stream: false,
      }),
    });

    if (!response.ok) {
      console.error(`Groq API request failed with status ${response.status}. Returning fallback.`);
      return NextResponse.json({ hashtags: getFallbackHashtags() });
    }

    const result = await response.json();
    const aiResponse = result.choices?.[0]?.message?.content;

    if (!aiResponse) {
      console.error("Invalid response format from Groq API. Returning fallback.");
      return NextResponse.json({ hashtags: getFallbackHashtags() });
    }

    const hashtags = aiResponse
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(tag => tag.length > 2)
      .map(tag => `#${tag.replace(/[^a-z0-9]/g, '')}`)
      .filter(tag => tag.length > 1);

    if (hashtags.length === 0) {
      console.warn("AI returned empty or invalid hashtags. Using fallback.");
      return NextResponse.json({ hashtags: getFallbackHashtags() });
    }

    return NextResponse.json({ hashtags });

  } catch (e: any) {
    console.error("An unexpected error occurred while calling Groq API:", e.message);
    // If any other error occurs, return high-quality fallback hashtags.
    return NextResponse.json({ hashtags: getFallbackHashtags() });
  }
}
