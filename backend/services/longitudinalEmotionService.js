import groq from "./aiReflectionService.js";

export const analyzeLongitudinalEmotion = async (entries) => {
  if (!entries || entries.length < 2) {
    return {
      status: "Insufficient Data",
      summary: "More journal entries are needed to identify an emotional trajectory.",
      changes: [],
      persistentSignals: [],
      emergingSignals: [],
      overallDirection: "Stable",
    };
  }

  const journalHistory = entries.map((entry, index) => ({
    entry: index + 1,
    date: entry.date,
    sentiment: entry.aiAnalysis?.sentiment || "unknown",
    emotions: entry.aiAnalysis?.emotions || [],
    emotionalIntensity:
      entry.aiAnalysis?.emotionalIntensity ?? null,
    distressIndicators:
      entry.aiAnalysis?.distressIndicators || [],
    contextSignals:
      entry.aiAnalysis?.contextSignals || [],
  }));

  const prompt = `
Analyze the following chronological emotional-signal history.

The data comes from a mental-health support system. Your task is to identify meaningful changes and persistent patterns in the user's written emotional signals.

Journal history:
${JSON.stringify(journalHistory, null, 2)}

Return ONLY valid JSON using exactly this structure:

{
  "status": "Stable | Improving | Increasing Concern | Mixed",
  "summary": "A concise explanation of the most meaningful emotional change across the available entries.",
  "changes": [
    {
      "signal": "emotional intensity | sentiment | emotion | distress indicator | context",
      "direction": "increased | decreased | emerged | persisted | disappeared",
      "explanation": "Brief evidence-based explanation of the observed change."
    }
  ],
  "persistentSignals": [
    "Signals that appear repeatedly across the entries."
  ],
  "emergingSignals": [
    "Meaningful signals that appear in newer entries but were absent or less prominent previously."
  ],
  "overallDirection": "Improving | Stable | Increasing Concern | Mixed"
}

Rules:
- Analyze CHANGE OVER TIME, not just the latest entry.
- Compare earlier entries with newer entries.
- Identify persistent signals separately from newly emerging signals.
- Do not invent emotions, circumstances, symptoms, or events.
- Use only information present in the supplied data.
- Do not diagnose any mental health condition.
- Do not make clinical claims.
- Do not provide medical advice.
- Do not assign a final clinical risk level.
- "Increasing Concern" means the observed emotional signals are becoming more concerning over time; it is NOT a diagnosis.
- If different signals move in different directions, use "Mixed".
- Keep explanations concise but meaningful.
- If there is no meaningful change, use "Stable".
`;

  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",

    messages: [
      {
        role: "system",
        content:
          "You are a longitudinal emotional-signal analysis component for a mental-health support system. Identify evidence-based changes and patterns over time. Never diagnose or make clinical judgments.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],

    temperature: 0.2,
    max_completion_tokens: 1500,
    reasoning_effort: "low",

    response_format: {
      type: "json_object",
    },
  });

  const analysisText = response.choices[0].message.content;

  const analysis = JSON.parse(analysisText);

  return {
    status: analysis.status || "Stable",

    summary:
      analysis.summary ||
      "No clear emotional trajectory could be determined.",

    changes: Array.isArray(analysis.changes)
      ? analysis.changes
      : [],

    persistentSignals: Array.isArray(
      analysis.persistentSignals
    )
      ? analysis.persistentSignals
      : [],

    emergingSignals: Array.isArray(
      analysis.emergingSignals
    )
      ? analysis.emergingSignals
      : [],

    overallDirection:
      analysis.overallDirection || "Stable",
  };
};