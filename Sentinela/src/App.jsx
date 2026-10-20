import { useState } from "react";
import "./App.css";
import Sinalizacoes from "./components/Sinalizacoes";
import Cadastro from "./components/Cadastro";

function App() {
  const [tela, setTela] = useState("cadastro");

  return (
    <>
      <nav style={{ padding: "8px 16px" }}>
        <button onClick={() => setTela("cadastro")}>Cadastro</button>{" "}
        <button onClick={() => setTela("alertas")}>Alertas</button>
      </nav>

      {tela === "cadastro" ? <Cadastro /> : <Sinalizacoes />}
    </>
  );
}

export default App;