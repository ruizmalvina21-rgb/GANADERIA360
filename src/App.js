import React, { useState } from 'react';

export default function GanaderiaApp() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [animales, setAnimales] = useState([
    { id: 'ARG-2026-001', caravana: 'NV-9981', categoria: 'Vaca', peso: '450 kg', estado: 'Activo', fecha: '2026-10-01' },
    { id: 'ARG-2026-002', caravana: 'NV-9982', categoria: 'Ternero', peso: '180 kg', estado: 'Activo', fecha: '2026-10-05' },
    { id: 'ARG-2026-003', caravana: 'NV-9983', categoria: 'Novillo', peso: '380 kg', estado: 'Activo', fecha: '2026-10-10' }
  ]);
  
  const [filtroCaravana, setFiltroCaravana] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
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
      estado: 'Activo',
      fecha: new Date().toISOString().split('T')[0]
    };

    setAnimales([nuevo, ...animales]);
    setNuevaCaravana('');
    setNuevoPeso('');
    setActiveTab('registro');
  };

  // Filtrado por caravana/ID y categoría
  const animalesFiltrados = animales.filter(anim => {
    const coincideTexto = anim.caravana.toLowerCase().includes(filtroCaravana.toLowerCase()) ||
                          anim.id.toLowerCase().includes(filtroCaravana.toLowerCase());
    const coincideCat = filtroCategoria === 'Todas' || anim.categoria === filtroCategoria;
    return coincideTexto && coincideCat;
  });

  // Función para exportar a Excel (CSV)
  const exportarAExcel = () => {
    let contenidoCSV = "ID SENASA,Caravana,Categoria,Peso,Estado,Fecha Registro\n";
    animales.forEach(a => {
      contenidoCSV += `${a.id},${a.caravana},${a.categoria},${a.peso},${a.estado},${a.fecha}\n`;
    });

    const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ganaderia_360_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '950px', margin: '0 auto', padding: '20px', backgroundColor: '#f4f7f4', minHeight: '100vh' }}>
      {/* Encabezado */}
      <header style={{ backgroundColor: '#2c5e3b', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: '0 0 5px 0', fontSize: '28px' }}>Ganadería 360</h1>
        <p style={{ margin: 0, fontSize: '15px', opacity: 0.9 }}>Sistema Integral de Gestión, Trazabilidad y Control Ganadero</p>
      </header>

      {/* Barra de Navegación */}
      <nav style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setActiveTab('inicio')}
          style={{ padding: '10px 18px', cursor: 'pointer', backgroundColor: activeTab === 'inicio' ? '#2c5e3b' : '#ffffff', color: activeTab === 'inicio' ? 'white' : '#2c5e3b', border: '1px solid #2c5e3b', borderRadius: '6px', fontWeight: 'bold' }}>
          🏠 Inicio
        </button>
        <button 
          onClick={() => setActiveTab('registro')}
          style={{ padding: '10px 18px', cursor: 'pointer', backgroundColor: activeTab === 'registro' ? '#2c5e3b' : '#ffffff', color: activeTab === 'registro' ? 'white' : '#2c5e3b', border: '1px solid #2c5e3b', borderRadius: '6px', fontWeight: 'bold' }}>
          📋 Listado y Filtros ({animales.length})
        </button>
        <button 
          onClick={() => setActiveTab('reportes')}
          style={{ padding: '10px 18px', cursor: 'pointer', backgroundColor: activeTab === 'reportes' ? '#2c5e3b' : '#ffffff', color: activeTab === 'reportes' ? 'white' : '#2c5e3b', border: '1px solid #2c5e3b', borderRadius: '6px', fontWeight: 'bold' }}>
          📊 Reportes y Excel
        </button>
        <button 
          onClick={() => setActiveTab('nuevo')}
          style={{ padding: '10px 18px', cursor: 'pointer', backgroundColor: activeTab === 'nuevo' ? '#2c5e3b' : '#ffffff', color: activeTab === 'nuevo' ? 'white' : '#2c5e3b', border: '1px solid #2c5e3b', borderRadius: '6px', fontWeight: 'bold' }}>
          ➕ Nuevo Animal
        </button>
      </nav>

      {/* Contenido según la pestaña */}
      <main style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        
        {/* PESTAÑA INICIO */}
        {activeTab === 'inicio' && (
          <div>
            <h2>Panel Principal de Operaciones</h2>
            <p>Sistema optimizado para establecimientos ganaderos con sincronización offline-first.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' }}>
              <div style={{ padding: '20px', backgroundColor: '#eef4f0', borderRadius: '8px', borderLeft: '6px solid #2c5e3b' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#2c5e3b' }}>Total Registrados</h3>
                <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{animales.length} <span style={{ fontSize: '16px', fontWeight: 'normal' }}>animales</span></p>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#eef4f0', borderRadius: '8px', borderLeft: '6px solid #2c5e3b' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#2c5e3b' }}>Estado del Sistema</h3>
                <p style={{ fontSize: '16px', margin: '5px 0 0 0', color: '#2e7d32', fontWeight: 'bold' }}>● Conectado y Sincronizado</p>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA REGISTRO Y FILTROS */}
        {activeTab === 'registro' && (
          <div>
            <h2>Listado General y Filtros por Caravana</h2>
            
            {/* Controles de Filtro */}
            <div style={{ display: 'flex', gap: '15px', margin: '20px 0', flexWrap: 'wrap' }}>
              <div style={{ flex: 2, minWidth: '220px' }}>
                <input 
                  type="text" 
                  placeholder="🔍 Buscar por número de caravana o ID..." 
                  value={filtroCaravana}
                  onChange={(e) => setFiltroCaravana(e.target.value)}
                  style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: '160px' }}>
                <select 
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }}>
                  <option value="Todas">Todas las categorías</option>
                  <option value="Vaca">Vaca</option>
                  <option value="Ternero">Ternero</option>
                  <option value="Toro">Toro</option>
                  <option value="Novillo">Novillo</option>
                  <option value="Vaququiona">Vaququiona</option>
                </select>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#2c5e3b', color: 'white', textAlign: 'left' }}>
                    <th style={{ padding: '12px' }}>ID / SENASA</th>
                    <th style={{ padding: '12px' }}>Caravana</th>
                    <th style={{ padding: '12px' }}>Categoría</th>
                    <th style={{ padding: '12px' }}>Peso</th>
                    <th style={{ padding: '12px' }}>Estado</th>
                    <th style={{ padding: '12px' }}>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {animalesFiltrados.length > 0 ? (
                    animalesFiltrados.map((anim, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{anim.id}</td>
                        <td style={{ padding: '12px' }}>{anim.caravana}</td>
                        <td style={{ padding: '12px' }}>{anim.categoria}</td>
                        <td style={{ padding: '12px' }}>{anim.peso}</td>
                        <td style={{ padding: '12px', color: '#2e7d32', fontWeight: 'bold' }}>{anim.estado}</td>
                        <td style={{ padding: '12px', color: '#666', fontSize: '13px' }}>{anim.fecha}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#777' }}>
                        No se encontraron animales que coincidan con los filtros aplicados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PESTAÑA REPORTES Y EXCEL */}
        {activeTab === 'reportes' && (
          <div>
            <h2>Reportes y Exportación de Datos</h2>
            <p>Generación de planillas compatibles con Microsoft Excel (.csv) para auditorías y control interno.</p>
            
            <div style={{ marginTop: '25px', padding: '25px', backgroundColor: '#f4f9f4', borderRadius: '8px', border: '1px solid #c8e6c9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
              <div>
                <h3 style={{ color: '#2c5e3b', margin: '0 0 5px 0' }}>Planilla General de Animales</h3>
                <p style={{ margin: 0, color: '#555' }}>Exporta todos los registros actuales almacenados en el sistema.</p>
              </div>
              <button 
                onClick={exportarAExcel}
                style={{ padding: '12px 24px', backgroundColor: '#2c5e3b', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                📥 Descargar Archivo Excel (.CSV)
              </button>
            </div>
          </div>
        )}

        {/* PESTAÑA NUEVO ANIMAL */}
        {activeTab === 'nuevo' && (
          <div>
            <h2>Registrar Nuevo Animal en Corral</h2>
            <form onSubmit={agregarAnimal} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '450px', marginTop: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Número de Caravana:</label>
                <input 
                  type="text" 
                  value={nuevaCaravana} 
                  onChange={(e) => setNuevaCaravana(e.target.value)} 
                  placeholder="Ej: NV-9984"
                  required 
                  style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Categoría:</label>
                <select 
                  value={nuevaCategoria} 
                  onChange={(e) => setNuevaCategoria(e.target.value)}
                  style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }}>
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
                  style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <button 
                type="submit" 
                style={{ padding: '12px', backgroundColor: '#2c5e3b', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                Guardar y Registrar Animal
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
