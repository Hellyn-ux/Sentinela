import { useState } from "react";
import "../App.css";

function Cadastro({ irPara }) {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
    termos: false,
  });

  const [mensagem, setMensagem] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [enviando, setEnviando] = useState(false);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });

    setMensagem("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (form.senha.length < 8) {
      setMensagem("A senha deve ter pelo menos 8 caracteres.");
      setSucesso(false);
      return;
    }

    if (form.senha !== form.confirmarSenha) {
      setMensagem("As senhas não coincidem.");
      setSucesso(false);
      return;
    }

    if (!form.termos) {
      setMensagem("Você precisa aceitar os termos de uso.");
      setSucesso(false);
      return;
    }

    setEnviando(true);

    try {
      const resposta = await fetch("http://localhost:8000/cadastro.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          cpf: form.cpf,
          telefone: form.telefone,
          senha: form.senha,
          termos: form.termos,
        }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setMensagem(dados.mensagem);
        setSucesso(true);
        setForm({
          nome: "",
          email: "",
          cpf: "",
          telefone: "",
          senha: "",
          confirmarSenha: "",
          termos: false,
        });
      } else {
        setMensagem(dados.erro || "Não foi possível cadastrar.");
        setSucesso(false);
      }
    } catch {
      setMensagem("Não foi possível conectar ao servidor.");
      setSucesso(false);
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
          Já tem uma conta?
                    <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              irPara("login");
            }}
          >
            Entrar
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              irPara("alertas");
            }}
          >
            Alertas
          </a>
        </div>
      </header>

      <main className="container">
        <section className="card">
          <div className="icone-cadastro"></div>

          <h1>Criar uma conta</h1>
          <p className="subtitulo">
            Preencha os dados abaixo para se cadastrar
          </p>

          <form onSubmit={handleSubmit}> 
              <div className="campo">
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                name="nome"
                type="text"
                placeholder="Digite seu nome"
                value={form.nome}
                onChange={handleChange}
                required
              />
            </div>
                        <div className="campo">
              <label htmlFor="cpf">CPF</label>
              <input
                id="cpf"
                name="cpf"
                type="text"
                placeholder="Digite seu CPF"
                value={form.cpf}
                onChange={handleChange}
                required
              />
            </div>

             

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
              <label htmlFor="telefone">Telefone</label>
              <input
                id="telefone"
                name="telefone"
                type="text"
                placeholder="Digite seu telefone"
                value={form.telefone}
                onChange={handleChange}
                autoComplete="tel"
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                name="senha"
                type="password"
                placeholder="Mínimo de 8 caracteres"
                value={form.senha}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="confirmarSenha">Confirmar senha</label>
              <input
                id="confirmarSenha"
                name="confirmarSenha"
                type="password"
                placeholder="Repita a senha"
                value={form.confirmarSenha}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>


            <label className="termos">
              <input
                type="checkbox"
                name="termos"
                checked={form.termos}
                onChange={handleChange}
              />
              <span>
                Eu concordo com os{" "}
                <a href="#">Termos de Uso</a> e{" "}
                <a href="#">Política de Privacidade</a>
              </span>
            </label>

            {mensagem && (
              <p
                className={`mensagem ${
                  sucesso ? "sucesso" : "erro"
                }`}
                role="status"
              >
                {mensagem}
              </p>
            )}

            <button type="submit" className="botao-cadastro" disabled={enviando}>
              {enviando ? "Enviando..." : "Cadastrar"}
            </button>

            <div className="divisor">
              <span>ou cadastre-se com</span>
            </div>

            <div className="redes-sociais">
              <button
                type="button"
                className="botao-social"
                onClick={() =>
                  alert("Integre o cadastro com Google aqui.")
                }
              >
                <span className="google">G</span>
                Google
              </button>

              <button
                type="button"
                className="botao-social"
                onClick={() =>
                  alert("Integre o cadastro com Facebook aqui.")
                }
              >
                <span className="facebook">f</span>
                Facebook
              </button>
            </div>
          </form>
        </section>

        <footer>
          © 2026 Sentinela. Todos os direitos reservados.
        </footer>
      </main>
    </div>
  );
}

export default Cadastro;
