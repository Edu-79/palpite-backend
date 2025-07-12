const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;

app.use(cors()); // <-- LIBERA ACESSO DE QUALQUER ORIGEM
app.use(express.json());

app.get('/palpites', async (req, res) => {
  // Seu código de geração de palpites aqui...
  const exemplo = {
    campeonato: 'Brasileirão Série A',
    jogos: [
      {
        time_casa: 'Flamengo',
        time_fora: 'Palmeiras',
        data: '12/07/2025 18:30',
        palpites: [
          'Vitória do Flamengo',
          'Mais de 2.5 gols',
          'Ambas marcam: Sim'
        ]
      }
    ]
  };
  res.json([exemplo]);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
