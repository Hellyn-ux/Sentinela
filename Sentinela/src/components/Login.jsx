import { useState } from "react";
import "../App.css";

function Login({ irPara, aoEntrar }) {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
    setMensagem("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setEnviando(true);

    try {
      const resposta = await fetch("http://localhost:8000/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        aoEntrar(dados.usuario);
      } else {
        setMensagem(dados.erro || "Não foi possível entrar.");
      }
    } catch {
      setMensagem("Não foi possível conectar ao servidor.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="pagina">
      <header className="navbar">
        <a href="#" className="logo">
          <span className="logo-icon"></span>
          Sentinela
        </a>

        <div className="login">
          Não tem uma conta?
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              irPara("cadastro");
            }}
          >
            Cadastrar
          </a>
        </div>
      </header>

      <main className="container">
        <section className="card">
          <h1>Entrar</h1>
          <p className="subtitulo">Acesse a sua conta</p>

          <form onSubmit={handleSubmit}>
            <div className="campo">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Digite seu e-mail"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                name="senha"
                type="password"
                placeholder="Digite sua senha"
                value={form.senha}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>

            {mensagem && (
              <p className="mensagem erro" role="status">
                {mensagem}
              </p>
            )}

            <button type="submit" className="botao-cadastro" disabled={enviando}>
              {enviando ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Login;