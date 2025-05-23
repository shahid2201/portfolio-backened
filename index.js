require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const sarcasticSuggestionRoute = require('./routes/sarcasticSuggestion');

const app = express();
app.use(cors({
  origin: 'https://shahid2201.github.io'
}));
app.use(express.json());

app.use('/api/sarcastic-suggestion', sarcasticSuggestionRoute);

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Configure your email transport (replace with your real credentials)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_TO,
    subject: `Portfolio Contact: Message from ${name}`,
    text: `${message}\n\nSender's email: ${email}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Error sending email:', err); // <-- Add this line
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));