import { useState, useEffect } from "react";
import serra_gaucha from "./assets/serra_gaucha.jpg";
import vale_dos_vinhedos from "./assets/vale_dos_vinhedos.jpeg";
import { api } from "./api";

const IMG_FALLBACK = {
  'serra-gaucha':    serra_gaucha,
  'litoral-gaucho':  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
  'missoes':         'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400&q=80',
  'campanha-gaucha': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80',
  'porto-alegre':    'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&q=80',
  'serra-nordeste':  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
  'vale-vinhedos':   vale_dos_vinhedos,
};


const getImg = (regiao) =>
  (regiao?.imagem_url) || IMG_FALLBACK[regiao?.slug] || IMG_FALLBACK.serra;

const PREFERENCES = [
  { id: "natureza", label: "Natureza", emoji: "🌿" },
  { id: "cultura", label: "Cultura", emoji: "🏛️" },
  { id: "gastronomia", label: "Gastronomia", emoji: "🍷" },
  { id: "aventura", label: "Aventura", emoji: "🏕️" },
  { id: "historia", label: "História", emoji: "🏰" },
  { id: "religioso", label: "Religioso", emoji: "⛪" },
];

const BUDGETS = [
  { id: "economico", label: "Econômico", desc: "Atrações gratuitas e de baixo custo", emoji: "💚" },
  { id: "moderado", label: "Moderado", desc: "Equilíbrio entre custo e experiência", emoji: "💛" },
  { id: "premium", label: "Premium", desc: "As melhores experiências sem limites", emoji: "💎" },
];

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

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ setScreen, onLogin }) {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setErro("");
    if (!email || !pw) return setErro("Preencha e-mail e senha.");
    setLoading(true);
    const res = await api.login(email, pw);
    setLoading(false);
    if (res.error) return setErro(res.error);
    onLogin(res.token, res.usuario);
    setScreen("home");
  };

  return (
    <PageWrapper noNav>
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 px-6 pt-12 pb-10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5" />
        <button className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white mb-6">←</button>
        <p className="text-cyan-300 text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5 mb-2">
          <span>🧭</span> Conexão Gaúcha
        </p>
        <h1 className="text-white text-3xl font-bold leading-tight">Bem-vindo de volta! 👋</h1>
        <p className="text-teal-200 text-sm mt-1">Entre para continuar seus roteiros</p>
      </div>

      <div className="bg-slate-50 rounded-t-3xl -mt-4 px-6 pt-8 pb-10 flex flex-col gap-5 relative z-10">
        {erro && <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl">{erro}</p>}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-sm font-semibold">E-mail</label>
          <input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between">
            <label className="text-slate-700 text-sm font-semibold">Senha</label>
            <button className="text-teal-600 text-sm font-medium hover:underline">Esqueci a senha</button>
          </div>
          <div className="relative">
            <input type={showPw ? "text" : "password"} placeholder="••••••••" value={pw} onChange={(e) => setPw(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition pr-12" />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
        </div>
        <button onClick={handleLogin} disabled={loading}
          className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-teal-900/30 active:scale-95 disabled:opacity-60">
          {loading ? "Entrando…" : "Entrar"}
        </button>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-slate-400 text-xs">ou</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>
        <p className="text-center text-slate-500 text-sm">
          Não tem conta?{" "}
          <button onClick={() => setScreen("register")} className="text-teal-700 font-bold hover:underline">Cadastre-se grátis</button>
        </p>
      </div>
    </PageWrapper>
  );
}

// ─── CADASTRO ─────────────────────────────────────────────────────────────────
function RegisterScreen({ setScreen, onLogin }) {
  const [showPw, setShowPw] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setErro("");
    if (!nome || !email || !pw || !pwConfirm) return setErro("Preencha todos os campos.");
    if (pw !== pwConfirm) return setErro("As senhas não coincidem.");
    if (pw.length < 6) return setErro("A senha deve ter no mínimo 6 caracteres.");
    setLoading(true);
    const res = await api.register(nome, email, pw);
    setLoading(false);
    if (res.error) return setErro(res.error);
    onLogin(res.token, res.usuario);
    setScreen("home");
  };

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
        {erro && <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl">{erro}</p>}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-sm font-semibold">Nome completo</label>
          <input type="text" placeholder="João da Silva" value={nome} onChange={(e) => setNome(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-sm font-semibold">E-mail</label>
          <input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-sm font-semibold">Senha</label>
          <div className="relative">
            <input type={showPw ? "text" : "password"} placeholder="Mínimo 6 caracteres" value={pw} onChange={(e) => setPw(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition pr-12" />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-sm font-semibold">Confirmar senha</label>
          <input type="password" placeholder="Repita a senha" value={pwConfirm} onChange={(e) => setPwConfirm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition" />
        </div>
        <button onClick={handleRegister} disabled={loading}
          className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-teal-900/30 active:scale-95 mt-2 disabled:opacity-60">
          {loading ? "Criando conta…" : "Criar conta"}
        </button>
        <p className="text-center text-slate-500 text-sm">
          Já tem conta?{" "}
          <button onClick={() => setScreen("login")} className="text-teal-700 font-bold hover:underline">Fazer login</button>
        </p>
      </div>
    </PageWrapper>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomeScreen({ setScreen, usuario, token, setRoteiroAtivo }) {
  const [roteiros, setRoteiros] = useState([]);

  useEffect(() => {
    api.getRoteiros(token).then((data) => {
      if (Array.isArray(data)) setRoteiros(data.slice(0, 2));
    });
  }, [token]);

  const primeiroNome = usuario?.nome_completo?.split(" ")[0] || "Viajante";

  return (
    <PageWrapper screen="home" setScreen={setScreen}>
      <div className="px-5 pt-8 pb-4 bg-white flex justify-between items-start">
        <div>
          <p className="text-slate-500 text-sm">Olá, {primeiroNome} 👋</p>
          <h1 className="text-slate-900 text-2xl font-bold">Para onde vamos?</h1>
        </div>
        <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center relative">🔔</button>
      </div>

      <div className="px-5 pb-4 bg-white">
        <div className="bg-slate-100 rounded-xl flex items-center gap-2 px-4 py-3">
          <span className="text-slate-400">🔍</span>
          <input placeholder="Buscar destino ou atividade..." className="bg-transparent flex-1 text-sm text-slate-600 placeholder-slate-400 focus:outline-none" />
        </div>
      </div>

      <div className="px-5 pb-5 bg-white">
        <div className="bg-gradient-to-br from-teal-800 to-teal-600 rounded-2xl px-5 py-5 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10" />
          <p className="text-teal-200 text-xs mb-1">Pronto para explorar?</p>
          <h2 className="text-white font-bold text-lg leading-snug mb-4">Crie seu roteiro personalizado</h2>
          <button onClick={() => setScreen("planner")}
            className="bg-cyan-400 hover:bg-cyan-300 text-teal-900 font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all active:scale-95">
            + Planejar viagem
          </button>
        </div>
      </div>

      <div className="bg-white mt-2 px-5 pb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-slate-800 font-bold">Roteiros recentes</h3>
          <button onClick={() => setScreen("history")} className="text-teal-600 text-sm font-medium">Histórico →</button>
        </div>
        {roteiros.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-6">Nenhum roteiro criado ainda.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {roteiros.map((r) => (
              <div key={r.id} onClick={() => { setRoteiroAtivo(r); setScreen("itinerary"); }}
                className="flex gap-3 bg-slate-50 rounded-xl p-3 cursor-pointer hover:bg-slate-100 transition">
                <img src={IMG_FALLBACK[r.regiao_slug] || IMG_FALLBACK.serra} alt={r.regiao_nome}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 font-semibold text-sm truncate">{r.titulo}</p>
                  <p className="text-slate-400 text-xs mt-0.5">📍 {r.regiao_nome}</p>
                  <p className="text-slate-400 text-xs mt-0.5">📅 {r.data_inicio}</p>
                </div>
                <span className="text-teal-700 font-bold text-sm whitespace-nowrap self-center">
                  R$ {Number(r.custo_total).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

// ─── PLANNER STEP 1 ───────────────────────────────────────────────────────────
function PlannerStep1({ setScreen, setPlanData, token }) {
  const [selected, setSelected] = useState(null);
  const [regioes, setRegioes] = useState([]);

  useEffect(() => {
    api.getRegioes(token).then((data) => {
      if (Array.isArray(data)) setRegioes(data);
    });
  }, [token]);

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

        {regioes.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-10">Carregando regiões…</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {regioes.map((r) => (
              <div key={r.id} onClick={() => setSelected(r)}
                className={`relative rounded-xl overflow-hidden cursor-pointer transition-all ${selected?.id === r.id ? "ring-2 ring-teal-500 scale-95" : "hover:scale-95"}`}>
                <img src={getImg(r)} alt={r.nome} className="w-full h-28 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs font-bold leading-tight">{r.nome}</p>
                </div>
                {selected?.id === r.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs">✓</div>
                )}
              </div>
            ))}
          </div>
        )}

        <button disabled={!selected}
          onClick={() => { setPlanData((p) => ({ ...p, regiao: selected })); setScreen("planner2"); }}
          className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${selected ? "bg-teal-800 text-white hover:bg-teal-900 active:scale-95 shadow-lg" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>
          Continuar →
        </button>
      </div>
    </PageWrapper>
  );
}

// ─── PLANNER STEP 2 ───────────────────────────────────────────────────────────
function PlannerStep2({ setScreen, planData, setPlanData }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const region = planData.regiao;

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
        <p className="text-slate-500 text-sm mt-1 mb-5">Defina as datas da sua viagem para {region?.nome}</p>

        {region && (
          <div className="relative rounded-2xl overflow-hidden mb-6 h-36">
            <img src={getImg(region)} alt={region.nome} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <p className="absolute bottom-3 left-3 text-white text-sm font-semibold">📍 {region.nome}</p>
          </div>
        )}

        {[{ label: "📅 Data de início", value: start, set: setStart }, { label: "📅 Data de retorno", value: end, set: setEnd }].map((f) => (
          <div key={f.label} className="flex flex-col gap-1.5 mb-4">
            <label className="text-slate-700 text-sm font-semibold">{f.label}</label>
            <input type="date" value={f.value} onChange={(e) => f.set(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition" />
          </div>
        ))}

        <button disabled={!start || !end}
          onClick={() => { setPlanData((p) => ({ ...p, start, end })); setScreen("planner3"); }}
          className={`w-full py-4 rounded-2xl font-bold text-sm mt-2 transition-all ${start && end ? "bg-teal-800 text-white hover:bg-teal-900 active:scale-95 shadow-lg" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>
          Continuar →
        </button>
      </div>
    </PageWrapper>
  );
}

// ─── PLANNER STEP 3 ───────────────────────────────────────────────────────────
function PlannerStep3({ setScreen, planData, setPlanData, token, setRoteiroAtivo }) {
  const [prefs, setPrefs] = useState([]);
  const [budget, setBudget] = useState("moderado");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const toggle = (id) => setPrefs((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const generate = async () => {
    setErro("");
    setLoading(true);
    const res = await api.criarRoteiro(token, {
      regiao_id: planData.regiao.id,
      data_inicio: planData.start,
      data_fim: planData.end,
      nivel_orcamento: budget,
      preferencias: prefs,
    });
    setLoading(false);
    if (res.error) return setErro(res.error);
    setRoteiroAtivo(res.roteiro);
    setScreen("itinerary");
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

        {erro && <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl mb-4">{erro}</p>}

        <div className="grid grid-cols-3 gap-3 mb-7">
          {PREFERENCES.map((p) => (
            <button key={p.id} onClick={() => toggle(p.id)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-all ${prefs.includes(p.id) ? "border-teal-500 bg-teal-50 text-teal-800" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}>
              <span className="text-xl">{p.emoji}</span>
              {p.label}
            </button>
          ))}
        </div>

        <div className="mb-7">
          <p className="text-slate-700 font-semibold text-sm flex items-center gap-1.5 mb-3">💲 Nível de orçamento</p>
          <div className="flex flex-col gap-2">
            {BUDGETS.map((b) => (
              <button key={b.id} onClick={() => setBudget(b.id)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all text-left ${budget === b.id ? "bg-teal-800 border-teal-800 text-white" : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"}`}>
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

        <button onClick={generate}
          className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold py-4 rounded-2xl text-sm transition-all shadow-lg shadow-teal-900/20 active:scale-95 flex items-center justify-center gap-2">
          🧭 Gerar roteiro agora!
        </button>
      </div>
    </PageWrapper>
  );
}

// ─── ITINERARY ────────────────────────────────────────────────────────────────
function ItineraryScreen({ setScreen, roteiro }) {
  if (!roteiro) return (
    <PageWrapper screen="home" setScreen={setScreen}>
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-400 text-sm">Nenhum roteiro selecionado.</p>
      </div>
    </PageWrapper>
  );

  const imgHero = IMG_FALLBACK[roteiro.regiao_slug] || IMG_FALLBACK.serra;

  return (
    <PageWrapper screen="home" setScreen={setScreen}>
      <div className="relative h-56">
        <img src={imgHero} alt={roteiro.regiao_nome} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <button onClick={() => setScreen("home")} className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center text-white text-sm backdrop-blur-sm">←</button>
        </div>
        <div className="absolute bottom-4 left-4">
          <p className="text-white/70 text-xs">📍 {roteiro.regiao_nome}</p>
          <h1 className="text-white text-xl font-bold">{roteiro.titulo}</h1>
        </div>
      </div>

      <div className="mx-4 -mt-4 relative z-10 bg-white rounded-2xl shadow-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full capitalize">{roteiro.nivel_orcamento}</span>
          <span className="text-teal-800 font-bold text-lg">💰 R$ {Number(roteiro.custo_total).toFixed(2)}</span>
        </div>
        <div className="flex gap-4 text-xs text-slate-500">
          <span>📅 {roteiro.data_inicio} → {roteiro.data_fim}</span>
        </div>
      </div>

      <div className="px-4 pb-8 flex flex-col gap-5">
        {(roteiro.dias || []).map((dia) => (
          <div key={dia.id}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-teal-800 text-white text-xs font-bold flex items-center justify-center">{dia.numero_dia}</div>
                <div>
                  <p className="text-slate-800 font-bold text-sm">Dia {dia.numero_dia}</p>
                  <p className="text-slate-400 text-xs">{dia.data}</p>
                </div>
              </div>
              <span className="text-slate-600 text-sm font-semibold">💲 R$ {Number(dia.custo_dia).toFixed(2)}</span>
            </div>

            <div className="flex flex-col gap-3">
              {(dia.itens || []).map((item, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                  {item.imagem_url && (
                    <div className="relative">
                      <img src={item.imagem_url} alt={item.local_nome} className="w-full h-36 object-cover" />
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm font-medium">{item.horario}</div>
                      <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-lg font-bold">⭐ {item.avaliacao}</div>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-slate-800 font-bold text-base">{item.local_nome}</h4>
                      <span className="text-slate-400 text-xs ml-2 shrink-0">📍 {item.cidade}</span>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed mb-3">{item.descricao}</p>
                    <div className="flex gap-2 mb-3">
                      <span className="bg-teal-50 text-teal-700 text-xs px-3 py-1.5 rounded-full font-medium">💲 R$ {Number(item.custo_medio).toFixed(2)}</span>
                      <span className="bg-slate-50 text-slate-600 text-xs px-3 py-1.5 rounded-full">⏱ {item.duracao_estimada}</span>
                    </div>
                    {item.latitude && item.longitude && (
                      <a href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`} target="_blank" rel="noreferrer"
                        className="w-full border border-teal-200 text-teal-700 text-xs font-semibold py-2.5 rounded-xl hover:bg-teal-50 transition flex items-center justify-center gap-1.5">
                        🗺️ Ver no Google Maps
                      </a>
                    )}
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

// ─── HISTORY ──────────────────────────────────────────────────────────────────
function HistoryScreen({ setScreen, token, setRoteiroAtivo }) {
  const [roteiros, setRoteiros] = useState([]);
  const [stats, setStats] = useState({ total: 0, regioes: 0, gasto: 0 });

  const carregar = () => {
    api.getRoteiros(token).then((data) => {
      if (!Array.isArray(data)) return;
      setRoteiros(data);
      setStats({
        total: data.length,
        regioes: new Set(data.map((r) => r.regiao_id)).size,
        gasto: data.reduce((s, r) => s + Number(r.custo_total), 0),
      });
    });
  };

  useEffect(() => { carregar(); }, [token]);

  const deletar = async (id) => {
    await api.deletarRoteiro(token, id);
    carregar();
  };

  return (
    <PageWrapper screen="history" setScreen={setScreen}>
      <div className="px-5 pt-8 pb-8">
        <h1 className="text-slate-900 text-2xl font-bold">Histórico de viagens</h1>
        <p className="text-slate-500 text-sm mt-1 mb-5">Todos os seus roteiros em um lugar</p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { emoji: "🗺️", val: stats.total, label: "Roteiros" },
            { emoji: "📍", val: stats.regioes, label: "Regiões" },
            { emoji: "💰", val: `R$ ${stats.gasto.toFixed(2)}`, label: "Total gasto" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-3 text-center shadow-sm border border-slate-100">
              <p className="text-2xl mb-0.5">{s.emoji}</p>
              <p className="text-slate-800 font-bold text-sm">{s.val}</p>
              <p className="text-slate-400 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        <h3 className="text-slate-800 font-bold mb-3">Meus roteiros</h3>
        {roteiros.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">Nenhum roteiro encontrado.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {roteiros.map((h) => (
              <div key={h.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                <div className="relative h-24">
                  <img src={IMG_FALLBACK[h.regiao_slug] || IMG_FALLBACK.serra} alt={h.regiao_nome} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end">
                    <div>
                      <p className="text-white/60 text-[10px]">📍 {h.regiao_nome}</p>
                      <p className="text-white text-sm font-bold">{h.titulo}</p>
                    </div>
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg">
                      R$ {Number(h.custo_total).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="px-3 py-2.5 flex items-center gap-3 flex-wrap">
                  <span className="text-slate-400 text-xs">📅 {h.data_inicio}</span>
                  <button onClick={() => deletar(h.id)} className="text-slate-400 text-base hover:text-red-400 transition">🗑</button>
                  <button onClick={() => { setRoteiroAtivo(h); setScreen("itinerary"); }}
                    className="ml-auto bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold px-4 py-1.5 rounded-xl transition">
                    Ver roteiro
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function ProfileScreen({ setScreen, token, onLogout }) {
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    api.getPerfil(token).then((data) => {
      if (!data.error) setPerfil(data);
    });
  }, [token]);

  const iniciais = perfil?.nome_completo?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "??";

  const menuItems = [
    { section: "CONTA", items: [{ icon: "👤", title: "Dados pessoais", desc: "Nome, e-mail e senha" }, { icon: "🔔", title: "Notificações", desc: "Alertas e novidades" }] },
    { section: "PREFERÊNCIAS", items: [{ icon: "📍", title: "Regiões favoritas", desc: "Seus destinos preferidos" }, { icon: "⭐", title: "Avaliações", desc: "Locais que você visitou" }] },
    { section: "SUPORTE", items: [{ icon: "🔒", title: "Privacidade e segurança", desc: "" }, { icon: "❓", title: "Ajuda e suporte", desc: "" }, { icon: "🚪", title: "Sair da conta", desc: "", danger: true }] },
  ];

  return (
    <PageWrapper screen="profile" setScreen={setScreen}>
      <div className="px-5 pt-8 pb-8">
        <h1 className="text-slate-900 text-2xl font-bold mb-5">Meu perfil</h1>

        <div className="bg-gradient-to-br from-teal-800 to-teal-700 rounded-2xl p-4 flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">{iniciais}</div>
          <div className="flex-1">
            <p className="text-white font-bold">{perfil?.nome_completo || "…"}</p>
            <p className="text-teal-200 text-xs">✉️ {perfil?.email || "…"}</p>
          </div>
          <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm">⚙️</button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { emoji: "🗺️", val: perfil?.stats?.total_roteiros ?? "…", label: "Roteiros" },
            { emoji: "📍", val: perfil?.stats?.total_regioes ?? "…", label: "Regiões" },
            { emoji: "💰", val: perfil ? `R$ ${Number(perfil.stats?.total_estimado || 0).toFixed(0)}` : "…", label: "Estimado" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-3 text-center shadow-sm border border-slate-100">
              <p className="text-xl mb-0.5">{s.emoji}</p>
              <p className="text-slate-800 font-bold text-sm">{s.val}</p>
              <p className="text-slate-400 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-5">
          {menuItems.map((section) => (
            <div key={section.section}>
              <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mb-2">{section.section}</p>
              <div className="flex flex-col gap-1">
                {section.items.map((item) => (
                  <button key={item.title}
                    onClick={() => { if (item.danger) onLogout(); }}
                    className="flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 hover:bg-slate-50 transition w-full text-left shadow-sm border border-slate-100">
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

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("login");
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [usuario, setUsuario] = useState(() => {
    const u = localStorage.getItem("usuario");
    return u ? JSON.parse(u) : null;
  });
  const [planData, setPlanData] = useState({});
  const [roteiroAtivo, setRoteiroAtivo] = useState(null);

  useEffect(() => {
    if (token) setScreen("home");
  }, []);

  const onLogin = (t, u) => {
    setToken(t);
    setUsuario(u);
    localStorage.setItem("token", t);
    localStorage.setItem("usuario", JSON.stringify(u));
  };

  const onLogout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setScreen("login");
  };

  const screens = {
    login: <LoginScreen setScreen={setScreen} onLogin={onLogin} />,
    register: <RegisterScreen setScreen={setScreen} onLogin={onLogin} />,
    home: <HomeScreen setScreen={setScreen} usuario={usuario} token={token} setRoteiroAtivo={setRoteiroAtivo} />,
    planner: <PlannerStep1 setScreen={setScreen} setPlanData={setPlanData} token={token} />,
    planner2: <PlannerStep2 setScreen={setScreen} planData={planData} setPlanData={setPlanData} />,
    planner3: <PlannerStep3 setScreen={setScreen} planData={planData} setPlanData={setPlanData} token={token} setRoteiroAtivo={setRoteiroAtivo} />,
    itinerary: <ItineraryScreen setScreen={setScreen} roteiro={roteiroAtivo} />,
    history: <HistoryScreen setScreen={setScreen} token={token} setRoteiroAtivo={setRoteiroAtivo} />,
    profile: <ProfileScreen setScreen={setScreen} token={token} onLogout={onLogout} />,
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