import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.get("/", (req, res) => {
  res.send("✅ Backend do Palpite do Edu está online");
});

app.post("/palpites", async (req, res) => {
  const { jogos } = req.body;
  if (!jogos || !Array.isArray(jogos) || jogos.length === 0) {
    return res.status(400).json({ error: "Lista de jogos inválida" });
  }

  try {
    const prompt = `Com base em dados estatísticos atualizados e desempenho dos times, gere até 3 palpites diretos e objetivos por jogo (sem repetições ou contradições). Jogos:\n${jogos.map((j, i) => `${i + 1}. ${j}`).join("\n")}`;

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
    });

    const texto = response.data.choices[0].message.content;
    res.json({ palpites: texto });
  } catch (err) {
    console.error("Erro na geração de palpites:", err.message);
    res.status(500).json({ error: "Erro ao gerar palpites" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
