import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function createDotSprite() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(238,246,255,1)');
  grd.addColorStop(0.3, 'rgba(168,210,255,1)');
  grd.addColorStop(0.65, 'rgba(80,150,255,0.6)');
  grd.addColorStop(1, 'rgba(80,150,255,0)');
  g.fillStyle = grd;
  g.beginPath();
  g.arc(32, 32, 32, 0, Math.PI * 2);
  g.fill();
  return new THREE.CanvasTexture(c);
}

function createPlaneSprite() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  g.translate(64, 64);
  g.fillStyle = '#ffffff';

  g.beginPath();
  g.moveTo(0, -46);
  g.quadraticCurveTo(7, -30, 7, -6);
  g.lineTo(7, 30);
  g.quadraticCurveTo(6, 42, 0, 46);
  g.quadraticCurveTo(-6, 42, -7, 30);
  g.lineTo(-7, -6);
  g.quadraticCurveTo(-7, -30, 0, -46);
  g.closePath();
  g.fill();

  g.beginPath(); g.moveTo(6, -4); g.lineTo(52, 24); g.lineTo(52, 33); g.lineTo(6, 16); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(-6, -4); g.lineTo(-52, 24); g.lineTo(-52, 33); g.lineTo(-6, 16); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(5, 30); g.lineTo(23, 44); g.lineTo(23, 50); g.lineTo(5, 40); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(-5, 30); g.lineTo(-23, 44); g.lineTo(-23, 50); g.lineTo(-5, 40); g.closePath(); g.fill();

  return new THREE.CanvasTexture(c);
}

function ll2v(lat, lon) {
  const phi = (lat * Math.PI) / 180;
  const th = (lon * Math.PI) / 180;
  return new THREE.Vector3(
    Math.cos(phi) * Math.cos(th),
    Math.sin(phi),
    Math.cos(phi) * Math.sin(th)
  );
}

const CONTINENTS = [
  "M70,96 L120,78 L168,76 L196,86 L228,80 L252,96 L236,108 L256,116 L236,134 L214,128 L222,150 L202,166 L210,182 L192,196 L182,224 L168,236 L158,212 L160,182 L150,160 L156,142 L138,138 L120,132 L110,112 L92,108 Z",
  "M252,82 L300,58 L322,66 L330,86 L312,104 L288,108 L266,98 Z",
  "M236,232 L268,224 L300,232 L322,252 L318,286 L300,316 L282,338 L268,328 L262,300 L250,276 L244,252 Z",
  "M360,96 L398,86 L430,92 L426,116 L404,122 L388,140 L372,134 L364,116 Z",
  "M362,150 L398,142 L438,148 L470,162 L466,196 L450,232 L438,268 L416,292 L398,280 L388,250 L376,216 L366,184 Z",
  "M432,84 L496,66 L566,72 L626,86 L650,108 L632,134 L596,148 L556,150 L520,142 L486,150 L458,140 L440,116 Z",
  "M506,184 L538,178 L552,200 L544,228 L524,232 L512,210 Z",
  "M600,212 L640,206 L682,216 L676,238 L646,246 L616,238 Z",
  "M624,256 L676,248 L704,264 L696,288 L662,300 L632,288 L622,270 Z",
];

function makeLandTest(data, w, h) {
  const d = data.data;
  return (lon, lat) => {
    let u = (lon + 180) / 360;
    u = ((u % 1) + 1) % 1;
    const px = Math.min(w - 1, Math.max(0, Math.floor(u * w)));
    const py = Math.min(h - 1, Math.max(0, Math.floor(((90 - lat) / 180) * h)));
    const i = (py * w + px) * 4;
    return d[i] > 128;
  };
}

function makeLandTestExt(data, w, h) {
  const d = data.data;
  return (lon, lat) => {
    let u = (lon + 180) / 360;
    u = ((u % 1) + 1) % 1;
    const px = Math.min(w - 1, Math.max(0, Math.floor(u * w)));
    const py = Math.min(h - 1, Math.max(0, Math.floor(((90 - lat) / 180) * h)));
    const i = (py * w + px) * 4;
    const r = d[i], gg = d[i + 1], b = d[i + 2], a = d[i + 3];
    const lum = 0.299 * r + 0.587 * gg + 0.114 * b;
    return a > 40 && lum < 205;
  };
}

