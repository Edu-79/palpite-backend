
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/palpites', async (req, res) => {
  try {
    const { jogos } = req.body;

    if (!jogos || !Array.isArray(jogos)) {
      return res.status(400).json({ error: 'Lista de jogos inválida.' });
    }

    const prompt = `Baseado em dados estatísticos reais, gere 3 palpites objetivos e sem contradições para cada um dos seguintes jogos. Não diga "palpite indisponível". Use linguagem simples e direta.

${jogos.map((j, i) => `${i + 1}. ${j}`).join('
')}`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const texto = completion.data.choices[0].message.content;
    res.json({ palpites: texto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao gerar os palpites.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
