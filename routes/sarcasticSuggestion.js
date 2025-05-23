const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this is set in your .env file
});

router.post('/', async (req, res) => {
  const { message } = req.body; // Get the user's current message
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a witty assistant who helps users finish their own contact form messages in a funny or sarcastic way. The user is contacting a web developer for the first time (they do not know each other) to help them or their business go online. Given the start of a message, suggest a short, playful, clever, and email-style way to complete it for a first-time contact with a web developer. Do NOT reply to the message—just complete it as if you are the user writing to a web developer for the first time. Only provide the completion, not the whole message.',
        },
        {
          role: 'user',
          content: `Here is the start of my message: "${message}". Suggest a short, funny or sarcastic, email-style way to finish this message for a first-time contact with a web developer. Only provide the completion, not the whole message.`,
        },
      ],
      max_tokens: 40,
      temperature: 0.95,
    });

    const suggestion = completion.choices[0]?.message?.content?.trim() || '';
    res.json({ suggestion });
  } catch (err) {
    console.error('OpenAI error:', err);
    res.json({ suggestion: '' });
  }
});

module.exports = router;