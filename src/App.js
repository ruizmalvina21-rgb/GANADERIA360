import React, { useState } from 'react';

export default function GanaderiaApp() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [animales, setAnimales] = useState([
    { id: 'ARG-2026-001', caravana: 'NV-9981', categoria: 'Vaca', peso: '450 kg', estado: 'Activo' },
    { id: 'ARG-2026-002', caravana: 'NV-9982', categoria: 'Ternero', peso: '180 kg', estado: 'Activo' }
  ]);
  const [nuevaCaravana, setNuevaCaravana] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('Vaca');
  const [nuevoPeso, setNuevoPeso] = useState('');

  const agregarAnimal = (e) => {
    e.preventDefault();
    if (!nuevaCaravana || !nuevoPeso) return;
    
    const nuevo = {
      id: `ARG-2026-${Date.now().toString().slice(-3)}`,
      caravana: nuevaCaravana,
      categoria: nuevaCategoria,
      peso: `${nuevoPeso} kg`,
      estado: 'Activo'
    };

    setAnimales([nuevo, ...animales]);
    setNuevaCaravana('');
    setNuevoPeso('');
    setActiveTab('registro');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      {/* Encabezado */}
      <header style={{ backgroundColor: '#2c5e3b', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: '0 0 5px 0' }}>Ganadería 360</h1>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Sistema de Gestión Integral para Establecimientos Ganaderos</p>
      </header>

      {/* Barra de Navegación */}
      <nav style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
        <button 
          onClick={() => setActiveTab('inicio')}
          style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: activeTab === 'inicio' ? '#2c5e3b' : '#ddd', color: activeTab === 'inicio' ? 'white' : 'black', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
          Inicio
        </button>
        <button 
          onClick={() => setActiveTab('registro')}
          style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: activeTab === 'registro' ? '#2c5e3b' : '#ddd', color: activeTab === 'registro' ? 'white' : 'black', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
          Registro de Animales
        </button>
        <button 
          onClick={() => setActiveTab('nuevo')}
          style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: activeTab === 'nuevo' ? '#2c5e3b' : '#ddd', color: activeTab === 'nuevo' ? 'white' : 'black', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
          + Nuevo Animal
        </button>
      </nav>

      {/* Contenido según la pestaña */}
      <main style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        {activeTab === 'inicio' && (
          <div>
            <h2>Panel Principal</h2>
            <p>Bienvenido al sistema de gestión offline-first para establecimientos ganaderos.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
              <div style={{ padding: '15px', backgroundColor: '#eef4f0', borderRadius: '6px', borderLeft: '5px solid #2c5e3b' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#2c5e3b' }}>Total Registrados</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{animales.length} animales</p>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#eef4f0', borderRadius: '6px', borderLeft: '5px solid #2c5e3b' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#2c5e3b' }}>Estado del Sistema</h3>
                <p style={{ fontSize: '16px', margin: 0, color: 'green', fontWeight: 'bold' }}>● Aplicación conectada y en línea</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'registro' && (
          <div>
            <h2>Listado de Animales en Corral</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ backgroundColor: '#2c5e3b', color: 'white', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>ID / SENASA</th>
                  <th style={{ padding: '10px' }}>Caravana</th>
                  <th style={{ padding: '10px' }}>Categoría</th>
                  <th style={{ padding: '10px' }}>Peso</th>
                  <th style={{ padding: '10px' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {animales.map((anim, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '10px' }}>{anim.id}</td>
                    <td style={{ padding: '10px' }}>{anim.caravana}</td>
                    <td style={{ padding: '10px' }}>{anim.categoria}</td>
                    <td style={{ padding: '10px' }}>{anim.peso}</td>
                    <td style={{ padding: '10px', color: 'green', fontWeight: 'bold' }}>{anim.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'nuevo' && (
          <div>
            <h2>Registrar Nuevo Animal</h2>
            <form onSubmit={agregarAnimal} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px', marginTop: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Número de Caravana:</label>
                <input 
                  type="text" 
                  value={nuevaCaravana} 
                  onChange={(e) => setNuevaCaravana(e.target.value)} 
                  placeholder="Ej: NV-9983"
                  required 
                  style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Categoría:</label>
                <select 
                  value={nuevaCategoria} 
                  onChange={(e) => setNuevaCategoria(e.target.value)}
                  style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}>
                  <option value="Vaca">Vaca</option>
                  <option value="Ternero">Ternero</option>
                  <option value="Toro">Toro</option>
                  <option value="Novillo">Novillo</option>
                  <option value="Vaququiona">Vaququiona</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Peso (kg):</label>
                <input 
                  type="number" 
                  value={nuevoPeso} 
                  onChange={(e) => setNuevoPeso(e.target.value)} 
                  placeholder="Ej: 420"
                  required 
                  style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                />
              </div>
              <button 
                type="submit" 
                style={{ padding: '10px', backgroundColor: '#2c5e3b', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                Guardar Animal
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