function buildDotPositions(isLand) {
  const pos = [];
  const R = 1.002;
  for (let lat = -84; lat <= 84; lat += 2.6) {
    const phi = (lat * Math.PI) / 180;
    const circ = Math.max(0.12, Math.cos(phi));
    const lonStep = 2.6 / circ;
    for (let lon = -180; lon < 180; lon += lonStep) {
      if (isLand(lon, lat)) {
        const th = (lon * Math.PI) / 180;
        pos.push(
          R * Math.cos(phi) * Math.cos(th),
          R * Math.sin(phi),
          R * Math.cos(phi) * Math.sin(th)
        );
      }
    }
  }
  return pos;
}

function rasterizeGeo(features, W, H) {
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#000';
  g.fillRect(0, 0, W, H);
  g.fillStyle = '#fff';
  const X = (lon) => ((lon + 180) / 360) * W;
  const Y = (lat) => ((90 - lat) / 180) * H;
  const drawPoly = (rings) => {
    const p = new Path2D();
    for (const ring of rings) {
      ring.forEach((pt, i) => {
        const x = X(pt[0]), y = Y(pt[1]);
        i ? p.lineTo(x, y) : p.moveTo(x, y);
      });
      p.closePath();
    }
    g.fill(p, 'evenodd');
  };
  for (const f of features) {
    const gm = f.geometry;
    if (!gm) continue;
    if (gm.type === 'Polygon') drawPoly(gm.coordinates);
    else if (gm.type === 'MultiPolygon')
      for (const poly of gm.coordinates) drawPoly(poly);
  }
  return g.getImageData(0, 0, W, H);
}

