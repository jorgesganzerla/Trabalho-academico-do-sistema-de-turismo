require('dotenv').config();
const { query, initTables } = require('./db');

async function seed() {
  await initTables();

const regioes = [
  ['Serra Gaúcha',          'serra-gaucha',    'Gramado, Canela, Bento Gonçalves e região serrana',          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80'],
  ['Litoral Gaúcho',        'litoral-gaucho',  'Torres, Tramandaí, Capão da Canoa',                          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80'],
  ['Missões',               'missoes',         'São Miguel das Missões, Santo Ângelo',                       'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400&q=80'],
  ['Campanha Gaúcha',       'campanha-gaucha', 'Bagé, Santana do Livramento, Dom Pedrito',                   'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80'],
  ['Porto Alegre e Região', 'porto-alegre',    'Porto Alegre, Novo Hamburgo, São Leopoldo',                  'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&q=80'],
  ['Serra do Nordeste',     'serra-nordeste',  'Vacaria, Bom Jesus, São Francisco de Paula',                 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80'],
  ['Vale dos Vinhedos',     'vale-vinhedos',   'Garibaldi, Carlos Barbosa, Monte Belo do Sul',               'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80'],
];

for (const [nome, slug, descricao, imagem_url] of regioes) {
  await query(
    'INSERT IGNORE INTO regioes (nome, slug, descricao, imagem_url) VALUES (?, ?, ?, ?)',
    [nome, slug, descricao, imagem_url]
  );
}

  // Busca IDs das regiões inseridas
  const regsRows = await query('SELECT id, slug FROM regioes');
  const regId = {};
  for (const r of regsRows) regId[r.slug] = r.id;

  const locais = [
    // Serra Gaúcha
    [regId['serra-gaucha'],    'Parque do Caracol',    'Canela',                 'Cachoeira de 131m em plena mata nativa. Trilhas e tirolesa.',           -29.3289, -50.8497, 38,  4.8, '3-4 horas', 'natureza'],
    [regId['serra-gaucha'],    'Rua Coberta',          'Gramado',                'Centro comercial com chocolates artesanais e produtos coloniais.',       -29.3794, -50.8751, 0,   4.5, '2-3 horas', 'cultura'],
    [regId['serra-gaucha'],    'Mundo a Vapor',        'Gramado',                'Museu interativo com miniaturas e trens a vapor.',                       -29.3801, -50.8734, 60,  4.7, '2-3 horas', 'cultura'],
    [regId['serra-gaucha'],    'Vale dos Vinhedos',    'Bento Gonçalves',        'Rota do vinho com degustação em vinícolas premiadas.',                   -29.1563, -51.5318, 80,  4.9, '4-5 horas', 'gastronomia'],
    [regId['serra-gaucha'],    'Lago Negro',           'Gramado',                'Lago com pedalinhos rodeado de pinheiros e araucárias.',                 -29.3766, -50.8689, 25,  4.6, '1-2 horas', 'natureza'],
    // Litoral
    [regId['litoral-gaucho'],  'Praia de Torres',      'Torres',                 'Praias com falésias e pedras basálticas únicas no Brasil.',              -29.3351, -49.7262, 0,   4.6, '4-5 horas', 'natureza'],
    [regId['litoral-gaucho'],  'Parque da Guarita',    'Torres',                 'Falésias e trilhas com vista panorâmica do oceano.',                     -29.3508, -49.7191, 0,   4.7, '2-3 horas', 'natureza'],
    // Missões
    [regId['missoes'],         'Ruínas de São Miguel', 'São Miguel das Missões', 'Patrimônio Mundial da UNESCO. Ruínas jesuíticas do século XVII.',        -28.5570, -54.6946, 20,  4.9, '3-4 horas', 'historia'],
    [regId['missoes'],         'Museu das Missões',    'São Miguel das Missões', 'Acervo de esculturas e peças das reduções jesuíticas.',                  -28.5577, -54.6952, 10,  4.5, '1-2 horas', 'historia'],
    // Porto Alegre
    [regId['porto-alegre'],    'Mercado Público',      'Porto Alegre',           'Mercado histórico com gastronomia típica gaúcha e artesanato.',          -30.0277, -51.2287, 0,   4.4, '2-3 horas', 'gastronomia'],
    [regId['porto-alegre'],    'Parque Farroupilha',   'Porto Alegre',           'O maior parque urbano da cidade, ideal para passeios e piqueniques.',    -30.0384, -51.2139, 0,   4.6, '2-3 horas', 'natureza'],
    // Vale dos Vinhedos
    [regId['vale-vinhedos'],   'Vinícola Miolo',       'Bento Gonçalves',        'Uma das mais premiadas vinícolas do Brasil, com tour e degustação.',     -29.1721, -51.5604, 60,  4.8, '2-3 horas', 'gastronomia'],
    [regId['vale-vinhedos'],   'Linha Leopoldina',     'Garibaldi',              'Estrada rural com vinhedos centenários e arquitetura colonial italiana.', -29.2498, -51.5318, 0,   4.5, '2-3 horas', 'cultura'],
  ];

  for (const l of locais) {
    await query(`
      INSERT IGNORE INTO locais
        (regiao_id, nome, cidade, descricao, latitude, longitude, custo_medio, avaliacao, duracao_estimada, categoria)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, l);
  }

  console.log('✅ Seed concluído! Regiões e locais inseridos.');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
