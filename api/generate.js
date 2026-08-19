import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method!== 'POST') return res.status(405).end();

  const { bullets, mode, wordLimit } = req.body;

  const prompt = `You are Flowrite AI. Turn bullet points into a polished ${mode}.

BULLETS: ${bullets}
WORD LIMIT: ~${wordLimit} words

RULES:
1. Start with a strong hook. No cliches like "since childhood"
2. Use specific details and examples
3. Mode rules:
   Essay: Story + Impact + Future
   Speech: Energy, rhetorical questions, short sentences
   Debate: Clear argument + evidence + address counterpoints
4. Fix grammar and upgrade weak phrases
5. End with exactly this line: IMPROVEMENTS:
- point 1
- point 2
- point 3

TONE: Smart student, confident but not arrogant`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{role: "user", content: prompt}],
    max_tokens: 1200
  });

  const fullText = completion.choices[0].message.content;
  const parts = fullText.split("IMPROVEMENTS:");
  const text = parts[0].trim();
  const improvements = parts[1]?.split("\n").map(s => s.replace('-', '').trim()).filter(Boolean).slice(0,3) || [];

  res.json({ text, improvements });
}
