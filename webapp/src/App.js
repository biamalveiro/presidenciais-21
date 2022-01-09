import React, { useState, useEffect } from "react";
import EmbeddingProjection from "./components/EmbeddingProjection";
import Legend from "./components/Legend";
import Neighbours from "./components/Neighbours";

function App() {
  const [parishesList, setParishesList] = useState([]);

  const loadParishesList = async () => {
    const res = await fetch("/api/getParishesList");
    const list = await res.json();
    setParishesList(list);
  };

  useEffect(() => {
    loadParishesList();
  }, []);

  return (
    <div className="my-10 flex-col justify-center">
      <header className="text-center w-3/4 mx-auto">
        <h1 className="text-3xl text-gray-800 font-semibold ">
          Vizinhos Eleitoriais
        </h1>
        <h1 className=" text-base uppercase text-gray-500">
          Presidenciais 2021
        </h1>
        <div className="text-center text-gray-600 text-sm w-3/4 mx-auto mt-4 mb-4">
          <p className="font-bold">
            Que freguesias portuguesas são mais parecidas na forma como votam?
          </p>
          <p>
            <span>
              Utilizando dados das eleições presidenciais de 2021, esta
              visualização distribui círculos{" "}
            </span>
            <div
              className="h-3 w-3 inline-block border"
              style={{
                backgroundColor: "#D1D5DB",
                borderRadius: "50%",
                borderColor: "#a6aeb9",
              }}
            />
            <span>
              {" "}
              representantes de cada freguesia no espaço de forma a preservar a
              distancia entre as suas distribuições de votos. Isto é, freguesias
              que votaram de forma parecida devem aparecer próximas na projeção.
              Ainda, o tamanho de cada circulo é proporcional ao número de votos
              da freguesia. Se uma freguesia votou muito mais num candidato, em
              comparação com o resto do país, a cor do seu circulo representa
              esse candidato.
            </span>
          </p>
        </div>
        <Legend />
      </header>
      <EmbeddingProjection parishesList={parishesList} />
      <Neighbours parishesList={parishesList} />
    </div>
  );
}

export default App;
