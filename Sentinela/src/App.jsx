import { useState } from "react";
import "./App.css";
import Sinalizacoes from "./components/Sinalizacoes";
import Cadastro from "./components/Cadastro";
import Login from "./components/Login";

function App() {
  const [tela, setTela] = useState("login");
  const [usuario, setUsuario] = useState(null);

  function aoEntrar(dadosUsuario) {
    setUsuario(dadosUsuario);
    setTela("alertas");
  }

  function sair() {
    setUsuario(null);
    setTela("login");
  }

  if (tela === "login") {
    return <Login irPara={setTela} aoEntrar={aoEntrar} />;
  }

  if (tela === "cadastro") {
    return <Cadastro irPara={setTela} />;
  }

  return (
    <>
      {usuario && (
        <p style={{ padding: "8px 16px" }}>
          Olá, {usuario.nome}!{" "}
          <button onClick={sair}>Sair</button>
        </p>
      )}
      <Sinalizacoes irPara={setTela} />
    </>
  );
}

export default App;