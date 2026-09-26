import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SIGNAL_PROMPT = `
You are the AI understanding layer of Mindora-Sentinel.

Analyze the user's message deeply and identify information that may be useful
to a mental-wellbeing monitoring and decision-support system.

Do not diagnose the user.
Do not reduce the message to a simplistic fixed classification.
Understand nuance, context, ambiguity, emotions, concerns, behavioural clues,
and signs of distress when they are actually present.

Return valid JSON with this structure:

{
  "sentiment": "string",
  "emotions": ["string"],
  "distressSignals": ["string"],
  "urgency": "string",
  "relevantSignals": ["string"],
  "confidence": 0.0,
  "reasoning": "string"
}

Use natural descriptive values rather than forcing everything into a
predefined taxonomy.

If something is not present or cannot reasonably be inferred, use an empty
array or an appropriate neutral value.

The output is decision-support information, not a clinical assessment.
`;

export const extractChatSignals = async (message, context = "") => {
  if (!message || typeof message !== "string" || !message.trim()) {
    throw new Error("A valid message is required.");
  }

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    include_reasoning: false,
    temperature: 0.2,
    max_tokens: 500,
    messages: [
      {
        role: "system",
        content: SIGNAL_PROMPT,
      },
      ...(context
        ? [
            {
              role: "system",
              content: `Relevant context:\n${context}`,
            },
          ]
        : []),
      {
        role: "user",
        content: message.trim(),
      },
    ],
  });

  const raw =
    completion.choices?.[0]?.message?.content?.trim() || "";

  if (!raw) {
    throw new Error("AI signal analysis returned an empty response.");
  }

  try {
    return JSON.parse(raw);
  } catch {
    return {
      sentiment: "Unknown",
      emotions: [],
      distressSignals: [],
      urgency: "Unknown",
      relevantSignals: [],
      confidence: 0,
      reasoning: "Structured AI analysis could not be parsed.",
    };
  }
};