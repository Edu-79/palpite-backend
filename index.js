const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.get('/', (req, res) => {
  res.send('Palpite Backend Rodando...');
});

app.get('/palpite', async (req, res) => {
  try {
    const prompt = `Você é um especialista em estatísticas de futebol. Gere 3 palpites claros e coerentes para jogos de hoje, como "Vitória do Real Madrid", "Mais de 2.5 gols", "Ambos marcam: sim". Use dados realistas como se fossem extraídos de sites como SofaScore e 365Scores.`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const palpites = completion.data.choices[0].message.content;
    res.json({ palpites });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar palpites', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));