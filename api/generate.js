export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body.prompt || body.topic || "Write an essay";

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "GEMINI_API_KEY not set in Vercel" }, { status: 500 });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json({ error: data.error?.message || "Gemini API error", full: data }, { status: 500 });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    return Response.json({ text: text });

  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
