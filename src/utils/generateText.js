import axios from 'axios';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export const generateText = async (prompt, tone, format, outputLength) => {
  if (!prompt) throw new Error('Prompt is required');

  let attempt = 0;
  const maxAttempts = 3;
  const baseDelay = 2000; // 2 seconds

  while (attempt < maxAttempts) {
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
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      attempt++;
      const errorMessage = error.response?.data?.error?.message || '';
      if (error.response?.status === 429 && attempt < maxAttempts) {
        if (errorMessage.includes('exceeded your current quota')) {
          throw new Error('Quota exceeded. Please check your OpenAI plan and billing details at https://platform.openai.com/account/billing.');
        }
        const waitTime = baseDelay * attempt; // Linear backoff (2s, 4s, 6s)
        console.log(`Rate limit hit. Retrying in ${waitTime / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      throw new Error(errorMessage || 'Failed to generate text. Please check your API key or network.');
    }
  }
  throw new Error('Max retry attempts reached. Check your OpenAI quota.');
};