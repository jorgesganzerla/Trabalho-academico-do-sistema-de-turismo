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
function HomeScreen({ setScreen, usuario, token, setRoteiroAtivo, setPlanData }) {
  const [roteiros, setRoteiros] = useState([]);
  const [regioes, setRegioes] = useState([]);
  const [busca, setBusca] = useState("");
  const [notificacoes, setNotificacoes] = useState([]);
  const [painelAberto, setPainelAberto] = useState(false);
  const [populares, setPopulares] = useState([]);

  useEffect(() => {
    api.getRoteiros(token).then((data) => { if (Array.isArray(data)) setRoteiros(data); });
    api.getRegioes(token).then((data) => { if (Array.isArray(data)) setRegioes(data); });
    api.getNotificacoes(token).then((data) => { if (Array.isArray(data)) setNotificacoes(data); });
    api.getLocaisPopulares(token).then((data) => { if (Array.isArray(data)) setPopulares(data); });
  }, [token]);

  const naoLidas = notificacoes.filter((n) => !n.lida).length;
  const primeiroNome = usuario?.nome_completo?.split(" ")[0] || "Viajante";
  const termo = busca.toLowerCase().trim();

  const roteirosFiltrados = termo
    ? roteiros.filter((r) =>
        r.titulo.toLowerCase().includes(termo) ||
        r.regiao_nome.toLowerCase().includes(termo)
      )
    : roteiros.slice(0, 2);

  const regioesFiltradas = termo
    ? regioes.filter((r) => r.nome.toLowerCase().includes(termo))
    : [];

  const semResultados = termo && roteirosFiltrados.length === 0 && regioesFiltradas.length === 0;

  const abrirPainel = async () => {
    setPainelAberto(true);
    if (naoLidas > 0) {
      await api.marcarNotificacoesLidas(token);
      setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: 1 })));
    }
  };

  const getEpoca = () => {
    const mes = new Date().getMonth() + 1;
    if (mes >= 12 || mes <= 2) return "verão 🌊";
    if (mes >= 3 && mes <= 5) return "outono 🍂";
    if (mes >= 6 && mes <= 8) return "inverno ❄️";
    return "primavera 🌸";
  };

  const irParaLocal = (local) => {
    const regiao = {
      id: local.regiao_id,
      nome: local.regiao_nome,
      slug: local.regiao_slug,
      imagem_url: local.regiao_imagem,
    };
    setPlanData((p) => ({ ...p, regiao }));
    setScreen("planner2");
  };

  return (
    <PageWrapper screen="home" setScreen={setScreen}>
      <div className="px-5 pt-8 pb-4 bg-white flex justify-between items-start">
        <div>
          <p className="text-slate-500 text-sm">Olá, {primeiroNome} 👋</p>
          <h1 className="text-slate-900 text-2xl font-bold">Para onde vamos?</h1>
        </div>
        <button onClick={abrirPainel} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center relative">
          🔔
          {naoLidas > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-cyan-500 rounded-full border-2 border-white text-white text-[9px] font-bold flex items-center justify-center">
              {naoLidas > 9 ? "9+" : naoLidas}
            </span>
          )}
        </button>
      </div>

      {/* Painel de notificações */}
      {painelAberto && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPainelAberto(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-t-3xl shadow-2xl max-h-[70vh] flex flex-col">
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
              <h2 className="text-slate-800 font-bold text-lg">Notificações</h2>
              <button onClick={() => setPainelAberto(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-3 flex flex-col gap-3">
              {notificacoes.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-8">Nenhuma notificação ainda.</p>
              ) : (
                notificacoes.map((n) => (
                  <div key={n.id} className={`rounded-xl p-3 border ${n.lida ? "bg-white border-slate-100" : "bg-cyan-50 border-cyan-100"}`}>
                    <p className="text-slate-800 font-semibold text-sm">{n.titulo}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{n.mensagem}</p>
                    <p className="text-slate-300 text-xs mt-1">{new Date(n.criado_em).toLocaleString("pt-BR")}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <div className="px-5 pb-4 bg-white">
        <div className="bg-slate-100 rounded-xl flex items-center gap-2 px-4 py-3">
          <span className="text-slate-400">🔍</span>
          <input
            placeholder="Buscar destino ou atividade..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="bg-transparent flex-1 text-sm text-slate-600 placeholder-slate-400 focus:outline-none"
          />
          {busca && (
            <button onClick={() => setBusca("")} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
          )}
        </div>
      </div>

      {termo ? (
        <div className="px-5 pb-8 bg-white flex flex-col gap-5">
          {semResultados && (
            <p className="text-slate-400 text-sm text-center py-8">Nenhum resultado para "{busca}".</p>
          )}
          {regioesFiltradas.length > 0 && (
            <div>
              <h3 className="text-slate-800 font-bold mb-3">Regiões</h3>
              <div className="flex flex-col gap-2">
                {regioesFiltradas.map((r) => (
                  <div key={r.id}
                    onClick={() => { setPlanData((p) => ({ ...p, regiao: r })); setScreen("planner2"); }}
                    className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 cursor-pointer hover:bg-slate-100 transition">
                    <img src={getImg(r)} alt={r.nome} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    <div>
                      <p className="text-slate-800 font-semibold text-sm">{r.nome}</p>
                      <p className="text-slate-400 text-xs">{r.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {roteirosFiltrados.length > 0 && (
            <div>
              <h3 className="text-slate-800 font-bold mb-3">Roteiros</h3>
              <div className="flex flex-col gap-3">
                {roteirosFiltrados.map((r) => (
                  <div key={r.id}
                    onClick={() => { setRoteiroAtivo(r); setScreen("itinerary"); }}
                    className="flex gap-3 bg-slate-50 rounded-xl p-3 cursor-pointer hover:bg-slate-100 transition">
                    <img src={IMG_FALLBACK[r.regiao_slug] || IMG_FALLBACK['serra-gaucha']} alt={r.regiao_nome}
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
            </div>
          )}
        </div>
      ) : (
        <>
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

          {/* Populares por época */}
          {populares.length > 0 && (
            <div className="bg-white pb-5">
              <div className="px-5 mb-3">
                <h3 className="text-slate-800 font-bold">🏆 Populares no {getEpoca()}</h3>
                <p className="text-slate-400 text-xs mt-0.5">Os 5 lugares mais indicados para essa época</p>
              </div>
              <div className="flex gap-3 px-5 overflow-x-auto scrollbar-hide">
                {populares.map((local) => (
                  <div key={local.id} onClick={() => irParaLocal(local)}
                    className="flex-shrink-0 w-44 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer hover:shadow-md transition">
                    <div className="relative h-24">
                      <img
                        src={local.imagem_url || IMG_FALLBACK[local.regiao_slug] || IMG_FALLBACK['serra-gaucha']}
                        alt={local.nome}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-lg">
                        ⭐ {local.avaliacao}
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-slate-800 font-bold text-xs truncate">{local.nome}</p>
                      <p className="text-slate-400 text-[10px] mt-0.5">📍 {local.cidade}</p>
                      <p className="text-teal-700 font-semibold text-[10px] mt-1">
                        {Number(local.custo_medio) === 0 ? "Gratuito" : `R$ ${Number(local.custo_medio).toFixed(0)}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white mt-2 px-5 pb-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-slate-800 font-bold">Roteiros recentes</h3>
              <button onClick={() => setScreen("history")} className="text-teal-600 text-sm font-medium">Histórico →</button>
            </div>
            {roteiros.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">Nenhum roteiro criado ainda.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {roteiros.slice(0, 2).map((r) => (
                  <div key={r.id} onClick={() => { setRoteiroAtivo(r); setScreen("itinerary"); }}
                    className="flex gap-3 bg-slate-50 rounded-xl p-3 cursor-pointer hover:bg-slate-100 transition">
                    <img src={IMG_FALLBACK[r.regiao_slug] || IMG_FALLBACK['serra-gaucha']} alt={r.regiao_nome}
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
        </>
      )}
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
function ItineraryScreen({ setScreen, roteiro, token }) {
  const [exportando, setExportando] = useState(false);
  const [painelCompartilhar, setPainelCompartilhar] = useState(false);
  const [linkCompartilhar, setLinkCompartilhar] = useState("");
  const [copiado, setCopiado] = useState(false);

  const exportar = async () => {
    setExportando(true);
    const res = await api.exportarRoteiro(token, roteiro.id);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `roteiro-${roteiro.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setExportando(false);
  };

  const compartilhar = async () => {
    const res = await api.compartilharRoteiro(token, roteiro.id);
    if (res.link) {
      setLinkCompartilhar(res.link);
      setPainelCompartilhar(true);
    }
  };

  const copiarLink = () => {
    navigator.clipboard.writeText(linkCompartilhar);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  if (!roteiro) return (
    <PageWrapper screen="home" setScreen={setScreen}>
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-400 text-sm">Nenhum roteiro selecionado.</p>
      </div>
    </PageWrapper>
  );

  const imgHero = IMG_FALLBACK[roteiro.regiao_slug] || IMG_FALLBACK['serra-gaucha'];

  return (
    <PageWrapper screen="home" setScreen={setScreen}>

      {/* Painel compartilhar */}
      {painelCompartilhar && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPainelCompartilhar(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-t-3xl shadow-2xl px-5 pt-6 pb-10 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-slate-800 font-bold text-lg">Compartilhar roteiro</h3>
              <button onClick={() => setPainelCompartilhar(false)} className="text-slate-400 text-xl">✕</button>
            </div>
            <p className="text-slate-500 text-sm">{roteiro.titulo}</p>
            <div className="bg-slate-100 rounded-xl px-4 py-3 flex items-center gap-2">
              <p className="text-slate-600 text-xs flex-1 truncate">{linkCompartilhar}</p>
            </div>
            <button onClick={copiarLink}
              className={`w-full font-bold py-3.5 rounded-2xl transition text-sm ${copiado ? "bg-teal-600 text-white" : "bg-teal-800 hover:bg-teal-900 text-white"}`}>
              {copiado ? "✓ Link copiado!" : "📋 Copiar link"}
            </button>
          </div>
        </div>
      )}

      <div className="relative h-56">
        <img src={imgHero} alt={roteiro.regiao_nome} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <button onClick={() => setScreen("home")} className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center text-white text-sm backdrop-blur-sm">←</button>
          <div className="flex gap-2">
            <button onClick={exportar} disabled={exportando}
              className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center text-white text-sm backdrop-blur-sm disabled:opacity-60"
              title="Exportar roteiro">
              {exportando ? "⏳" : "⬇"}
            </button>
            <button onClick={compartilhar}
              className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center text-white text-sm backdrop-blur-sm"
              title="Compartilhar roteiro">
              ↗
            </button>
          </div>
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
// ─── HISTORY ──────────────────────────────────────────────────────────────────
function HistoryScreen({ setScreen, token, setRoteiroAtivo }) {
  const [roteiros, setRoteiros] = useState([]);
  const [stats, setStats] = useState({ total: 0, regioes: 0, gasto: 0 });
  const [carregando, setCarregando] = useState(null);

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

  const verRoteiro = async (id) => {
    setCarregando(id);
    const roteiro = await api.getRoteiro(token, id);
    setCarregando(null);
    if (roteiro.error) return;
    setRoteiroAtivo(roteiro);
    setScreen("itinerary");
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
                  <img src={IMG_FALLBACK[h.regiao_slug] || IMG_FALLBACK['serra-gaucha']} alt={h.regiao_nome} className="w-full h-full object-cover" />
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
                  <button
                    onClick={() => verRoteiro(h.id)}
                    disabled={carregando === h.id}
                    className="ml-auto bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold px-4 py-1.5 rounded-xl transition disabled:opacity-60">
                    {carregando === h.id ? "Carregando…" : "Ver roteiro"}
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
                    onClick={() => {
                      if (item.danger) onLogout();
                      else if (item.title === "Dados pessoais") setScreen("dadosPessoais");
                      else if (item.title === "Regiões favoritas") setScreen("regioesFavoritas");
                      else if (item.title === "Avaliações") setScreen("avaliacoes");
                      else if (item.title === "Notificações") setScreen("notificacoes");
                      else if (item.title === "Privacidade e segurança") setScreen("privacidade");
                      else if (item.title === "Ajuda e suporte") setScreen("ajuda");
                    }}

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

// ─── DADOS PESSOAIS ───────────────────────────────────────────────────────────
function DadosPessoaisScreen({ setScreen, token, usuario, onLogin }) {
  const [nome, setNome] = useState(usuario?.nome_completo || "");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState("");
  const [erro, setErro] = useState("");

  const salvar = async () => {
    setErro("");
    setSucesso("");

    if (!nome.trim()) return setErro("O nome não pode estar vazio.");

    if (novaSenha || senhaAtual) {
      if (!senhaAtual) return setErro("Informe a senha atual para alterá-la.");
      if (novaSenha.length < 6) return setErro("A nova senha deve ter no mínimo 6 caracteres.");
      if (novaSenha !== confirmarSenha) return setErro("As senhas não coincidem.");
    }

    setLoading(true);
    const dados = { nome_completo: nome };
    if (novaSenha) { dados.senha_atual = senhaAtual; dados.nova_senha = novaSenha; }

    const res = await api.atualizarPerfil(token, dados);
    setLoading(false);

    if (res.error) return setErro(res.error);

    onLogin(token, { ...usuario, nome_completo: nome });
    setSucesso("Dados atualizados com sucesso!");
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
  };

  return (
    <PageWrapper noNav>
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 px-6 pt-12 pb-10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
        <button onClick={() => setScreen("profile")} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white mb-6">←</button>
        <p className="text-cyan-300 text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5 mb-2">
          <span>🧭</span> Conexão Gaúcha
        </p>
        <h1 className="text-white text-3xl font-bold leading-tight">Dados pessoais 👤</h1>
        <p className="text-teal-200 text-sm mt-1">Atualize seu nome ou senha</p>
      </div>

      <div className="bg-slate-50 rounded-t-3xl -mt-4 px-6 pt-8 pb-10 flex flex-col gap-5 relative z-10">
        {erro && <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl">{erro}</p>}
        {sucesso && <p className="text-teal-700 text-sm bg-teal-50 px-4 py-2 rounded-xl">{sucesso}</p>}

        {/* Nome */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-sm font-semibold">Nome completo</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 transition" />
        </div>

        {/* E-mail (somente leitura) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-sm font-semibold">E-mail</label>
          <input type="email" value={usuario?.email || ""} disabled
            className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-400 cursor-not-allowed" />
          <p className="text-slate-400 text-xs">O e-mail não pode ser alterado.</p>
        </div>

        <div className="h-px bg-slate-200" />
        <p className="text-slate-600 text-sm font-semibold">Alterar senha <span className="text-slate-400 font-normal">(opcional)</span></p>

        {/* Senha atual */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-sm font-semibold">Senha atual</label>
          <div className="relative">
            <input type={showSenhaAtual ? "text" : "password"} value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)} placeholder="••••••••"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition pr-12" />
            <button onClick={() => setShowSenhaAtual(!showSenhaAtual)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {showSenhaAtual ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Nova senha */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-sm font-semibold">Nova senha</label>
          <div className="relative">
            <input type={showNovaSenha ? "text" : "password"} value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)} placeholder="Mínimo 6 caracteres"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition pr-12" />
            <button onClick={() => setShowNovaSenha(!showNovaSenha)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {showNovaSenha ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Confirmar nova senha */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-sm font-semibold">Confirmar nova senha</label>
          <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)}
            placeholder="Repita a nova senha"
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition" />
        </div>

        <button onClick={salvar} disabled={loading}
          className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-teal-900/30 active:scale-95 disabled:opacity-60">
          {loading ? "Salvando…" : "Salvar alterações"}
        </button>
      </div>
    </PageWrapper>
  );
}

// ─── REGIÕES FAVORITAS ────────────────────────────────────────────────────────
function RegioesFavoritasScreen({ setScreen, token, setPlanData }) {
  const [favoritos, setFavoritos] = useState([]);
  const [regioes, setRegioes] = useState([]);
  const [favIds, setFavIds] = useState([]);
  const [aba, setAba] = useState("favoritas");

  const carregar = async () => {
    const [favs, todas, ids] = await Promise.all([
      api.getFavoritos(token),
      api.getRegioes(token),
      api.getFavoritosIds(token),
    ]);
    if (Array.isArray(favs)) setFavoritos(favs);
    if (Array.isArray(todas)) setRegioes(todas);
    if (Array.isArray(ids)) setFavIds(ids);
  };

  useEffect(() => { carregar(); }, [token]);

  const toggleFavorito = async (regiao) => {
    if (favIds.includes(regiao.id)) {
      await api.desfavoritarRegiao(token, regiao.id);
      setFavIds((p) => p.filter((id) => id !== regiao.id));
      setFavoritos((p) => p.filter((f) => f.id !== regiao.id));
    } else {
      await api.favoritarRegiao(token, regiao.id);
      setFavIds((p) => [...p, regiao.id]);
      carregar();
    }
  };

  const irParaPlanner = (regiao) => {
    setPlanData((p) => ({ ...p, regiao }));
    setScreen("planner2");
  };

  return (
    <PageWrapper noNav>
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 px-6 pt-12 pb-10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
        <button onClick={() => setScreen("profile")} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white mb-6">←</button>
        <p className="text-cyan-300 text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5 mb-2">
          <span>🧭</span> Conexão Gaúcha
        </p>
        <h1 className="text-white text-3xl font-bold leading-tight">Regiões favoritas 📍</h1>
        <p className="text-teal-200 text-sm mt-1">Suas regiões preferidas do RS</p>
      </div>

      <div className="bg-slate-50 rounded-t-3xl -mt-4 px-5 pt-6 pb-10 relative z-10">
        {/* Abas */}
        <div className="flex gap-2 mb-5">
          {[{ id: "favoritas", label: "Minhas favoritas" }, { id: "todas", label: "Todas as regiões" }].map((a) => (
            <button key={a.id} onClick={() => setAba(a.id)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${aba === a.id ? "bg-teal-800 text-white" : "bg-white text-slate-500 border border-slate-200"}`}>
              {a.label}
            </button>
          ))}
        </div>

        {/* Aba: Favoritas */}
        {aba === "favoritas" && (
          <div className="flex flex-col gap-3">
            {favoritos.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">Nenhuma região favoritada ainda.<br />Vá em "Todas as regiões" para adicionar.</p>
            ) : (
              favoritos.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                  <div className="relative h-28">
                    <img src={getImg(r)} alt={r.nome} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-2 left-3">
                      <p className="text-white font-bold text-sm">{r.nome}</p>
                      <p className="text-white/60 text-xs">{r.total_roteiros} roteiro{r.total_roteiros !== 1 ? "s" : ""} feito{r.total_roteiros !== 1 ? "s" : ""}</p>
                    </div>
                    <button onClick={() => toggleFavorito(r)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-base">
                      ❤️
                    </button>
                  </div>
                  <div className="px-3 py-2.5">
                    <button onClick={() => irParaPlanner(r)}
                      className="w-full bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold py-2 rounded-xl transition">
                      + Planejar viagem aqui
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Aba: Todas */}
        {aba === "todas" && (
          <div className="flex flex-col gap-3">
            {regioes.map((r) => {
              const isFav = favIds.includes(r.id);
              return (
                <div key={r.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                  <div className="relative h-24">
                    <img src={getImg(r)} alt={r.nome} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <p className="absolute bottom-2 left-3 text-white font-bold text-sm">{r.nome}</p>
                    <button onClick={() => toggleFavorito(r)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-base">
                      {isFav ? "❤️" : "🤍"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

// ─── AVALIAÇÕES ───────────────────────────────────────────────────────────────
function AvaliacoesScreen({ setScreen, token }) {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [pendentes, setPendentes] = useState([]);
  const [aba, setAba] = useState("feitas");
  const [form, setForm] = useState(null); // { roteiro_id, titulo, estrelas, comentario }
  const [loading, setLoading] = useState(false);

  const carregar = async () => {
    const [avs, pends] = await Promise.all([
      api.getAvaliacoes(token),
      api.getAvaliacoesPendentes(token),
    ]);
    if (Array.isArray(avs)) setAvaliacoes(avs);
    if (Array.isArray(pends)) setPendentes(pends);
  };

  useEffect(() => { carregar(); }, [token]);

  const salvar = async () => {
    if (!form.estrelas) return;
    setLoading(true);
    await api.salvarAvaliacao(token, {
      roteiro_id: form.roteiro_id,
      estrelas: form.estrelas,
      comentario: form.comentario,
    });
    setLoading(false);
    setForm(null);
    carregar();
  };

  const deletar = async (roteiro_id) => {
    await api.deletarAvaliacao(token, roteiro_id);
    carregar();
  };

  const Estrelas = ({ valor, onChange }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} onClick={() => onChange && onChange(n)} className={`text-2xl ${n <= valor ? "text-yellow-400" : "text-slate-200"}`}>★</button>
      ))}
    </div>
  );

  return (
    <PageWrapper noNav>
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 px-6 pt-12 pb-10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
        <button onClick={() => setScreen("profile")} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white mb-6">←</button>
        <p className="text-cyan-300 text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5 mb-2">
          <span>🧭</span> Conexão Gaúcha
        </p>
        <h1 className="text-white text-3xl font-bold leading-tight">Avaliações ⭐</h1>
        <p className="text-teal-200 text-sm mt-1">Suas opiniões sobre os roteiros</p>
      </div>

      <div className="bg-slate-50 rounded-t-3xl -mt-4 px-5 pt-6 pb-10 relative z-10">
        {/* Abas */}
        <div className="flex gap-2 mb-5">
          {[{ id: "feitas", label: `Feitas (${avaliacoes.length})` }, { id: "pendentes", label: `Pendentes (${pendentes.length})` }].map((a) => (
            <button key={a.id} onClick={() => setAba(a.id)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${aba === a.id ? "bg-teal-800 text-white" : "bg-white text-slate-500 border border-slate-200"}`}>
              {a.label}
            </button>
          ))}
        </div>

        {/* Modal de avaliação */}
        {form && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setForm(null)} />
            <div className="relative w-full max-w-sm bg-white rounded-t-3xl shadow-2xl px-5 pt-6 pb-10 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-slate-800 font-bold">Avaliar roteiro</h3>
                <button onClick={() => setForm(null)} className="text-slate-400 text-xl">✕</button>
              </div>
              <p className="text-slate-600 text-sm">{form.titulo}</p>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 text-sm font-semibold">Nota</label>
                <Estrelas valor={form.estrelas || 0} onChange={(n) => setForm((p) => ({ ...p, estrelas: n }))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 text-sm font-semibold">Comentário <span className="text-slate-400 font-normal">(opcional)</span></label>
                <textarea value={form.comentario || ""} onChange={(e) => setForm((p) => ({ ...p, comentario: e.target.value }))}
                  placeholder="Como foi sua experiência?"
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition resize-none" />
              </div>
              <button onClick={salvar} disabled={!form.estrelas || loading}
                className="w-full bg-teal-800 text-white font-bold py-3.5 rounded-2xl transition disabled:opacity-60">
                {loading ? "Salvando…" : "Salvar avaliação"}
              </button>
            </div>
          </div>
        )}

        {/* Aba: Feitas */}
        {aba === "feitas" && (
          <div className="flex flex-col gap-3">
            {avaliacoes.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">Nenhuma avaliação feita ainda.</p>
            ) : (
              avaliacoes.map((a) => (
                <div key={a.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 font-bold text-sm truncate">{a.titulo}</p>
                      <p className="text-slate-400 text-xs">📍 {a.regiao_nome} · 📅 {a.data_inicio}</p>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <button onClick={() => setForm({ roteiro_id: a.roteiro_id, titulo: a.titulo, estrelas: a.estrelas, comentario: a.comentario })}
                        className="text-slate-400 hover:text-teal-600 text-sm">✏️</button>
                      <button onClick={() => deletar(a.roteiro_id)}
                        className="text-slate-400 hover:text-red-400 text-sm">🗑</button>
                    </div>
                  </div>
                  <div className="flex gap-0.5 my-2">
                    {[1,2,3,4,5].map((n) => (
                      <span key={n} className={`text-lg ${n <= a.estrelas ? "text-yellow-400" : "text-slate-200"}`}>★</span>
                    ))}
                  </div>
                  {a.comentario && <p className="text-slate-500 text-xs leading-relaxed bg-slate-50 rounded-xl px-3 py-2">{a.comentario}</p>}
                  <p className="text-slate-300 text-xs mt-2">{new Date(a.atualizado_em).toLocaleString("pt-BR")}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Aba: Pendentes */}
        {aba === "pendentes" && (
          <div className="flex flex-col gap-3">
            {pendentes.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">Todos os roteiros já foram avaliados! 🎉</p>
            ) : (
              pendentes.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
                  <img src={IMG_FALLBACK[r.regiao_slug] || IMG_FALLBACK['serra-gaucha']} alt={r.regiao_nome}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 font-bold text-sm truncate">{r.titulo}</p>
                    <p className="text-slate-400 text-xs">📍 {r.regiao_nome} · 📅 {r.data_inicio}</p>
                  </div>
                  <button onClick={() => setForm({ roteiro_id: r.id, titulo: r.titulo, estrelas: 0, comentario: "" })}
                    className="bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold px-3 py-1.5 rounded-xl transition flex-shrink-0">
                    Avaliar
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

// ─── NOTIFICAÇÕES ─────────────────────────────────────────────────────────────
function NotificacoesScreen({ setScreen, token }) {
  const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    api.getNotificacoes(token).then((data) => {
      if (Array.isArray(data)) setNotificacoes(data);
    });
    api.marcarNotificacoesLidas(token);
  }, [token]);

  return (
    <PageWrapper noNav>
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 px-6 pt-12 pb-10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
        <button onClick={() => setScreen("profile")} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white mb-6">←</button>
        <p className="text-cyan-300 text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5 mb-2">
          <span>🧭</span> Conexão Gaúcha
        </p>
        <h1 className="text-white text-3xl font-bold leading-tight">Notificações 🔔</h1>
        <p className="text-teal-200 text-sm mt-1">Seus alertas e novidades</p>
      </div>

      <div className="bg-slate-50 rounded-t-3xl -mt-4 px-5 pt-6 pb-10 relative z-10 flex flex-col gap-3">
        {notificacoes.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">Nenhuma notificação ainda.</p>
        ) : (
          notificacoes.map((n) => (
            <div key={n.id} className={`rounded-xl p-4 border ${n.lida ? "bg-white border-slate-100" : "bg-cyan-50 border-cyan-100"}`}>
              <p className="text-slate-800 font-semibold text-sm">{n.titulo}</p>
              <p className="text-slate-500 text-xs mt-1">{n.mensagem}</p>
              <p className="text-slate-300 text-xs mt-2">{new Date(n.criado_em).toLocaleString("pt-BR")}</p>
            </div>
          ))
        )}
      </div>
    </PageWrapper>
  );
}

// ─── PRIVACIDADE E SEGURANÇA ──────────────────────────────────────────────────
function PrivacidadeScreen({ setScreen }) {
  const secoes = [
    {
      titulo: "📋 Dados coletados",
      texto: "Coletamos apenas as informações necessárias para o funcionamento do app: nome completo, e-mail e senha (armazenada de forma criptografada). Também armazenamos os roteiros, avaliações e regiões favoritas que você cria dentro da plataforma.",
    },
    {
      titulo: "🔒 Como protegemos seus dados",
      texto: "Sua senha é armazenada com criptografia bcrypt e nunca é salva em texto puro. A autenticação é feita via token JWT com prazo de expiração. Nenhum dado sensível é trafegado sem autenticação.",
    },
    {
      titulo: "🚫 O que não fazemos",
      texto: "Não vendemos, compartilhamos ou repassamos seus dados pessoais a terceiros. Não utilizamos seus dados para fins publicitários. Não armazenamos informações de pagamento.",
    },
    {
      titulo: "📍 Uso dos dados de localização",
      texto: "O app utiliza coordenadas geográficas apenas para exibir locais no mapa via Google Maps. Nenhuma localização do seu dispositivo é coletada ou armazenada.",
    },
    {
      titulo: "🗑️ Exclusão de dados",
      texto: "Você pode excluir seus roteiros a qualquer momento pelo Histórico. Para solicitar a exclusão completa da sua conta e todos os dados associados, entre em contato pelo suporte.",
    },
    {
      titulo: "📬 Contato",
      texto: "Dúvidas sobre privacidade? Entre em contato: privacidade@conexaogaucha.com.br",
    },
  ];

  return (
    <PageWrapper noNav>
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 px-6 pt-12 pb-10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
        <button onClick={() => setScreen("profile")} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white mb-6">←</button>
        <p className="text-cyan-300 text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5 mb-2">
          <span>🧭</span> Conexão Gaúcha
        </p>
        <h1 className="text-white text-3xl font-bold leading-tight">Privacidade e segurança 🔒</h1>
        <p className="text-teal-200 text-sm mt-1">Como cuidamos dos seus dados</p>
      </div>

      <div className="bg-slate-50 rounded-t-3xl -mt-4 px-5 pt-6 pb-10 relative z-10 flex flex-col gap-4">
        {secoes.map((s) => (
          <div key={s.titulo} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <p className="text-slate-800 font-bold text-sm mb-2">{s.titulo}</p>
            <p className="text-slate-500 text-xs leading-relaxed">{s.texto}</p>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

// ─── AJUDA E SUPORTE ──────────────────────────────────────────────────────────
function AjudaScreen({ setScreen }) {
  const [aberto, setAberto] = useState(null);

  const faqs = [
    {
      pergunta: "Como criar um roteiro?",
      resposta: "Na barra inferior, toque em 'Planejar'. Escolha a região, defina as datas e selecione suas preferências e orçamento. O sistema monta o roteiro automaticamente com os melhores locais.",
    },
    {
      pergunta: "Como visualizar um roteiro já criado?",
      resposta: "Acesse 'Histórico' na barra inferior. Todos os seus roteiros aparecem listados. Toque em 'Ver roteiro' para visualizar o itinerário completo com dias e atrações.",
    },
    {
      pergunta: "Como exportar meu roteiro?",
      resposta: "Abra o roteiro desejado e toque no botão ⬇ no canto superior direito. O arquivo será baixado automaticamente no formato .txt com todos os detalhes da viagem.",
    },
    {
      pergunta: "Como compartilhar meu roteiro?",
      resposta: "Abra o roteiro e toque no botão ↗ no canto superior direito. Um link será gerado e você pode copiá-lo para compartilhar com quem quiser.",
    },
    {
      pergunta: "Como favoritar uma região?",
      resposta: "Vá em Perfil → Regiões favoritas → aba 'Todas as regiões'. Toque no ícone 🤍 ao lado da região desejada para favoritá-la. O ícone muda para ❤️ quando favoritada.",
    },
    {
      pergunta: "Como avaliar um roteiro?",
      resposta: "Vá em Perfil → Avaliações → aba 'Pendentes'. Toque em 'Avaliar' no roteiro desejado, escolha a nota em estrelas e escreva um comentário opcional.",
    },
    {
      pergunta: "Como alterar meu nome ou senha?",
      resposta: "Vá em Perfil → Dados pessoais. Você pode editar seu nome e alterar sua senha informando a senha atual e a nova senha.",
    },
    {
      pergunta: "Como excluir um roteiro?",
      resposta: "Acesse 'Histórico' na barra inferior e toque no ícone 🗑 ao lado do roteiro que deseja excluir. A ação é irreversível.",
    },
    {
      pergunta: "Por que meu roteiro ficou com custo R$0?",
      resposta: "Isso pode acontecer se a região escolhida não possui locais cadastrados com custo definido, ou se as preferências selecionadas não encontraram locais compatíveis. Tente criar um novo roteiro sem filtrar preferências.",
    },
    {
      pergunta: "O app funciona sem internet?",
      resposta: "Não. O Conexão Gaúcha precisa de conexão com a internet para carregar regiões, gerar roteiros e salvar seus dados. Certifique-se de estar conectado ao usar o app.",
    },
  ];

  return (
    <PageWrapper noNav>
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 px-6 pt-12 pb-10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
        <button onClick={() => setScreen("profile")} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white mb-6">←</button>
        <p className="text-cyan-300 text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5 mb-2">
          <span>🧭</span> Conexão Gaúcha
        </p>
        <h1 className="text-white text-3xl font-bold leading-tight">Ajuda e suporte ❓</h1>
        <p className="text-teal-200 text-sm mt-1">Perguntas frequentes</p>
      </div>

      <div className="bg-slate-50 rounded-t-3xl -mt-4 px-5 pt-6 pb-10 relative z-10 flex flex-col gap-3">
        {faqs.map((f, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <button
              onClick={() => setAberto(aberto === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-4 text-left">
              <p className="text-slate-800 font-semibold text-sm flex-1 pr-2">{f.pergunta}</p>
              <span className={`text-slate-400 text-lg transition-transform ${aberto === i ? "rotate-180" : ""}`}>⌄</span>
            </button>
            {aberto === i && (
              <div className="px-4 pb-4">
                <p className="text-slate-500 text-xs leading-relaxed">{f.resposta}</p>
              </div>
            )}
          </div>
        ))}
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
    home: <HomeScreen setScreen={setScreen} usuario={usuario} token={token} setRoteiroAtivo={setRoteiroAtivo} setPlanData={setPlanData} />,
    planner: <PlannerStep1 setScreen={setScreen} setPlanData={setPlanData} token={token} />,
    planner2: <PlannerStep2 setScreen={setScreen} planData={planData} setPlanData={setPlanData} />,
    planner3: <PlannerStep3 setScreen={setScreen} planData={planData} setPlanData={setPlanData} token={token} setRoteiroAtivo={setRoteiroAtivo} />,
    itinerary: <ItineraryScreen setScreen={setScreen} roteiro={roteiroAtivo} />,
    history: <HistoryScreen setScreen={setScreen} token={token} setRoteiroAtivo={setRoteiroAtivo} />,
    profile: <ProfileScreen setScreen={setScreen} token={token} onLogout={onLogout} />,
    dadosPessoais: <DadosPessoaisScreen setScreen={setScreen} token={token} usuario={usuario} onLogin={onLogin} />,
    regioesFavoritas: <RegioesFavoritasScreen setScreen={setScreen} token={token} setPlanData={setPlanData} />,
    avaliacoes: <AvaliacoesScreen setScreen={setScreen} token={token} />,
    itinerary: <ItineraryScreen setScreen={setScreen} roteiro={roteiroAtivo} token={token} />,
    notificacoes: <NotificacoesScreen setScreen={setScreen} token={token} />,
    privacidade: <PrivacidadeScreen setScreen={setScreen} />,
    ajuda: <AjudaScreen setScreen={setScreen} />,
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