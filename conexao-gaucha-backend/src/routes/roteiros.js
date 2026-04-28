const express  = require('express');
const auth     = require('../middleware/auth');
const { query, getPool } = require('../database/db');

const router = express.Router();

// Todas as rotas abaixo exigem autenticação
router.use(auth);

// ── RF-04 / RF-03: Criar roteiro (planejar viagem + montar roteiro) ──────────
// POST /api/roteiros
router.post('/', async (req, res) => {
  const conn = await getPool().getConnection();
  try {
    const { regiao_id, data_inicio, data_fim, nivel_orcamento, preferencias } = req.body;
    const usuario_id = req.usuario.id;

    if (!regiao_id || !data_inicio || !data_fim)
      return res.status(400).json({ error: 'regiao_id, data_inicio e data_fim são obrigatórios.' });

    const inicio = new Date(data_inicio);
    const fim    = new Date(data_fim);
    if (fim <= inicio)
      return res.status(400).json({ error: 'data_fim deve ser posterior a data_inicio.' });

    const [regiao] = await query('SELECT * FROM regioes WHERE id = ?', [regiao_id]);
    if (!regiao) return res.status(404).json({ error: 'Região não encontrada.' });

    // Calcula dias de viagem
    const dias = Math.ceil((fim - inicio) / (1000 * 60 * 60 * 24));
    const titulo = `${regiao.nome} — ${dias} dia${dias > 1 ? 's' : ''}`;

    await conn.beginTransaction();

    // Busca locais da região filtrados por preferências e orçamento
    let sqlLocais = 'SELECT * FROM locais WHERE regiao_id = ?';
    const paramsLocais = [regiao_id];

    if (preferencias && preferencias.length > 0) {
      sqlLocais += ` AND categoria IN (${preferencias.map(() => '?').join(',')})`;
      paramsLocais.push(...preferencias);
    }

    if (nivel_orcamento === 'economico') sqlLocais += ' AND custo_medio <= 30';
    if (nivel_orcamento === 'moderado')  sqlLocais += ' AND custo_medio <= 100';

    sqlLocais += ' ORDER BY avaliacao DESC LIMIT 20';
    const [locaisRows] = await conn.execute(sqlLocais, paramsLocais);

    // Cria o roteiro
    const [roteiroResult] = await conn.execute(
      'INSERT INTO roteiros (usuario_id, regiao_id, titulo, data_inicio, data_fim, nivel_orcamento) VALUES (?, ?, ?, ?, ?, ?)',
      [usuario_id, regiao_id, titulo, data_inicio, data_fim, nivel_orcamento || 'moderado']
    );
    const roteiro_id = roteiroResult.insertId;

    // Salva preferências
    if (preferencias && preferencias.length > 0) {
      for (const pref of preferencias) {
        await conn.execute(
          'INSERT INTO preferencias_roteiro (roteiro_id, tipo) VALUES (?, ?)',
          [roteiro_id, pref]
        );
      }
    }

    // Distribui locais pelos dias
    let custo_total = 0;
    const locaisPorDia = Math.max(2, Math.ceil(locaisRows.length / dias));

    for (let d = 0; d < dias; d++) {
      const dataDodia = new Date(inicio);
      dataDodia.setDate(inicio.getDate() + d);
      const dataStr = dataDodia.toISOString().split('T')[0];

      const locaisDoDia = locaisRows.slice(d * locaisPorDia, (d + 1) * locaisPorDia);
      const custo_dia   = locaisDoDia.reduce((s, l) => s + Number(l.custo_medio), 0);
      custo_total += custo_dia;

      const [diaResult] = await conn.execute(
        'INSERT INTO dias_roteiro (roteiro_id, numero_dia, data, custo_dia) VALUES (?, ?, ?, ?)',
        [roteiro_id, d + 1, dataStr, custo_dia]
      );
      const dia_id = diaResult.insertId;

      const horarios = ['09:00', '14:00', '17:00', '20:00'];
      for (let i = 0; i < locaisDoDia.length; i++) {
        await conn.execute(
          'INSERT INTO itens_roteiro (dia_id, local_id, horario, ordem) VALUES (?, ?, ?, ?)',
          [dia_id, locaisDoDia[i].id, horarios[i] || '10:00', i]
        );
      }
    }

    // Atualiza custo total
    await conn.execute(
      'UPDATE roteiros SET custo_total = ? WHERE id = ?',
      [custo_total, roteiro_id]
    );

    await conn.commit();

    // Retorna roteiro completo
    const roteiro = await getRoteiroCompleto(roteiro_id);
    return res.status(201).json({ message: 'Roteiro criado com sucesso.', roteiro });

  } catch (err) {
    await conn.rollback();
    console.error(err);
    return res.status(500).json({ error: 'Erro ao criar roteiro.' });
  } finally {
    conn.release();
  }
});

// ── RF-08: Histórico de roteiros ─────────────────────────────────────────────
// GET /api/roteiros
router.get('/', async (req, res) => {
  try {
    const roteiros = await query(`
      SELECT r.*, rg.nome AS regiao_nome, rg.slug AS regiao_slug
      FROM roteiros r
      JOIN regioes rg ON r.regiao_id = rg.id
      WHERE r.usuario_id = ?
      ORDER BY r.criado_em DESC
    `, [req.usuario.id]);

    return res.json(roteiros);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar roteiros.' });
  }
});

