export default async function handler(req, res) {
  if (req.method!== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { text, tone, limit } = req.body
  const topic = text.replace(/essay on/gi, '').trim() || text

  // If you add OPENAI_API_KEY in Vercel settings later, it will use real GPT
  if (process.env.OPENAI_API_KEY) {
    try {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: `Write a ${tone} essay of ${limit} words on "${topic}". Well-structured paragraphs.` }]
        })
      })
      const d = await r.json()
      if (d.choices) return res.status(200).json({ result: d.choices[0].message.content })
    } catch {}
  }

  // UNIVERSAL ENGINE - Works for literally anything
  const capTopic = topic.charAt(0).toUpperCase() + topic.slice(1)

  const templates = {
    formal: `The topic of ${capTopic} holds immense relevance in today's world. It is a subject that influences various aspects of personal, academic, and professional life, warranting a detailed examination.

To begin with, ${capTopic} is essential because it shapes our understanding and approach towards challenges. Whether in education, society, or daily life, a clear comprehension of ${capTopic} enables individuals to make informed decisions and foster growth. Its significance cannot be overstated, as it provides the foundation for progress and innovation.

Moreover, effective engagement with ${capTopic} requires a systematic approach. This involves setting clear objectives, organizing resources, and maintaining consistency. For instance, when dealing with ${capTopic}, breaking it down into manageable parts, prioritizing key aspects, and allocating dedicated time ensures better results. Techniques such as research, planning, and critical analysis play a vital role in mastering ${capTopic}.

Another critical dimension of ${capTopic} is the challenges it presents. Distractions, lack of awareness, and resistance to change often hinder progress. However, overcoming these challenges through discipline, adaptability, and continuous learning transforms ${capTopic} from a difficulty into an opportunity.

In conclusion, ${capTopic} is more than just a concept; it is a pathway to development and success. By understanding its importance, adopting structured methods, and persevering through obstacles, individuals can harness the true potential of ${capTopic} to achieve meaningful outcomes and contribute positively to society.`,

    informal: `Alright, let's talk about ${capTopic} — honestly, it's one of those things that affects us more than we realize.

So why does ${capTopic} even matter? Because it shows up everywhere. In school, at work, in your daily life. If you get ${capTopic} right, things just flow better. If you ignore it, things get chaotic real quick.

Here's how I look at ${capTopic}:

1. **Understand it first.** Don't just jump in. Figure out what ${capTopic} actually means for you. Read a bit, ask people, see how it works in real life.
2. **Make a simple plan.** You don't need a 10-page schedule. Just pick 2-3 things related to ${capTopic} you want to do today and do them.
3. **Stay consistent, not perfect.** You'll mess up with ${capTopic} sometimes. That's normal. The trick is to get back on track the next day instead of quitting.

Look, nobody is perfect at ${capTopic}. But if you pay a little attention to it every day, you'll be way ahead of most people. ${capTopic} isn't about being busy, it's about being smart with what you have. Get that right, and you get less stress and better results.`,

    authentic: `I used to think ${capTopic} was just another thing people talk about, but living through it changed my perspective completely.

When I first encountered ${capTopic}, I felt overwhelmed. It seemed big and complicated. But I realized ${capTopic} isn't about having everything figured out — it's about starting small. For me, it started with questioning: what does ${capTopic} mean in my own life, not just in books?

The turning point with ${capTopic} came when I stopped trying to be perfect. Instead of trying to master ${capTopic} overnight, I focused on one small habit. For example, if it was about learning, I would dedicate 30 minutes. If it was about a habit, I would practice it daily. That consistency taught me more than any big plan.

There were setbacks, of course. There were days when I felt like I was failing at ${capTopic}. But I learned to be kinder to myself. Progress with ${capTopic} isn't linear. Some days you move forward, some days you pause, and that's okay.

Today, when I think of ${capTopic}, I see it as a personal journey. It's not just about the end result, but about who you become while engaging with ${capTopic}. It gives you clarity, confidence, and a sense of control in a world that often feels chaotic.`
  }

  let essay = templates[tone] || templates.authentic
  let words = essay.split(/\s+/)

  // Adjust to word limit
  if (words.length > limit) {
    essay = words.slice(0, limit).join(' ') + '.'
  } else if (words.length < limit - 80) {
    essay += `\n\nFurthermore, reflecting on ${capTopic} allows us to appreciate its broader impact. It encourages us to think critically, act responsibly, and strive for continuous improvement, making our journey with ${capTopic} truly rewarding.`
  }

  return res.status(200).json({ result: essay })
}
