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

/**
 * Get AI response from OpenAI
 * @param {string} message - User's message
 * @param {Array} conversationHistory - Previous messages in format [{role: 'user'|'assistant', content: string}]
 * @returns {Promise<string>} AI response
 */
export const getAIResponse = async (message, conversationHistory = []) => {
  const client = getClient();

  if (!client) {
    return `AI mock response: I read "${message.slice(0, 120)}" and I'm here to help with your volunteer journey!`;
  }

  try {
    // Build messages array with system prompt and conversation history
    const messages = [
      {
        role: "system",
        content: "You are a helpful AI assistant for a volunteer management platform called Voluntry. Help users with questions about volunteering, finding opportunities, tracking their impact, and managing their volunteer activities. Be friendly, encouraging, and informative.",
      },
      ...conversationHistory,
      {
        role: "user",
        content: message,
      },
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content;
    return content ?? "I am here to help with your volunteer work!";
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error(`Failed to get AI response: ${error.message}`);
  }
};

