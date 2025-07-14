import axios from 'axios';

const apiKey = import.meta.env.VITE_APP_OPENAI_API_KEY;

export const generateText = async (prompt, tone, format, outputLength) => {
  if (!prompt) throw new Error('Prompt is required');

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a creative writing assistant. Generate text in a ${tone} tone for a ${format} format, with a ${outputLength} length (approximately ${outputLength === 'Short' ? '50 words' : outputLength === 'Medium' ? '150 words' : '300 words'}).`,
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: outputLength === 'Short' ? 60 : outputLength === 'Medium' ? 200 : 400,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`, // Replace with your actual OpenAI API key
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to generate text. Please check your API key or network.');
  }
};