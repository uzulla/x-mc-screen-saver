import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Clouds() {
  const cloudsRef = useRef<THREE.Group>(null);
  
  const clouds = Array.from({ length: 20 }, (_, i) => {
    const baseScale = 2 + Math.random() * 3;
    const x = (Math.random() - 0.5) * 60;
    const z = (Math.random() - 0.5) * 60;
    const y = 20 + Math.random() * 5;
    const speed = 0.2 + Math.random() * 0.3;
    const height = 0.5 + Math.random() * 1.5; // Random height for each cloud
    const layers = Math.floor(2 + Math.random() * 3); // Random number of layers
    
    return { 
      baseScale, 
      position: [x, y, z], 
      speed, 
      height,
      layers,
      key: i 
    };
  });

  useFrame((state) => {
    clouds.forEach((cloud, i) => {
      if (cloudsRef.current) {
        const group = cloudsRef.current.children[i] as THREE.Group;
        group.position.x += cloud.speed * 0.01;
        
        if (group.position.x > 30) {
          group.position.x = -30;
        }
      }
    });
  });

  return (
    <group ref={cloudsRef}>
      {clouds.map((cloud) => (
        <group key={cloud.key} position={cloud.position as [number, number, number]}>
          {Array.from({ length: cloud.layers }, (_, layerIndex) => {
            const layerScale = cloud.baseScale * (1 - layerIndex * 0.2);
            const layerHeight = cloud.height * (1 - layerIndex * 0.3);
            return (
              <mesh 
                key={layerIndex}
                position={[0, layerIndex * 0.3, 0]}
              >
                <boxGeometry args={[layerScale, layerHeight, layerScale]} />
                <meshStandardMaterial 
                  color="#ffffff" 
                  transparent
                  opacity={0.8 - layerIndex * 0.1}
                />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}