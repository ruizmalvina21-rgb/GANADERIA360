import React, { useState } from 'react';

export default function GanaderiaApp() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [animales, setAnimales] = useState([
    { id: 'ARG-2026-001', caravana: 'NV-9981', categoria: 'Vaca', peso: '450 kg', estado: 'Activo' },
    { id: 'ARG-2026-002', caravana: 'NV-9982', categoria: 'Ternero', peso: '180 kg', estado: 'Activo' },
    { id: 'ARG-2026-003', caravana: 'NV-9983', categoria: 'Novillo', peso: '380 kg', estado: 'Activo' }
  ]);
  
  const [filtroCaravana, setFiltroCaravana] = useState('');
  const [nuevaCaravana, setNuevaCaravana] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('Vaca');
  const [nuevoPeso, setNuevoPeso] = useState('');

  // Función para agregar animal
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

  // Filtrado por caravana o ID
  const animalesFiltrados = animales.filter(anim => 
    anim.caravana.toLowerCase().includes(filtroCaravana.toLowerCase()) ||
    anim.id.toLowerCase().includes(filtroCaravana.toLowerCase())
  );

  // Función para exportar a Excel (CSV)
  const exportarAExcel = () => {
    let contenidoCSV = "ID SENASA,Caravana,Categoria,Peso,Estado\n";
    animales.forEach(a => {
      contenidoCSV += `${a.id},${a.caravana},${a.categoria},${a.peso},${a.estado}\n`;
    });

    const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'ganaderia_360_reporte.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      {/* Encabezado */}
      <header style={{ backgroundColor: '#2c5e3b', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: '0 0 5px 0' }}>Ganadería 360</h1>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Sistema de Gestión Integral, Reportes y Trazabilidad</p>
      </header>

      {/* Barra de Navegación */}
      <nav style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setActiveTab('inicio')}
          style={{ padding: '10px 15px', cursor: 'pointer', backgroundColor: activeTab === 'inicio' ? '#2c5e3b' : '#ddd', color: activeTab === 'inicio' ? 'white' : 'black', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
          Inicio
        </button>
        <button 
          onClick={() => setActiveTab('registro')}
          style={{ padding: '10px 15px', cursor: 'pointer', backgroundColor: activeTab === 'registro' ? '#2c5e3b' : '#ddd', color: activeTab === 'registro' ? 'white' : 'black', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
          Listado y Filtros
        </button>
        <button 
          onClick={() => setActiveTab('reportes')}
          style={{ padding: '10px 15px', cursor: 'pointer', backgroundColor: activeTab === 'reportes' ? '#2c5e3b' : '#ddd', color: activeTab === 'reportes' ? 'white' : 'black', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
          Reportes y Excel
        </button>
        <button 
          onClick={() => setActiveTab('nuevo')}
          style={{ padding: '10px 15px', cursor: 'pointer', backgroundColor: activeTab === 'nuevo' ? '#2c5e3b' : '#ddd', color: activeTab === 'nuevo' ? 'white' : 'black', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
          + Nuevo Animal
        </button>
      </nav>

      {/* Contenido según la pestaña */}
      <main style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        
        {/* PESTAÑA INICIO */}
        {activeTab === 'inicio' && (
          <div>
            <h2>Panel Principal</h2>
            <p>Sistema offline-first operativo para establecimientos ganaderos y control de caravanas.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
              <div style={{ padding: '15px', backgroundColor: '#eef4f0', borderRadius: '6px', borderLeft: '5px solid #2c5e3b' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#2c5e3b' }}>Total Registrados</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{animales.length} animales</p>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#eef4f0', borderRadius: '6px', borderLeft: '5px solid #2c5e3b' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#2c5e3b' }}>Estado del Sistema</h3>
                <p style={{ fontSize: '16px', margin: 0, color: 'green', fontWeight: 'bold' }}>● En línea y Sincronizado</p>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA REGISTRO Y FILTROS */}
        {activeTab === 'registro' && (
          <div>
            <h2>Listado de Animales y Filtros</h2>
            
            {/* Barra de búsqueda / filtro por caravana */}
            <div style={{ margin: '15px 0' }}>
              <input 
                type="text" 
                placeholder="🔍 Filtrar por número de caravana o ID..." 
                value={filtroCaravana}
                onChange={(e) => setFiltroCaravana(e.target.value)}
                style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

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
                {animalesFiltrados.length > 0 ? (
                  animalesFiltrados.map((anim, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '10px' }}>{anim.id}</td>
                      <td style={{ padding: '10px' }}>{anim.caravana}</td>
                      <td style={{ padding: '10px' }}>{anim.categoria}</td>
                      <td style={{ padding: '10px' }}>{anim.peso}</td>
                      <td style={{ padding: '10px', color: 'green', fontWeight: 'bold' }}>{anim.estado}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ padding: '15px', textAlign: 'center', color: '#777' }}>
                      No se encontraron animales con esa caravana.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* PESTAÑA REPORTES Y EXCEL */}
        {activeTab === 'reportes' && (
          <div>
            <h2>Reportes y Exportación</h2>
            <p>Generación de planillas y reportes oficiales listos para auditoría o gestión interna.</p>
            
            <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f1f8f3', borderRadius: '6px', border: '1px solid #c8e6c9' }}>
              <h3 style={{ color: '#2c5e3b', marginTop: 0 }}>Exportar Datos del Corral</h3>
              <p>Descargá un archivo en formato compatible con Excel (.csv) con el registro completo actual.</p>
              <button 
                onClick={exportarAExcel}
                style={{ padding: '12px 20px', backgroundColor: '#2c5e3b', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                📥 Descargar Reporte a Excel
              </button>
            </div>
          </div>
        )}

        {/* PESTAÑA NUEVO ANIMAL */}
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
                  placeholder="Ej: NV-9984"
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
