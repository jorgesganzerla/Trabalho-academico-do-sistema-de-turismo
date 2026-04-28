const express = require('express');
const { query } = require('../database/db');

const router = express.Router();

// GET /api/regioes — lista todas as regiões
router.get('/', async (req, res) => {
  try {
    const regioes = await query('SELECT * FROM regioes ORDER BY nome');
    return res.json(regioes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar regiões.' });
  }
});

// GET /api/regioes/:slug/locais — locais de uma região com filtros opcionais
router.get('/:slug/locais', async (req, res) => {
  try {
    const { slug } = req.params;
    const { categoria, orcamento } = req.query;

    const [regiao] = await query('SELECT * FROM regioes WHERE slug = ?', [slug]);
    if (!regiao) return res.status(404).json({ error: 'Região não encontrada.' });

    let sql = 'SELECT * FROM locais WHERE regiao_id = ?';
    const params = [regiao.id];

    if (categoria) {
      sql += ' AND categoria = ?';
      params.push(categoria);
    }

    if (orcamento === 'economico') {
      sql += ' AND custo_medio <= 30';
    } else if (orcamento === 'moderado') {
      sql += ' AND custo_medio <= 100';
    }
    // premium = sem filtro de custo

    sql += ' ORDER BY avaliacao DESC';

    const locais = await query(sql, params);
    return res.json({ regiao, locais });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar locais.' });
  }
});

module.exports = router;
