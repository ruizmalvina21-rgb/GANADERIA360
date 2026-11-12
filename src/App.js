import React, { useState, useEffect } from 'react';

export default function App() {
  const NOMBRE_APLICACION = 'GanadoGestión AR';
  const aliasBco = 'GRUTA.BOXEO.CAROZO';
  const cvuBco = '0140388403615454488833';
  const telefonoWhatsApp = '542234372133';

  const [tab, setTab] = useState('diario');
  const [nombreEstablecimiento, setNombreEstablecimiento] = useState('Mi Establecimiento');
  const [renspa, setRenspa] = useState('03.123.0.00456/00');
  const [stockInicial, setStockInicial] = useState(100);
  const [operacion, setOperacion] = useState('Nacimiento');
  const [categoria, setCategoria] = useState('Terneros');
  const [caravanaInput, setCaravanaInput] = useState('');
  
  const [registros, setRegistros] = useState(() => {
    const saved = localStorage.getItem('ganado_regs_v11');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ganado_regs_v11', JSON.stringify(registros));
  }, [registros]);

  const agregarCaravana = (e) => {
    e.preventDefault();
    if (!caravanaInput.trim()) return;

    const nuevoItem = {
      id: Date.now(),
      caravana: caravanaInput.trim(),
      categoria,
      operacion,
      fecha: new Date().toLocaleDateString()
    };

    setRegistros([nuevoItem, ...registros]);
    setCaravanaInput('');
  };

  const eliminarRegistro = (id) => {
    setRegistros(registros.filter(r => r.id !== id));
  };

  const totalCabezas = Number(stockInicial) + registros.filter(r => r.operacion === 'Nacimiento').length - registros.filter(r => r.operacion === 'Venta / Salida').length;

  const exportarExcel = () => {
    if (registros.length === 0) { alert('No hay registros.'); return; }
    let html = '<table border="1"><tr><th>Caravana</th><th>Categoría</th><th>Operación</th><th>Fecha</th></tr>';
    registros.forEach(r => {
      html += `<tr><td>${r.caravana}</td><td>${r.categoria}</td><td>${r.operacion}</td><td>${r.fecha}</td></tr>`;
    });
    html += '</table>';
    let blob = new Blob(['\ufeff' + html], { type: 'application/vnd.ms-excel' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'GanadoGestion.xls';
    a.click();
  };

  const enviarWhatsApp = () => {
    let msg = `*REPORTE HACIENDA - ${nombreEstablecimiento}*\nRENSPA: ${renspa}\nStock Actual: ${totalCabezas} cabezas\nRegistros: ${registros.length}`;
    window.open(`https://wa.me/${telefonoWhatsApp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const styles = {
    container: { fontFamily: 'sans-serif', backgroundColor: '#121212', color: '#fff', minHeight: '100vh', paddingBottom: '2rem' },
    header: { backgroundColor: '#1b5e20', color: 'white', padding: '1rem', textAlign: 'center' },
    nav: { display: 'flex', backgroundColor: '#0d3b11', overflowX: 'auto' },
    navBtn: (active) => ({
      padding: '0.8rem 1rem', border: 'none', background: active ? 'rgba(255,255,255,0.1)' : 'none',
      color: active ? '#fff' : '#ccc', fontWeight: 'bold', cursor: 'pointer', flex: 1, textAlign: 'center'
    }),
    body: { padding: '1rem', maxWidth: '700px', margin: '0 auto' },
    card: { background: '#1e1e1e', borderRadius: '12px', padding: '1.2rem', marginBottom: '1rem' },
    input: { width: '100%', padding: '0.8rem', border: '1px solid #444', background: '#2a2a2a', color: 'white', borderRadius: '8px', boxSizing: 'border-box', marginTop: '0.3rem', marginBottom: '0.8rem' },
    select: { width: '100%', padding: '0.8rem', border: '1px solid #444', background: '#2a2a2a', color: 'white', borderRadius: '8px', boxSizing: 'border-box', marginTop: '0.3rem', marginBottom: '0.8rem' },
    btn: { width: '100%', backgroundColor: '#1b5e20', color: 'white', border: 'none', padding: '0.9rem', fontSize: '1rem', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', marginTop: '0.5rem' }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={{ margin: 0, fontSize: '1.3rem' }}>{NOMBRE_APLICACION}</h1>
        <small>Establecimiento: <b>{nombreEstablecimiento}</b> | RENSPA: <b>{renspa}</b></small>
      </header>

      <nav style={styles.nav}>
        <button style={styles.navBtn(tab === 'diario')} onClick={() => setTab('diario')}>📋 Manga</button>
        <button style={styles.navBtn(tab === 'stock')} onClick={() => setTab('stock')}>🐂 Stock</button>
        <button style={styles.navBtn(tab === 'config')} onClick={() => setTab('config')}>⚙️ Configuración</button>
      </nav>

      <div style={styles.body}>
        {tab === 'diario' && (
          <div>
            <div style={styles.card}>
              <h3 style={{ color: '#81c784', marginTop: 0 }}>Registro en Manga</h3>
              <form onSubmit={agregarCaravana}>
                <label style={{ fontSize: '0.85rem', color: '#aaa' }}>Operación:</label>
                <select value={operacion} onChange={(e) => setOperacion(e.target.value)} style={styles.select}>
                  <option value="Nacimiento">Nacimiento</option>
                  <option value="Venta / Salida">Venta / Salida</option>
                  <option value="Sanidad">Sanidad</option>
                  <option value="Alta en Manga">Alta en Manga</option>
                </select>

                <label style={{ fontSize: '0.85rem', color: '#aaa' }}>Categoría:</label>
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={styles.select}>
                  <option value="Terneros">Terneros</option>
                  <option value="Terneras">Terneras</option>
                  <option value="Novillos">Novillos</option>
                  <option value="Vaquillonas">Vaquillonas</option>
                  <option value="Vacas">Vacas</option>
                  <option value="Toros">Toros</option>
                </select>

                <label style={{ fontSize: '0.85rem', color: '#aaa' }}>N° de Caravana:</label>
                <input 
                  type="text" 
                  placeholder="Ej: 00123" 
                  value={caravanaInput} 
                  onChange={(e) => setCaravanaInput(e.target.value)} 
                  style={styles.input} 
                />

                <button type="submit" style={styles.btn}>➕ Registrar Animal</button>
              </form>
            </div>

            <div style={styles.card}>
              <h3 style={{ color: '#81c784', marginTop: 0 }}>Listado ({registros.length})</h3>
              <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem' }}>
                {registros.length === 0 ? (
                  <p style={{ color: '#aaa' }}>Sin registros cargados hoy.</p>
                ) : (
                  registros.map((r) => (
                    <div key={r.id} style={{ background: '#252525', padding: '0.6rem', marginBottom: '0.4rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span><b>{r.caravana}</b> - {r.categoria} ({r.operacion})</span>
                      <button onClick={() => eliminarRegistro(r.id)} style={{ background: '#c62828', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' }}>X</button>
                    </div>
                  ))
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button onClick={exportarExcel} style={{ ...styles.btn, backgroundColor: '#2e7d32', marginTop: 0 }}>📊 Descargar Excel</button>
                <button onClick={enviarWhatsApp} style={{ ...styles.btn, backgroundColor: '#25d366', color: '#000', marginTop: 0 }}>📲 Enviar WhatsApp</button>
              </div>
            </div>
          </div>
        )}

        {tab === 'stock' && (
          <div style={styles.card}>
            <h3 style={{ color: '#81c784', marginTop: 0 }}>Stock General</h3>
            <p>Stock Inicial Base: <b>{stockInicial} cabezas</b></p>
            <p>Stock Actual Calculado: <b style={{ color: '#81c784', fontSize: '1.2rem' }}>{totalCabezas} cabezas</b></p>
          </div>
        )}

        {tab === 'config' && (
          <div style={styles.card}>
            <h3 style={{ color: '#81c784', marginTop: 0 }}>Configurar Establecimiento</h3>
            <label style={{ fontSize: '0.85rem', color: '#aaa' }}>Nombre del Campo:</label>
            <input type="text" value={nombreEstablecimiento} onChange={(e) => setNombreEstablecimiento(e.target.value)} style={styles.input} />

            <label style={{ fontSize: '0.85rem', color: '#aaa' }}>RENSPA:</label>
            <input type="text" value={renspa} onChange={(e) => setRenspa(e.target.value)} style={styles.input} />

            <label style={{ fontSize: '0.85rem', color: '#aaa' }}>Stock Inicial:</label>
            <input type="number" value={stockInicial} onChange={(e) => setStockInicial(e.target.value)} style={styles.input} />
          </div>
        )}
      </div>
    </div>
  );
}