// GET /api/roteiros/:id — detalhes de um roteiro
router.get('/:id', async (req, res) => {
  try {
    const roteiro = await getRoteiroCompleto(req.params.id, req.usuario.id);
    if (!roteiro) return res.status(404).json({ error: 'Roteiro não encontrado.' });
    return res.json(roteiro);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar roteiro.' });
  }
});

// ── RF-05: Visualizar custo total ─────────────────────────────────────────────
// GET /api/roteiros/:id/custo
router.get('/:id/custo', async (req, res) => {
  try {
    const [roteiro] = await query(
      'SELECT id, titulo, custo_total FROM roteiros WHERE id = ? AND usuario_id = ?',
      [req.params.id, req.usuario.id]
    );
    if (!roteiro) return res.status(404).json({ error: 'Roteiro não encontrado.' });

    const dias = await query(
      'SELECT numero_dia, data, custo_dia FROM dias_roteiro WHERE roteiro_id = ? ORDER BY numero_dia',
      [roteiro.id]
    );
    return res.json({ ...roteiro, custo_por_dia: dias });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao calcular custo.' });
  }
});

// ── RF-06: Exportar roteiro (gera texto estruturado) ─────────────────────────
// GET /api/roteiros/:id/export
router.get('/:id/export', async (req, res) => {
  try {
    const roteiro = await getRoteiroCompleto(req.params.id, req.usuario.id);
    if (!roteiro) return res.status(404).json({ error: 'Roteiro não encontrado.' });

    let texto = `CONEXÃO GAÚCHA — ROTEIRO DE VIAGEM\n`;
    texto += `${'='.repeat(40)}\n`;
    texto += `Destino : ${roteiro.regiao_nome}\n`;
    texto += `Título  : ${roteiro.titulo}\n`;
    texto += `Período : ${roteiro.data_inicio} até ${roteiro.data_fim}\n`;
    texto += `Orçamento: ${roteiro.nivel_orcamento}\n`;
    texto += `Custo total estimado: R$ ${Number(roteiro.custo_total).toFixed(2)}\n\n`;

    for (const dia of roteiro.dias) {
      texto += `${'─'.repeat(40)}\n`;
      texto += `DIA ${dia.numero_dia} — ${dia.data} | Custo: R$ ${Number(dia.custo_dia).toFixed(2)}\n`;
      for (const item of dia.itens) {
        texto += `  ${item.horario || '--:--'} | ${item.local_nome} (${item.cidade})\n`;
        texto += `         ${item.descricao}\n`;
        texto += `         Custo: R$ ${Number(item.custo_medio).toFixed(2)} | Duração: ${item.duracao_estimada}\n`;
      }
      texto += '\n';
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="roteiro-${roteiro.id}.txt"`);
    return res.send(texto);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao exportar roteiro.' });
  }
});

// ── RF-07: Compartilhar roteiro ───────────────────────────────────────────────
// GET /api/roteiros/:id/share
router.get('/:id/share', async (req, res) => {
  try {
    const [roteiro] = await query(
      'SELECT id, titulo FROM roteiros WHERE id = ? AND usuario_id = ?',
      [req.params.id, req.usuario.id]
    );
    if (!roteiro) return res.status(404).json({ error: 'Roteiro não encontrado.' });

    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    const link = `${baseUrl}/roteiro/${roteiro.id}`;

    return res.json({
      message: 'Link de compartilhamento gerado.',
      link,
      titulo: roteiro.titulo,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao gerar link.' });
  }
});

// DELETE /api/roteiros/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM roteiros WHERE id = ? AND usuario_id = ?',
      [req.params.id, req.usuario.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Roteiro não encontrado.' });
    return res.json({ message: 'Roteiro excluído com sucesso.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao excluir roteiro.' });
  }
});

// ── Helper: busca roteiro completo com dias e itens ──────────────────────────
async function getRoteiroCompleto(id, usuario_id = null) {
  let sql = `
    SELECT r.*, rg.nome AS regiao_nome, rg.slug AS regiao_slug
    FROM roteiros r JOIN regioes rg ON r.regiao_id = rg.id
    WHERE r.id = ?
  `;
  const params = [id];
  if (usuario_id) { sql += ' AND r.usuario_id = ?'; params.push(usuario_id); }

  const [roteiro] = await query(sql, params);
  if (!roteiro) return null;

  const dias = await query(
    'SELECT * FROM dias_roteiro WHERE roteiro_id = ? ORDER BY numero_dia',
    [id]
  );

  for (const dia of dias) {
    dia.itens = await query(`
      SELECT ir.horario, ir.ordem,
             l.id AS local_id, l.nome AS local_nome, l.cidade,
             l.descricao, l.custo_medio, l.avaliacao,
             l.duracao_estimada, l.imagem_url, l.categoria,
             l.latitude, l.longitude
      FROM itens_roteiro ir
      JOIN locais l ON ir.local_id = l.id
      WHERE ir.dia_id = ?
      ORDER BY ir.ordem
    `, [dia.id]);
  }

  roteiro.dias = dias;

  roteiro.preferencias = (await query(
    'SELECT tipo FROM preferencias_roteiro WHERE roteiro_id = ?', [id]
  )).map(p => p.tipo);

  return roteiro;
}

module.exports = router;
