const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.get("/", (req, res) => {
  res.send("Servidor do Palpite da Hora está online!");
});

app.post("/palpite", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt não fornecido." });
  }

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Você é um analista esportivo que gera palpites com base em estatísticas de jogos de futebol.",
        },
        { role: "user", content: prompt },
      ],
    });

    const resposta = response.data.choices[0].message.content;
    res.json({ resultado: resposta });
  } catch (error) {
    console.error("Erro ao gerar palpite:", error.message);
    res.status(500).json({ error: "Erro ao gerar palpite." });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
