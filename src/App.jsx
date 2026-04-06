import { useState } from "react";

// ─── THEME / DESIGN TOKENS ───────────────────────────────────────────────────
// Palette: deep teal (#0D3349), mid teal (#1A5276), accent cyan (#2E9EC4),
//          light bg (#EBF4F8), card white (#FFFFFF), text dark (#0D1F2D)
// Font: using Sora (display) + DM Sans (body) via Google Fonts import in index
// ─────────────────────────────────────────────────────────────────────────────

const REGIONS = [
  { id: "serra", name: "Serra Gaúcha", cities: "Gramado · Canela · Bento Gonçalves", img: "https://images.unsplash.com/photo-1599413987323-b2b8c0d7d9c8?w=400&q=80" },
  { id: "litoral", name: "Litoral Gaúcho", cities: "Torres · Tramandaí · Capão da Canoa", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80" },
  { id: "missoes", name: "Missões", cities: "São Miguel das Missões · Santo Ângelo", img: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400&q=80" },
  { id: "campanha", name: "Campanha Gaúcha", cities: "Bagé · Santana do Livramento · Dom Pedrito", img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80" },
  { id: "poa", name: "Porto Alegre e Região", cities: "Porto Alegre · Novo Hamburgo · São Leopoldo", img: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&q=80" },
  { id: "nordeste", name: "Serra do Nordeste", cities: "Vacaria · Bom Jesus · São Francisco de Paula", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80" },
  { id: "vinhedos", name: "Vale dos Vinhedos", cities: "Garibaldi · Carlos Barbosa · Monte Belo do Sul", img: "https://images.unsplash.com/photo-1566903209804-1b26cc4e44a3?w=400&q=80" },
];

const PREFERENCES = [
  { id: "natureza", label: "Natureza", emoji: "🌿" },
  { id: "cultura", label: "Cultura", emoji: "🏛️" },
  { id: "gastronomia", label: "Gastronomia", emoji: "🍷" },
  { id: "aventura", label: "Aventura", emoji: "🏕️" },
  { id: "historia", label: "História", emoji: "🏰" },
  { id: "religioso", label: "Religioso", emoji: "⛪" },
];

const BUDGETS = [
  { id: "economico", label: "Econômico", desc: "Atrações gratuitas e de baixo custo", color: "text-green-500", emoji: "💚" },
  { id: "moderado", label: "Moderado", desc: "Equilíbrio entre custo e experiência", color: "text-yellow-500", emoji: "💛" },
  { id: "premium", label: "Premium", desc: "As melhores experiências sem limites", color: "text-blue-400", emoji: "💎" },
];

const SAMPLE_ITINERARY = {
  region: "Serra Gaúcha",
  days: 4,
  cost: "R$ 732",
  budget: "Moderado",
  period: "ter., 20 de out. → sex., 01 de jan.",
  tags: ["cultura", "aventura"],
  img: "https://images.unsplash.com/photo-1566903209804-1b26cc4e44a3?w=800&q=80",
  schedule: [
    {
      day: 1,
      date: "ter., 20 de out.",
      cost: "R$ 173",
      places: [
        {
          time: "09:00",
          name: "Parque do Caracol",
          city: "Canela",
          desc: "Um dos cartões-postais do RS, com cachoeira de 131m em plena mata nativa. Trilhas, tirolesa e mirante panorâmico.",
          cost: "R$ 38 por pessoa (entrada)",
          duration: "3–4 horas",
          rating: 4.8,
          img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80",
        },
        {
          time: "14:00",
          name: "Rua Coberta de Gramado",
          city: "Gramado",
          desc: "Centro comercial e gastronômico da cidade, ideal para compras de chocolate artesanal e produtos coloniais.",
          cost: "Gratuito",
          duration: "2–3 horas",
          rating: 4.6,
          img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80",
        },
      ],
    },
    {
      day: 2,
      date: "qua., 21 de out.",
      cost: "R$ 210",
      places: [
        {
          time: "10:00",
          name: "Vale dos Vinhedos",
          city: "Bento Gonçalves",
          desc: "Rota do vinho com degustação em vinícolas premiadas, paisagens de tirar o fôlego e gastronomia italiana.",
          cost: "R$ 80 por pessoa",
          duration: "4–5 horas",
          rating: 4.9,
          img: "https://images.unsplash.com/photo-1566903209804-1b26cc4e44a3?w=400&q=80",
        },
      ],
    },
  ],
};

const HISTORY = [
  { id: 1, region: "Serra Gaúcha", days: 74, locals: 222, cost: "R$ 14.018", date: "20 de out. de 2026", img: "https://images.unsplash.com/photo-1566903209804-1b26cc4e44a3?w=400&q=80", current: true },
  { id: 2, region: "Serra Gaúcha", days: 4, locals: 12, cost: "R$ 732", date: "10 de out. de 2025", img: "https://images.unsplash.com/photo-1566903209804-1b26cc4e44a3?w=400&q=80", current: false },
  { id: 3, region: "Litoral Gaúcho", days: 4, locals: 10, cost: "R$ 492", date: "20 de dez. de 2025", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80", current: false },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function NavBar({ active, setScreen }) {
  const items = [
    { id: "home", label: "Início", icon: "🏠" },
    { id: "planner", label: "Planejar", icon: "🗺️" },
    { id: "history", label: "Histórico", icon: "🕐" },
    { id: "profile", label: "Perfil", icon: "👤" },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex z-50 shadow-lg max-w-screen-xl mx-auto">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setScreen(item.id)}
          className={`flex-1 py-3 flex flex-col items-center gap-0.5 text-xs font-medium transition-colors ${
            active === item.id ? "text-teal-700" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.label}</span>
          {active === item.id && <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-0.5" />}
        </button>
      ))}
    </nav>
  );
}

function PageWrapper({ children, noNav, screen, setScreen }) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="relative w-full max-w-sm min-h-screen bg-slate-50 flex flex-col shadow-2xl">
        <div className={`flex-1 overflow-y-auto ${noNav ? "" : "pb-20"}`}>{children}</div>
        {!noNav && <NavBar active={screen} setScreen={setScreen} />}
      </div>
    </div>
  );
}

// ─── SCREEN: LOGIN ────────────────────────────────────────────────────────────
function LoginScreen({ setScreen }) {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  return (
    <PageWrapper noNav>
      {/* Header teal */}
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 px-6 pt-12 pb-10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5" />
        <button className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white mb-6">←</button>
        <p className="text-cyan-300 text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5 mb-2">
          <span>🧭</span> Conexão Gaúcha
        </p>
        <h1 className="text-white text-3xl font-bold leading-tight">
          Bem-vindo de volta! 👋
        </h1>
        <p className="text-teal-200 text-sm mt-1">Entre para continuar seus roteiros</p>
      </div>

      {/* Form card */}
      <div className="bg-slate-50 rounded-t-3xl -mt-4 px-6 pt-8 pb-10 flex flex-col gap-5 relative z-10">
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-sm font-semibold">E-mail</label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between">
            <label className="text-slate-700 text-sm font-semibold">Senha</label>
            <button className="text-teal-600 text-sm font-medium hover:underline">Esqueci a senha</button>
          </div>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition pr-12"
            />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <button
          onClick={() => setScreen("home")}
          className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-teal-900/30 active:scale-95"
        >
          Entrar
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-slate-400 text-xs">ou</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <p className="text-center text-slate-500 text-sm">
          Não tem conta?{" "}
          <button onClick={() => setScreen("register")} className="text-teal-700 font-bold hover:underline">
            Cadastre-se grátis
          </button>
        </p>
      </div>
    </PageWrapper>
  );
}

// ─── SCREEN: REGISTER ────────────────────────────────────────────────────────
function RegisterScreen({ setScreen }) {
  const [showPw, setShowPw] = useState(false);

  return (
    <PageWrapper noNav>
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 px-6 pt-12 pb-10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
        <button onClick={() => setScreen("login")} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white mb-6">←</button>
        <p className="text-cyan-300 text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5 mb-2">
          <span>🧭</span> Conexão Gaúcha
        </p>
        <h1 className="text-white text-3xl font-bold leading-tight">Criar sua conta 🎒</h1>
        <p className="text-teal-200 text-sm mt-1">Comece a planejar suas aventuras gaúchas</p>
      </div>

      <div className="bg-slate-50 rounded-t-3xl -mt-4 px-6 pt-8 pb-10 flex flex-col gap-4 relative z-10">
        {[
          { label: "Nome completo", placeholder: "João da Silva", type: "text" },
          { label: "E-mail", placeholder: "seu@email.com", type: "email" },
        ].map((f) => (
          <div key={f.label} className="flex flex-col gap-1.5">
            <label className="text-slate-700 text-sm font-semibold">{f.label}</label>
            <input type={f.type} placeholder={f.placeholder} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition" />
          </div>
        ))}

        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-sm font-semibold">Senha</label>
          <div className="relative">
            <input type={showPw ? "text" : "password"} placeholder="Mínimo 6 caracteres" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition pr-12" />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-sm font-semibold">Confirmar senha</label>
          <input type="password" placeholder="Repita a senha" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition" />
        </div>

        <button onClick={() => setScreen("home")} className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-teal-900/30 active:scale-95 mt-2">
          Criar conta
        </button>

        <p className="text-center text-slate-500 text-sm">
          Já tem conta?{" "}
          <button onClick={() => setScreen("login")} className="text-teal-700 font-bold hover:underline">Fazer login</button>
        </p>
      </div>
    </PageWrapper>
  );
}

// ─── SCREEN: HOME ─────────────────────────────────────────────────────────────
function HomeScreen({ setScreen }) {
  const featured = [
    { name: "Serra Gaúcha", sub: "Gramado", img: "https://images.unsplash.com/photo-1566903209804-1b26cc4e44a3?w=400&q=80" },
    { name: "Litoral Gaúcho", sub: "Torres", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80" },
    { name: "Missões", sub: "São Miguel", img: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400&q=80" },
  ];
  const recent = [
    { name: "Serra Gaúcha — 4 dias", region: "Serra Gaúcha", date: "10 de out. de 2025", cost: "R$ 732", img: "https://images.unsplash.com/photo-1566903209804-1b26cc4e44a3?w=200&q=80" },
    { name: "Litoral Gaúcho — 4 dias", region: "Litoral Gaúcho", date: "20 de dez. de 2025", cost: "R$ 492", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80" },
  ];

  return (
    <PageWrapper screen="home" setScreen={setScreen}>
      {/* Top bar */}
      <div className="px-5 pt-8 pb-4 bg-white flex justify-between items-start">
        <div>
          <p className="text-slate-500 text-sm">Olá, Yan 👋</p>
          <h1 className="text-slate-900 text-2xl font-bold">Para onde vamos?</h1>
        </div>
        <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center relative">
          🔔
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-500 rounded-full border border-white" />
        </button>
      </div>

      {/* Search */}
      <div className="px-5 pb-4 bg-white">
        <div className="bg-slate-100 rounded-xl flex items-center gap-2 px-4 py-3">
          <span className="text-slate-400">🔍</span>
          <input placeholder="Buscar destino ou atividade..." className="bg-transparent flex-1 text-sm text-slate-600 placeholder-slate-400 focus:outline-none" />
        </div>
      </div>

      {/* CTA Banner */}
      <div className="px-5 pb-5 bg-white">
        <div className="bg-gradient-to-br from-teal-800 to-teal-600 rounded-2xl px-5 py-5 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10" />
          <p className="text-teal-200 text-xs mb-1">Pronto para explorar?</p>
          <h2 className="text-white font-bold text-lg leading-snug mb-4">Crie seu roteiro personalizado</h2>
          <button
            onClick={() => setScreen("planner")}
            className="bg-cyan-400 hover:bg-cyan-300 text-teal-900 font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all active:scale-95"
          >
            + Planejar viagem
          </button>
        </div>
      </div>

      {/* Destinos em destaque */}
      <div className="bg-white pb-5">
        <div className="px-5 flex justify-between items-center mb-3">
          <h3 className="text-slate-800 font-bold">Destinos em destaque</h3>
          <button className="text-teal-600 text-sm font-medium">Ver todos →</button>
        </div>
        <div className="flex gap-3 px-5 overflow-x-auto scrollbar-hide">
          {featured.map((d) => (
            <div key={d.name} className="relative flex-shrink-0 w-40 h-24 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform">
              <img src={d.img} alt={d.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-2 left-2">
                <p className="text-white text-xs font-bold">{d.name}</p>
                <p className="text-white/70 text-[10px] flex items-center gap-0.5">📍 {d.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roteiros recentes */}
      <div className="bg-white mt-2 px-5 pb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-slate-800 font-bold">Roteiros recentes</h3>
          <button onClick={() => setScreen("history")} className="text-teal-600 text-sm font-medium">Histórico →</button>
        </div>
        <div className="flex flex-col gap-3">
          {recent.map((r) => (
            <div key={r.name} onClick={() => setScreen("itinerary")} className="flex gap-3 bg-slate-50 rounded-xl p-3 cursor-pointer hover:bg-slate-100 transition">
              <img src={r.img} alt={r.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-slate-800 font-semibold text-sm truncate">{r.name}</p>
                <p className="text-slate-400 text-xs flex items-center gap-0.5 mt-0.5">📍 {r.region}</p>
                <p className="text-slate-400 text-xs flex items-center gap-0.5 mt-0.5">📅 {r.date}</p>
              </div>
              <span className="text-teal-700 font-bold text-sm whitespace-nowrap self-center">{r.cost}</span>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

// ─── SCREEN: PLANNER STEP 1 ───────────────────────────────────────────────────
function PlannerStep1({ setScreen, setPlanData }) {
  const [selected, setSelected] = useState(null);

  return (
    <PageWrapper screen="planner" setScreen={setScreen}>
      <div className="px-5 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setScreen("home")} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-sm">←</button>
          <div className="flex-1">
            <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Etapa 1 de 3</p>
            <div className="flex gap-1.5 justify-center">
              <div className="h-1.5 w-10 rounded-full bg-teal-600" />
              <div className="h-1.5 w-10 rounded-full bg-slate-200" />
              <div className="h-1.5 w-10 rounded-full bg-slate-200" />
            </div>
          </div>
          <div className="w-8" />
        </div>

        <h1 className="text-slate-900 text-2xl font-bold">Escolha a região 🗺️</h1>
        <p className="text-slate-500 text-sm mt-1 mb-5">Onde você quer explorar no RS?</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {REGIONS.map((r) => (
            <div
              key={r.id}
              onClick={() => setSelected(r.id)}
              className={`relative rounded-xl overflow-hidden cursor-pointer transition-all ${selected === r.id ? "ring-2 ring-teal-500 scale-95" : "hover:scale-95"}`}
            >
              <img src={r.img} alt={r.name} className="w-full h-28 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-bold leading-tight">{r.name}</p>
                <p className="text-white/60 text-[9px] leading-tight mt-0.5">{r.cities}</p>
              </div>
              {selected === r.id && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs">✓</div>
              )}
            </div>
          ))}
        </div>

        <button
          disabled={!selected}
          onClick={() => { setPlanData((p) => ({ ...p, region: selected })); setScreen("planner2"); }}
          className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${selected ? "bg-teal-800 text-white hover:bg-teal-900 active:scale-95 shadow-lg shadow-teal-900/20" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
        >
          Continuar →
        </button>
      </div>
    </PageWrapper>
  );
}

// ─── SCREEN: PLANNER STEP 2 ───────────────────────────────────────────────────
function PlannerStep2({ setScreen, planData, setPlanData }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const region = REGIONS.find((r) => r.id === planData.region);

  return (
    <PageWrapper screen="planner" setScreen={setScreen}>
      <div className="px-5 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setScreen("planner")} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-sm">←</button>
          <div className="flex-1">
            <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Etapa 2 de 3</p>
            <div className="flex gap-1.5 justify-center">
              <div className="h-1.5 w-10 rounded-full bg-teal-600" />
              <div className="h-1.5 w-10 rounded-full bg-teal-600" />
              <div className="h-1.5 w-10 rounded-full bg-slate-200" />
            </div>
          </div>
          <div className="w-8" />
        </div>

        <h1 className="text-slate-900 text-2xl font-bold">Quando viajar? 📅</h1>
        <p className="text-slate-500 text-sm mt-1 mb-5">Defina as datas da sua viagem para {region?.name}</p>

        {region && (
          <div className="relative rounded-2xl overflow-hidden mb-6 h-36">
            <img src={region.img} alt={region.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <p className="absolute bottom-3 left-3 text-white text-sm font-semibold flex items-center gap-1">📍 {region.name}</p>
          </div>
        )}

        {[
          { label: "📅 Data de início", value: start, set: setStart },
          { label: "📅 Data de retorno", value: end, set: setEnd },
        ].map((f) => (
          <div key={f.label} className="flex flex-col gap-1.5 mb-4">
            <label className="text-slate-700 text-sm font-semibold">{f.label}</label>
            <input
              type="date"
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
            />
          </div>
        ))}

        <button
          disabled={!start || !end}
          onClick={() => { setPlanData((p) => ({ ...p, start, end })); setScreen("planner3"); }}
          className={`w-full py-4 rounded-2xl font-bold text-sm mt-2 transition-all ${start && end ? "bg-teal-800 text-white hover:bg-teal-900 active:scale-95 shadow-lg" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
        >
          Continuar →
        </button>
      </div>
    </PageWrapper>
  );
}

// ─── SCREEN: PLANNER STEP 3 ───────────────────────────────────────────────────
function PlannerStep3({ setScreen, setPlanData }) {
  const [prefs, setPrefs] = useState([]);
  const [budget, setBudget] = useState("moderado");
  const [loading, setLoading] = useState(false);

  const toggle = (id) => setPrefs((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const generate = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setScreen("itinerary"); }, 2200);
  };

  if (loading) return (
    <PageWrapper noNav>
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-8">
        <div className="w-20 h-20 rounded-full bg-teal-800 flex items-center justify-center text-4xl animate-bounce">🧭</div>
        <h2 className="text-slate-800 text-xl font-bold text-center">Montando seu roteiro perfeito…</h2>
        <p className="text-slate-500 text-sm text-center">Buscando os melhores locais da região para você</p>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-teal-600 rounded-full animate-pulse w-3/4" />
        </div>
      </div>
    </PageWrapper>
  );

  return (
    <PageWrapper screen="planner" setScreen={setScreen}>
      <div className="px-5 pt-8 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setScreen("planner2")} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-sm">←</button>
          <div className="flex-1">
            <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Etapa 3 de 3</p>
            <div className="flex gap-1.5 justify-center">
              <div className="h-1.5 w-10 rounded-full bg-teal-600" />
              <div className="h-1.5 w-10 rounded-full bg-teal-600" />
              <div className="h-1.5 w-10 rounded-full bg-teal-600" />
            </div>
          </div>
          <div className="w-8" />
        </div>

        <h1 className="text-slate-900 text-2xl font-bold">Suas preferências ✨</h1>
        <p className="text-slate-500 text-sm mt-1 mb-6">O que você mais curte? (opcional)</p>

        <div className="grid grid-cols-3 gap-3 mb-7">
          {PREFERENCES.map((p) => (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-all ${prefs.includes(p.id) ? "border-teal-500 bg-teal-50 text-teal-800" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}
            >
              <span className="text-xl">{p.emoji}</span>
              {p.label}
            </button>
          ))}
        </div>

        <div className="mb-7">
          <p className="text-slate-700 font-semibold text-sm flex items-center gap-1.5 mb-3">💲 Nível de orçamento</p>
          <div className="flex flex-col gap-2">
            {BUDGETS.map((b) => (
              <button
                key={b.id}
                onClick={() => setBudget(b.id)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all text-left ${budget === b.id ? "bg-teal-800 border-teal-800 text-white" : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"}`}
              >
                <span className="text-xl">{b.emoji}</span>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${budget === b.id ? "text-white" : ""}`}>{b.label}</p>
                  <p className={`text-xs ${budget === b.id ? "text-teal-200" : "text-slate-400"}`}>{b.desc}</p>
                </div>
                {budget === b.id && <span className="text-cyan-300">✓</span>}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generate}
          className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold py-4 rounded-2xl text-sm transition-all shadow-lg shadow-teal-900/20 active:scale-95 flex items-center justify-center gap-2"
        >
          🧭 Gerar roteiro agora!
        </button>
      </div>
    </PageWrapper>
  );
}

// ─── SCREEN: ITINERARY ────────────────────────────────────────────────────────
function ItineraryScreen({ setScreen }) {
  const it = SAMPLE_ITINERARY;
  return (
    <PageWrapper screen="home" setScreen={setScreen}>
      {/* Hero image */}
      <div className="relative h-56">
        <img src={it.img} alt={it.region} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <button onClick={() => setScreen("home")} className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center text-white text-sm backdrop-blur-sm">←</button>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center text-white text-sm backdrop-blur-sm">⬇</button>
            <button className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center text-white text-sm backdrop-blur-sm">↗</button>
          </div>
        </div>
        <div className="absolute bottom-4 left-4">
          <p className="text-white/70 text-xs flex items-center gap-1">📍 {it.region}</p>
          <h1 className="text-white text-xl font-bold">{it.region} — {it.days} dias</h1>
        </div>
      </div>

      {/* Summary card */}
      <div className="mx-4 -mt-4 relative z-10 bg-white rounded-2xl shadow-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">{it.budget}</span>
          <span className="text-teal-800 font-bold text-lg flex items-center gap-1">📋 {it.cost === "R$ 732" ? "R$ 732" : it.cost}</span>
        </div>
        <div className="flex gap-4 text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1">📅 {it.period}</span>
          <span className="flex items-center gap-1">⏱ {it.days} dias</span>
        </div>
        <div className="flex gap-2">
          {it.tags.map((t) => <span key={t} className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full">{t}</span>)}
        </div>
      </div>

      {/* Days */}
      <div className="px-4 pb-8 flex flex-col gap-5">
        {it.schedule.map((day) => (
          <div key={day.day}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-teal-800 text-white text-xs font-bold flex items-center justify-center">{day.day}</div>
                <div>
                  <p className="text-slate-800 font-bold text-sm">Dia {day.day}</p>
                  <p className="text-slate-400 text-xs">{day.date}</p>
                </div>
              </div>
              <span className="text-slate-600 text-sm font-semibold">💲 {day.cost}</span>
            </div>

            <div className="flex flex-col gap-3">
              {day.places.map((place) => (
                <div key={place.name} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                  <div className="relative">
                    <img src={place.img} alt={place.name} className="w-full h-36 object-cover" />
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm font-medium">{place.time}</div>
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-lg font-bold flex items-center gap-0.5">⭐ {place.rating}</div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-slate-800 font-bold text-base">{place.name}</h4>
                      <span className="text-slate-400 text-xs flex items-center gap-0.5 ml-2 shrink-0">📍 {place.city}</span>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed mb-3">{place.desc}</p>
                    <div className="flex gap-2 mb-3">
                      <span className="bg-teal-50 text-teal-700 text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1">💲 {place.cost}</span>
                      <span className="bg-slate-50 text-slate-600 text-xs px-3 py-1.5 rounded-full flex items-center gap-1">⏱ {place.duration}</span>
                    </div>
                    <button className="w-full border border-teal-200 text-teal-700 text-xs font-semibold py-2.5 rounded-xl hover:bg-teal-50 transition flex items-center justify-center gap-1.5">
                      🗺️ Ver no Google Maps
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

// ─── SCREEN: HISTORY ──────────────────────────────────────────────────────────
function HistoryScreen({ setScreen }) {
  const current = HISTORY.filter((h) => h.current);
  const past = HISTORY.filter((h) => !h.current);

  return (
    <PageWrapper screen="history" setScreen={setScreen}>
      <div className="px-5 pt-8 pb-8">
        <h1 className="text-slate-900 text-2xl font-bold">Histórico de viagens</h1>
        <p className="text-slate-500 text-sm mt-1 mb-5">Todos os seus roteiros em um lugar</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { emoji: "🗺️", val: "4", label: "Roteiros" },
            { emoji: "📍", val: "3", label: "Regiões" },
            { emoji: "💰", val: "R$ 15.482", label: "Total gasto" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-3 text-center shadow-sm border border-slate-100">
              <p className="text-2xl mb-0.5">{s.emoji}</p>
              <p className="text-slate-800 font-bold text-sm">{s.val}</p>
              <p className="text-slate-400 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Current */}
        <h3 className="text-slate-800 font-bold mb-3">Meus roteiros criados</h3>
        <div className="flex flex-col gap-3 mb-6">
          {current.map((h) => (
            <HistoryCard key={h.id} h={h} setScreen={setScreen} />
          ))}
        </div>

        {/* Past */}
        <h3 className="text-slate-800 font-bold mb-3">Roteiros anteriores</h3>
        <div className="flex flex-col gap-3">
          {past.map((h) => (
            <HistoryCard key={h.id} h={h} setScreen={setScreen} />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

function HistoryCard({ h, setScreen }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
      <div className="relative h-24">
        <img src={h.img} alt={h.region} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end">
          <div>
            <p className="text-white/60 text-[10px] flex items-center gap-0.5">📍 {h.region}</p>
            <p className="text-white text-sm font-bold">{h.region} — {h.days} dias</p>
          </div>
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg">{h.cost}</span>
        </div>
      </div>
      <div className="px-3 py-2.5 flex items-center gap-3 flex-wrap">
        <span className="text-slate-400 text-xs flex items-center gap-1">📅 {h.date}</span>
        <span className="text-slate-400 text-xs flex items-center gap-1">⏱ {h.days}d · {h.locals} locais</span>
        {h.current && (
          <button className="ml-1 text-slate-400 text-base hover:text-red-400 transition">🗑</button>
        )}
        <button onClick={() => setScreen("itinerary")} className="ml-auto bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold px-4 py-1.5 rounded-xl transition">
          Ver roteiro
        </button>
      </div>
    </div>
  );
}

// ─── SCREEN: PROFILE ──────────────────────────────────────────────────────────
function ProfileScreen({ setScreen }) {
  const menuItems = [
    { section: "CONTA", items: [{ icon: "👤", title: "Dados pessoais", desc: "Nome, e-mail e senha" }, { icon: "🔔", title: "Notificações", desc: "Alertas e novidades" }] },
    { section: "PREFERÊNCIAS", items: [{ icon: "📍", title: "Regiões favoritas", desc: "Seus destinos preferidos" }, { icon: "⭐", title: "Avaliações", desc: "Locais que você visitou" }] },
    { section: "SUPORTE", items: [{ icon: "🔒", title: "Privacidade e segurança", desc: "" }, { icon: "❓", title: "Ajuda e suporte", desc: "" }, { icon: "🚪", title: "Sair da conta", desc: "", danger: true }] },
  ];

  return (
    <PageWrapper screen="profile" setScreen={setScreen}>
      <div className="px-5 pt-8 pb-8">
        <h1 className="text-slate-900 text-2xl font-bold mb-5">Meu perfil</h1>

        {/* User card */}
        <div className="bg-gradient-to-br from-teal-800 to-teal-700 rounded-2xl p-4 flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">YM</div>
          <div className="flex-1">
            <p className="text-white font-bold">Yan mamede</p>
            <p className="text-teal-200 text-xs flex items-center gap-1">✉️ yan@gmail.com</p>
          </div>
          <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm">⚙️</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { emoji: "🗺️", val: "4", label: "Roteiros" },
            { emoji: "📍", val: "3", label: "Regiões" },
            { emoji: "💰", val: "R$ 15.5k", label: "Estimado" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-3 text-center shadow-sm border border-slate-100">
              <p className="text-xl mb-0.5">{s.emoji}</p>
              <p className="text-slate-800 font-bold text-sm">{s.val}</p>
              <p className="text-slate-400 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Menu sections */}
        <div className="flex flex-col gap-5">
          {menuItems.map((section) => (
            <div key={section.section}>
              <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mb-2">{section.section}</p>
              <div className="flex flex-col gap-1">
                {section.items.map((item) => (
                  <button
                    key={item.title}
                    onClick={() => item.title === "Sair da conta" && setScreen("login")}
                    className="flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 hover:bg-slate-50 transition w-full text-left shadow-sm border border-slate-100"
                  >
                    <span className="text-xl w-7 text-center">{item.icon}</span>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${item.danger ? "text-red-500" : "text-slate-800"}`}>{item.title}</p>
                      {item.desc && <p className="text-xs text-slate-400">{item.desc}</p>}
                    </div>
                    <span className="text-slate-300 text-sm">›</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

// ─── APP ROOT ────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("login");
  const [planData, setPlanData] = useState({});

  const screens = {
    login: <LoginScreen setScreen={setScreen} />,
    register: <RegisterScreen setScreen={setScreen} />,
    home: <HomeScreen setScreen={setScreen} />,
    planner: <PlannerStep1 setScreen={setScreen} setPlanData={setPlanData} />,
    planner2: <PlannerStep2 setScreen={setScreen} planData={planData} setPlanData={setPlanData} />,
    planner3: <PlannerStep3 setScreen={setScreen} setPlanData={setPlanData} />,
    itinerary: <ItineraryScreen setScreen={setScreen} />,
    history: <HistoryScreen setScreen={setScreen} />,
    profile: <ProfileScreen setScreen={setScreen} />,
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #CBD5E1; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      {screens[screen] || screens.login}
    </div>
  );
}