export default function NetworkGlobe() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const stopRef = useRef(false);

  useEffect(() => {
    stopRef.current = false;
    let animId;

    const initGlobe = () => {
      const canvas = canvasRef.current;
      const host = containerRef.current;
      if (!canvas || !host) return;

      const W = host.clientWidth;
      const H = host.clientHeight;
      if (W < 2 || H < 2) return;

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
      renderer.setSize(W, H, false);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, W / H, 0.1, 100);
      camera.position.set(0, 0, 4.7);

      const group = new THREE.Group();
      group.rotation.x = -0.2;
      scene.add(group);

      // Dark sphere
      group.add(
        new THREE.Mesh(
          new THREE.SphereGeometry(0.99, 96, 64),
          new THREE.MeshBasicMaterial({ color: 0x0a1430 })
        )
      );

      // Grid lines
      const gmat = new THREE.LineBasicMaterial({
        color: 0x3f73d6,
        transparent: true,
        opacity: 0.14,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const grR = 0.992;
      for (let lon = -180; lon < 180; lon += 30) {
        const pts = [];
        for (let lat = -90; lat <= 90; lat += 4) {
          const phi = (lat * Math.PI) / 180;
          const th = (lon * Math.PI) / 180;
          pts.push(
            new THREE.Vector3(
              grR * Math.cos(phi) * Math.cos(th),
              grR * Math.sin(phi),
              grR * Math.cos(phi) * Math.sin(th)
            )
          );
        }
        group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gmat));
      }
      for (let lat = -60; lat <= 60; lat += 30) {
        const pts = [];
        for (let lon = -180; lon <= 180; lon += 4) {
          const phi = (lat * Math.PI) / 180;
          const th = (lon * Math.PI) / 180;
          pts.push(
            new THREE.Vector3(
              grR * Math.cos(phi) * Math.cos(th),
              grR * Math.sin(phi),
              grR * Math.cos(phi) * Math.sin(th)
            )
          );
        }
        group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gmat));
      }

      // Load continents
      const addDots = (pos) => {
        if (!pos.length) return;
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));
        const points = new THREE.Points(
          geo,
          new THREE.PointsMaterial({
            size: 0.027,
            map: createDotSprite(),
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            depthTest: true,
            color: 0xaccbff,
            sizeAttenuation: true,
          })
        );
        points.rotation.y = -Math.PI / 2;
        group.add(points);
      };

      const fallback = () => {
        const c = document.createElement('canvas');
        c.width = 720;
        c.height = 360;
        const g = c.getContext('2d');
        g.fillStyle = '#000';
        g.fillRect(0, 0, 720, 360);
        g.fillStyle = '#fff';
        for (const dpath of CONTINENTS) g.fill(new Path2D(dpath));
        addDots(buildDotPositions(makeLandTest(g.getImageData(0, 0, 720, 360), 720, 360)));
      };

      fetch(
        'https://cdn.jsdelivr.net/gh/martynafford/natural-earth-geojson@master/110m/physical/ne_110m_land.json'
      )
        .then((r) => r.json())
        .then((j) => {
          const data = rasterizeGeo(j.features, 1440, 720);
          addDots(buildDotPositions(makeLandTestExt(data, 1440, 720)));
        })
        .catch(fallback);

      // Flight routes
      const flightsGroup = new THREE.Group();
      flightsGroup.rotation.y = -Math.PI / 2;
      group.add(flightsGroup);

      const planeTex = createPlaneSprite();

      const xRoutes = (lat, lon) => [
        [[lat, lon], [lat + 48, lon - 62]],
        [[lat, lon], [lat + 48, lon + 62]],
        [[lat, lon], [lat - 48, lon - 62]],
        [[lat, lon], [lat - 48, lon + 62]],
      ];
      const routes = [...xRoutes(10, 20), ...xRoutes(10, -160)];

      const flights = routes.map((rt, i) => {
        const a = ll2v(rt[0][0], rt[0][1]);
        const b = ll2v(rt[1][0], rt[1][1]);
        const omega = Math.acos(Math.max(-1, Math.min(1, a.dot(b))));
        const sinO = Math.sin(omega) || 1e-4;
        const at = (t) => {
          const s0 = Math.sin((1 - t) * omega) / sinO;
          const s1 = Math.sin(t * omega) / sinO;
          const v = new THREE.Vector3(
            a.x * s0 + b.x * s1,
            a.y * s0 + b.y * s1,
            a.z * s0 + b.z * s1
          ).normalize();
          return v.multiplyScalar(1.02 + 0.22 * Math.sin(Math.PI * t));
        };

        const linePts = [];
        for (let k = 0; k <= 70; k++) {
          const t = k / 70;
          const s0 = Math.sin((1 - t) * omega) / sinO;
          const s1 = Math.sin(t * omega) / sinO;
          const v = new THREE.Vector3(
            a.x * s0 + b.x * s1,
            a.y * s0 + b.y * s1,
            a.z * s0 + b.z * s1
          ).normalize();
          linePts.push(v.multiplyScalar(1.016 + 0.21 * Math.sin(Math.PI * t)));
        }
        const lgeo = new THREE.BufferGeometry().setFromPoints(linePts);
        const line = new THREE.Line(
          lgeo,
          new THREE.LineDashedMaterial({
            color: 0x6ea8ff,
            transparent: true,
            opacity: 0.4,
            dashSize: 0.05,
            gapSize: 0.04,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          })
        );
        line.computeLineDistances();
        flightsGroup.add(line);

        const plane = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: planeTex,
            color: 0xdcecff,
            transparent: true,
            depthTest: true,
            depthWrite: false,
          })
        );
        plane.scale.set(0.08, 0.08, 0.08);
        flightsGroup.add(plane);

        return { at, plane, speed: 0.05 + (i % 3) * 0.012, phase: (i * 0.137) % 1 };
      });

      // Resize handler
      const onResize = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      window.addEventListener('resize', onResize);

      // Animation loop
      const wa = new THREE.Vector3();
      const wb = new THREE.Vector3();
      const tick = () => {
        if (stopRef.current) {
          renderer.dispose();
          window.removeEventListener('resize', onResize);
          return;
        }
        group.rotation.y += 0.0015;
        flightsGroup.updateWorldMatrix(true, false);

        const now = performance.now() * 0.001;
        for (const f of flights) {
          const t = (now * f.speed + f.phase) % 1;
          const dt = 0.012;
          const t2 = Math.min(0.999, t + dt);
          const pa = f.at(t);
          const pb = f.at(t2);
          f.plane.position.copy(pa);
          wa.copy(pa).applyMatrix4(flightsGroup.matrixWorld);
          const facing = wa.z > -0.15;
          f.plane.visible = facing;
          const wp = wa.clone().project(camera);
          wb.copy(pb).applyMatrix4(flightsGroup.matrixWorld).project(camera);
          f.plane.material.rotation = Math.atan2(wb.y - wp.y, wb.x - wp.x) - Math.PI / 2;
        }

        renderer.render(scene, camera);
        animId = requestAnimationFrame(tick);
      };
      tick();
    };

    initGlobe();

    return () => {
      stopRef.current = true;
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        left: '50%',
        top: '54%',
        transform: 'translate(-50%,-50%)',
        width: 'min(92vw,820px)',
        aspectRatio: '1',
        opacity: 0.85,
        pointerEvents: 'none',
        filter: 'drop-shadow(0 0 60px rgba(40,90,200,.35))',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
}
