import React, { useState, useEffect } from "react";
import EmbeddingProjection from "./components/EmbeddingProjection";

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
    <div className="flex-col justify-center w-full">
      <header className="text-center mt-8">
        <h3 className="text-4xl font-bold	">Vizinhos Eleitorais</h3>
      </header>
      <EmbeddingProjection parishesList={parishesList} />
    </div>
  );
}

export default App;
