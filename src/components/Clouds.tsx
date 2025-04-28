import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Clouds() {
  const cloudsRef = useRef<THREE.Group>(null);
  
  const clouds = Array.from({ length: 20 }, (_, i) => {
    const scale = 2 + Math.random() * 3;
    const x = (Math.random() - 0.5) * 60;
    const z = (Math.random() - 0.5) * 60;
    const y = 20 + Math.random() * 5;
    const speed = 0.2 + Math.random() * 0.3;
    
    return { scale, position: [x, y, z], speed, key: i };
  });

  useFrame((state) => {
    clouds.forEach((cloud, i) => {
      if (cloudsRef.current) {
        const mesh = cloudsRef.current.children[i] as THREE.Mesh;
        mesh.position.x += cloud.speed * 0.01;
        
        if (mesh.position.x > 30) {
          mesh.position.x = -30;
        }
      }
    });
  });

  return (
    <group ref={cloudsRef}>
      {clouds.map((cloud) => (
        <mesh key={cloud.key} position={cloud.position as [number, number, number]}>
          <boxGeometry args={[cloud.scale, 0.2, cloud.scale]} />
          <meshStandardMaterial 
            color="#ffffff" 
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}