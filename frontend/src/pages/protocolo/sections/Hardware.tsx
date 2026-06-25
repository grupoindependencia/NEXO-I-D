import { useEffect, useRef, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, Callout } from '@/components/ui/Card';
import './Hardware.css';

declare global {
  interface Window {
    THREE: any;
    STL_CASE_B64?: string;
    STL_TAPA_B64?: string;
    STL_ENSAMBLE_B64?: string;
  }
}

type ModelKey = 'ensamble' | 'case' | 'tapa';

const SCRIPT_URLS = [
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/STLLoader.js',
  '/cad/stl_data.js',
];

// Promise global que se resuelve una sola vez cuando los scripts están listos
let scriptsLoadedPromise: Promise<void> | null = null;
function loadAllScripts(): Promise<void> {
  if (scriptsLoadedPromise) return scriptsLoadedPromise;
  scriptsLoadedPromise = (async () => {
    for (const url of SCRIPT_URLS) {
      await new Promise<void>((res, rej) => {
        // ¿Ya está cargado?
        if (url.endsWith('three.min.js') && window.THREE) return res();
        if (url.endsWith('OrbitControls.js') && window.THREE?.OrbitControls) return res();
        if (url.endsWith('STLLoader.js') && window.THREE?.STLLoader) return res();
        if (url === '/cad/stl_data.js' && window.STL_CASE_B64) return res();

        // Buscar script existente
        const existing = document.querySelector(`script[src="${url}"]`) as HTMLScriptElement | null;
        if (existing) {
          if (existing.dataset.loaded === 'true') return res();
          existing.addEventListener('load', () => res());
          existing.addEventListener('error', () => rej(new Error(`No se pudo cargar: ${url}`)));
          return;
        }
        const s = document.createElement('script');
        s.src = url;
        s.async = false; // mantener orden
        s.onload = () => { s.dataset.loaded = 'true'; res(); };
        s.onerror = () => rej(new Error(`No se pudo cargar: ${url}`));
        document.head.appendChild(s);
      });
    }
  })();
  return scriptsLoadedPromise;
}

