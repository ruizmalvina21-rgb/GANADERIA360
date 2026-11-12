import React, { useState, useEffect } from 'react';

export default function App() {
  const NOMBRE_APLICACION = 'GanadoGestión AR';
  const aliasBco = 'GRUTA.BOXEO.CAROZO';
  const cvuBco = '0140388403615454488833';
  const telefonoWhatsApp = '542234372133';

  const [tab, setTab] = useState('diario');

  const [fechaRegistroApp] = useState(() => {
    let saved = localStorage.getItem('ganado_fecha_app_v14');
    if (!saved) {
      saved = new Date().toISOString();
      localStorage.setItem('ganado_fecha_app_v14', saved);
    }
    return new Date(saved);
  });

  const calcularDiasPrueba = () => {
    const diff = new Date() - fechaRegistroApp;
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const restantes = 15 - dias;
    return restantes > 0 ? restantes : 0;
  };

  const diasPruebaRestantes = calcularDiasPrueba();
  const [planSuscripcion, setPlanSuscripcion] = useState('Anual');

  const obtenerPrecio = (plan) => {
    if (plan === 'Mensual') return '$40.000 ARS';
    if (plan === 'Trimestral') return '$80.000 ARS';
    return '$240.000 ARS';
  };

  const [establecimientos, setEstablecimientos] = useState(() => {
    const saved = localStorage.getItem('ganado_ests_v14');
    return saved ? JSON.parse(saved) : [
      { id: 1, nombre: 'Mi Establecimiento', cuit: '', renspa: '', stockInicial: 0, prefijo: '0001234567' }
    ];
  });

  const [estacionActivaId, setEstacionActivaId] = useState(() => {
    const saved = localStorage.getItem('ganado_est_activa_v14');
    return saved ? Number(saved) : 1;
  });

  const establecimientoActual = establecimientos.find(e => e.id === estacionActivaId) || establecimientos[0];
  const [editandoEst, setEditandoEst] = useState(false);
  const [tNombre, setTNombre] = useState(establecimientoActual.nombre);
  const [tCuit, setTCuit] = useState(establecimientoActual.cuit);
  const [tRenspa, setTRenspa] = useState(establecimientoActual.renspa);
  const [tStock, setTStock] = useState(establecimientoActual.stockInicial);
  const [tPrefijo, setTPrefijo] = useState(establecimientoActual.prefijo);

  useEffect(() => {
    setTNombre(establecimientoActual.nombre);
    setTCuit(establecimientoActual.cuit);
    setTRenspa(establecimientoActual.renspa);
    setTStock(establecimientoActual.stockInicial);
    setTPrefijo(establecimientoActual.prefijo);
  }, [estacionActivaId, establecimientoActual.id]);

  const guardarEstablecimiento = () => {
    const actualizados = establecimientos.map(est => {
      if (est.id === establecimientoActual.id) {
        return {
          ...est,
          nombre: tNombre.trim() || 'Establecimiento Sin Nombre',
          cuit: tCuit.trim(),
          renspa: tRenspa.trim(),
          stockInicial: parseInt(tStock, 10) || 0,
          prefijo: tPrefijo.trim() || '0000000000'
        };
      }
      return est;
    });
    setEstablecimientos(actualizados);
    localStorage.setItem('ganado_ests_v14', JSON.stringify(actualizados));
    setEditandoEst(false);
    alert('Datos guardados correctamente.');
  };

  const agregarNuevoRenspa = () => {
    const nombreNuevo = prompt('Ingrese el nombre del nuevo Establecimiento / Campo:');
    if (!nombreNuevo) return;
    const renspaNuevo = prompt('Ingrese el número de RENSPA:') || '';
    
    const nuevo = {
      id: Date.now(),
      nombre: nombreNuevo.trim(),
      cuit: '',
      renspa: renspaNuevo.trim(),
      stockInicial: 0,
      prefijo: '0001234567'
    };

    const actualizados = [...establecimientos, nuevo];
    setEstablecimientos(actualizados);
    localStorage.setItem('ganado_ests_v14', JSON.stringify(actualizados));
    setEstacionActivaId(nuevo.id);
    localStorage.setItem('ganado_est_activa_v14', String(nuevo.id));
  };

  const [operacionActual, setOperacionActual] = useState('Nacimiento');
  const [categoriaGlobal, setCategoriaGlobal] = useState('Terneros');
  const obtenerSexo = (cat) => ['Terneras', 'Vaquillonas', 'Vacas'].includes(cat) ? 'H' : 'M';

  const claveReg = `ganado_regs_v14_${(establecimientoActual.renspa || establecimientoActual.nombre).replace(/[^a-zA-Z0-9]/g, '_')}`;
  const [registros, setRegistros] = useState(() => {
    const saved = localStorage.getItem(claveReg);
    return saved ? JSON.parse(saved) : [];
  });

  const claveHist = `ganado_hist_v14_${(establecimientoActual.renspa || establecimientoActual.nombre).replace(/[^a-zA-Z0-9]/g, '_')}`;
  const [archivoHistorico, setArchivoHistorico] = useState(() => {
    const saved = localStorage.getItem(claveHist);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const idKey = (establecimientoActual.renspa || establecimientoActual.nombre).replace(/[^a-zA-Z0-9]/g, '_');
    setRegistros(JSON.parse(localStorage.getItem(`ganado_regs_v14_${idKey}`) || '[]'));
    setArchivoHistorico(JSON.parse(localStorage.getItem(`ganado_hist_v14_${idKey}`) || '[]'));
  }, [estacionActivaId, establecimientoActual.nombre, establecimientoActual.renspa]);

  const [loteTemp, setLoteTemp] = useState([]);
  const [caravanaInput, setCaravanaInput] = useState('');
  const [rangoDesde, setRangoDesde] = useState('');
  const [rangoHasta, setRangoHasta] = useState('');
  const [packs, setPacks] = useState(() => JSON.parse(localStorage.getItem('ganado_packs_v14') || '[]'));
  const [cantPack, setCantPack] = useState(100);

  const totalCompradas = packs.reduce((acc, p) => acc + p.cantidad, 0);
  const totalUsadas = registros.filter(r => !r.esExcepcion).length;
  const caravanasDisponibles = totalCompradas - totalUsadas;

  const agregarAlLote = (items) => {
    let temp = [...loteTemp];
    items.forEach(i => {
      let limpio = i.numero.replace(/\D/g, '');
      if (limpio) {
        let ultimos5 = ('00000' + limpio).slice(-5);
        if (!temp.some(x => x.numero === ultimos5)) {
          let cat = i.categoria || categoriaGlobal;
          temp.push({ id: Date.now() + Math.random(), numero: ultimos5, categoria: cat, sexo: obtenerSexo(cat) });
        }
      }
    });
    setLoteTemp(temp);
  };

  const agregarRango = () => {
    const d = parseInt(rangoDesde, 10);
    const h = parseInt(rangoHasta, 10);
    if (isNaN(d) || isNaN(h) || d > h) { alert('Rango inválido'); return; }
    let items = [];
    for (let i = d; i <= h; i++) items.push({ numero: String(i), categoria: categoriaGlobal });
    agregarAlLote(items);
    setRangoDesde(''); setRangoHasta('');
  };

  const confirmarLote = () => {
    if (loteTemp.length === 0) return;
    const fechaHoy = new Date().toLocaleDateString();
    const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let nuevosRegs = [...registros];
    let guardados = [];
    let libres = caravanasDisponibles;
    const prefijo = establecimientoActual.prefijo || '0001234567';

    loteTemp.forEach(item => {
      let esEx = item.numero.length > 5;
      let car15 = (prefijo + item.numero).slice(-15);
      let dup = nuevosRegs.some(r => r.caravana === car15);
      let sinStock = libres <= 0;
      if (!sinStock) libres--;

      let reg = {
        id: Date.now() + Math.random(),
        operacion: operacionActual,
        categoria: item.categoria,
        sexo: item.sexo,
        caravana: car15,
        fecha: fechaHoy,
        esExcepcion: esEx || dup || sinStock,
        motivoAlerta: sinStock ? 'SIN STOCK' : (esEx ? 'EXCEPCIÓN' : dup ? 'DUPLICADO' : '')
      };
      guardados.push(reg);
      nuevosRegs.push(reg);
    });

    const carpeta = {
      id: Date.now(),
      titulo: `${operacionActual} - ${establecimientoActual.nombre}`,
      fecha: `${fechaHoy} a las ${hora}`,
      operacion: operacionActual,
      cantidad: guardados.length,
      items: guardados
    };

    const histAct = [carpeta, ...archivoHistorico];
    setArchivoHistorico(histAct);
    localStorage.setItem(claveHist, JSON.stringify(histAct));

    setRegistros(nuevosRegs);
    localStorage.setItem(claveReg, JSON.stringify(nuevosRegs));
    setLoteTemp([]);
    alert(`Operación guardada con éxito (${guardados.length} cabezas).`);
  };

  const exportarExcel = (itemsParaExportar) => {
    if (itemsParaExportar.length === 0) { alert('No hay datos para exportar.'); return; }
    let html = '<table border="1"><tr><th>Caravana Oficial</th><th>Categoría</th><th>Sexo</th><th>Operación</th><th>Fecha</th><th>Estado</th></tr>';
    itemsParaExportar.forEach(r => {
      html += `<tr><td style="mso-number-format:'\@';">${r.caravana}</td><td>${r.categoria}</td><td>${r.sexo}</td><td>${r.operacion}</td><td>${r.fecha}</td><td>${r.motivoAlerta || 'OK'}</td></tr>`;
    });
    html += '</table>';
    const blob = new Blob(['\ufeff' + html], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reporte_${establecimientoActual.nombre.replace(/[^a-zA-Z0-9]/g, '_')}.xls`;
    a.click();
  };

  const enviarWhatsApp = () => {
    const totalEnt = registros.filter(r => ['Nacimiento', 'Alta en Manga'].includes(r.operacion) && !r.esExcepcion).length;
    const totalSal = registros.filter(r => r.operacion === 'Venta / Salida' && !r.esExcepcion).length;
    const stockActual = (Number(establecimientoActual.stockInicial) || 0) + totalEnt - totalSal;

    let txt = `REPORTE INSTITUCIONAL DE HACIENDA\n`;
    txt += `Campo: ${establecimientoActual.nombre} | RENSPA: ${establecimientoActual.renspa || 'S/N'}\n`;
    txt += `Stock Actual: ${stockActual} cabezas | Identificados: ${totalUsadas}\n\n`;
    registros.slice(-10).forEach(r => {
      txt += `${r.caravana} | ${r.categoria} (${r.sexo}) | ${r.operacion}\n`;
    });
    window.open(`https://wa.me/${telefonoWhatsApp}?text=${encodeURIComponent(txt)}`, '_blank');
  };

  const styles = {
    container: { fontFamily: 'sans-serif', backgroundColor: '#121212', color: '#fff', minHeight: '100vh', paddingBottom: '2rem' },
    header: { backgroundColor: '#1b5e20', color: 'white', padding: '1rem', textAlign: 'center' },
    nav: { display: 'flex', backgroundColor: '#0d3b11', overflowX: 'auto' },
    navBtn: (active) => ({
      padding: '0.8rem 0.6rem', border: 'none', background: active ? 'rgba(255,255,255,0.15)' : 'none',
      color: active ? '#ffffff' : '#ccc', fontWeight: 'bold', cursor: 'pointer', flex: 1, textAlign: 'center', fontSize: '0.75rem', whiteSpace: 'nowrap'
    }),
    body: { padding: '1rem', maxWidth: '800px', margin: '0 auto' },
    card: { background: '#1e1e1e', borderRadius: '12px', padding: '1.2rem', marginBottom: '1rem' },
    input: { width: '100%', padding: '0.8rem', border: '1px solid #444', background: '#2a2a2a', color: 'white', borderRadius: '8px', boxSizing: 'border-box', marginTop: '0.3rem', marginBottom: '0.8rem' },
    select: { width: '100%', padding: '0.8rem', border: '1px solid #444', background: '#2a2a2a', color: 'white', borderRadius: '8px', boxSizing: 'border-box', marginTop: '0.3rem', marginBottom: '0.8rem' },
    btn: { width: '100%', backgroundColor: '#1b5e20', color: 'white', border: 'none', padding: '0.9rem', fontSize: '1rem', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', marginTop: '0.5rem' },
    grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginTop: '0.8rem' }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={{ margin: 0, fontSize: '1.2rem' }}>{NOMBRE_APLICACION}</h1>
        <small style={{ color: '#a5d6a7' }}>
          Campo: <b>{establecimientoActual.nombre}</b> | RENSPA: <b>{establecimientoActual.renspa || 'Sin registrar'}</b> | Prueba: <b>{diasPruebaRestantes} días</b>
        </small>
      </header>

      <nav style={styles.nav}>
        <button style={styles.navBtn(tab === 'diario')} onClick={() => setTab('diario')}>Manga</button>
        <button style={styles.navBtn(tab === 'archivo')} onClick={() => setTab('archivo')}>Archivo</button>
        <button style={styles.navBtn(tab === 'stock')} onClick={() => setTab('stock')}>Stock</button>
        <button style={styles.navBtn(tab === 'packs')} onClick={() => setTab('packs')}>Packs</button>
        <button style={styles.navBtn(tab === 'suscripcion')} onClick={() => setTab('suscripcion')}>Suscripción</button>
      </nav>

      <div style={styles.body}>
        {tab === 'diario' && (
          <div>
            <div style={{ ...styles.card, border: '2px solid #0288d1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: '#81c784', margin: 0 }}>Establecimiento Activo</h3>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button onClick={agregarNuevoRenspa} style={{ background: '#0288d1', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>Nuevo Campo</button>
                  <button onClick={() => setEditandoEst(!editandoEst)} style={{ background: '#333', color: '#fff', border: '1px solid #666', padding: '0.3rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}>{editandoEst ? 'Cerrar' : 'Configurar'}</button>
                </div>
              </div>

              {establecimientos.length > 1 && (
                <div style={{ marginTop: '0.8rem' }}>
                  <select value={estacionActivaId} onChange={(e) => { setEstacionActivaId(Number(e.target.value)); localStorage.setItem('ganado_est_activa_v14', e.target.value); }} style={styles.select}>
                    {establecimientos.map(est => <option key={est.id} value={est.id}>{est.nombre} (RENSPA: {est.renspa || 'S/N'})</option>)}
                  </select>
                </div>
              )}

              {!editandoEst ? (
                <div style={{ fontSize: '0.9rem', color: '#ccc', marginTop: '0.5rem' }}>
                  <div>RENSPA: <b style={{ color: '#ffb74d' }}>{establecimientoActual.renspa || 'Sin registrar'}</b></div>
                  <div>Stock Inicial Base: <b>{establecimientoActual.stockInicial || 0} cabezas</b> | Prefijo: <b>{establecimientoActual.prefijo}</b></div>
                </div>
              ) : (
                <div style={{ marginTop: '0.8rem' }}>
                  <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Nombre del Establecimiento:</label>
                  <input type="text" value={tNombre} onChange={(e) => setTNombre(e.target.value)} style={styles.input} />
                  <label style={{ fontSize: '0.75rem', color: '#aaa' }}>RENSPA:</label>
                  <input type="text" value={tRenspa} onChange={(e) => setTRenspa(e.target.value)} style={styles.input} />
                  <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Stock Inicial:</label>
                  <input type="number" value={tStock} onChange={(e) => setTStock(e.target.value)} style={styles.input} />
                  <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Prefijo de Caravana (10 dígitos):</label>
                  <input type="text" maxLength={10} value={tPrefijo} onChange={(e) => setTPrefijo(e.target.value)} style={styles.input} />
                  <button onClick={guardarEstablecimiento} style={{ ...styles.btn, backgroundColor: '#2e7d32' }}>Guardar Datos</button>
                </div>
              )}
            </div>

            <div style={styles.card}>
              <h3 style={{ color: '#81c784', marginTop: 0 }}>1. Operación y Categoría Base</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.8rem' }}>
                {['Nacimiento', 'Venta / Salida', 'Sanidad', 'Alta en Manga'].map(op => (
                  <button key={op} onClick={() => setOperacionActual(op)} style={{ padding: '0.7rem', background: operacionActual === op ? '#f57c00' : '#2a2a2a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>{op}</button>
                ))}
              </div>
              <label style={{ fontSize: '0.85rem', color: '#aaa' }}>Categoría:</label>
              <select value={categoriaGlobal} onChange={(e) => setCategoriaGlobal(e.target.value)} style={styles.select}>
                {['Terneros', 'Terneras', 'Novillitos', 'Novillos', 'Vaquillonas', 'Vacas', 'Toros'].map(c => <option key={c} value={c}>{c} ({obtenerSexo(c)})</option>)}
              </select>
            </div>

            <div style={{ ...styles.card, border: '2px solid #0277bd' }}>
              <h3 style={{ color: '#81c784', marginTop: 0 }}>Ingreso en Manga</h3>
              <label style={{ fontSize: '0.85rem', color: '#aaa' }}>Caravana Individual (Escribir y Enter o Agregar):</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input type="text" placeholder="Ej: 12345" value={caravanaInput} onChange={(e) => setCaravanaInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && caravanaInput.trim()) { agregarAlLote([{ numero: caravanaInput.trim() }]); setCaravanaInput(''); } }} style={{ ...styles.input, margin: 0 }} />
                <button onClick={() => { if (caravanaInput.trim()) { agregarAlLote([{ numero: caravanaInput.trim() }]); setCaravanaInput(''); } }} style={{ background: '#2e7d32', color: '#fff', border: 'none', padding: '0 1rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Agregar</button>
              </div>

              <label style={{ fontSize: '0.85rem', color: '#aaa' }}>O Rango Correlativo:</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input type="number" placeholder="Desde N°" value={rangoDesde} onChange={(e) => setRangoDesde(e.target.value)} style={{ ...styles.input, margin: 0 }} />
                <input type="number" placeholder="Hasta N°" value={rangoHasta} onChange={(e) => setRangoHasta(e.target.value)} style={{ ...styles.input, margin: 0 }} />
              </div>
              <button onClick={agregarRango} style={{ ...styles.btn, backgroundColor: '#f57c00', color: '#000' }}>Agregar Rango al Lote</button>
            </div>

            {loteTemp.length > 0 && (
              <div style={{ ...styles.card, border: '2px solid #ffb74d', background: '#1c1b18' }}>
                <h3 style={{ color: '#ffb74d', marginTop: 0 }}>Lote en Preparación ({loteTemp.length} animales)</h3>
                <div style={{ maxHeight: '150px', overflowY: 'auto', background: '#111', padding: '0.5rem', borderRadius: '6px', marginBottom: '1rem' }}>
                  {loteTemp.map((i, idx) => (
                    <div key={i.id} style={{ fontSize: '0.85rem', padding: '0.3rem 0', borderBottom: '1px solid #333' }}>#{idx + 1} — N° <b style={{ color: '#ffb74d' }}>{i.numero}</b> ({i.categoria} - {i.sexo})</div>
                  ))}
                </div>
                <button onClick={confirmarLote} style={{ ...styles.btn, backgroundColor: '#2e7d32', fontSize: '1.05rem' }}>Confirmar y Guardar Lote</button>
                <button onClick={() => setLoteTemp([])} style={{ ...styles.btn, backgroundColor: '#c62828', marginTop: '0.4rem' }}>Descartar</button>
              </div>
            )}

            <div style={styles.card}>
              <h3 style={{ color: '#81c784', marginTop: 0 }}>Listado Definitivo ({registros.length})</h3>
              <div style={{ maxHeight: '180px', overflowY: 'auto', marginBottom: '1rem' }}>
                {registros.length === 0 ? <p style={{ color: '#aaa' }}>Sin registros guardados.</p> : registros.slice().reverse().map((r, idx) => (
                  <div key={r.id} style={{ background: r.esExcepcion ? '#3e2723' : '#252525', padding: '0.5rem', marginBottom: '0.3rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                    <b>#{registros.length - idx}</b> — Caravana: <b style={{ color: '#81c784' }}>{r.caravana}</b> | {r.categoria} ({r.sexo}) — [{r.operacion}]
                  </div>
                ))}
              </div>
              <div style={styles.grid3}>
                <button onClick={() => exportarExcel(registros)} style={{ ...styles.btn, backgroundColor: '#2e7d32', marginTop: 0 }}>Excel</button>
                <button onClick={() => window.print()} style={{ ...styles.btn, backgroundColor: '#d84315', marginTop: 0 }}>PDF</button>
                <button onClick={enviarWhatsApp} style={{ ...styles.btn, backgroundColor: '#25d366', color: '#000', marginTop: 0 }}>WhatsApp</button>
              </div>
            </div>
          </div>
        )}

        {tab === 'archivo' && (
          <div style={styles.card}>
            <h3 style={{ color: '#81c784', marginTop: 0 }}>Archivo Histórico</h3>
            {archivoHistorico.length === 0 ? <p style={{ color: '#aaa' }}>No hay carpetas archivadas.</p> : archivoHistorico.map(c => (
              <div key={c.id} style={{ background: '#252525', padding: '0.8rem', borderRadius: '8px', marginBottom: '0.6rem', borderLeft: '4px solid #0288d1' }}>
                <strong style={{ color: '#ffb74d' }}>{c.titulo}</strong> <span style={{ fontSize: '0.75rem', color: '#aaa', float: 'right' }}>{c.fecha}</span>
                <div style={{ fontSize: '0.85rem', margin: '0.4rem 0' }}>Total: <b>{c.cantidad} cabezas</b></div>
                <button onClick={() => exportarExcel(c.items)} style={{ background: '#2e7d32', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>Descargar Excel de esta carpeta</button>
              </div>
            ))}
          </div>
        )}

        {tab === 'stock' && (
          <div style={styles.card}>
            <h3 style={{ color: '#81c784', marginTop: 0 }}>Estado de Stock General</h3>
            <p>Stock Inicial Configurado: <b>{establecimientoActual.stockInicial || 0} cabezas</b></p>
            <p>Stock Actual Calculado: <b style={{ color: '#81c784', fontSize: '1.4rem' }}>{(Number(establecimientoActual.stockInicial) || 0) + registros.filter(r => ['Nacimiento', 'Alta en Manga'].includes(r.operacion) && !r.esExcepcion).length - registros.filter(r => r.operacion === 'Venta / Salida' && !r.esExcepcion).length} cabezas</b></p>
            <p>Animales Identificados en Manga: <b>{totalUsadas} un.</b></p>
          </div>
        )}

        {tab === 'packs' && (
          <div style={styles.card}>
            <h3 style={{ color: '#81c784', marginTop: 0 }}>Packs de Caravanas</h3>
            <p>Disponibles en Stock: <b style={{ color: '#00e676', fontSize: '1.2rem' }}>{caravanasDisponibles} un.</b></p>
            <select value={cantPack} onChange={(e) => setCantPack(Number(e.target.value))} style={styles.select}>
              <option value={50}>Pack de 50 unidades</option>
              <option value={100}>Pack de 100 unidades</option>
              <option value={500}>Pack de 500 unidades</option>
            </select>
            <button onClick={() => {
              const p = { id: Date.now(), cantidad: cantPack, fecha: new Date().toLocaleDateString() };
              const act = [...packs, p];
              setPacks(act);
              localStorage.setItem('ganado_packs_v14', JSON.stringify(act));
              alert('Pack acreditado correctamente.');
            }} style={{ ...styles.btn, backgroundColor: '#0288d1' }}>Simular Acreditación de Pack</button>
          </div>
        )}

        {tab === 'suscripcion' && (
          <div style={{ background: '#1e1e1e', borderRadius: '12px', padding: '1.2rem', marginBottom: '1rem', border: '2px solid #f57c00', textAlign: 'center' }}>
            <h3 style={{ color: '#ffb74d', marginTop: 0 }}>Estado de Suscripción</h3>
            <div style={{ background: '#1b381e', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#81c784' }}>{diasPruebaRestantes} Días Restantes</div>
              <small>Prueba gratuita activa</small>
            </div>
            <select value={planSuscripcion} onChange={(e) => setPlanSuscripcion(e.target.value)} style={styles.select}>
              <option value="Mensual">Plan Mensual ($40.000 ARS)</option>
              <option value="Trimestral">Plan Trimestral ($80.000 ARS)</option>
              <option value="Anual">Plan Anual ($240.000 ARS)</option>
            </select>
            <div style={{ background: '#252525', padding: '0.8rem', borderRadius: '8px', textAlign: 'left', marginBottom: '1rem', fontSize: '0.9rem' }}>
              <div>Banco Provincia</div>
              <div>Alias: <b style={{ color: '#ffb74d' }}>{aliasBco}</b></div>
              <div>CVU: <b style={{ color: '#ffb74d' }}>{cvuBco}</b></div>
            </div>
            <button onClick={() => window.open(`https://wa.me/${telefonoWhatsApp}?text=${encodeURIComponent(`Hola, quiero abonar el plan ${planSuscripcion} (${obtenerPrecio(planSuscripcion)}) para ${establecimientoActual.nombre}`)}`, '_blank')} style={{ ...styles.btn, backgroundColor: '#25d366', color: '#000' }}>
              Notificar Pago por WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
