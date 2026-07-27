import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

function ThreeDAnimation() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const objectsRef = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf0f9ff);
    scene.fog = new THREE.Fog(0xf0f9ff, 100, 1000);

    // Camera setup
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 50;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x2563eb, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x7c3aed, 0.6);
    pointLight1.position.set(-30, 30, 30);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06b6d4, 0.6);
    pointLight2.position.set(30, -30, 30);
    scene.add(pointLight2);

    // Create 3D objects
    const objects = [];

    // Rotating cube
    const cubeGeometry = new THREE.BoxGeometry(15, 15, 15);
    const cubeMaterial = new THREE.MeshPhongMaterial({
      color: 0x2563eb,
      emissive: 0x1e40af,
      shininess: 100,
      wireframe: false
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-25, 0, 0);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);
    objects.push({ mesh: cube, speed: 0.01, axis: 'xyz' });

    // Rotating sphere
    const sphereGeometry = new THREE.IcosahedronGeometry(10, 4);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x7c3aed,
      emissive: 0x6d28d9,
      shininess: 100,
      wireframe: false
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(25, 0, 0);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere);
    objects.push({ mesh: sphere, speed: 0.015, axis: 'yz' });

    // Rotating torus in center
    const torusGeometry = new THREE.TorusGeometry(12, 4, 100, 100);
    const torusMaterial = new THREE.MeshPhongMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      shininess: 100,
      wireframe: false
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(0, 0, 0);
    torus.castShadow = true;
    torus.receiveShadow = true;
    scene.add(torus);
    objects.push({ mesh: torus, speed: 0.008, axis: 'x' });

    // Particle system
    const particleCount = 100;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100;
      positions[i + 1] = (Math.random() - 0.5) * 100;
      positions[i + 2] = (Math.random() - 0.5) * 100;

      velocities[i] = (Math.random() - 0.5) * 0.5;
      velocities[i + 1] = (Math.random() - 0.5) * 0.5;
      velocities[i + 2] = (Math.random() - 0.5) * 0.5;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x2563eb,
      size: 0.8,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6
    });
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    objectsRef.current = objects;
    const particlesRef = { geometry: particles, velocities, count: particleCount };

    // Handle window resize
    const handleResize = () => {
      const newWidth = containerRef.current?.clientWidth || width;
      const newHeight = containerRef.current?.clientHeight || height;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate objects
      objects.forEach((obj) => {
        if (obj.axis.includes('x')) obj.mesh.rotation.x += obj.speed;
        if (obj.axis.includes('y')) obj.mesh.rotation.y += obj.speed;
        if (obj.axis.includes('z')) obj.mesh.rotation.z += obj.speed;
      });

      // Update particles
      const positionAttr = particlesRef.geometry.attributes.position;
      for (let i = 0; i < particlesRef.count * 3; i += 3) {
        positionAttr.array[i] += particlesRef.velocities[i];
        positionAttr.array[i + 1] += particlesRef.velocities[i + 1];
        positionAttr.array[i + 2] += particlesRef.velocities[i + 2];

        // Bounce particles
        if (Math.abs(positionAttr.array[i]) > 50) particlesRef.velocities[i] *= -1;
        if (Math.abs(positionAttr.array[i + 1]) > 50) particlesRef.velocities[i + 1] *= -1;
        if (Math.abs(positionAttr.array[i + 2]) > 50) particlesRef.velocities[i + 2] *= -1;
      }
      positionAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '0',
        overflow: 'hidden',
        border: 'none',
        boxShadow: 'none',
        marginBottom: '0',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
      }}
    />
  );
}

export default ThreeDAnimation;
