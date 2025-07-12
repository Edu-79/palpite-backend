const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require('openai');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.get('/', (req, res) => {
  res.send('Servidor de palpites funcionando.');
});

app.get('/palpites', async (req, res) => {
  try {
    const prompt = "Liste 5 jogos de futebol com palpites baseados em desempenho, gols e escanteios.";
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const resposta = completion.data.choices[0].message.content;
    res.json({ palpites: resposta });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('Erro ao gerar palpites');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
