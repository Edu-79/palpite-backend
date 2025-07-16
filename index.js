const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Palpite Backend Rodando...');
});

app.get('/palpites', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Chave da API OpenAI não configurada' });
  }

  try {
    const configuration = new Configuration({ apiKey });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{
        role: 'user',
        content: 'Gere 3 palpites de futebol realistas para jogos de hoje com base em estatísticas e desempenho dos times. Use um tom direto.'
      }]
    });

    const resposta = completion.data.choices[0].message.content;
    res.json({ palpites: resposta });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar palpites com a OpenAI', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});