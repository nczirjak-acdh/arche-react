// components/PLYViewerWithControls.tsx
'use client';

import React, { useEffect, useRef } from 'react';

type Props = {
  src: string; // PLY file URL
  className?: string;
  height?: number; // canvas height in px
  background?: string; // CSS color (e.g. '#f8fafc')
};

export default function DisseminationPLY({
  src,
  className = '',
  height = 500,
  background = '#f8fafc',
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const threeRef = useRef<{
    renderer?: any;
    scene?: any;
    camera?: any;
    controls?: any;
    modelGroup?: any;
    animId?: number;
    initial?: {
      position: [number, number, number];
      target: [number, number, number];
    };
  }>({});

  useEffect(() => {
    let disposed = false;

    (async () => {
      const THREE = await import('three');
      const { OrbitControls } = await import(
        'three/examples/jsm/controls/OrbitControls.js'
      );
      const { PLYLoader } = await import(
        'three/examples/jsm/loaders/PLYLoader.js'
      );

      if (disposed) return;
      const container = containerRef.current!;
      const width = container.clientWidth;
      const heightPx = height;

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, heightPx);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.innerHTML = '';
      container.appendChild(renderer.domElement);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = `${heightPx}px`;
      renderer.setClearColor(background, 1);

      // Scene & camera
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        45,
        width / heightPx,
        0.01,
        10000
      );
      camera.position.set(1.5, 1, 1.5);

      // Lights
      const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
      hemi.position.set(0, 1, 0);
      scene.add(hemi);

      const dir = new THREE.DirectionalLight(0xffffff, 1.0);
      dir.position.set(5, 10, 7.5);
      scene.add(dir);

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;

      // Group to hold model
      const modelGroup = new THREE.Group();
      scene.add(modelGroup);

      // Load PLY
      const loader = new PLYLoader();
      loader.load(
        src,
        (geometry: any) => {
          // If PLY has no normals, compute them so lighting looks good
          if (!geometry.attributes.normal) {
            geometry.computeVertexNormals();
          }

          let material: any;
          // If vertex colors exist, use them
          if (geometry.attributes.color) {
            material = new THREE.MeshBasicMaterial({ vertexColors: true });
          } else {
            material = new THREE.MeshStandardMaterial({
              color: 0xb0b0b0,
              metalness: 0.1,
              roughness: 0.8,
            });
          }

          const mesh = new THREE.Mesh(geometry, material);
          modelGroup.add(mesh);

          // Frame the model
          geometry.computeBoundingSphere();
          geometry.computeBoundingBox();

          const sphere = geometry.boundingSphere!;
          const center = sphere.center;
          const radius = Math.max(sphere.radius, 1e-6);

          // Re-center model at origin for nicer controls
          modelGroup.position.set(-center.x, -center.y, -center.z);

          // Set camera to frame object
          const fov = (camera.fov * Math.PI) / 180;
          const distance = radius / Math.sin(fov / 2);

          camera.position.set(0, 0, distance * 1.2);
          camera.near = Math.max(distance / 100, 0.01);
          camera.far = distance * 100;
          camera.updateProjectionMatrix();

          controls.target.set(0, 0, 0);
          controls.update();

          // Save initial for reset
          threeRef.current.initial = {
            position: [camera.position.x, camera.position.y, camera.position.z],
            target: [controls.target.x, controls.target.y, controls.target.z],
          };
        },
        undefined,
        (err) => {
          // eslint-disable-next-line no-console
          console.error('PLY load error:', err);
        }
      );

      // Animate
      const tick = () => {
        controls.update();
        renderer.render(scene, camera);
        threeRef.current.animId = requestAnimationFrame(tick);
      };
      tick();

      // Resize
      const onResize = () => {
        const w = container.clientWidth;
        const h = heightPx; // fixed height
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(container);

      // Save refs
      threeRef.current.renderer = renderer;
      threeRef.current.scene = scene;
      threeRef.current.camera = camera;
      threeRef.current.controls = controls;
      threeRef.current.modelGroup = modelGroup;

      return () => {
        ro.disconnect();
      };
    })();

    return () => {
      disposed = true;
      const t = threeRef.current;
      if (t.animId) cancelAnimationFrame(t.animId);
      if (t.controls) t.controls.dispose();
      if (t.scene) {
        t.scene.traverse((obj: any) => {
          if (obj.isMesh) {
            obj.geometry?.dispose?.();
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m: any) => m.dispose?.());
            } else {
              obj.material?.dispose?.();
            }
          }
        });
      }
      t.renderer?.dispose?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, height, background]);

  // Controls: zoom via OrbitControls dollyIn/Out (keeps perspective & feel)
  const zoom = (factor: number) => {
    const controls: any = threeRef.current.controls;
    if (!controls) return;
    // OrbitControls offers dollyIn/Out for perspective cameras
    if (factor > 1) controls.dollyOut?.(factor);
    else controls.dollyIn?.(1 / factor);
    controls.update();
  };

  const reset = () => {
    const { camera, controls, initial } = threeRef.current as any;
    if (!camera || !controls || !initial) return;
    camera.position.set(...initial.position);
    controls.target.set(...initial.target);
    controls.update();
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div
        ref={containerRef}
        className="w-full rounded-lg shadow"
        style={{ height }}
      />
      <div className="pointer-events-auto absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <button
          onClick={() => zoom(1.2)} // zoom out
          className="rounded-md border bg-white/90 px-3 py-1 text-sm shadow hover:bg-white"
          aria-label="Zoom out"
          title="Zoom out"
        >
          −
        </button>
        <button
          onClick={reset}
          className="rounded-md border bg-white/90 px-3 py-1 text-sm shadow hover:bg-white"
          aria-label="Reset view"
          title="Reset view"
        >
          Reset
        </button>
        <button
          onClick={() => zoom(0.8)} // zoom in
          className="rounded-md border bg-white/90 px-3 py-1 text-sm shadow hover:bg-white"
          aria-label="Zoom in"
          title="Zoom in"
        >
          +
        </button>
      </div>
    </div>
  );
}
