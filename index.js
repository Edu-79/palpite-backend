require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { OpenAI } = require('openai');
const cors = require('cors');

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Exemplo de scraping do SofaScore (adaptado)
async function getJogosDoDia() {
    try {
        const { data } = await axios.get('https://www.sofascore.com/pt/futebol');
        const $ = cheerio.load(data);
        const jogos = [];

        $('a[href*="/time/"]').each((i, el) => {
            const texto = $(el).text().trim();
            if (texto && texto.length > 3) {
                jogos.push(texto);
            }
        });

        return jogos.slice(0, 10); // limitar para testes
    } catch (error) {
        console.error("Erro no scraping:", error.message);
        return [];
    }
}

async function gerarPalpitesIA(jogos) {
    try {
        const prompt = `Baseado nos seguintes jogos de futebol do dia: ${jogos.join(", ")}, gere 3 palpites para cada um, considerando estatísticas reais como gols, escanteios, cartões e quem deve vencer. Os palpites devem ser claros, objetivos e não contraditórios.`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
        });

        return response.choices[0].message.content;
    } catch (err) {
        console.error("Erro com OpenAI:", err.message);
        return "Palpite indisponível no momento.";
    }
}

app.get('/palpites', async (req, res) => {
    const jogos = await getJogosDoDia();
    if (!jogos.length) return res.json({ error: "Sem jogos encontrados." });

    const palpites = await gerarPalpitesIA(jogos);
    res.json({ jogos, palpites });
});

app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));