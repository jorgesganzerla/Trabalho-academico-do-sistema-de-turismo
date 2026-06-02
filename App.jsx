import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import serra_gaucha from "./assets/serra_gaucha.jpg";
import vale_dos_vinhedos from "./assets/vale_dos_vinhedos.jpeg";
import porto_alegre from "./assets/porto_alegre.jpg";
import { api } from "./api";

const IMG_FALLBACK = {
  'serra-gaucha':    serra_gaucha,
  'litoral-gaucho':  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
  'missoes':         'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400&q=80',
  'campanha-gaucha': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80',
  'porto-alegre':    porto_alegre,
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
function LoginScreen({ setScreen, onLogin, showToast }) {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const [recuperando, setRecuperando] = useState(false);
  const [msgRecupera, setMsgRecupera] = useState("");

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

  const handleRecuperarSenha = async () => {
    if (!email) return setErro("Digite seu e-mail para recuperar a senha.");
    setRecuperando(true);
    try {
      const res = await api.recuperarSenha(email);
      setRecuperando(false);
      if (res.error) {
        showToast('error', res.error);
      } else {
        showToast('success', 'E-mail de recuperação enviado!');
        setMsgRecupera(res.message || "Link enviado!");
      }
    } catch {
      setRecuperando(false);
      showToast('error', 'Erro ao enviar e-mail de recuperação. Tente novamente.');
    }
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
        {msgRecupera && <p className="text-teal-700 text-sm bg-teal-50 px-4 py-2 rounded-xl">{msgRecupera}</p>}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-sm font-semibold">E-mail</label>
          <input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between">
            <label className="text-slate-700 text-sm font-semibold">Senha</label>
            <button onClick={handleRecuperarSenha} disabled={recuperando} className="text-teal-600 text-sm font-medium hover:underline">{recuperando ? "Enviando…" : "Esqueci a senha"}</button>
          </div>
          <div className="relative">
            <input type={showPw ? "text" : "password"} placeholder="••••••••" value={pw} onChange={(e) => setPw(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition pr-12" />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600">
          <input type="checkbox" defaultChecked className="accent-teal-700 w-4 h-4" id="lembrar" />
          <span>Lembrar-me</span>
        </label>
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

// ─── REDEFINIR SENHA (CT-09) ────────────────────────────────────────────────
function ResetPasswordScreen({ setScreen, resetToken, showToast }) {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRedefinir = async () => {
    setErro("");
    if (!novaSenha || novaSenha.length < 6)
      return setErro("A nova senha deve ter no mínimo 6 caracteres.");
    if (novaSenha !== confirmar)
      return setErro("As senhas não coincidem.");

    setLoading(true);
    const res = await api.redefinirSenha(resetToken, novaSenha);
    setLoading(false);

    if (res.error) return setErro(res.error);

    setSucesso("Senha redefinida! Faça login.");
    showToast('success', 'Senha redefinida! Faça login.');
    setTimeout(() => {
      window.history.replaceState({}, '', '/');
      setScreen("login");
    }, 2000);
  };

  return (
    <PageWrapper noNav>
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 px-6 pt-12 pb-10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5" />
        <button onClick={() => { window.history.replaceState({}, '', '/'); setScreen("login"); }}
          className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white mb-6">←</button>
        <p className="text-cyan-300 text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5 mb-2">
          <span>🧭</span> Conexão Gaúcha
        </p>
        <h1 className="text-white text-3xl font-bold leading-tight">Redefinir senha 🔒</h1>
        <p className="text-teal-200 text-sm mt-1">Crie uma nova senha para sua conta</p>
      </div>

      <div className="bg-slate-50 rounded-t-3xl -mt-4 px-6 pt-8 pb-10 flex flex-col gap-5 relative z-10">
        {erro && <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl">{erro}</p>}
        {sucesso && <p className="text-teal-700 text-sm bg-teal-50 px-4 py-2 rounded-xl">{sucesso}</p>}

        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-sm font-semibold">Nova senha</label>
          <div className="relative">
            <input type={showPw ? "text" : "password"} placeholder="••••••••" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition pr-12" />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-sm font-semibold">Confirmar nova senha</label>
          <input type={showPw ? "text" : "password"} placeholder="••••••••" value={confirmar} onChange={(e) => setConfirmar(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition" />
        </div>

        <p className="text-slate-400 text-xs">Mínimo de 6 caracteres</p>

        <button onClick={handleRedefinir} disabled={loading}
          className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-teal-900/30 active:scale-95 disabled:opacity-60">
          {loading ? "Redefinindo…" : "Redefinir senha"}
        </button>

        <p className="text-center text-slate-500 text-sm">
          Lembrou a senha?{" "}
          <button onClick={() => { window.history.replaceState({}, '', '/'); setScreen("login"); }} className="text-teal-700 font-bold hover:underline">Fazer login</button>
        </p>
      </div>
    </PageWrapper>
  );
}

// ─── CADASTRO ─────────────────────────────────────────────────────────────────
function RegisterScreen({ setScreen, onLogin, showToast }) {
  const [showPw, setShowPw] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [lgpd, setLgpd] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setErro("");
    if (!nome || !email || !pw || !pwConfirm) return setErro("Preencha todos os campos.");
    if (pw !== pwConfirm) return setErro("As senhas não coincidem.");
    if (pw.length < 6) return setErro("A senha deve ter no mínimo 6 caracteres.");
    if (!lgpd) return setErro("Você precisa aceitar a Política de Privacidade (LGPD) para continuar.");
    setLoading(true);
    const res = await api.register(nome, email, pw);
    setLoading(false);
    if (res.error) return setErro(res.error);
    onLogin(res.token, res.usuario);
    showToast('success', 'Conta criada com sucesso! Bem-vindo(a)!');
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
        <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
          <input type="checkbox" checked={lgpd} onChange={e => setLgpd(e.target.checked)}
            className="mt-0.5 accent-teal-700 w-4 h-4 flex-shrink-0" />
          <span>Li e aceito a <span className="text-teal-700 font-semibold">Política de Privacidade</span> e o tratamento dos meus dados conforme a <span className="font-semibold">LGPD (Lei nº 13.709/2018)</span>.</span>
        </label>
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
function HomeScreen({ setScreen, usuario, token, setRoteiroAtivo, showToast }) {
  const [roteiros, setRoteiros] = useState([]);
  const [buscaQ, setBuscaQ] = useState("");
  const [resultadosBusca, setResultadosBusca] = useState(null);

  useEffect(() => {
    api.getRoteiros(token).then((data) => {
      if (Array.isArray(data)) setRoteiros(data.slice(0, 2));
    });
  }, [token]);

  const handleBusca = async (q) => {
    setBuscaQ(q);
    if (!q.trim()) { setResultadosBusca(null); return; }
    const data = await api.buscarLocais(token, q);
    setResultadosBusca(Array.isArray(data) ? data : []);
  };

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
          <input
            placeholder="Buscar destino ou atividade..."
            value={buscaQ}
            onChange={(e) => handleBusca(e.target.value)}
            className="bg-transparent flex-1 text-sm text-slate-600 placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {resultadosBusca !== null && (
        <div className="px-5 pb-4 bg-white">
          {resultadosBusca.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">Nenhum local encontrado para "{buscaQ}".</p>
          ) : (
            <div className="flex flex-col gap-2">
              {resultadosBusca.slice(0, 5).map((l) => (
                <div key={l.id} className="flex gap-3 bg-slate-50 rounded-xl p-3">
                  {l.imagem_url && <img src={l.imagem_url} alt={l.nome} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 font-semibold text-sm truncate">{l.nome}</p>
                    <p className="text-slate-400 text-xs">📍 {l.cidade} · {l.regiao_nome}</p>
                    <p className="text-teal-700 text-xs font-medium">R$ {Number(l.custo_medio).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
                <img src={IMG_FALLBACK[r.regiao_slug] || IMG_FALLBACK.serra} alt={"Imagem de " + (r.regiao_nome || "região")}
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
function PlannerStep1({ setScreen, setPlanData, token, showToast }) {
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
                <img src={getImg(r)} alt={"Imagem de " + r.nome} className="w-full h-28 object-cover" />
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
          onClick={() => {
            setPlanData((p) => {
              if (p.regiao && p.regiao.id !== selected.id) {
                if (!window.confirm("Mudar de região irá resetar o roteiro atual. Deseja continuar?")) return p;
              }
              return { regiao: selected };
            });
            setScreen("planner2");
          }}
          className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${selected ? "bg-teal-800 text-white hover:bg-teal-900 active:scale-95 shadow-lg" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>
          Continuar →
        </button>
      </div>
    </PageWrapper>
  );
}

// ─── PLANNER STEP 2 ───────────────────────────────────────────────────────────
function PlannerStep2({ setScreen, planData, setPlanData, showToast }) {
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
            <img src={getImg(region)} alt={"Paisagem de " + region.nome} className="w-full h-full object-cover" />
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
          onClick={() => {
            if (end && start && end <= start) {
              showToast('error', 'A data de retorno deve ser posterior à data de início.');
              return;
            }
            setPlanData((p) => ({ ...p, start, end }));
            setScreen("planner3");
          }}
          className={`w-full py-4 rounded-2xl font-bold text-sm mt-2 transition-all ${start && end ? "bg-teal-800 text-white hover:bg-teal-900 active:scale-95 shadow-lg" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>
          Continuar →
        </button>
      </div>
    </PageWrapper>
  );
}

// ─── PLANNER STEP 3 ───────────────────────────────────────────────────────────
function PlannerStep3({ setScreen, planData, setPlanData, token, setRoteiroAtivo, showToast }) {
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
    showToast('success', 'Roteiro criado com sucesso!');
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
function ItineraryScreen({ setScreen, roteiro: roteiroInicial, token, showToast }) {
  const [roteiro, setRoteiro] = useState(roteiroInicial);
  const [viajantes, setViajantes] = useState(1);
  const [orcamentoLimite, setOrcamentoLimite] = useState("");
  const [compartilhando, setCompartilhando] = useState(false);
  const [linkComp, setLinkComp] = useState("");
  const [mostraShare, setMostraShare] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [voos, setVoos] = useState(null);
  const [buscandoVoos, setBuscandoVoos] = useState(false);
  const [origemVoo, setOrigemVoo] = useState("São Paulo");
  const [dataIdaVoo, setDataIdaVoo] = useState("");
  const [dataVoltaVoo, setDataVoltaVoo] = useState("");
  const [vooEscolhido, setVooEscolhido] = useState(null);
  const [vooMsg, setVooMsg] = useState(null); // { tipo: 'ok'|'erro', texto }
  const [km, setKm] = useState(null);
  const [calculandoKm, setCalculandoKm] = useState(false);

  useEffect(() => {
    setRoteiro(roteiroInicial);
    if (roteiroInicial) {
      // Pré-preenche datas com as do roteiro (formato YYYY-MM-DD)
      const fmtDate = (d) => d ? String(d).slice(0, 10) : "";
      setDataIdaVoo(fmtDate(roteiroInicial.data_inicio));
      setDataVoltaVoo(fmtDate(roteiroInicial.data_fim));
      // Carrega voo escolhido previamente
      api.getVooEscolhido(token, roteiroInicial.id).then(res => {
        if (res.voo) setVooEscolhido(res.voo);
      }).catch(() => {});
    }
  }, [roteiroInicial]);

  if (!roteiro) return (
    <PageWrapper screen="home" setScreen={setScreen}>
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-400 text-sm">Nenhum roteiro selecionado.</p>
      </div>
    </PageWrapper>
  );

  const custoTotal = Number(roteiro.custo_total);
  const custoPorPessoa = viajantes > 1 ? (custoTotal / viajantes).toFixed(2) : null;
  const acimaDoBudget = orcamentoLimite && custoTotal > Number(orcamentoLimite);
  const imgHero = IMG_FALLBACK[roteiro.regiao_slug] || IMG_FALLBACK["serra-gaucha"];

  // CT-66/68: Exportar roteiro
  const handleExportar = async () => {
    setExportando(true);
    try {
      const res = await api.exportarRoteiro(token, roteiro.id);
      if (!res.ok) { showToast('error', 'Erro ao exportar roteiro.'); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `roteiro-${roteiro.id}.txt`; a.click();
      URL.revokeObjectURL(url);
      showToast('success', 'Roteiro exportado com sucesso!');
    } catch {
      showToast('error', 'Erro ao exportar roteiro. Tente novamente.');
    } finally { setExportando(false); }
  };

  // CT-69/71/75: Compartilhar roteiro
  const handleCompartilhar = async () => {
    setCompartilhando(true);
    try {
      const res = await api.compartilharRoteiro(token, roteiro.id);
      setCompartilhando(false);
      if (res.link) { setLinkComp(res.link); setMostraShare(true); showToast('success', 'Link de compartilhamento gerado!'); }
      else showToast('error', 'Erro ao gerar link de compartilhamento.');
    } catch {
      setCompartilhando(false);
      showToast('error', 'Erro ao compartilhar roteiro. Tente novamente.');
    }
  };

  // CT-28: Remover item
  const handleRemoverItem = async (itemId, diaIdx, itemIdx) => {
    if (!window.confirm("Remover esta atividade?")) return;
    const res = await api.removerItem(token, itemId);
    if (res.message) {
      setRoteiro(r => {
        const dias = r.dias.map((d, di) => di !== diaIdx ? d : {
          ...d, itens: d.itens.filter((_, ii) => ii !== itemIdx)
        });
        return { ...r, dias };
      });
    }
  };

  // CT-43: Check-in (marcar como concluído)
  const handleCheckin = async (itemId, diaIdx, itemIdx, atual) => {
    const res = await api.atualizarItem(token, itemId, { concluido: !atual });
    if (res.message) {
      setRoteiro(r => {
        const dias = r.dias.map((d, di) => di !== diaIdx ? d : {
          ...d, itens: d.itens.map((it, ii) => ii !== itemIdx ? it : { ...it, concluido: !atual })
        });
        return { ...r, dias };
      });
    }
  };

  // CT-39: Salvar nota
  const handleSalvarNota = async (itemId, nota, diaIdx, itemIdx) => {
    const res = await api.atualizarItem(token, itemId, { nota });
    if (res.message) {
      setRoteiro(r => {
        const dias = r.dias.map((d, di) => di !== diaIdx ? d : {
          ...d, itens: d.itens.map((it, ii) => ii !== itemIdx ? it : { ...it, nota })
        });
        return { ...r, dias };
      });
    }
  };

  // CT-40: Limpar dia
  const handleLimparDia = async (diaId, diaIdx) => {
    if (!window.confirm("Remover todas as atividades deste dia?")) return;
    const res = await api.limparDia(token, diaId);
    if (res.message) {
      setRoteiro(r => {
        const dias = r.dias.map((d, di) => di !== diaIdx ? d : { ...d, itens: [] });
        return { ...r, dias };
      });
    }
  };

  // CT-50: Otimizar rota
  const handleOtimizar = async (diaId) => {
    try {
      const res = await api.otimizarRota(token, diaId);
      if (res.message) {
        const atualizado = await api.getRoteiro(token, roteiro.id);
        if (!atualizado.error) setRoteiro(atualizado);
        showToast('success', 'Rota otimizada com sucesso!');
      } else {
        showToast('error', res.error || 'Erro ao otimizar rota.');
      }
    } catch {
      showToast('error', 'Erro ao otimizar rota. Tente novamente.');
    }
  };

  // CT-61: Buscar voos (com datas editáveis)
  const handleBuscarVoos = async () => {
    setBuscandoVoos(true);
    setVooMsg(null);
    try {
      const res = await api.buscarVoos(token, roteiro.id, origemVoo, dataIdaVoo, dataVoltaVoo);
      if (res.error) {
        const msgAmigavel = 'Serviço de voos indisponível no momento. Tente novamente em alguns minutos.';
        setVooMsg({ tipo: 'erro', texto: msgAmigavel });
        showToast('error', msgAmigavel);
        setVoos([]);
      } else if (!res.voos || res.voos.length === 0) {
        setVoos([]);
        showToast('error', 'Nenhum voo encontrado para esse trecho e datas.');
      } else {
        setVoos(res.voos);
        showToast('success', `${res.voos.length} voo(s) encontrado(s)!`);
      }
    } catch {
      const msgAmigavel = 'Serviço de voos indisponível no momento. Tente novamente em alguns minutos.';
      setVooMsg({ tipo: 'erro', texto: msgAmigavel });
      showToast('error', msgAmigavel);
      setVoos([]);
    }
    setBuscandoVoos(false);
  };

  // CT-61: Selecionar/salvar voo
  const handleEscolherVoo = async (v) => {
    setVooMsg(null);
    try {
      const dados = {
        origem: origemVoo || 'São Paulo',
        destino: 'Porto Alegre',
        data_ida: dataIdaVoo || roteiro.data_inicio,
        data_volta: dataVoltaVoo || roteiro.data_fim,
        companhia: v.companhia,
        preco: v.preco || v.preco_raw || null,
        moeda: v.moeda || 'BRL',
        link_externo: v.link_reserva || null,
        payload_json: v,
      };
      const res = await api.escolherVoo(token, roteiro.id, dados);
      if (res.error) { showToast('error', res.error); return; }
      setVooEscolhido(res.voo);
      showToast('success', 'Voo salvo!');
      if (v.link_reserva) window.open(v.link_reserva, '_blank');
    } catch { showToast('error', 'Erro ao salvar voo. Tente novamente.'); }
  };

  // CT-97: Hash dos itens para detectar mudanças e recalcular km automaticamente
  const itensHash = useMemo(() => JSON.stringify(
    (roteiro?.dias || []).flatMap(d =>
      (d.itens || []).map(i => `${d.numero_dia}:${i.id}:${i.ordem}:${i.latitude}:${i.longitude}:${i.checkin}:${i.checkout}:${i.nota}`)
    )
  ), [roteiro]);

  const handleCalcularKm = useCallback(async () => {
    if (!roteiro?.id) return;
    setCalculandoKm(true);
    try {
      const res = await api.calcularKm(token, roteiro.id);
      setKm(res ?? { erro: true });
    } catch {
      setKm({ erro: true });
    } finally {
      setCalculandoKm(false);
    }
  }, [roteiro?.id, token]);

  // Auto-recálculo com debounce de 500ms quando itens mudam
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (!roteiro?.id) return;
    // Pula o primeiro render para não disparar imediatamente ao montar
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      handleCalcularKm();
    }, 500);
    return () => clearTimeout(timer);
  }, [itensHash]); // eslint-disable-line react-hooks/exhaustive-deps

  // CT-58: Distribuição de gastos por categoria
  const categorias = {};
  (roteiro.dias || []).forEach(d => (d.itens || []).forEach(it => {
    const cat = it.categoria || "outros";
    categorias[cat] = (categorias[cat] || 0) + Number(it.custo_medio || 0);
  }));
  const catEntries = Object.entries(categorias);

  return (
    <PageWrapper screen="home" setScreen={setScreen}>
      {/* Hero */}
      <div className="relative h-56">
        <img src={imgHero} alt={`Região ${roteiro.regiao_nome}`} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <button onClick={() => setScreen("home")} aria-label="Voltar para início"
            className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center text-white text-sm backdrop-blur-sm">←</button>
          <div className="flex gap-2">
            <button onClick={handleExportar} disabled={exportando} title="Exportar roteiro"
              className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center text-white text-sm backdrop-blur-sm">
              {exportando ? "…" : "📥"}
            </button>
            <button onClick={handleCompartilhar} disabled={compartilhando} title="Compartilhar roteiro"
              className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center text-white text-sm backdrop-blur-sm">
              {compartilhando ? "…" : "🔗"}
            </button>
          </div>
        </div>
        <div className="absolute bottom-4 left-4">
          <p className="text-white/70 text-xs">📍 {roteiro.regiao_nome}</p>
          <h1 className="text-white text-xl font-bold">{roteiro.titulo}</h1>
        </div>
      </div>

      {/* CT-69/71/75: Modal de compartilhamento */}
      {mostraShare && (
        <div className="mx-4 mt-3 bg-teal-50 border border-teal-200 rounded-2xl p-4">
          <p className="text-teal-800 font-semibold text-sm mb-2">🔗 Link de compartilhamento</p>
          <div className="flex gap-2 mb-3">
            <input readOnly value={linkComp}
              className="flex-1 bg-white border border-teal-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none" />
            <button onClick={() => { navigator.clipboard.writeText(linkComp); showToast('success', 'Link copiado!'); }}
              className="bg-teal-700 text-white text-xs px-3 py-2 rounded-xl font-semibold">Copiar</button>
          </div>
          {/* CT-71: WhatsApp */}
          <div className="flex gap-2">
            <a href={`https://wa.me/?text=${encodeURIComponent("Confira meu roteiro: " + linkComp)}`}
              target="_blank" rel="noreferrer"
              className="flex-1 bg-green-500 text-white text-xs font-bold py-2 rounded-xl text-center">
              📱 WhatsApp
            </a>
            {/* CT-75: QR Code via API pública */}
            <a href={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(linkComp)}`}
              target="_blank" rel="noreferrer"
              className="flex-1 bg-slate-700 text-white text-xs font-bold py-2 rounded-xl text-center">
              📷 QR Code
            </a>
          </div>
          <button onClick={() => setMostraShare(false)} className="mt-2 text-slate-400 text-xs w-full text-center">Fechar</button>
        </div>
      )}

      {/* Resumo financeiro */}
      <div className="mx-4 -mt-4 relative z-10 bg-white rounded-2xl shadow-lg p-4 mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full capitalize">{roteiro.nivel_orcamento}</span>
          <span className={`font-bold text-lg ${acimaDoBudget ? "text-red-600" : "text-teal-800"}`}>
            💰 R$ {custoTotal.toFixed(2)} {acimaDoBudget && "⚠️"}
          </span>
        </div>
        {acimaDoBudget && (
          <p className="text-red-500 text-xs bg-red-50 px-3 py-1.5 rounded-lg mb-2">Atenção: custo acima do orçamento definido!</p>
        )}
        <div className="flex gap-3 text-xs text-slate-500 mb-3">
          <span>📅 {roteiro.data_inicio} → {roteiro.data_fim}</span>
        </div>

        {/* CT-56: Rateio por viajantes */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-slate-600 text-xs">👥 Viajantes:</span>
          <button onClick={() => setViajantes(v => Math.max(1, v - 1))}
            className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-sm flex items-center justify-center">−</button>
          <span className="text-slate-800 font-semibold text-sm w-4 text-center">{viajantes}</span>
          <button onClick={() => setViajantes(v => v + 1)}
            className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-sm flex items-center justify-center">+</button>
          {custoPorPessoa && <span className="text-teal-700 text-xs font-semibold ml-1">≈ R$ {custoPorPessoa}/pessoa</span>}
        </div>

        {/* CT-57: Limite de orçamento */}
        <div className="flex items-center gap-2">
          <span className="text-slate-600 text-xs">🎯 Orçamento limite:</span>
          <input type="number" placeholder="Ex: 500" value={orcamentoLimite}
            onChange={e => setOrcamentoLimite(e.target.value)}
            className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-400" />
        </div>
      </div>

      {/* CT-58: Gráfico de gastos por categoria */}
      {catEntries.length > 0 && (
        <div className="mx-4 mb-3 bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <p className="text-slate-700 font-semibold text-sm mb-3">📊 Gastos por categoria</p>
          <div className="flex flex-col gap-2">
            {catEntries.map(([cat, val]) => {
              const pct = custoTotal > 0 ? Math.round((val / custoTotal) * 100) : 0;
              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs text-slate-600 mb-0.5">
                    <span className="capitalize">{cat}</span>
                    <span>R$ {val.toFixed(2)} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-teal-500 h-1.5 rounded-full transition-all" style={{ width: pct + "%" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CT-61: Painel de Voos (datas editáveis + persistência) */}
      <div className="mx-4 mb-3 bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <p className="text-slate-700 font-semibold text-sm mb-3">✈️ Buscar passagens aéreas</p>

        {/* Toast de feedback */}
        {vooMsg && (
          <p className={`text-xs px-3 py-2 rounded-xl mb-3 ${vooMsg.tipo === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {vooMsg.texto}
          </p>
        )}

        {/* Voo escolhido anteriormente */}
        {vooEscolhido && (
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 mb-3">
            <p className="text-teal-800 font-bold text-xs mb-1">✈️ Voo escolhido</p>
            <p className="text-slate-700 text-xs">
              {vooEscolhido.companhia && <span className="font-semibold">{vooEscolhido.companhia} · </span>}
              {vooEscolhido.origem} → {vooEscolhido.destino}
            </p>
            <p className="text-slate-500 text-xs">
              Ida: {vooEscolhido.data_ida ? String(vooEscolhido.data_ida).slice(0,10) : '—'}
              {vooEscolhido.data_volta && ` · Volta: ${String(vooEscolhido.data_volta).slice(0,10)}`}
              {vooEscolhido.preco && ` · ${vooEscolhido.moeda || 'BRL'} ${Number(vooEscolhido.preco).toFixed(2)}`}
            </p>
            {vooEscolhido.link_externo && (
              <a href={vooEscolhido.link_externo} target="_blank" rel="noreferrer"
                className="inline-block mt-2 text-teal-700 text-xs font-semibold underline hover:text-teal-900">
                Ver no Skyscanner ↗
              </a>
            )}
          </div>
        )}

        {/* Inputs: origem + datas */}
        <div className="flex flex-wrap gap-2 mb-3">
          <input value={origemVoo} onChange={e => setOrigemVoo(e.target.value)}
            placeholder="Cidade de origem"
            className="flex-1 min-w-[120px] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-400" />
          <div className="flex flex-col">
            <label className="text-slate-400 text-[10px] mb-0.5 ml-1">Ida</label>
            <input type="date" value={dataIdaVoo} onChange={e => setDataIdaVoo(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-400" />
          </div>
          <div className="flex flex-col">
            <label className="text-slate-400 text-[10px] mb-0.5 ml-1">Volta</label>
            <input type="date" value={dataVoltaVoo} onChange={e => setDataVoltaVoo(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-400" />
          </div>
          <button onClick={handleBuscarVoos} disabled={buscandoVoos}
            className="self-end bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl disabled:opacity-60">
            {buscandoVoos ? "Buscando…" : "Buscar"}
          </button>
        </div>

        {/* Skeleton de carregamento */}
        {buscandoVoos && (
          <div className="flex flex-col gap-2">
            {[1,2,3].map(i => (
              <div key={i} className="bg-slate-100 rounded-xl p-3 animate-pulse h-16" />
            ))}
          </div>
        )}

        {/* Resultados */}
        {!buscandoVoos && voos === null && (
          <p className="text-slate-400 text-xs text-center py-2">Clique em buscar para encontrar voos.</p>
        )}
        {!buscandoVoos && voos !== null && voos.length === 0 && (
          <p className="text-slate-400 text-xs text-center py-2">Nenhum voo encontrado para esse trecho.</p>
        )}
        {!buscandoVoos && voos && voos.length > 0 && (
          <div className="flex flex-col gap-2">
            {voos.map((v, i) => (
              <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 hover:bg-teal-50 transition">
                {v.logo && <img src={v.logo} alt={"Logo " + v.companhia} className="w-8 h-8 rounded object-contain" />}
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 font-semibold text-xs">{v.companhia}</p>
                  <p className="text-slate-400 text-xs">{v.paradas === 0 ? "Direto" : `${v.paradas} parada(s)`} · {v.duracao_minutos}min</p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <p className="text-teal-700 font-bold text-sm">{v.preco_formatado}</p>
                  <button onClick={() => handleEscolherVoo(v)}
                    className="bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold px-3 py-1 rounded-lg transition">
                    Selecionar este voo
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CT-97: Km percorridos — recálculo automático */}
      <div className="mx-4 mb-3 bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-slate-700 font-semibold text-sm">🛣️ Distância total do roteiro</p>
            {calculandoKm && (
              <p className="text-teal-600 text-xs mt-0.5 animate-pulse">Atualizando…</p>
            )}
            {!calculandoKm && km && !km.erro && km.km > 0 && (
              <p className="text-slate-500 text-xs mt-0.5">
                {km.km} km · ~{km.duracao_minutos} min de carro · {km.pontos} locais
              </p>
            )}
            {!calculandoKm && km && !km.erro && km.km === 0 && km.pontos < 2 && (
              <p className="text-slate-400 text-xs mt-0.5">Adicione ao menos 2 locais com coordenadas para ver a distância total.</p>
            )}
            {!calculandoKm && km && km.erro && (
              <p className="text-red-400 text-xs mt-0.5">Não foi possível calcular a distância agora.</p>
            )}
            {!calculandoKm && km?.message && !km.erro && <p className="text-slate-400 text-xs mt-0.5">{km.message}</p>}
          </div>
          <button onClick={handleCalcularKm} disabled={calculandoKm}
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold px-3 py-2 rounded-xl transition disabled:opacity-60 ml-2 shrink-0">
            {calculandoKm ? "Calculando…" : km ? "Recalcular" : "Calcular"}
          </button>
        </div>
      </div>

      {/* Dias */}
      <div className="px-4 pb-8 flex flex-col gap-5">
        {(roteiro.dias || []).map((dia, diaIdx) => (
          <div key={dia.id}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-teal-800 text-white text-xs font-bold flex items-center justify-center">{dia.numero_dia}</div>
                <div>
                  <p className="text-slate-800 font-bold text-sm">Dia {dia.numero_dia}</p>
                  <p className="text-slate-400 text-xs">{dia.data}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 text-sm font-semibold">💲 R$ {Number(dia.custo_dia).toFixed(2)}</span>
                {/* CT-50: Otimizar */}
                <button onClick={() => handleOtimizar(dia.id)} title="Otimizar rota do dia"
                  className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-lg font-medium">🗺 Otimizar</button>
                {/* CT-40: Limpar dia */}
                <button onClick={() => handleLimparDia(dia.id, diaIdx)} title="Limpar dia"
                  className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded-lg font-medium">🗑 Limpar</button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {(dia.itens || []).map((item, itemIdx) => (
                <ItemCard key={item.id || itemIdx}
                  item={item} token={token}
                  onRemover={() => handleRemoverItem(item.id, diaIdx, itemIdx)}
                  onCheckin={() => handleCheckin(item.id, diaIdx, itemIdx, item.concluido)}
                  onSalvarNota={(nota) => handleSalvarNota(item.id, nota, diaIdx, itemIdx)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

// ── Card de item do roteiro (CT-28/33/39/43/46/47) ────────────────────────────
function ItemCard({ item, onRemover, onCheckin, onSalvarNota }) {
  const [mostraNota, setMostraNota] = useState(false);
  const [nota, setNota] = useState(item.nota || "");

  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-sm border ${item.concluido ? "border-teal-300 opacity-80" : "border-slate-100"}`}>
      {item.imagem_url && (
        <div className="relative">
          <img src={item.imagem_url} alt={`Local ${item.local_nome || item.nome_manual}`} className="w-full h-36 object-cover" />
          <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm font-medium">{item.horario}</div>
          {item.avaliacao > 0 && <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-lg font-bold">⭐ {item.avaliacao}</div>}
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h4 className={`text-slate-800 font-bold text-base ${item.concluido ? "line-through text-slate-400" : ""}`}>
            {item.local_nome || item.nome_manual || "Atividade manual"}
          </h4>
          <span className="text-slate-400 text-xs ml-2 shrink-0">📍 {item.cidade || ""}</span>
        </div>
        {item.descricao && <p className="text-slate-500 text-xs leading-relaxed mb-3">{item.descricao}</p>}
        <div className="flex gap-2 mb-3 flex-wrap">
          {item.custo_medio > 0 && <span className="bg-teal-50 text-teal-700 text-xs px-3 py-1.5 rounded-full font-medium">💲 R$ {Number(item.custo_medio).toFixed(2)}</span>}
          {item.duracao_estimada && <span className="bg-slate-50 text-slate-600 text-xs px-3 py-1.5 rounded-full">⏱ {item.duracao_estimada}</span>}
        </div>

        {/* CT-39: Nota */}
        {mostraNota && (
          <div className="mb-3">
            <textarea value={nota} onChange={e => setNota(e.target.value)} placeholder="Ex: Levar casaco, reservar com antecedência..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-400 resize-none" rows={2} />
            <button onClick={() => { onSalvarNota(nota); setMostraNota(false); }}
              className="mt-1 text-xs bg-teal-700 text-white px-3 py-1.5 rounded-lg font-medium">Salvar nota</button>
          </div>
        )}
        {item.nota && !mostraNota && (
          <p className="text-slate-500 text-xs italic mb-2 bg-slate-50 px-3 py-1.5 rounded-lg">📝 {item.nota}</p>
        )}

        <div className="flex gap-2">
          {item.latitude && item.longitude && (
            <a href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`} target="_blank" rel="noreferrer"
              className="flex-1 border border-teal-200 text-teal-700 text-xs font-semibold py-2.5 rounded-xl hover:bg-teal-50 transition flex items-center justify-center gap-1.5">
              🗺️ Maps
            </a>
          )}
          {/* CT-43: Check-in */}
          <button onClick={onCheckin}
            className={`flex-1 text-xs font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-1 ${item.concluido ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-600 hover:bg-teal-50"}`}>
            {item.concluido ? "✅ Realizado" : "○ Marcar feito"}
          </button>
          {/* CT-39: Nota toggle */}
          <button onClick={() => setMostraNota(v => !v)}
            className="text-xs bg-slate-100 text-slate-500 px-2.5 py-2.5 rounded-xl hover:bg-slate-200 transition">📝</button>
          {/* CT-28: Remover */}
          <button onClick={onRemover}
            className="text-xs bg-red-50 text-red-400 px-2.5 py-2.5 rounded-xl hover:bg-red-100 transition">🗑</button>
        </div>
      </div>
    </div>
  );
}

// ─── HISTORY ──────────────────────────────────────────────────────────────────
const STATUS_LABEL = {
  planejamento: { label: "Em Planejamento", color: "bg-blue-100 text-blue-700" },
  confirmado:   { label: "Confirmado",       color: "bg-cyan-100 text-cyan-700" },
  em_andamento: { label: "Em Andamento",     color: "bg-yellow-100 text-yellow-700" },
  concluido:    { label: "Realizada",        color: "bg-green-100 text-green-700" },
  cancelado:    { label: "Cancelado",        color: "bg-red-100 text-red-600" },
};

function HistoryScreen({ setScreen, token, setRoteiroAtivo, showToast }) {
  const [roteiros, setRoteiros] = useState([]);
  const [stats, setStats] = useState({ total: 0, regioes: 0, gasto: 0 });
  const [filtroRegiao, setFiltroRegiao] = useState("");

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
    if (!window.confirm("Excluir este roteiro permanentemente?")) return;
    try {
      await api.deletarRoteiro(token, id);
      carregar();
      showToast('success', 'Roteiro excluído com sucesso!');
    } catch {
      showToast('error', 'Erro ao excluir roteiro. Tente novamente.');
    }
  };

  const clonar = async (id) => {
    try {
      const res = await api.clonarRoteiro(token, id);
      if (res.roteiro) { carregar(); showToast('success', 'Roteiro clonado com sucesso!'); }
      else showToast('error', res.error || 'Erro ao clonar roteiro.');
    } catch {
      showToast('error', 'Erro ao clonar roteiro. Tente novamente.');
    }
  };

  const regioes = [...new Set(roteiros.map(r => r.regiao_nome).filter(Boolean))];
  const filtrados = filtroRegiao ? roteiros.filter(r => r.regiao_nome === filtroRegiao) : roteiros;

  return (
    <PageWrapper screen="history" setScreen={setScreen}>
      <div className="px-5 pt-8 pb-8">
        <h1 className="text-slate-900 text-2xl font-bold">Histórico de viagens</h1>
        <p className="text-slate-500 text-sm mt-1 mb-5">Todos os seus roteiros em um lugar</p>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { emoji: "🗺️", val: stats.total, label: "Roteiros" },
            { emoji: "📍", val: stats.regioes, label: "Regiões" },
            { emoji: "💰", val: `R$ ${stats.gasto.toFixed(0)}`, label: "Total gasto" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-3 text-center shadow-sm border border-slate-100">
              <p className="text-2xl mb-0.5">{s.emoji}</p>
              <p className="text-slate-800 font-bold text-sm">{s.val}</p>
              <p className="text-slate-400 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {regioes.length > 1 && (
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            <button onClick={() => setFiltroRegiao("")}
              className={"flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium border transition " + (!filtroRegiao ? "bg-teal-700 text-white border-teal-700" : "bg-white text-slate-600 border-slate-200")}>
              Todas
            </button>
            {regioes.map(r => (
              <button key={r} onClick={() => setFiltroRegiao(r)}
                className={"flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium border transition " + (filtroRegiao === r ? "bg-teal-700 text-white border-teal-700" : "bg-white text-slate-600 border-slate-200")}>
                {r}
              </button>
            ))}
          </div>
        )}

        <h3 className="text-slate-800 font-bold mb-3">Meus roteiros</h3>
        {filtrados.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">Nenhum roteiro encontrado.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {filtrados.map((h) => {
              const st = STATUS_LABEL[h.status] || STATUS_LABEL.planejamento;
              return (
                <div key={h.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                  <div className="relative h-24">
                    <img src={IMG_FALLBACK[h.regiao_slug] || IMG_FALLBACK["serra-gaucha"]}
                      alt={"Foto de " + h.regiao_nome} className="w-full h-full object-cover" />
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
                  <div className="px-3 py-2.5 flex items-center gap-2 flex-wrap">
                    <span className="text-slate-400 text-xs">📅 {h.data_inicio}</span>
                    <span className={"text-xs font-semibold px-2 py-0.5 rounded-full " + st.color}>{st.label}</span>
                    <div className="ml-auto flex gap-1.5">
                      <button onClick={() => clonar(h.id)} title="Clonar roteiro"
                        className="bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs px-2.5 py-1.5 rounded-xl transition">📋</button>
                      <button onClick={() => deletar(h.id)} title="Excluir"
                        className="bg-red-50 hover:bg-red-100 text-red-400 text-xs px-2.5 py-1.5 rounded-xl transition">🗑</button>
                      <button onClick={() => { setRoteiroAtivo(h); setScreen("itinerary"); }}
                        className="bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold px-3 py-1.5 rounded-xl transition">
                        Ver roteiro
                      </button>
                    </div>
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

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function ProfileScreen({ setScreen, token, onLogout, showToast }) {
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

// ─── TOAST COMPONENT (Sistema unificado) ──────────────────────────────────────
function Toast({ toast, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      // Trigger entrance animation
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [toast]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const bgColor = isSuccess ? 'bg-teal-600' : 'bg-red-500';
  const icon = isSuccess ? '✓' : '✕';

  return (
    <div
      className={`fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 sm:w-80 z-[9999] transition-all duration-300 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className={`${bgColor} text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3`}>
        <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold flex-shrink-0">
          {icon}
        </span>
        <p className="text-sm font-medium flex-1">{toast.msg}</p>
        <button onClick={onClose} className="text-white/60 hover:text-white text-lg leading-none ml-1 flex-shrink-0">×</button>
      </div>
    </div>
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
  const [resetToken, setResetToken] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  // ── Toast global state ──
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg: string }

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const showToast = useCallback((type, msg) => {
    setToast({ type, msg });
  }, []);

  const toggleDark = () => setDarkMode(d => { localStorage.setItem("darkMode", String(!d)); return !d; });

  useEffect(() => {
    // CT-09: detectar URL /recuperar-senha?token=XXX
    const params = new URLSearchParams(window.location.search);
    const tkReset = params.get("token");
    if (window.location.pathname === "/recuperar-senha" && tkReset) {
      setResetToken(tkReset);
      setScreen("reset-password");
      return;
    }
    if (token) setScreen("home");
  }, []);

  // CT-16: interceptar 401 por token expirado
  useEffect(() => {
    if (!token) return;
    const origFetch = window._origFetch || window.fetch;
    window._origFetch = origFetch;
    window.fetch = async (...args) => {
      const res = await origFetch(...args);
      if (res.status === 401) {
        const clone = res.clone();
        const json = await clone.json().catch(() => ({}));
        if (json.error && (json.error.toLowerCase().includes("token") || json.error.toLowerCase().includes("sessão"))) {
          onLogout();
          showToast('error', 'Sessão expirada. Faça login novamente.');
        }
      }
      return res;
    };
    return () => { if (window._origFetch) window.fetch = window._origFetch; };
  }, [token]);

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
    login: <LoginScreen setScreen={setScreen} onLogin={onLogin} showToast={showToast} />,
    register: <RegisterScreen setScreen={setScreen} onLogin={onLogin} showToast={showToast} />,
    "reset-password": <ResetPasswordScreen setScreen={setScreen} resetToken={resetToken} showToast={showToast} />,
    home: <HomeScreen setScreen={setScreen} usuario={usuario} token={token} setRoteiroAtivo={setRoteiroAtivo} showToast={showToast} />,
    planner: <PlannerStep1 setScreen={setScreen} setPlanData={setPlanData} token={token} showToast={showToast} />,
    planner2: <PlannerStep2 setScreen={setScreen} planData={planData} setPlanData={setPlanData} showToast={showToast} />,
    planner3: <PlannerStep3 setScreen={setScreen} planData={planData} setPlanData={setPlanData} token={token} setRoteiroAtivo={setRoteiroAtivo} showToast={showToast} />,
    itinerary: <ItineraryScreen setScreen={setScreen} roteiro={roteiroAtivo} token={token} showToast={showToast} />,
    history: <HistoryScreen setScreen={setScreen} token={token} setRoteiroAtivo={setRoteiroAtivo} showToast={showToast} />,
    profile: <ProfileScreen setScreen={setScreen} token={token} onLogout={onLogout} showToast={showToast} />,
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }} className={darkMode ? "dark" : ""}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #CBD5E1; }
        .dark, .dark body { background: #0F172A !important; color: #E2E8F0; }
        .dark .bg-white { background: #1E293B !important; }
        .dark .bg-slate-50 { background: #0F172A !important; }
        .dark .bg-slate-100 { background: #1E293B !important; }
        .dark .text-slate-900, .dark .text-slate-800 { color: #F1F5F9 !important; }
        .dark .text-slate-700, .dark .text-slate-600 { color: #CBD5E1 !important; }
        .dark .text-slate-500, .dark .text-slate-400 { color: #94A3B8 !important; }
        .dark .border-slate-200, .dark .border-slate-100 { border-color: #334155 !important; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      {token && (
        <button onClick={toggleDark} title={darkMode ? "Modo claro" : "Modo escuro"}
          style={{ position:"fixed", top:10, right:10, zIndex:9999,
            background: darkMode ? "#334155" : "#F1F5F9",
            border:"none", borderRadius:"50%", width:34, height:34,
            cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" }}>
          {darkMode ? "☀️" : "🌙"}
        </button>
      )}
      {screens[screen] || screens.login}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}