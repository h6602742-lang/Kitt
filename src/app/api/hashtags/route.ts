import { NextResponse } from 'next/server';

const HUGGING_FACE_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3";

export async function POST(request: Request) {
  const { keyword } = await request.json();
  const apiToken = process.env.NEXT_PUBLIC_HF_TOKEN;

  if (!keyword) {
    return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
  }

  if (!apiToken || !apiToken.startsWith('hf_')) {
    console.error('Hugging Face API token is missing or invalid.');
    return NextResponse.json({ error: 'API token is not configured correctly on the server.' }, { status: 500 });
  }

  const prompt = `Act as a social media expert. Generate 10 trending and relevant hashtags for the keyword: "${keyword}". Return ONLY the hashtags separated by spaces. Do not include any other text, explanation, or the '#' symbol.`;
  
  const maxRetries = 3;
  let lastError: any = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(HUGGING_FACE_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiToken.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          options: {
            wait_for_model: true,
            use_cache: false,
          },
        }),
      });

      if (response.status === 503 && i < maxRetries - 1) {
        await new Promise(res => setTimeout(res, 8000));
        continue;
      }

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(`API request failed with status ${response.status}: ${errorBody.error || response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!Array.isArray(result) || !result[0]?.generated_text) {
        throw new Error("Invalid response format from AI service.");
      }

      const generatedText = result[0].generated_text;
      const aiResponse = generatedText.split(prompt).pop() || '';
      
      const hashtags = aiResponse
        .trim()
        .split(/\s+/)
        .map(tag => tag.replace(/[^a-zA-Z0-9]/g, ''))
        .filter(tag => tag.length > 1 && !/^\d+$/.test(tag))
        .map(tag => `#${tag}`);

      if (hashtags.length > 0 && hashtags[0] !== '#') {
        return NextResponse.json({ hashtags: hashtags.filter(tag => tag.length > 2) });
      } else {
        throw new Error("AI returned invalid or empty hashtags.");
      }

    } catch (e: any) {
        lastError = e;
        console.error(`Hashtag generation attempt ${i + 1} failed:`, e.message);
    }
  }

  return NextResponse.json({ error: `Failed to generate hashtags after ${maxRetries} attempts. Please try again later.` }, { status: 500 });
}
