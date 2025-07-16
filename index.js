const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.get("/", (req, res) => {
  res.send("Palpite da Hora Backend rodando!");
});

app.post("/palpites", async (req, res) => {
  try {
    const { rodada } = req.body;

    const prompt = `Gere 3 palpites de futebol baseados em estatísticas reais para os jogos da rodada: ${rodada}. 
    Os palpites devem incluir resultados prováveis (vitória, empate), total de gols (mais de 2.5, menos de 2.5), escanteios ou cartões se possível. 
    Não repita palpites e evite contradições.`;

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });

    const resposta = completion.data.choices[0].message.content;
    res.json({ palpites: resposta });
  } catch (error) {
    console.error("Erro ao gerar palpites:", error);
    res.status(500).json({ error: "Erro ao gerar palpites" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});