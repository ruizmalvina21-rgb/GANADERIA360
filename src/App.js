import React, { useState, useEffect } from 'react';

function App() {
  const [activeTab, setActiveTab] = 'inicio';
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    // Carga inicial de datos para Ganaderia360
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ borderBottom: '2px solid #ccc', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1 style={{ color: '#2c3e50' }}>Ganaderia360</h1>
        <p style={{ color: '#666' }}>Sistema de Gestión Integral para Establecimientos Ganaderos</p>
      </header>

      <nav style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('inicio')}
          style={{ padding: '10px 15px', marginRight: '10px', cursor: 'pointer' }}
        >
          Inicio
        </button>
        <button 
          onClick={() => setActiveTab('registros')}
          style={{ padding: '10px 15px', cursor: 'pointer' }}
        >
          Registros
        </button>
      </nav>

      <main style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
        <h2>Panel Principal</h2>
        <p>Bienvenido al sistema de control de hacienda, trazabilidad y caravanas electrónicas.</p>
        
        <div style={{ marginTop: '20px' }}>
          <h3>Estado del Sistema</h3>
          <p style={{ color: 'green', fontWeight: 'bold' }}>● Aplicación conectada y en línea</p>
        </div>
      </main>

      <footer style={{ marginTop: '40px', textAlign: 'center', color: '#888', fontSize: '12px' }}>
        Ganaderia360 &copy; 2026 - Todos los derechos reservados
      </footer>
    </div>
  );
}

export default App;
