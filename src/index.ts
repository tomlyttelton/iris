import express from 'express';
import { getNewsData } from './getNewsData';
import { generatePrompt } from './generatePrompt';
import { makeOutboundCall } from './makeOutboundCall';

const app = express();
app.use(express.json());

app.post('/', async (req, res) => {
  const phone = req.body.from;
  if (!phone) {
    return res.status(400).send('Missing "from" phone number');
  }

  try {
    const news = await getNewsData();
    const prompt = await generatePrompt(news);
    await makeOutboundCall(phone, prompt);
    res.status(200).send('Call initiated');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to process request');
  }
});

export default app;