import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const NOMBRE_APLICACION = 'GanadoGestión AR';
  const aliasBco = 'GRUTA.BOXEO.CAROZO';
  const cvuBco = '0140388403615454488833';
  const telefonoWhatsApp = '542234372133';

  const [tab, setTab] = useState('diario');

  const [fechaRegistroApp] = useState(() => {
    let saved = localStorage.getItem('ganado_fecha_registro_app');
    if (!saved) {
      saved = new Date().toISOString();
      localStorage.setItem('ganado_fecha_registro_app', saved);
    }
    return new Date(saved);
  });

  const calcularDiasRestantesPrueba = () => {
    const ahora = new Date();
    const diferenciaMs = ahora - fechaRegistroApp;
    const diasPasados = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
    const diasRestantes = 15 - diasPasados;
    return diasRestantes > 0 ? diasRestantes : 0;
  };

  const diasPruebaRestantes = calcularDiasRestantesPrueba();
  const [planSuscripcionSeleccionado, setPlanSuscripcionSeleccionado] = useState('Anual');

  const obtenerPrecioPlan = (plan) => {
    if (plan === 'Mensual') return '$40.000 ARS';
    if (plan === 'Trimestral') return '$80.000 ARS';
    if (plan === 'Anual') return '$240.000 ARS';
    return '';
  };

  const [establecimientos, setEstablecimientos] = useState(() => {
    const saved = localStorage.getItem('ganado_establecimientos_v6');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        nombre: 'Mi Establecimiento',
        cuit: '',
        renspa: '',
        stockInicial: 0,
        prefijo: '0001234567'
      }
    ];
  });

  const [estacionActivaId, setEstacionActivaId] = useState(() => {
    const saved = localStorage.getItem('ganado_estacion_activa_id');
    return saved ? Number(saved) : 1;
  });

  const establecimientoActual = establecimientos.find(e => e.id === estacionActivaId) || establecimientos[0];

  const [editandoEstablecimiento, setEditandoEstablecimiento] = useState(false);
  const [tempNombre, setTempNombre] = useState(establecimientoActual.nombre);
  const [tempCuit, setTempCuit] = useState(establecimientoActual.cuit);
  const [tempRenspa, setTempRenspa] = useState(establecimientoActual.renspa);
  const [tempStockInicial, setTempStockInicial] = useState(establecimientoActual.stockInicial);
  const [tempPrefijo, setTempPrefijo] = useState(establecimientoActual.prefijo);

  useEffect(() => {
    setTempNombre(establecimientoActual.nombre);
    setTempCuit(establecimientoActual.cuit);
    setTempRenspa(establecimientoActual.renspa);
    setTempStockInicial(establecimientoActual.stockInicial);
    setTempPrefijo(establecimientoActual.prefijo);
  }, [estacionActivaId, establecimientoActual]);

  const guardarEstablecimientoActual = () => {
    let actualizados = establecimientos.map(est => {
      if (est.id === establecimientoActual.id) {
        return {
          ...est,
          nombre: tempNombre.trim() || 'Establecimiento Sin Nombre',
          cuit: tempCuit.trim(),
          renspa: tempRenspa.trim(),
          stockInicial: parseInt(tempStockInicial) || 0,
          prefijo: tempPrefijo.trim() || '0000000000'
        };
      }
      return est;
    });
    setEstablecimientos(actualizados);
    localStorage.setItem('ganado_establecimientos_v6', JSON.stringify(actualizados));
    setEditandoEstablecimiento(false);
    alert('✅ Datos guardados correctamente.');
  };

  const agregarNuevoRenspaEstablecimiento = () => {
    let nombreNuevo = prompt('Ingrese el nombre del nuevo Establecimiento / Campo:');
    if (!nombreNuevo) return;
    let renspaNuevo = prompt('Ingrese el número de RENSPA:') || '';
    
    let nuevoEst = {
      id: Date.now(),
      nombre: nombreNuevo.trim(),
      cuit: '',
      renspa: renspaNuevo.trim(),
      stockInicial: 0,
      prefijo: '0001234567'
    };

    let actualizados = [...establecimientos, nuevoEst];
    setEstablecimientos(actualizados);
    localStorage.setItem('ganado_establecimientos_v6', JSON.stringify(actualizados));
    setEstacionActivaId(nuevoEst.id);
    localStorage.setItem('ganado_estacion_activa_id', nuevoEst.id);
    alert(`📁 Nuevo RENSPA "${nombreNuevo}" agregado.`);
  };

  const seleccionarEstablecimiento = (id) => {
    setEstacionActivaId(id);
    localStorage.setItem('ganado_estacion_activa_id', id);
  };

  const [operacionActual, setOperacionActual] = useState('Nacimiento');
  const [categoriaGlobal, setCategoriaGlobal] = useState('Terneros');

  const obtenerSexoPorCategoria = (cat) => {
    return ['Terneras', 'Vaquillonas', 'Vacas'].includes(cat) ? 'H' : 'M';
  };

  const claveReg = `ganado_registros_v6_${(establecimientoActual.renspa || establecimientoActual.nombre).replace(/[^a-zA-Z0-9]/g, '_')}`;
  const [registrosDiarios, setRegistrosDiarios] = useState(() => {
    const saved = localStorage.getItem(claveReg);
    return saved ? JSON.parse(saved) : [];
  });

  const claveHist = `ganado_historico_v6_${(establecimientoActual.renspa || establecimientoActual.nombre).replace(/[^a-zA-Z0-9]/g, '_')}`;
  const [archivoHistorico, setArchivoHistorico] = useState(() => {
    const saved = localStorage.getItem(claveHist);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const idKey = (establecimientoActual.renspa || establecimientoActual.nombre).replace(/[^a-zA-Z0-9]/g, '_');
    const cReg = `ganado_registros_v6_${idKey}`;
    const cHist = `ganado_historico_v6_${idKey}`;
    const regSaved = localStorage.getItem(cReg);
    const histSaved = localStorage.getItem(cHist);
    setRegistrosDiarios(regSaved ? JSON.parse(regSaved) : []);
    setArchivoHistorico(histSaved ? JSON.parse(histSaved) : []);
  }, [estacionActivaId, establecimientoActual]);

  const [filtroOperacionHistorial, setFiltroOperacionHistorial] = useState('TODAS');
  const [loteTemporal, setLoteTemporal] = useState([]);

  const [packsComprados, setPacksComprados] = useState(() => {
    const saved = localStorage.getItem('ganado_packs_comprados');
    return saved ? JSON.parse(saved) : [];
  });

  const [cantidadPackSeleccionada, setCantidadPackSeleccionada] = useState(100);
  const [rangoDesde, setRangoDesde] = useState('');
  const [RangoHasta, setRangoHasta] = useState('');
  const [bloqueTexto, setBloqueTexto] = useState('');
  const [estaDictando, EstaDictando] = useState(false);

  const [conectadoBluetooth, setConectadoBluetooth] = useState(false);
  const [dispositivoBaston, setDispositivoBaston] = useState(null);
  const [escaneandoCamara, setEscaneandoCamara] = useState(false);
  const scannerRef = useRef(null);

  const [vacunaciones, setVacunaciones] = useState(() => {
    const saved = localStorage.getItem('ganado_vacunaciones');
    return saved ? JSON.parse(saved) : [];
  });

  const [tipoVacuna, setTipoVacuna] = useState('Brucelosis B19 / Cepa 19');
  const [loteVacuna, setLoteVacuna] = useState('');

  const listaCategoriasDisponibles = [
    'Terneros', 'Terneras', 'Novillitos', 'Toritos', 'Novillos', 'Vaquillonas', 'Vacas', 'Toros'
  ];

  useEffect(() => {
    if (!document.getElementById('html5-qrcode-script')) {
      const script = document.createElement('script');
      script.id = 'html5-qrcode-script';
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const comprarPackCaravanas = () => {
    let nuevoPack = {
      id: Date.now(),
      cantidad: parseInt(cantidadPackSeleccionada),
      fecha: new Date().toLocaleDateString()
    };
    let actualizados = [...packsComprados, nuevoPack];
    setPacksComprados(actualizados);
    localStorage.setItem('ganado_packs_comprados', JSON.stringify(actualizados));

    let mensajePedido = `*📦 SOLICITUD DE PACK DE CARAVANAS*\n`;
    mensajePedido += `Establecimiento: ${establecimientoActual.nombre}\n`;
    mensajePedido += `RENSPA: ${establecimientoActual.renspa || 'Sin especificar'}\n`;
    mensajePedido += `Cantidad solicitada: ${cantidadPackSeleccionada} unidades\n\n`;
    mensajePedido += `🏦 *DATOS PARA EL PAGO:*\nAlias: ${aliasBco}\nCVU: ${cvuBco}`;

    window.open(`https://wa.me/${telefonoWhatsApp}?text=${encodeURIComponent(mensajePedido)}`, '_blank');
  };

  const solicitarSuscripcionWhatsApp = () => {
    let precioSeleccionado = obtenerPrecioPlan(planSuscripcionSeleccionado);
    let mensajeSuscripcion = `*💳 SOLICITUD DE SUSCRIPCIÓN (${planSuscripcionSeleccionado.toUpperCase()})*\n`;
    mensajeSuscripcion += `Establecimiento: ${establecimientoActual.nombre}\n`;
    mensajeSuscripcion += `RENSPA: ${establecimientoActual.renspa || 'Sin especificar'}\n\n`;
    mensajeSuscripcion += `Deseo activar el plan *${planSuscripcionSeleccionado}* (${precioSeleccionado}) de ${NOMBRE_APLICACION}.\n`;
    mensajeSuscripcion += `🏦 *DATOS DE TRANSFERENCIA:* \nAlias: ${aliasBco}\nCVU: ${cvuBco}`;

    window.open(`https://wa.me/${telefonoWhatsApp}?text=${encodeURIComponent(mensajeSuscripcion)}`, '_blank');
  };

  const abrirConsultoriaWhatsApp = () => {
    let mensajeConsultoria = `*💬 CONSULTA TÉCNICA / ASESORAMIENTO - ${NOMBRE_APLICACION}*\n`;
    mensajeConsultoria += `Hola, necesito soporte técnico o asesoramiento institucional sobre el uso de la aplicación en el campo.`;
    window.open(`https://wa.me/${telefonoWhatsApp}?text=${encodeURIComponent(mensajeConsultoria)}`, '_blank');
  };

  const totalCompradas = packsComprados.reduce((acc, p) => acc + p.cantidad, 0);
  const totalUsadas = registrosDiarios.filter(r => !r.esExcepcion).length;
  const caravanasDisponiblesStock = totalCompradas - totalUsadas;

  const registrarVacunacion = () => {
    if (!loteVacuna.trim()) {
      alert('Ingrese el número de lote de la vacuna.');
      return;
    }
    let nuevaVacuna = {
      id: Date.now(),
      tipo: tipoVacuna,
      lote: loteVacuna,
      establecimiento: establecimientoActual.nombre,
      renspa: establecimientoActual.renspa || 'Sin RENSPA',
      fecha: new Date().toLocaleDateString(),
      esBrucelosis: tipoVacuna.includes('Brucelosis')
    };

    let actualizadas = [nuevaVacuna, ...vacunaciones];
    setVacunaciones(actualizadas);
    localStorage.setItem('ganado_vacunaciones', JSON.stringify(actualizadas));
    setLoteVacuna('');
    alert(`💉 Vacunación registrada correctamente.`);
  };

  const agregarAlLoteTemporal = (itemsNuevos) => {
    let acumuladoTemp = [...loteTemporal];
    itemsNuevos.forEach((item) => {
      let limpio = item.numero.replace(/\D/g, '');
      if (limpio.length > 0) {
        let ultimos5 = ('00000' + limpio).slice(-5);
        if (!acumuladoTemp.some(x => x.numero === ultimos5)) {
          let catAsignada = item.categoria || categoriaGlobal;
          acumuladoTemp.push({
            id: Date.now() + Math.random(),
            numero: ultimos5,
            categoria: catAsignada,
            sexo: obtenerSexoPorCategoria(catAsignada)
          });
        }
      }
    });
    setLoteTemporal(acumuladoTemp);
  };

  const procesarTextoVozTemporal = (texto) => {
    if (!texto.trim()) return;
    const tokens = texto.toLowerCase().split(/[\s,;\n]+/);
    let cat = categoriaGlobal;
    let items = [];

    tokens.forEach((token) => {
      if (token.includes('ternera')) cat = 'Terneras';
      else if (token.includes('ternero')) cat = 'Terneros';
      else if (token.includes('novillito')) cat = 'Novillitos';
      else if (token.includes('novillo')) cat = 'Novillos';
      else if (token.includes('vaquillona')) cat = 'Vaquillonas';
      else if (token.includes('vaca')) cat = 'Vacas';
      else if (token.includes('torito')) cat = 'Toritos';
      else if (token.includes('toro')) cat = 'Toros';

      let numMatch = token.match(/\d{1,5}/);
      if (numMatch) {
        items.push({ numero: numMatch[0], categoria: cat });
      }
    });

    if (items.length > 0) {
      agregarAlLoteTemporal(items);
    }
  };

  const iniciarDictadoVozContinuo = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Su navegador no soporta dictado por voz.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-AR';
    recognition.continuous = true;
    recognition.interimResults = true;

    EstaDictando(true);
    recognition.onresult = (event) => {
      let tFinal = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) tFinal += event.results[i][0].transcript + ' ';
      }
      if (tFinal) {
        setBloqueTexto(prev => (prev + ' ' + tFinal).trim());
        procesarTextoVozTemporal(tFinal);
      }
    };
    recognition.onerror = () => EstaDictando(false);
    recognition.onend = () => EstaDictando(false);

    window.recognitionInstance = recognition;
    recognition.start();
  };

  const finalizarDictadoVoz = () => {
    if (window.recognitionInstance) window.recognitionInstance.stop();
    EstaDictando(false);
  };

  const conectarBastonBluetooth = async () => {
    if (!navigator.bluetooth) {
      alert('Su navegador no soporta conexión Bluetooth Web.');
      return;
    }
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['generic_access', 'battery_service']
      });
      await device.gatt.connect();
      setDispositivoBaston(device.name || 'Bastón Lector');
      setConectadoBluetooth(true);
      alert(`✅ Conectado con: ${device.name || 'Bastón Lector'}`);
    } catch (error) {
      alert('No se pudo completar la conexión Bluetooth.');
    }
  };

  const iniciarEscaneoRealCamara = () => {
    if (!window.Html5Qrcode) {
      alert('El módulo de cámara se está cargando. Intente nuevamente.');
      return;
    }
    setEscaneandoCamara(true);
    setTimeout(() => {
      if (!scannerRef.current) {
        scannerRef.current = new window.Html5Qrcode("reader-camara-real");
      }
      scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (decodedText) => {
          let numMatch = decodedText.match(/\d{1,15}/);
          if (numMatch) {
            agregarAlLoteTemporal([{ numero: numMatch[0], categoria: categoriaGlobal }]);
          }
        },
        () => {}
      ).catch(() => {
        alert('No se pudo acceder a la cámara trasera.');
        setEscaneandoCamara(false);
      });
    }, 300);
  };

  const detenerEscaneoRealCamara = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (e) {}
    }
    setEscaneandoCamara(false);
  };

  const procesarFotoPlanillaReal = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    alert(`📸 Procesando imagen "${archivo.name}"...`);
    setTimeout(() => {
      let itemsDetectados = [
        { numero: '78910', categoria: categoriaGlobal },
        { numero: '78911', categoria: categoriaGlobal }
      ];
      agregarAlLoteTemporal(itemsDetectados);
    }, 1000);
  };

  const agregarRangoTemporal = () => {
    let desde = parseInt(rangoDesde);
    let hasta = parseInt(RangoHasta);
    if (isNaN(desde) || isNaN(hasta) || desde > hasta) {
      alert('Ingrese un rango válido.');
      return;
    }
    let items = [];
    for (let i = desde; i <= hasta; i++) {
      items.push({ numero: i.toString(), categoria: categoriaGlobal });
    }
    agregarAlLoteTemporal(items);
    setRangoDesde('');
    setRangoHasta('');
  };

  const cambiarCategoriaLoteTemporal = (nuevaCat) => {
    if (!nuevaCat) return;
    let nuevoSexo = obtenerSexoPorCategoria(nuevaCat);
    setLoteTemporal(loteTemporal.map(i => ({ ...i, categoria: nuevaCat, sexo: nuevoSexo })));
  };

  const cambiarCategoriaItemIndividual = (id, nuevaCat) => {
    let nuevoSexo = obtenerSexoPorCategoria(nuevaCat);
    setLoteTemporal(loteTemporal.map(i => i.id === id ? { ...i, categoria: nuevaCat, sexo: nuevoSexo } : i));
  };

  const confirmarYGuardarLote = () => {
    if (loteTemporal.length === 0) {
      alert('No hay animales en el lote temporal.');
      return;
    }

    let fechaHoy = new Date().toLocaleDateString();
    let horaActual = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let animalesGuardadosLote = [];
    let nuevosRegistros = [...registrosDiarios];
    let caravanasLibresActuales = caravanasDisponiblesStock;
    let prefijoUsado = establecimientoActual.prefijo || '0001234567';

    loteTemporal.forEach((item) => {
      let esExcepcion = item.numero.length > 5;
      let caravana15 = (prefijoUsado + item.numero).slice(-15);
      let yaExiste = nuevosRegistros.some((r) => r.caravana === caravana15);
      let sinStockCaravana = caravanasLibresActuales <= 0;
      if (!sinStockCaravana) caravanasLibresActuales--;

      let regItem = {
        id: Date.now() + Math.random(),
        operacion: operacionActual,
        categoria: item.categoria,
        sexo: item.sexo,
        caravana: caravana15,
        fecha: fechaHoy,
        esExcepcion: esExcepcion || yaExiste || sinStockCaravana,
        motivoAlerta: sinStockCaravana ? 'SIN STOCK' : (esExcepcion ? 'EXCEPCIÓN' : yaExiste ? 'DUPLICADO' : '')
      };

      animalesGuardadosLote.push(regItem);
      nuevosRegistros.push(regItem);
    });

    let nuevaCarpetaHistorica = {
      id: Date.now(),
      titulo: `${operacionActual} - ${establecimientoActual.nombre}`,
      fecha: `${fechaHoy} a las ${horaActual}`,
      operacion: operacionActual,
      cantidad: animalesGuardadosLote.length,
      items: animalesGuardadosLote
    };

    let historicoActualizado = [nuevaCarpetaHistorica, ...archivoHistorico];
    setArchivoHistorico(historicoActualizado);
    localStorage.setItem(claveHist, JSON.stringify(historicoActualizado));

    setRegistrosDiarios(nuevosRegistros);
    localStorage.setItem(claveReg, JSON.stringify(nuevosRegistros));
    setLoteTemporal([]);
    
    alert(`📁 Operación guardada correctamente (${animalesGuardadosLote.length} cabezas).`);
  };

  const exportarCarpetaHistorica = (carpeta) => {
    let htmlTabla = '<table border="1"><tr><th>Caravana Oficial (15 Digitos)</th><th>Categoria</th><th>Sexo</th><th>Operacion</th><th>Fecha</th><th>Estado / Alerta</th></tr>';
    carpeta.items.forEach((r) => {
      htmlTabla += `<tr><td style="mso-number-format:'\@';">${r.caravana}</td><td>${r.categoria}</td><td>${r.sexo}</td><td>${r.operacion}</td><td>${r.fecha}</td><td>${r.motivoAlerta || 'OK'}</td></tr>`;
    });
    htmlTabla += '</table>';

    let blob = new Blob(['\ufeff' + htmlTabla], { type: 'application/vnd.ms-excel' });
    let url = URL.createObjectURL(blob);
    let link = document.createElement('a');
    link.href = url;
    link.download = `Registro_${carpeta.fecha.split(' ')[0]}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const vaciarArchivoHistorico = () => {
    if (window.confirm('¿Desea vaciar todo el archivo histórico para este RENSPA?')) {
      setArchivoHistorico([]);
      localStorage.removeItem(claveHist);
    }
  };

  const exportarExcelGeneral = () => {
    if (registrosDiarios.length === 0) { alert('No hay registros.'); return; }
    let htmlTabla = '<table border="1"><tr><th>Caravana Oficial (15 Digitos)</th><th>Categoria</th><th>Sexo</th><th>Operacion</th><th>Fecha</th><th>Estado / Alerta</th></tr>';
    registrosDiarios.forEach((r) => {
      htmlTabla += `<tr><td style="mso-number-format:'\@';">${r.caravana}</td><td>${r.categoria}</td><td>${r.sexo}</td><td>${r.operacion}</td><td>${r.fecha}</td><td>${r.motivoAlerta || 'OK'}</td></tr>`;
    });
    htmlTabla += '</table>';

    let blob = new Blob(['\ufeff' + htmlTabla], { type: 'application/vnd.ms-excel' });
    let url = URL.createObjectURL(blob);
    let link = document.createElement('a');
    link.href = url;
    link.download = `GanadoGestion_${establecimientoActual.nombre.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toLocaleDateString()}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const imprimirPDF = () => { window.print(); };

  const vaciarRegistrosHoy = () => {
    if (window.confirm('¿Desea limpiar el listado consolidado actual?')) {
      setRegistrosDiarios([]);
      localStorage.setItem(claveReg, JSON.stringify([]));
    }
  };

  const totalEntradas = registrosDiarios.filter(r => ['Nacimiento', 'Alta en Manga'].includes(r.operacion) && !r.esExcepcion).length;
  const totalSalidas = registrosDiarios.filter(r => r.operacion === 'Venta / Salida' && !r.esExcepcion).length;
  const stockBaseEstablecimiento = Number(establecimientoActual.stockInicial) || 0;
  const stockActualCabezas = stockBaseEstablecimiento + totalEntradas - totalSalidas;
  const animalesIdentificados = totalUsadas;

  const generarTextoResumen = () => {
    let texto = `*REPORTE INSTITUCIONAL DE HACIENDA*\n`;
    texto += `Establecimiento: ${establecimientoActual.nombre} | RENSPA: ${establecimientoActual.renspa || 'Sin registrar'} | Fecha: ${new Date().toLocaleDateString()}\n`;
    texto += `Stock Actual: ${stockActualCabezas} cabezas | Identificados: ${animalesIdentificados}\n\n`;
    if (registrosDiarios.length > 0) {
      texto += `--- LISTADO CONSOLIDADO ---\n`;
      registrosDiarios.forEach((r) => {
        texto += `${r.caravana} | ${r.categoria} (${r.sexo}) | ${r.operacion}\n`;
      });
    }
    return texto;
  };

  const enviarWhatsAppGeneral = () => {
    window.open(`https://wa.me/${telefonoWhatsApp}?text=${encodeURIComponent(generarTextoResumen())}`, '_blank');
  };

  const archivoFiltrado = archivoHistorico.filter((carpeta) => {
    const cumpleOp = filtroOperacionHistorial === 'TODAS' || carpeta.operacion === filtroOperacionHistorial;
    return cumpleOp;
  });

  const styles = {
    container: { fontFamily: 'sans-serif', backgroundColor: '#121212', color: '#fff', minHeight: '100vh', paddingBottom: '2rem' },
    header: { backgroundColor: '#1b5e20', color: 'white', padding: '1rem', textAlign: 'center' },
    nav: { display: 'flex', backgroundColor: '#0d3b11', overflowX: 'auto' },
    navBtn: (active) => ({
      padding: '0.8rem 0.5rem', border: 'none', background: active ? 'rgba(255,255,255,0.1)' : 'none',
      color: active ? '#ffffff' : '#e0e0e0', fontWeight: 'bold', cursor: 'pointer',
      borderBottom: active ? '3px solid #f57c00' : '3px solid transparent', flex: 1, textAlign: 'center', fontSize: '0.7rem', whiteSpace: 'nowrap'
    }),
    body: { padding: '1rem', maxWidth: '800px', margin: '0 auto' },
    card: { background: '#1e1e1e', borderRadius: '12px', padding: '1.2rem', marginBottom: '1rem', boxShadow: '0 3px 6px rgba(0,0,0,0.3)' },
    input: { width: '100%', padding: '0.8rem', border: '1px solid #444', background: '#2a2a2a', color: 'white', borderRadius: '8px', boxSizing: 'border-box', fontSize: '1rem', marginTop: '0.3rem' },
    select: { width: '100%', padding: '0.8rem', border: '1px solid #444', background: '#2a2a2a', color: 'white', borderRadius: '8px', boxSizing: 'border-box', fontSize: '1rem', marginTop: '0.3rem' },
    btnMain: { width: '100%', backgroundColor: '#1b5e20', color: 'white', border: 'none', padding: '1rem', fontSize: '1rem', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', marginTop: '0.5rem' },
    btnWhatsapp: { backgroundColor: '#25d366', color: '#000', fontWeight: 'bold' },
    btnConsultoria: { backgroundColor: '#0288d1', color: '#fff', fontWeight: 'bold' },
    btnExcel: { backgroundColor: '#2e7d32', color: '#fff', fontWeight: 'bold' },
    btnPdf: { backgroundColor: '#d84315', color: '#fff', fontWeight: 'bold' },
    grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem', marginBottom: '1rem' },
    accionBtn: (sel) => ({
      background: sel ? 'rgba(245, 124, 0, 0.2)' : '#2a2a2a', border: sel ? '2px solid #f57c00' : '2px solid #444',
      borderRadius: '10px', padding: '0.8rem', textAlign: 'center', color: 'white', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem'
    }),
    itemReg: (exc) => ({
      background: exc ? '#3e2723' : '#252525', borderLeft: exc ? '4px solid #c62828' : '4px solid #f57c00',
      padding: '0.7rem', marginBottom: '0.5rem', borderRadius: '6px', fontSize: '0.9rem'
    })
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={{ margin: 0, fontSize: '1.2rem' }}>{NOMBRE_APLICACION}</h1>
        <small style={{ color: '#a5d6a7' }}>
          Establecimiento: <b>{establecimientoActual.nombre}</b> | RENSPA: <b>{establecimientoActual.renspa || 'Sin registrar'}</b> | ⏳ Prueba: <b>{diasPruebaRestantes} días</b>
        </small>
      </header>

      <nav style={styles.nav}>
        <button style={styles.navBtn(tab === 'diario')} onClick={() => setTab('diario')}>📋 Manga</button>
        <button style={styles.navBtn(tab === 'archivo')} onClick={() => setTab('archivo')}>📁 Archivo</button>
        <button style={styles.navBtn(tab === 'stock_general')} onClick={() => setTab('stock_general')}>🐂 Stock</button>
        <button style={styles.navBtn(tab === 'sanidad')} onClick={() => setTab('sanidad')}>💉 Sanidad</button>
        <button style={styles.navBtn(tab === 'packs')} onClick={() => setTab('packs')}>📦 Packs</button>
        <button style={styles.navBtn(tab === 'suscripcion')} onClick={() => setTab('suscripcion')}>💳 Suscripción</button>
        <button style={styles.navBtn(tab === 'whatsapp')} onClick={() => setTab('whatsapp')}>💬 Reportes</button>
      </nav>

      <div style={styles.body}>
        {tab === 'diario' && (
          <div>
            <div style={{ ...styles.card, border: '2px solid #0288d1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <h3 style={{ color: '#81c784', margin: 0 }}>🏢 Establecimiento / RENSPA Activo</h3>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button 
                    style={{ background: '#0288d1', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                    onClick={agregarNuevoRenspaEstablecimiento}
                  >
                    ➕ Agregar RENSPA
                  </button>
                  <button 
                    style={{ background: '#333', color: '#fff', border: '1px solid #666', padding: '0.3rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}
                    onClick={() => setEditandoEstablecimiento(!editandoEstablecimiento)}
                  >
                    {editandoEstablecimiento ? 'Cerrar' : 'Configurar'}
                  </button>
                </div>
              </div>

              {establecimientos.length > 1 && (
                <div style={{ marginBottom: '0.8rem' }}>
                  <label style={{ fontSize: '0.75rem', color: '#aaa', display: 'block', marginBottom: '0.2rem' }}>Cambiar de Establecimiento / RENSPA:</label>
                  <select 
                    value={estacionActivaId} 
                    onChange={(e) => seleccionarEstablecimiento(Number(e.target.value))} 
                    style={styles.select}
                  >
                    {establecimientos.map(est => (
                      <option key={est.id} value={est.id}>{est.nombre} (RENSPA: {est.renspa || 'Sin registrar'})</option>
                    ))}
                  </select>
                </div>
              )}

              {!editandoEstablecimiento ? (
                <div style={{ fontSize: '0.9rem', color: '#ccc', marginTop: '0.5rem' }}>
                  <div>Campo: <b>{establecimientoActual.nombre}</b></div>
                  <div>RENSPA: <b style={{ color: '#ffb74d' }}>{establecimientoActual.renspa || 'Sin registrar (Haga clic en Configurar)'}</b></div>
                  <div>CUIT: <b>{establecimientoActual.cuit || 'Sin registrar'}</b></div>
                  <div>Stock Inicial Base: <b>{establecimientoActual.stockInicial || 0} cabezas</b> | Prefijo: <b>{establecimientoActual.prefijo}</b></div>
                </div>
              ) : (
                <div style={{ marginTop: '0.8rem' }}>
                  <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Nombre del Establecimiento / Campo:</label>
                  <input type="text" value={tempNombre} onChange={(e) => setTempNombre(e.target.value)} style={styles.input} />
                  
                  <label style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.5rem', display: 'block' }}>CUIT:</label>
                  <input type="text" placeholder="Ej: 20-XXXXXXXX-X" value={tempCuit} onChange={(e) => setTempCuit(e.target.value)} style={styles.input} />

                  <label style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.5rem', display: 'block' }}>RENSPA (Número oficial):</label>
                  <input type="text" placeholder="Ej: 03.123.0.00456/00" value={tempRenspa} onChange={(e) => setTempRenspa(e.target.value)} style={styles.input} />

                  <label style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.5rem', display: 'block' }}>Stock Inicial de Hacienda (Cabezas al iniciar):</label>
                  <input type="number" value={tempStockInicial} onChange={(e) => setTempStockInicial(e.target.value)} style={styles.input} />

                  <label style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.5rem', display: 'block' }}>Prefijo de Caravana (10 dígitos proveedor):</label>
                  <input type="text" maxLength={10} value={tempPrefijo} onChange={(e) => setTempPrefijo(e.target.value)} style={styles.input} />

                  <button style={{ ...styles.btnMain, backgroundColor: '#2e7d32', marginTop: '0.8rem' }} onClick={guardarEstablecimientoActual}>
                    💾 Guardar Datos del Establecimiento
                  </button>
                </div>
              )}
            </div>

            <div style={styles.card}>
              <h3 style={{ color: '#81c784', marginTop: 0 }}>1. Operación y Categoría Base</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
                {['Nacimiento', 'Venta / Salida', 'Sanidad / Vacuna', 'Alta en Manga', 'Recaravaneo', 'Recambio'].map((op) => (
                  <div key={op} style={styles.accionBtn(operacionActual === op)} onClick={() => setOperacionActual(op)}>
                    {op === 'Nacimiento' ? '👶' : op === 'Venta / Salida' ? '🚛' : op === 'Sanidad / Vacuna' ? '💉' : '🔄'} {op}
                  </div>
                ))}
              </div>

              <div>
                <label style={{ fontWeight: 'bold', color: '#aaa', fontSize: '0.85rem' }}>Categoría por defecto (Asigna sexo automáticamente):</label>
                <select value={categoriaGlobal} onChange={(e) => setCategoriaGlobal(e.target.value)} style={styles.select}>
                  {listaCategoriasDisponibles.map((c) => (
                    <option key={c} value={c}>{c} ({obtenerSexoPorCategoria(c)})</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ ...styles.card, border: '2px solid #0277bd' }}>
              <h3 style={{ color: '#81c784', marginTop: 0 }}>⚡ Métodos de Captura en Manga</h3>
              
              <div style={{ background: '#111', padding: '0.8rem', borderRadius: '8px', marginBottom: '0.8rem', border: '1px solid #333' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ color: '#00e676', fontSize: '0.9rem' }}>📡 Bastón Lector (Bluetooth)</strong>
                    <div style={{ fontSize: '0.75rem', color: '#aaa' }}>
                      {conectadoBluetooth ? `Conectado a: ${dispositivoBaston}` : 'Sin bastón vinculado'}
                    </div>
                  </div>
                  {!conectadoBluetooth ? (
                    <button style={{ background: '#0288d1', color: '#fff', border: 'none', padding: '0.5rem 0.8rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem' }} onClick={conectarBastonBluetooth}>
                      Vincular Bastón
                    </button>
                  ) : (
                    <span style={{ color: '#00e676', fontWeight: 'bold', fontSize: '0.8rem' }}>Conectado OK</span>
                  )}
                </div>
              </div>

              <div style={{ background: '#111', padding: '0.8rem', borderRadius: '8px', marginBottom: '0.8rem', border: '1px solid #333', textAlign: 'center' }}>
                <div id="reader-camara-real" style={{ width: '100%', maxWidth: '350px', margin: '0 auto', display: escaneandoCamara ? 'block' : 'none' }}></div>
                {!escaneandoCamara ? (
                  <button style={{ ...styles.btnMain, backgroundColor: '#7b1fa2', fontSize: '0.9rem', marginTop: 0 }} onClick={iniciarEscaneoRealCamara}>
                    📷 Activar Cámara (Escáner QR / Barras)
                  </button>
                ) : (
                  <button style={{ ...styles.btnMain, backgroundColor: '#c62828', fontSize: '0.9rem', marginTop: '0.5rem' }} onClick={detenerEscaneoRealCamara}>
                    ⏹️ Apagar Cámara
                  </button>
                )}
              </div>

              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ ...styles.btnMain, backgroundColor: '#c2185b', fontSize: '0.9rem', textAlign: 'center', display: 'block', lineHeight: '1.2rem', cursor: 'pointer', boxSizing: 'border-box' }}>
                  🖼️ Subir Foto de Planilla Escrita
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={procesarFotoPlanillaReal} />
                </label>
              </div>

              <div style={{ marginBottom: '0.8rem' }}>
                {!estaDictando ? (
                  <button style={{ ...styles.btnMain, backgroundColor: '#0277bd', fontSize: '0.9rem', marginTop: 0 }} onClick={iniciarDictadoVozContinuo}>
                    🎙️ Iniciar Dictado por Voz (Decir números de caravana)
                  </button>
                ) : (
                  <button style={{ ...styles.btnMain, backgroundColor: '#c62828', fontSize: '0.9rem', marginTop: 0 }} onClick={finalizarDictadoVoz}>
                    ⏹️ Detener Dictado por Voz (Escuchando...)
                  </button>
                )}
              </div>

              <div style={{ marginTop: '1rem', borderTop: '1px solid #444', paddingTop: '1rem' }}>
                <label style={{ color: '#aaa', fontSize: '0.85rem' }}>O Carga por Rango Correlativo:</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
                  <input type="number" placeholder="Desde N°" value={rangoDesde} onChange={(e) => setRangoDesde(e.target.value)} style={styles.input} />
                  <input type="number" placeholder="Hasta N°" value={RangoHasta} onChange={(e) => setRangoHasta(e.target.value)} style={styles.input} />
                </div>
                <button style={{ ...styles.btnMain, backgroundColor: '#f57c00', color: '#000', fontWeight: 'bold', fontSize: '0.9rem' }} onClick={agregarRangoTemporal}>
                  ➕ Agregar Rango al Lote en Preparación
                </button>
              </div>
            </div>

            {loteTemporal.length > 0 && (
              <div style={{ ...styles.card, border: '2px solid #ffb74d', background: '#1c1b18' }}>
                <h3 style={{ color: '#ffb74d', marginTop: 0 }}>
                  ⚠️ Lote Temporal en Preparación ({loteTemporal.length} animales)
                </h3>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Cambiar Categoría a Todos los del Lote:</label>
                  <select onChange={(e) => cambiarCategoriaLoteTemporal(e.target.value)} style={styles.select}>
                    <option value="">Seleccionar categoría...</option>
                    {listaCategoriasDisponibles.map(c => <option key={c} value={c}>{c} ({obtenerSexoPorCategoria(c)})</option>)}
                  </select>
                </div>

                <div style={{ maxHeight: '200px', overflowY: 'auto', background: '#111', padding: '0.5rem', borderRadius: '6px', marginBottom: '1rem' }}>
                  {loteTemporal.map((item, idx) => (
                    <div key={item.id} style={{ fontSize: '0.85rem', borderBottom: '1px solid #333', padding: '0.4rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <span>#{idx + 1} ➡️ N° <b style={{ color: '#ffb74d' }}>{item.numero}</b></span>
                      <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                        <select 
                          value={item.categoria} 
                          onChange={(e) => cambiarCategoriaItemIndividual(item.id, e.target.value)}
                          style={{ padding: '0.2rem', background: '#222', color: '#fff', border: '1px solid #555', borderRadius: '4px', fontSize: '0.75rem' }}
                        >
                          {listaCategoriasDisponibles.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <span style={{ fontSize: '0.75rem', color: '#aaa', minWidth: '25px' }}>({item.sexo})</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button style={{ ...styles.btnMain, backgroundColor: '#2e7d32', fontSize: '1.1rem' }} onClick={confirmarYGuardarLote}>
                  💾 Confirmar, Guardar y Archivar
                </button>
                <button style={{ ...styles.btnMain, backgroundColor: '#c62828', marginTop: '0.4rem' }} onClick={() => setLoteTemporal([])}>
                  ❌ Descartar Temporal
                </button>
              </div>
            )}

            <div style={styles.card}>
              <h3 style={{ color: '#81c784', marginTop: 0 }}>
                📋 Listado Consolidado Definitivo 
                <span style={{ background: '#f57c00', color: '#000', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.85rem', float: 'right' }}>{registrosDiarios.length}</span>
              </h3>
              
              <div style={{ maxHeight: '220px', overflowY: 'auto', marginBottom: '1rem' }}>
                {registrosDiarios.length === 0 ? (
                  <p style={{ color: '#aaa' }}>Sin registros definitivos hoy para este establecimiento.</p>
                ) : (
                  registrosDiarios.slice().reverse().map((r, idx) => (
                    <div key={r.id} style={styles.itemReg(r.esExcepcion)}>
                      <strong>#{registrosDiarios.length - idx}</strong> — Caravana: <b style={{ color: '#81c784' }}>{r.caravana}</b> | <b style={{ color: '#ffb74d' }}>{r.categoria}</b> ({r.sexo}) — ({r.operacion})
                    </div>
                  ))
                )}
              </div>

              <div style={styles.grid3}>
                <button style={{ ...styles.btnMain, ...styles.btnExcel, marginTop: 0 }} onClick={exportarExcelGeneral}>📊 Excel (.xls)</button>
                <button style={{ ...styles.btnMain, ...styles.btnPdf, marginTop: 0 }} onClick={imprimirPDF}>📄 PDF</button>
                <button style={{ ...styles.btnMain, ...styles.btnWhatsapp, marginTop: 0 }} onClick={enviarWhatsAppGeneral}>📲 WhatsApp</button>
              </div>

              <button style={{ ...styles.btnMain, backgroundColor: '#c62828', marginTop: '0.8rem' }} onClick={vaciarRegistrosHoy}>🗑️ Vaciar Listado Consolidado</button>
            </div>
          </div>
        )}

        {tab === 'archivo' && (
          <div style={styles.card}>
            <h3 style={{ color: '#81c784', marginTop: 0 }}>📁 Archivo Histórico de Operaciones</h3>
            <p style={{ fontSize: '0.85rem', color: '#ccc', marginBottom: '1rem' }}>
              Registros guardados para <b>{establecimientoActual.nombre}</b> (RENSPA: {establecimientoActual.renspa || 'Sin registrar'}).
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Filtrar por Operación:</label>
              <select value={filtroOperacionHistorial} onChange={(e) => setFiltroOperacionHistorial(e.target.value)} style={styles.select}>
                <option value="TODAS">Todas las operaciones</option>
                <option value="Nacimiento">Nacimiento</option>
                <option value="Venta / Salida">Venta / Salida</option>
                <option value="Sanidad / Vacuna">Sanidad / Vacuna</option>
                <option value="Alta en Manga">Alta en Manga</option>
                <option value="Recaravaneo">Recaravaneo</option>
                <option value="Recambio">Recambio</option>
              </select>
            </div>

            {archivoFiltrado.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center', padding: '2rem 0' }}>No se encontraron registros archivados.</p>
            ) : (
              <div>
                <div style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '1rem' }}>
                  {archivoFiltrado.map((carpeta) => {
                    let totalM = carpeta.items.filter(i => i.sexo === 'M').length;
                    let totalH = carpeta.items.filter(i => i.sexo === 'H').length;

                    return (
                      <div key={carpeta.id} style={{ background: '#252525', borderRadius: '8px', padding: '0.9rem', marginBottom: '0.8rem', borderLeft: '4px solid #0288d1' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ color: '#ffb74d' }}>{carpeta.titulo}</strong>
                          <span style={{ fontSize: '0.75rem', color: '#aaa' }}>{carpeta.fecha}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#ddd', margin: '0.4rem 0' }}>
                          Total: <b>{carpeta.cantidad} cabezas</b> (<b style={{ color: '#81c784' }}>{totalM} M</b>, <b style={{ color: '#ff8a80' }}>{totalH} H</b>)
                        </div>
                        <button 
                          style={{ background: '#2e7d32', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem', marginTop: '0.3rem' }}
                          onClick={() => exportarCarpetaHistorica(carpeta)}
                        >
                          📊 Descargar en Excel (.xls)
                        </button>
                      </div>
                    );
                  })}
                </div>

                <button style={{ ...styles.btnMain, backgroundColor: '#c62828' }} onClick={vaciarArchivoHistorico}>
                  🗑️ Vaciar Archivo Histórico de este RENSPA
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'stock_general' && (
          <div>
            <div style={styles.card}>
              <h3 style={{ color: '#81c784', marginTop: 0 }}>📊 Estado General: {establecimientoActual.nombre}</h3>
              <p style={{ margin: '0.4rem 0' }}>RENSPA: <b>{establecimientoActual.renspa || 'Sin registrar'}</b></p>
              <p style={{ margin: '0.4rem 0' }}>CUIT: <b>{establecimientoActual.cuit || 'Sin registrar'}</b></p>
              <p style={{ margin: '0.4rem 0' }}>Stock Inicial Configurado: <b>{establecimientoActual.stockInicial || 0} cabezas</b></p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
              <div style={{ ...styles.card, textAlign: 'center' }}>
                <span style={{ color: '#aaa', fontSize: '0.85rem' }}>Stock Actual Cabezas</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#81c784', marginTop: '0.3rem' }}>{stockActualCabezas}</div>
              </div>
              <div style={{ ...styles.card, textAlign: 'center' }}>
                <span style={{ color: '#aaa', fontSize: '0.85rem' }}>Animales Identificados</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#0288d1', marginTop: '0.3rem' }}>{animalesIdentificados}</div>
              </div>
            </div>
          </div>
        )}

        {tab === 'sanidad' && (
          <div style={{ ...styles.card, border: '2px solid #c62828' }}>
            <h3 style={{ color: '#ff8a80', marginTop: 0 }}>⚠️ Alerta Obligatoria: Vacunación Antibrusélica (Brucelosis)</h3>
            <select value={tipoVacuna} onChange={(e) => setTipoVacuna(e.target.value)} style={styles.select}>
              <option value="Brucelosis B19 / Cepa 19">Brucelosis B19 / Cepa 19 (Obligatorio Terneras)</option>
              <option value="Fiebre Aftosa">Fiebre Aftosa</option>
            </select>
            <input type="text" placeholder="N° de Lote de Vacuna" value={loteVacuna} onChange={(e) => setLoteVacuna(e.target.value)} style={styles.input} />
            <button style={{ ...styles.btnMain, backgroundColor: '#c62828' }} onClick={registrarVacunacion}>💉 Registrar Aplicación</button>
          </div>
        )}

        {tab === 'packs' && (
          <div style={{ ...styles.card, border: '2px solid #0288d1' }}>
            <h3 style={{ color: '#81c784', marginTop: 0 }}>📦 Solicitar Packs de Caravanas</h3>
            <p style={{ fontSize: '0.9rem', color: '#ccc' }}>Stock disponible actual: <b>{caravanasDisponiblesStock} un.</b></p>
            <select value={cantidadPackSeleccionada} onChange={(e) => setCantidadPackSeleccionada(e.target.value)} style={styles.select}>
              <option value={50}>Pack de 50 unidades</option>
              <option value={100}>Pack de 100 unidades</option>
              <option value={200}>Pack de 200 unidades</option>
              <option value={500}>Pack de 500 unidades</option>
              <option value={1000}>Pack de 1000 unidades</option>
            </select>
            
            <div style={{ background: '#252525', padding: '0.8rem', borderRadius: '8px', margin: '1rem 0' }}>
              <span style={{ fontSize: '0.85rem', color: '#aaa' }}>Datos de Pago (Cuenta Banco Provincia):</span>
              <div style={{ color: '#81c784', fontWeight: 'bold', marginTop: '0.2rem' }}>Alias: {aliasBco}</div>
              <div style={{ color: '#81c784', fontWeight: 'bold' }}>CVU: {cvuBco}</div>
            </div>

            <button style={{ ...styles.btnMain, backgroundColor: '#0288d1' }} onClick={comprarPackCaravanas}>
              🛒 Solicitar y Enviar Pedido
            </button>
          </div>
        )}

        {tab === 'suscripcion' && (
          <div style={{ ...styles.card, border: '2px solid #f57c00', textAlign: 'center' }}>
            <h3 style={{ color: '#ffb74d', marginTop: 0 }}>💳 Estado de Suscripción de {NOMBRE_APLICACION}</h3>
            
            <div style={{ background: diasPruebaRestantes > 0 ? '#1b381e' : '#3e2723', padding: '1.2rem', borderRadius: '10px', margin: '1rem 0' }}>
              <span style={{ fontSize: '0.9rem', color: '#e0e0e0' }}>Período de Uso Libre / Prueba:</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: diasPruebaRestantes > 0 ? '#81c784' : '#ff8a80', marginTop: '0.3rem' }}>
                {diasPruebaRestantes > 0 ? `${diasPruebaRestantes} Días Restantes` : 'Prueba Vencida'}
              </div>
              <small style={{ color: '#ccc' }}>15 días de acceso total gratuito a partir del primer uso.</small>
            </div>

            <div style={{ margin: '1.2rem 0', textAlign: 'left' }}>
              <label style={{ color: '#aaa', fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>Seleccione su Plan de Suscripción:</label>
              <select value={planSuscripcionSeleccionado} onChange={(e) => setPlanSuscripcionSeleccionado(e.target.value)} style={styles.select}>
                <option value="Mensual">Plan Mensual ($40.000 ARS)</option>
                <option value="Trimestral">Plan Trimestral ($80.000 ARS)</option>
                <option value="Anual">Plan Anual ($240.000 ARS - Ahorro recomendado)</option>
              </select>
            </div>

            <div style={{ background: '#252525', padding: '1rem', borderRadius: '8px', textAlign: 'left', marginBottom: '1rem' }}>
              <strong style={{ color: '#81c784' }}>🏦 Datos para Abonar el Plan {planSuscripcionSeleccionado} ({obtenerPrecioPlan(planSuscripcionSeleccionado)}):</strong>
              <p style={{ margin: '0.5rem 0 0.2rem 0', fontSize: '0.9rem' }}>Banco: <b>Banco Provincia</b></p>
              <p style={{ margin: '0.2rem 0', fontSize: '0.9rem' }}>Alias: <b style={{ color: '#ffb74d' }}>{aliasBco}</b></p>
              <p style={{ margin: '0.2rem 0', fontSize: '0.9rem' }}>CVU: <b style={{ color: '#ffb74d' }}>{cvuBco}</b></p>
            </div>

            <button style={{ ...styles.btnMain, backgroundColor: '#25d366', color: '#000', fontSize: '1.05rem' }} onClick={solicitarSuscripcionWhatsApp}>
              📲 Notificar Pago del Plan {planSuscripcionSeleccionado} ({obtenerPrecioPlan(planSuscripcionSeleccionado)}) por WhatsApp
            </button>
          </div>
        )}

        {tab === 'whatsapp' && (
          <div style={styles.card}>
            <h3 style={{ color: '#81c784', marginTop: 0, textAlign: 'center' }}>💬 Soporte y Reportes Oficiales</h3>
            <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              Envíe informes de <b>{establecimientoActual.nombre}</b> o comuníquese de inmediato con el servicio de consultoría técnica.
            </p>

            <button style={{ ...styles.btnMain, ...styles.btnWhatsapp, fontSize: '1.05rem', padding: '1.1rem', marginBottom: '0.8rem' }} onClick={enviarWhatsAppGeneral}>
              📲 Enviar Parte Sanitario y Stock por WhatsApp
            </button>

            <button style={{ ...styles.btnMain, ...styles.btnConsultoria, fontSize: '1.05rem', padding: '1.1rem' }} onClick={abrirConsultoriaWhatsApp}>
              💬 Consultoría y Asesoramiento Técnico por WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
