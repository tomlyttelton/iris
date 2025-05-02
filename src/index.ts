import express, { Request, Response } from 'express';
import { getNewsData } from './getNewsData';
import { generatePrompt } from './generatePrompt';
import { makeOutboundCall } from './makeOutboundCall';

const app = express();
app.use(express.json());

app.post('/mcp/tools/iris-research', async (req: Request, res: Response) => {
  const phoneNumber = req.body.phoneNumber;
  if (!phoneNumber) {
    return res.status(400).json({ error: 'Missing "phoneNumber"' });
  }

  try {
    const news = await getNewsData();
    const prompt = await generatePrompt(news);
    await makeOutboundCall(phoneNumber, prompt);
    res.status(200).json({ output: 'Call placed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

export default app;