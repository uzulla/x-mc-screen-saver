import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { createNoise2D } from 'simplex-noise';
import * as THREE from 'three';

const WORLD_SIZE = 32;
const CHUNK_SIZE = 16;

const BIOME_TYPES = {
  PLAINS: 'plains',
  MOUNTAINS: 'mountains',
  DESERT: 'desert',
  WATER: 'water',
} as const;

const BLOCK_COLORS = {
  GRASS: '#4CAF50',
  DIRT: '#795548',
  STONE: '#9E9E9E',
  SAND: '#FEDD6E',
  WATER: '#2196F3',
  SNOW: '#FFFFFF',
} as const;

export function World() {
  const noise2D = useMemo(() => createNoise2D(), []);
  const biomeNoise = useMemo(() => createNoise2D(), []);
  const terrainRef = useRef<THREE.Group>(null);
  const cameraPositionRef = useRef({ x: 0, y: 5, z: 0 });
  
  const getBiome = (x: number, z: number) => {
    const biomeValue = biomeNoise(x / (CHUNK_SIZE * 2), z / (CHUNK_SIZE * 2));
    const elevation = noise2D(x / CHUNK_SIZE, z / CHUNK_SIZE);
    
    if (elevation < -0.3) return BIOME_TYPES.WATER;
    if (biomeValue > 0.3) return BIOME_TYPES.MOUNTAINS;
    if (biomeValue < -0.3) return BIOME_TYPES.DESERT;
    return BIOME_TYPES.PLAINS;
  };

  const getBlockProperties = (x: number, z: number, y: number, maxHeight: number) => {
    const biome = getBiome(x, z);
    
    switch (biome) {
      case BIOME_TYPES.MOUNTAINS:
        if (y === maxHeight) return { color: y > 8 ? BLOCK_COLORS.SNOW : BLOCK_COLORS.STONE };
        return { color: BLOCK_COLORS.STONE };
      
      case BIOME_TYPES.DESERT:
        return { color: BLOCK_COLORS.SAND };
      
      case BIOME_TYPES.WATER:
        if (y <= 1) return { color: BLOCK_COLORS.WATER, transparent: true, opacity: 0.8 };
        return { color: BLOCK_COLORS.SAND };
      
      default: // PLAINS
        if (y === maxHeight) return { color: BLOCK_COLORS.GRASS };
        if (y >= maxHeight - 1) return { color: BLOCK_COLORS.DIRT };
        return { color: BLOCK_COLORS.STONE };
    }
  };
  
  const terrain = useMemo(() => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const blocks: JSX.Element[] = [];
    
    for (let x = -WORLD_SIZE / 2; x < WORLD_SIZE / 2; x++) {
      for (let z = -WORLD_SIZE / 2; z < WORLD_SIZE / 2; z++) {
        const biome = getBiome(x, z);
        const baseHeight = noise2D(x / CHUNK_SIZE, z / CHUNK_SIZE);
        let maxHeight = Math.floor((baseHeight + 1) * 3);
        
        if (biome === BIOME_TYPES.MOUNTAINS) {
          maxHeight = Math.floor((baseHeight + 1) * 6);
        } else if (biome === BIOME_TYPES.WATER) {
          maxHeight = 1;
        }
        
        for (let y = 0; y <= maxHeight; y++) {
          const { color, transparent = false, opacity = 1 } = getBlockProperties(x, z, y, maxHeight);
          const material = new THREE.MeshStandardMaterial({ 
            color, 
            transparent, 
            opacity,
          });
          
          blocks.push(
            <mesh
              key={`${x}-${y}-${z}`}
              geometry={geometry}
              material={material}
              position={[x, y, z]}
              castShadow
              receiveShadow
            />
          );
        }
      }
    }
    
    return blocks;
  }, [noise2D, biomeNoise]);

  useFrame(({ camera }) => {
    const time = Date.now() * 0.001;
    const radius = 20;
    
    cameraPositionRef.current.x = Math.sin(time * 0.5) * radius;
    cameraPositionRef.current.y = 15;
    cameraPositionRef.current.z = Math.cos(time * 0.5) * radius;
    
    camera.position.set(
      cameraPositionRef.current.x,
      cameraPositionRef.current.y,
      cameraPositionRef.current.z
    );
    camera.lookAt(0, 5, 0);
  });

  return <group ref={terrainRef}>{terrain}</group>;
}