export function HardwareSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>({ initialized: false });
  const [model, setModel] = useState<ModelKey>('ensamble');
  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [info, setInfo] = useState('Inicializando…');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const autoRotateRef = useRef(autoRotate);
  const wireframeRef = useRef(wireframe);
  useEffect(() => { autoRotateRef.current = autoRotate; }, [autoRotate]);
  useEffect(() => {
    wireframeRef.current = wireframe;
    if (sceneRef.current.mesh) sceneRef.current.mesh.material.wireframe = wireframe;
  }, [wireframe]);

  // Init principal
  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      try {
        setInfo('Cargando librerías 3D…');
        await loadAllScripts();
        if (cancelled) return;

        // Esperar a que el canvas tenga dimensiones reales
        let attempts = 0;
        while (
          (!containerRef.current ||
            !canvasRef.current ||
            containerRef.current.clientWidth === 0 ||
            containerRef.current.clientHeight === 0) &&
          attempts < 30
        ) {
          await new Promise((r) => setTimeout(r, 100));
          attempts++;
          if (cancelled) return;
        }
        if (!containerRef.current || !canvasRef.current) {
          setError('No se pudo inicializar el visor (canvas no disponible)');
          setCargando(false);
          return;
        }

        if (sceneRef.current.initialized) {
          // Ya inicializado (Strict Mode segundo mount). Solo recargar modelo si hace falta.
          if (!sceneRef.current.mesh) loadModelInternal(model);
          return;
        }

        initScene();
        loadModelInternal(model);
      } catch (err: any) {
        console.error('[Hardware]', err);
        setError(err?.message || 'Error desconocido al cargar el visor');
        setCargando(false);
      }
    };

    initialize();

    return () => {
      cancelled = true;
      cancelAnimationFrame(sceneRef.current.raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initScene = () => {
    const THREE = window.THREE;
    if (!THREE) { setError('THREE.js no se cargó'); return; }
    const canvas = canvasRef.current!;
    const container = containerRef.current!;
    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF4F6F4);
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 5000);
    camera.position.set(100, 80, 120);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h, false);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const k = new THREE.DirectionalLight(0xffffff, 0.85); k.position.set(60, 100, 80); scene.add(k);
    const f = new THREE.DirectionalLight(0xb0d4c0, 0.35); f.position.set(-60, 40, -50); scene.add(f);
    const r = new THREE.DirectionalLight(0xffffff, 0.25); r.position.set(0, -60, 30); scene.add(r);

    const controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;

    sceneRef.current = { THREE, scene, camera, renderer, controls, mesh: null, initialized: true };

    const resize = () => {
      if (!containerRef.current) return;
      const nw = containerRef.current.clientWidth;
      const nh = containerRef.current.clientHeight;
      if (!nw || !nh) return;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh, false);
    };
    new ResizeObserver(resize).observe(container);
    window.addEventListener('resize', resize);

    const animate = () => {
      sceneRef.current.raf = requestAnimationFrame(animate);
      if (autoRotateRef.current && sceneRef.current.mesh) {
        sceneRef.current.mesh.rotation.y += 0.006;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  };

  const loadModelInternal = (which: ModelKey) => {
    const ctx = sceneRef.current;
    if (!ctx.THREE) return;
    const THREE = ctx.THREE;
    setCargando(true);
    setInfo('Cargando modelo…');
    setError(null);

    if (ctx.mesh) {
      ctx.scene.remove(ctx.mesh);
      ctx.mesh.geometry.dispose();
      ctx.mesh.material.dispose();
      ctx.mesh = null;
    }

    const b64 = which === 'case' ? window.STL_CASE_B64
              : which === 'tapa' ? window.STL_TAPA_B64
              : window.STL_ENSAMBLE_B64;
    if (!b64) {
      setError(`Datos STL no encontrados (window.STL_${which.toUpperCase()}_B64). Verifica /cad/stl_data.js`);
      setCargando(false);
      return;
    }

    try {
      const binary = atob(b64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const loader = new THREE.STLLoader();
      const geometry = loader.parse(bytes.buffer);
      geometry.computeVertexNormals();
      geometry.rotateX(Math.PI / 2);
      geometry.center();

      const color = which === 'tapa' ? 0x95C11F : which === 'case' ? 0x00684A : 0xB8C4BD;
      const material = new THREE.MeshStandardMaterial({
        color,
        metalness: which === 'ensamble' ? 0.25 : 0.15,
        roughness: which === 'ensamble' ? 0.45 : 0.55,
        wireframe: wireframeRef.current,
      });
      const mesh = new THREE.Mesh(geometry, material);
      ctx.scene.add(mesh);
      ctx.mesh = mesh;

      const box = new THREE.Box3().setFromObject(mesh);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = ctx.camera.fov * (Math.PI / 180);
      const distance = Math.abs(maxDim / (2 * Math.tan(fov / 2))) * 1.5;
      ctx.camera.position.set(distance * 0.55, distance * 0.45, distance * 0.75);
      ctx.camera.near = distance / 100;
      ctx.camera.far = distance * 100;
      ctx.camera.updateProjectionMatrix();
      ctx.controls.target.set(0, 0, 0);
      ctx.controls.update();

      const verts = geometry.attributes.position.count;
      const label = which === 'ensamble' ? 'Ensamblaje completo' : which === 'tapa' ? 'Tapa' : 'Case';
      setInfo(`${label} · ${verts.toLocaleString()} vértices · ${Math.round(verts / 3).toLocaleString()} triángulos`);
      setCargando(false);
    } catch (err: any) {
      console.error('[Hardware] parseo STL falló:', err);
      setError(`Error al parsear STL: ${err?.message || 'desconocido'}`);
      setCargando(false);
    }
  };

  // Cambio de modelo
  useEffect(() => {
    if (sceneRef.current.initialized) loadModelInternal(model);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  return (
    <>
      <PageHeader
        titulo="Diseño físico del dispositivo"
        subtitulo="Modelos 3D del case y la tapa del nodo NetSensor. Rotar con clic izquierdo, mover con clic derecho, acercar con la rueda."
        tag="Hardware"
      />

      <div className="stl-viewer" ref={containerRef}>
        <canvas className="stl-canvas" ref={canvasRef} />
        <div className="stl-toolbar">
          <div className="stl-group">
            <button className={`stl-btn ${model === 'ensamble' ? 'active' : ''}`} onClick={() => setModel('ensamble')}>Ensamblaje</button>
            <button className={`stl-btn ${model === 'case' ? 'active' : ''}`} onClick={() => setModel('case')}>Case</button>
            <button className={`stl-btn ${model === 'tapa' ? 'active' : ''}`} onClick={() => setModel('tapa')}>Tapa</button>
          </div>
          <div className="stl-group">
            <button className={`stl-btn ${wireframe ? 'active' : ''}`} onClick={() => setWireframe((v) => !v)}>Wireframe</button>
            <button className={`stl-btn ${autoRotate ? 'active' : ''}`} onClick={() => setAutoRotate((v) => !v)}>Rotar</button>
          </div>
        </div>
        <div className="stl-info" style={error ? { color: 'var(--crit)' } : undefined}>
          {error || info}
        </div>
        {cargando && !error && <div className="stl-loading"><div className="stl-spinner" />Cargando…</div>}
      </div>

      <div className="grid-2" style={{ marginTop: 20 }}>
        <Card titulo="Ensamblaje completo">
          <p>Vista por defecto del visor. Incluye case, tapa, LEDs verde/amarillo/rojo, botón BOOT y conector micro-USB integrados.</p>
          <ul>
            <li><strong>Archivo fuente:</strong> <code>Ensamblajered2.SLDASM</code></li>
            <li><strong>Export:</strong> <code>Ensamblajered2.STL</code></li>
          </ul>
        </Card>
        <Card titulo="Fijación y herrajes">
          <p>El case y la tapa se unen mediante 4 tornillos M3 × 8 mm. Las inserciones roscadas se calientan e introducen al case previo al ensamblaje.</p>
          <ul>
            <li><strong>Tornillos:</strong> M3 × 8 mm (×4)</li>
            <li><strong>Inserciones:</strong> M3 × 4 mm de bronce</li>
            <li><strong>Cable gland:</strong> PG7 para fuente USB</li>
          </ul>
        </Card>
      </div>

      <Callout tipo="info" titulo="Archivos fuente">
        Los modelos originales en SolidWorks (<code>.SLDPRT</code>) y exportados (<code>.STL</code>) están en
        <code> D:\DOCUMENTOS\INDEPENDENCIA\PROYECTOS\CONECTIVIDAD\CAD\</code>. Cualquier modificación del diseño físico
        debe ser aprobada por Rodrigo Solís antes de impresión masiva.
      </Callout>
    </>
  );
}
