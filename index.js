const express = require('express');
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.get('/palpite', async (req, res) => {
  try {
    const prompt = `Gere 3 palpites estatísticos para o jogo entre Flamengo x Palmeiras hoje. Inclua sugestões de gols, escanteios e cartões, de forma clara e objetiva.`;
    
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const resposta = completion.data.choices[0].message.content;
    res.json({ palpite: resposta });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ erro: "Erro ao buscar o palpite." });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});