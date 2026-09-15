import groq from "./aiReflectionService.js";

export const analyzeEmotion = async (text) => {
  if (!text || !text.trim()) {
    return {
      sentiment: "neutral",
      emotions: [],
      emotionalIntensity: 0,
      distressIndicators: [],
      contextSignals: [],
    };
  }

  const prompt = `
Analyze the emotional and contextual signals present in the following user-written text.

User text:
"${text}"

Return ONLY valid JSON in exactly this structure:

{
  "sentiment": "positive | neutral | negative",
  "emotions": ["emotion1", "emotion2"],
  "emotionalIntensity": 0,
  "distressIndicators": ["indicator1", "indicator2"],
  "contextSignals": ["signal1", "signal2"]
}

Rules:
- sentiment must be exactly one of: positive, neutral, negative.
- emotions should contain only emotions directly supported by the text.
- emotionalIntensity must be an integer from 0 to 100.
- distressIndicators should contain observable textual indicators such as persistent fear, hopelessness, isolation, overwhelming stress, sleep difficulty, anger, or similar signals when actually supported by the text.
- contextSignals should describe relevant contextual circumstances mentioned in the text.
- Do not diagnose any mental health condition.
- Do not infer information that is not present in the text.
- Do not provide medical advice.
- Do not label the person with a disorder or condition.
- Keep the analysis concise and evidence-based.
- If there are no relevant distress indicators or context signals, return empty arrays.
`;

  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",

    messages: [
      {
        role: "system",
        content:
          "You are an AI emotional signal analysis component for a mental-health support system. Extract only observable emotional and contextual signals from the provided text. Do not diagnose, make clinical judgments, or provide medical advice.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],

    temperature: 0.2,
    max_completion_tokens: 1000,
    reasoning_effort: "low",

    response_format: {
      type: "json_object",
    },
  });

  const analysisText = response.choices[0].message.content;

  const analysis = JSON.parse(analysisText);

  return {
    sentiment: analysis.sentiment || "neutral",
    emotions: Array.isArray(analysis.emotions)
      ? analysis.emotions
      : [],
    emotionalIntensity:
      typeof analysis.emotionalIntensity === "number"
        ? Math.max(0, Math.min(100, analysis.emotionalIntensity))
        : 0,
    distressIndicators: Array.isArray(analysis.distressIndicators)
      ? analysis.distressIndicators
      : [],
    contextSignals: Array.isArray(analysis.contextSignals)
      ? analysis.contextSignals
      : [],
  };
};