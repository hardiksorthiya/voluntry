import OpenAI from "openai";

let cachedClient;

const getClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return cachedClient;
};

export const getAIResponse = async (prompt) => {
  const client = getClient();

  if (!client) {
    return `AI mock response: I read "${prompt.slice(0, 120)}" and I'm here to help with your volunteer journey!`;
  }

  const completion = await client.responses.create({
    model: "gpt-4o-mini",
    input: prompt,
  });

  const content = completion.output?.[0]?.content?.[0]?.text;
  return content ?? "I am here to help with your volunteer work!";
};

