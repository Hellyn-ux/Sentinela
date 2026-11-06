import { useState, useEffect } from "react";
import "../App.css";

export default function Sinalizacoes({ irPara }) {
  const [alertas, setAlertas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("Todos");
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function buscarAlertas() {
      try {
        const resposta = await fetch("http://localhost:8000/alertas.php");
if (!resposta.ok) throw new Error("Falha ao buscar alertas");
const dados = await resposta.json();

        if (ativo) {
          setAlertas(dados);
          setErro("");
        }
      } catch {
        if (ativo) {
          setErro("Não foi possível carregar os alertas.");
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    buscarAlertas();

    const intervalo = setInterval(buscarAlertas, 60000);

    return () => {
      ativo = false;
      clearInterval(intervalo);
    };
  }, []);

  const alertasFiltrados =
    filtro === "Todos"
      ? alertas
      : alertas.filter((alerta) => alerta.nivel === filtro);

  if (carregando) return <p>Carregando alertas...</p>;
  if (erro) return <p>{erro}</p>;

  return (
    <section>
            <button onClick={() => irPara("cadastro")}>Cadastro</button>
      <h1>Alertas de desastres naturais</h1>

      <label htmlFor="filtro">Filtrar por gravidade: </label>

      <select
        id="filtro"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      >
        <option>Todos</option>
        <option>Crítico</option>
        <option>Alto</option>
        <option>Moderado</option>
        <option>Baixo</option>
      </select>

      {alertasFiltrados.length === 0 ? (
        <p className="nenhum-alerta">Nenhum alerta encontrado.</p>
      ) : (
        <ul>
          {alertasFiltrados.map((alerta) => (
            <li key={alerta.id}>
              <h3>
                {alerta.tipo} — {alerta.nivel}
              </h3>

              <p>Local: {alerta.local}</p>
              <p>{alerta.descricao}</p>
              <p>Status: {alerta.status}</p>
              <small>
                {new Date(alerta.data_hora).toLocaleString("pt-BR")}
              </small>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}