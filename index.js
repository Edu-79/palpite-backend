const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

dotenv.config();
const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.get("/", (req, res) => {
  res.send("Palpite Backend Online");
});

app.get("/palpites", async (req, res) => {
  try {
    const prompt = `
Considere os jogos de futebol dos principais campeonatos do mundo. Gere uma lista com até 10 palpites do dia no seguinte formato:
- Campeonato
- Jogo (com horário)
- Palpites (3 palpites coerentes por jogo: vencedor, gols, escanteios ou cartões)

Responda apenas com os palpites. Exemplo:
Campeonato Brasileiro Série A
14:00 - Flamengo x Palmeiras
Palpites:
• Mais de 2.5 gols
• Vitória do Flamengo
• Mais de 4 escanteios no 1º tempo

Inicie agora:
    `;

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const resposta = completion.data.choices[0].message.content;
    res.json({ palpites: resposta });
  } catch (error) {
    console.error("Erro ao gerar palpites:", error.message);
    res.status(500).json({ error: "Erro ao gerar palpites." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});