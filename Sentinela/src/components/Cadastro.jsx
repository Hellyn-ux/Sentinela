import { useState } from "react";
import "../App.css";

function Cadastro() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    termos: false,
  });

  const [mensagem, setMensagem] = useState("");
  const [sucesso, setSucesso] = useState(false);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });

    setMensagem("");
  }

  function handleSubmit(event) {
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

    setMensagem("Cadastro realizado com sucesso!");
    setSucesso(true);

    console.log("Dados do cadastro:", {
      ...form,
      senha: "[oculta]",
      confirmarSenha: "[oculta]",
    });
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
          <a href="#">Entrar</a>
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
              <label htmlFor="nome">Nome completo</label>
              <input
                id="nome"
                name="nome"
                type="text"
                placeholder="Digite seu nome completo"
                value={form.nome}
                onChange={handleChange}
                autoComplete="name"
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
              <label htmlFor="usuario">CPF</label>
              <input
                id="usuario"
                name="usuario"
                type="text"
                placeholder="Digite seu CPF"
                value={form.usuario}
                onChange={handleChange}
                autoComplete="CPF"
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="senha">Telefone</label>
              <input
                id="senha"
                name="senha"
                type="text"
                placeholder="Digite seu telefone"
                value={form.senha}
                onChange={handleChange}
                autoComplete="tel"
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="confirmarSenha">
                Senha
              </label>
              <input
                id="confirmarSenha"
                name="confirmarSenha"
                type="password"
                placeholder="Senha"
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

            <button type="submit" className="botao-cadastro">
              Cadastrar
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
