// C:\SOLANA PROJETOS\PROJETO INSANO\app\src\App.jsx

import React, { useState } from 'react';
import "./App.css"
import Windows from './windows/Windows';

function App() {
  const [zoom, setZoom] = useState(1); // Estado para controlar o zoom

  const handleZoom = () => {
    setZoom(prevZoom => (prevZoom === 1 ? 2.5 : 1));
  };

  return (
    <div className="App" style={{ transform: `scale(${zoom})`, transition: 'transform 1s ease-in-out' }}>
      <button className="zoom-button" onClick={handleZoom}>
        {zoom === 1 ? 'Zoom In' : 'Zoom Out'}
      </button>
      <Windows/>
    </div>
  );
}

export default App;
