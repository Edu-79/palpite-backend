import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { OpenAI } from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get("/", (req, res) => {
  res.send("Palpite Backend Rodando...");
});

app.post("/palpite", async (req, res) => {
  try {
    const { jogo } = req.body;
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em estatísticas de futebol. Gere 3 palpites coerentes e objetivos para o jogo informado, sem contradições, incluindo: resultado provável, chance de BTTS e total de gols provável."
        },
        {
          role: "user",
          content: `Jogo: ${jogo}`
        }
      ],
      temperature: 0.7
    });

    const resposta = completion.choices[0].message.content;
    res.json({ palpite: resposta });
  } catch (error) {
    console.error("Erro ao gerar palpite:", error);
    res.status(500).json({ error: "Erro ao gerar palpite" });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});