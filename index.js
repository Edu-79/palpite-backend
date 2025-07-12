const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.get("/", (req, res) => {
  res.send("Palpite Backend Funcionando");
});

app.get("/palpites", async (req, res) => {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{
        role: "user",
        content: "Gere 10 palpites curtos e realistas para jogos de futebol de hoje. Ex: Vitória do Bahia, Ambas marcam, Mais de 2.5 gols."
      }],
    });

    const resposta = completion.data.choices[0].message.content;
    res.json({ palpites: resposta });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao gerar palpites." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));